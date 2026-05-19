(() => {
  if (window.__vistaWikiChatWidgetMounted) return;
  window.__vistaWikiChatWidgetMounted = true;

  const script =
    document.currentScript ||
    Array.from(document.scripts).find((s) => s.src && s.src.includes("vista-chatbot-widget.js"));
  const configuredApiUrl = script?.dataset.apiUrl || "/api/chat";
  const cfg = {
    apiUrl: configuredApiUrl,
    apiFallbacks: (script?.dataset.apiFallbacks || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
    widgetTitle: script?.dataset.widgetTitle || "Ask Vista",
    launcherLabel: script?.dataset.launcherLabel || "Chat",
    botName: script?.dataset.botName || "Vista Assistant",
    placeholder: script?.dataset.placeholder || "Ask about commands, towny, economy...",
  };
  const apiCandidates = buildApiCandidates(cfg.apiUrl, cfg.apiFallbacks);

  const sessionKey = "vista-wiki-chat-session-id";
  const storage = getSessionStorage();
  let sessionId = storage?.getItem(sessionKey) || "";
  let isBusy = false;

  const root = document.createElement("div");
  root.className = "vv-chat-widget";
  root.innerHTML = `
    <button class="vv-chat-launcher" type="button" aria-expanded="false" aria-controls="vv-chat-panel">
      <span class="vv-chat-launcher-dot"></span>
      <span class="vv-chat-launcher-label"></span>
    </button>
    <section id="vv-chat-panel" class="vv-chat-panel" aria-hidden="true" hidden inert>
      <header class="vv-chat-header">
        <div class="vv-chat-title-wrap">
          <p class="vv-chat-kicker">BETA</p>
          <h3 class="vv-chat-title"></h3>
        </div>
        <button class="vv-chat-close" type="button" aria-label="Close chat">x</button>
      </header>
      <div class="vv-chat-log" role="log" aria-live="polite"></div>
      <form class="vv-chat-form">
        <input id="vv-chat-input" class="vv-chat-input" type="text" maxlength="800" aria-label="Ask the wiki chatbot a question" />
        <button class="vv-chat-send" type="submit">Send</button>
      </form>
    </section>
  `;
  document.body.appendChild(root);

  const launcher = root.querySelector(".vv-chat-launcher");
  const launcherLabel = root.querySelector(".vv-chat-launcher-label");
  const panel = root.querySelector(".vv-chat-panel");
  const title = root.querySelector(".vv-chat-title");
  const closeBtn = root.querySelector(".vv-chat-close");
  const log = root.querySelector(".vv-chat-log");
  const form = root.querySelector(".vv-chat-form");
  const input = root.querySelector(".vv-chat-input");

  launcherLabel.textContent = cfg.launcherLabel;
  title.textContent = cfg.widgetTitle;
  input.placeholder = cfg.placeholder;

  addMessage("bot", "Hey. Ask me about the server wiki and I will fetch the best answer I can.");

  launcher.addEventListener("click", () => setOpen(!panel.classList.contains("is-open")));
  closeBtn.addEventListener("click", () => setOpen(false));
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    void sendMessage();
  });

  function setOpen(open) {
    panel.hidden = !open;
    panel.inert = !open;
    panel.classList.toggle("is-open", open);
    launcher.setAttribute("aria-expanded", String(open));
    panel.setAttribute("aria-hidden", String(!open));
    if (open) input.focus();
  }

  async function sendMessage() {
    const raw = input.value.trim();
    if (!raw || isBusy) return;
    input.value = "";
    addMessage("user", raw);
    isBusy = true;
    const waitBubble = addMessage("bot", "Typing...");

    try {
      const payload = await callChatApi({
        message: raw,
        session_id: sessionId || null,
      });
      if (typeof payload.session_id === "string" && payload.session_id) {
        sessionId = payload.session_id;
        storage?.setItem(sessionKey, sessionId);
      }

      waitBubble.remove();
      addMessage("bot", payload.reply || "I do not know from the wiki yet.", payload.sources || [], payload.links || []);
    } catch (error) {
      waitBubble.remove();
      const msg = "Chat API unreachable. Check README for widget API URL and CORS setup.";
      addMessage("bot", msg);
      console.error("vista widget send failed:", error);
    } finally {
      isBusy = false;
      input.focus();
    }
  }

  function addMessage(role, text, sources = [], links = []) {
    const item = document.createElement("article");
    item.className = `vv-chat-msg is-${role}`;

    const bubble = document.createElement("div");
    bubble.className = "vv-chat-bubble";
    bubble.innerHTML = linkify(text || "");
    item.appendChild(bubble);

    if (role === "bot" && Array.isArray(sources) && sources.length) {
      const wrap = document.createElement("div");
      wrap.className = "vv-chat-sources";
      sources.slice(0, 3).forEach((s) => {
        const safeUrl = safeLinkUrl(s?.url);
        if (!safeUrl) return;
        const a = document.createElement("a");
        a.className = "vv-chat-source-link";
        a.href = safeUrl;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.textContent = s.title || "Open wiki page";
        wrap.appendChild(a);
      });
      if (wrap.childNodes.length > 0) item.appendChild(wrap);
    } else if (role === "bot" && Array.isArray(links) && links.length) {
      const wrap = document.createElement("div");
      wrap.className = "vv-chat-sources";
      links.slice(0, 2).forEach((url) => {
        const safeUrl = safeLinkUrl(url);
        if (!safeUrl) return;
        const a = document.createElement("a");
        a.className = "vv-chat-source-link";
        a.href = safeUrl;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.textContent = "Open link";
        wrap.appendChild(a);
      });
      if (wrap.childNodes.length > 0) item.appendChild(wrap);
    }

    log.appendChild(item);
    log.scrollTop = log.scrollHeight;
    return item;
  }

  function linkify(text) {
    const safe = escapeHtml(text).replace(/\n/g, "<br>");
    return safe.replace(
      /(https?:\/\/[^\s<]+)/g,
      '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
    );
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function getSessionStorage() {
    try {
      return window.sessionStorage;
    } catch {
      return null;
    }
  }

  function safeLinkUrl(url) {
    if (typeof url !== "string") return null;
    const raw = url.trim();
    if (!raw) return null;
    try {
      const parsed = new URL(raw, window.location.origin);
      if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
        return null;
      }
      return parsed.href;
    } catch {
      return null;
    }
  }

  function buildApiCandidates(primary, fallbackList) {
    const out = [];
    const push = (value) => {
      if (typeof value !== "string") return;
      const url = value.trim();
      if (!url) return;
      if (!out.includes(url)) out.push(url);
    };

    push(primary);
    (fallbackList || []).forEach(push);

    const host = window.location.hostname;
    const localHost = host === "localhost" || host === "127.0.0.1";
    if (localHost && /^\/[^/]/.test(primary || "")) {
      push("http://127.0.0.1:8787/api/chat");
      push("http://localhost:8787/api/chat");
    }

    return out;
  }

  async function callChatApi(payload) {
    let lastError = null;
    for (const url of apiCandidates) {
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!response.ok) {
          lastError = new Error(`API ${response.status} from ${url}`);
          continue;
        }
        return await response.json();
      } catch (error) {
        lastError = error;
      }
    }
    throw lastError || new Error("No chat API endpoint reachable");
  }
})();
