import { defineConfig } from 'vitepress'
import { sidebar } from './sidebar.mts'
import { nav } from './nav.mts'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "design-patterns",
  description: "Deep dive into design patterns. Concepts, code, and best practices for writing maintainable software.",
  lastUpdated: true,
  base: '/design-patterns/',

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: nav,
    sidebar: sidebar,

    socialLinks: [
      { icon: 'github', link: 'https://github.com/zheng-yi-yi/design-patterns' }
    ],

    editLink: {
      pattern: 'https://github.com/zheng-yi-yi/design-patterns/edit/main/docs/:path'
    },

    footer: {
      message: 'Released under the GPLv3 License.',
      copyright: 'Copyright © 2026-present Zheng, YiYi'
    }
  }
})
