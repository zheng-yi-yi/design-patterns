import { defineConfig } from 'vitepress'
import { sidebarEn, sidebarZh } from './sidebar.mts'
import { navEn, navZh } from './nav.mts'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "design-patterns",
  description: "Deep dive into design patterns. Concepts, code, and best practices for writing maintainable software.",
  lastUpdated: true,
  base: '/design-patterns/',

  locales: {
    en: {
      label: 'English',
      lang: 'en',
      link: '/en/',
      themeConfig: {
        nav: navEn,
        sidebar: sidebarEn
      }
    },
    zh: {
      label: '简体中文',
      lang: 'zh-Hans',
      link: '/zh/',
      themeConfig: {
        nav: navZh,
        sidebar: sidebarZh
      }
    }
  },

  themeConfig: {
    // Shared configurations
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
