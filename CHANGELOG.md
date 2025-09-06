# Changelog

All notable changes to `@todovue/tv-demo` will be documented in this file.

This project adheres to [Semantic Versioning](https://semver.org/).

---
## [1.0.4] - 2025-09-05

### 🛠️ Changed
- Fixed the library entry point in `vite.config.js` to point to `src/entry.ts` instead of the `.vue` file. This resolves the default import error from Vue (`No matching export in "vue" for import "default"`) and ensures full compatibility with Vue 3 in both SPA and SSR (Nuxt 3).

---
## [1.0.3] - 2025-09-05

### ✨ Added
- SSR (Server Side Rendering) compatibility: the component can now be used seamlessly in Nuxt 3 and other SSR frameworks.
- Automatic import of all required CSS (global styles and highlight.js) when importing the component, so no manual CSS import is needed in SPA or SSR environments.
- Improved documentation and usage examples for both SPA and SSR (Nuxt 3) in the README.

### 🛠️ Changed
- Refactored `entry.ts` to ensure styles are always loaded and the component is exportable for universal usage.
- README and changelog updated to reflect SSR support and new usage patterns.

---
## [1.0.2] - 2025-05-05

### 🐛 Fixed
- Adjusted font size for demo component description for better readability.

### 📦 Dependencies
- Updated `vite` to version `^6.0.0` in `devDependencies`.

---
## [1.0.1] - 2025-05-05

### 🐛 Fixed
- Improved layout consistency by wrapping the component preview inside `.tv-demo-component-content` with centered `flex` alignment.
- Moved variant description to a `<span>` with class `.tv-demo-description` for better semantic structure and styling.

---
## [1.0.0] - 2025-05-05

### ✨ Added
- Initial release of `TvDemo` component.
- Supports display of Vue components in isolation with configurable:
    - `component` binding (dynamic rendering)
    - `variants` (for multiple demo cases)
    - `demoStyle` (layout and content customization)
    - `theme` switch (Light/Dark)
    - `sourceLink`, `npmInstall`, `urlClone` (for useful action links)
- Documentation tab using `README.md` rendering via `vue3-markdown-it`.
- Integrated `vue-highlight-code` for live code display.
- Responsive layout for desktop and mobile screens.

---
[1.0.4]: https://github.com/TODOvue/tv-demo/pull/22/files
[1.0.3]: https://github.com/TODOvue/tv-demo/pull/21/files
[1.0.2]: https://github.com/TODOvue/tv-demo/pull/20/files
[1.0.1]: https://github.com/TODOvue/tv-demo/pull/19/files
[1.0.0]: https://github.com/TODOvue/tv-demo/pull/18/files
