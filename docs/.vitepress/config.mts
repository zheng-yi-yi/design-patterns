import { defineConfig } from 'vitepress'
import { sidebar } from './sidebar.mts'
import { nav } from './nav.mts'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "design-patterns",
  description: "Deep dive into design patterns. Concepts, code, and best practices for writing maintainable software.",
  
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: nav,
    sidebar: sidebar,

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
