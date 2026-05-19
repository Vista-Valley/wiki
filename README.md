<div align="center">
  <picture>
    <source media="(prefers-color-scheme: light)" srcset="public/logo.png">
    <img alt="Vista Valley" height="200px" src="public/logo.png">
  </picture>
  <h1>Vista Valley: Official Wiki</h1>
  <p>
    <a href="https://store.vistavalley.xyz"><img alt="Store" src="https://img.shields.io/badge/Store-Visit-555555?style=for-the-badge&logo=shopify&logoColor=ffffff&labelColor=FF9655&" /></a>
    <a href="https://discord.vistavalley.xyz"><img alt="Discord" src="https://img.shields.io/discord/1239102938819854336.svg?style=for-the-badge&logo=discord&logoColor=ffffff&color=555555&labelColor=6A7EC2&label=Discord" /></a>
  </p>
  <p>
    <a href="https://mcstatus.io/status/java/join.vistavalley.xyz"><img alt="Minecraft Server" height="100px" src="https://api.mcstatus.io/v2/widget/java/join.vistavalley.xyz?style=for-the-badge" /></a>
  </p>
</div>

Explore our vibrant community and discover what makes Vista Valley unique. Whether you’re here to join our server, learn about our community, or seek inspiration, you’ve come to the right place!

- **Website**: https://wiki.vistavalley.xyz
- **World Map**: https://map.vistavalley.xyz

This repo is made Open-Source for contributers to make best of additions and documentations for the server with **[📖 Wiki] Flairs** as a reward.

![flairs example](https://github.com/Meustrabil/wiki/blob/26a2e39730164a153adb63627e328e98722ed572/public/image_2026-04-21_130021869.png)

## 📊 Contributing

You are free to report bugs or contribute to this project. Just open <a href="../../issues">Issues</a> or <a href="../../pulls">Pull Requests</a> and the team will look into them.

> [!TIP]
> Contributions are not limited to code. Making suggestions, reporting bugs, and sharing the project with others are all forms of contribution that are highly appreciated.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                               | Action                                           |
| :------------------------------------ | :----------------------------------------------- |
| `bun install`                         | Installs dependencies                            |
| `bun dev`                             | Starts local dev server at `localhost:4321`     |
| `bun run build`                       | Build your production site to `./dist/`          |
| `bun run preview`                     | Preview your build locally, before deploying     |
| `bun run astro ...`                   | Run CLI commands like `astro add`, `astro check` |
| `bun run astro -- --help`             | Get help using the Astro CLI                     |

## Wiki chatbot widget

The floating wiki chatbot launcher is loaded from:

- `public/vista-chatbot-widget.js`
- `src/styles/custom.css`
- script injection in `astro.config.mjs`

API endpoint config:

- Default: same-origin `POST /api/chat` (`data-api-url` in `astro.config.mjs`)
- For external API host, set full URL in `data-api-url`

Local dev note:

- If the site runs on `localhost`/`127.0.0.1` and `data-api-url` is a relative path like `/api/chat`,
  the widget automatically tries `http://127.0.0.1:8787/api/chat` and `http://localhost:8787/api/chat`.
- For cross-origin local API, allow CORS from your wiki dev host (usually `http://localhost:4321` and `http://127.0.0.1:4321`).

## 👀 Want to learn more?

Check out [Starlight’s docs](https://starlight.astro.build/), read [the Astro documentation](https://docs.astro.build), or jump into the [Astro Discord server](https://astro.build/chat).
