# Project Context
This is a VitePress documentation site for design patterns, covering creational, structural, and behavioral patterns with Java code examples.

# Content Structure
- `docs/creational/` — Creational patterns: Simple Factory, Factory Method, Abstract Factory, Singleton, Prototype, Builder
- `docs/structural/` — Structural patterns: Facade, Adapter, Composite, Proxy, Bridge, Decorator, Flyweight
- `docs/behavioral/` — Behavioral patterns: Strategy, Template Method, Mediator, Observer, Iterator, Memento, State, Command, Chain of Responsibility, Visitor, Interpreter
- `docs/.vitepress/` — VitePress config, nav (`nav.mts`), and sidebar (`sidebar.mts`)

# Development Guidelines
- **VitePress ESM**: VitePress is an ESM-only package. Ensure `package.json` has `"type": "module"` or use `.mjs`/`.mts` extensions.
- **Source Root**: The VitePress project root is the `docs/` directory.
- **File-based Routing**: Markdown files in `docs/` (except `.vitepress/`) are source files and mapped directly to URLs.
- **Naming Convention**: Directories and filenames must use English, lowercase, with hyphens (e.g., `chain-of-responsibility.md`).
- **Deployment**: Automatic deployment to GitHub Pages via GitHub Actions (`.github/workflows/deploy.yml`).
- **Markdown**: Use standard Markdown with VitePress-specific extensions where applicable.
- **Code Examples**: All code examples are in Java.

# Technical Note
VitePress is an ESM-only package. Don't use `require()` to import it, and make sure your nearest `package.json` contains `"type": "module"`, or change the file extension of your relevant files like `.vitepress/config.js` to `.mjs`/`.mts`. Refer to [Vite's troubleshooting guide](http://vitejs.dev/guide/troubleshooting.html#this-package-is-esm-only) for more details. Also, inside async CJS contexts, you can use `await import('vitepress')` instead.
