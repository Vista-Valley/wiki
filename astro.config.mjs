// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightSidebarTopics from 'starlight-sidebar-topics';
import starlightSidebarSwipe from 'starlight-sidebar-swipe';
import starlightUiTweaks from 'starlight-ui-tweaks';

// https://astro.build/config
export default defineConfig({
    site: 'https://wiki.vistavalley.xyz',
    trailingSlash: 'always',
    integrations: [
        starlight({
            title: 'Vista Valley',
            description: 'Official documentation for Vista Valley',
            logo: {
                src: './src/assets/images/logo.png',
                alt: 'Vista Valley Logo',
                replacesTitle: true,
            },
            editLink: {
                baseUrl: 'https://github.com/Vista-Valley/wiki/edit/main/',
            },
            defaultLocale: 'root',
            locales: {
                root: { label: 'English', lang: 'en' },
                // id: { label: 'Bahasa Indonesia', lang: 'id' },
            },
            favicon: '/logo.png',
            social: [{ icon: 'discord', label: 'Discord', href: 'https://discord.vistavalley.xyz' }, { icon: 'github', label: 'GitHub', href: 'https://github.com/Vista-Valley' }],
            customCss: ['./src/styles/custom.css', '@fontsource-variable/anuphan/wght.css'],
            head: [
                {
                    tag: 'meta',
                    attrs: {
                        property: 'og:image',
                        content: 'https://wiki.vistavalley.xyz/logo.png'
                    }
                },
                {
                    tag: 'meta',
                    attrs: {
                        name: 'twitter:image',
                        content: 'https://wiki.vistavalley.xyz/logo.png'
                    }
                },
                {
                    tag: 'meta',
                    attrs: {
                        name: 'twitter:card',
                        content: 'summary'
                    }
                }
            ],
            lastUpdated: true,
            plugins: [
                starlightSidebarTopics([
                    {
                        label: 'Home',
                        link: 'home/welcome',
                        icon: 'open-book',
                        items: [
                            {
                                label: 'Welcome',
                                link: 'home/welcome',
                            },
                            {
                                label: 'Play Now',
                                link: 'home/play-now',
                            },
                            {
                                label: 'Rules',
                                link: 'home/rules',
                            },
                            {
                                label: 'Vote',
                                link: 'home/vote',
                            },
                            {
                                label: 'FAQ',
                                link: 'home/faq',
                            }
                        ],
                    },
                    {
                        label: 'Earth',
                        link: 'earth',
                        icon: 'sun',
                        items: [
                            {
                                label: 'Gameplay',
                                collapsed: true,
                                autogenerate: { directory: 'earth/gameplay' },
                            },
                            {
                                label: 'Economy',
                                collapsed: true,
                                autogenerate: { directory: 'earth/economy' },
                            },
                            {
                                label: 'Social',
                                collapsed: true,
                                autogenerate: { directory: 'earth/social' },
                            },
                            {
                                label: 'Towny',
                                collapsed: true,
                                items: [
                                    { label: 'Overview', link: 'earth/towny' },
                                    { label: 'Commands', link: 'earth/towny/commands' },
                                    { label: 'Chat Channels', link: 'earth/towny/chat-channels' },
                                    { label: 'Towns', autogenerate: { directory: 'earth/towny/towns' } },
                                    { label: 'Nations', autogenerate: { directory: 'earth/towny/nations' } },
                                    // { label: 'Wars', link: 'earth/towny/wars' },
                                ]
                            },
                            {
                                label: 'Fluff',
                                collapsed: true,
                                autogenerate: { directory: 'earth/fluff' },
                            },
                            {
                                label: 'Technical',
                                collapsed: true,
                                autogenerate: { directory: 'earth/technical' },
                            },
                            {
                                label: 'Remnants of Gaia',
                                collapsed: true,
                                autogenerate: { directory: 'earth/remnants' },
                            },
                        ],
                    },
                    {
                        label: 'Branding',
                        link: 'branding',
                        icon: 'pen',
                        items: [
                            {
                                label: 'Overview',
                                link: 'branding',
                            }
                        ],
                    },
                ]),
                starlightSidebarSwipe(),
                starlightUiTweaks({
                    navbarLinks: [
                        { label: "World Map", href: "https://map.vistavalley.xyz" },
                        { label: "Server Store", href: "https://store.vistavalley.xyz" },
                        { label: "Gensou (Performance Modpack)", href: "https://modrinth.com/modpack/gensou" },
                    ],
                    ad: {
                        image: "https://raw.githubusercontent.com/MaboroshiKobo/Gensou/7fb81d5d385be6cb4f3476e8431b26f7f58bdbba/assets/images/icon_square.png",
                        title: "Gensou (Modpack)",
                        description: "Gensou balances high-end performance with essential quality-of-life utilities to enhance your gameplay on Vista Valley.",
                        buttonLabel: "View on Modrinth",
                        buttonHref: "https://modrinth.com/modpack/gensou",
                    },
                })
            ],
        }),
    ]
});
