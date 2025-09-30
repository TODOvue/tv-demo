# Changelog

All notable changes to `@todovue/tv-demo` will be documented in this file.

This project adheres to [Semantic Versioning](https://semver.org/).

---
## [1.1.0] - 2025-10-01

### 🛠️ Changed
- Updated Node.js version requirement from `>=16.0.0` to `>=20.19.0` in `package.json` to meet Vite 7.x compatibility requirements.
- Updated CI/CD workflow (`.github/workflows/release.yml`) to use Node.js 20 instead of Node.js 18.

### 📦 Dependencies
- Ensures compatibility with Vite `^7.0.0` which requires Node.js version 20.19+ or 22.12+.

---
## [1.0.6] - 2025-09-06

### 🛠️ Changed
- Moved `vue-highlight-code` and `vue3-markdown-it` to `peerDependencies` to avoid internal bundling that could trigger interop / synthetic default Vue imports in pre-bundling environments (esbuild / Vite optimizeDeps).
- Added `verify:dist` script that ensures the bundle does not contain `import <default> from 'vue'` nor mixed default + named imports.

### 🐛 Fixed
- Additional mitigation for the error: `No matching export in "vue" for import "default"` in SPA consumers by guaranteeing only named imports and properly externalized dependencies.

---
## [1.0.5] - 2025-09-05

### 🐛 Fixed
- Eliminated unintended synthetic default import of Vue by:
  - Switching library entry to `src/entry.ts` (already in 1.0.4) and
  - Adding `output.exports = 'named'` plus externalizing `vue3-markdown-it` and `vue-highlight-code` to prevent Rollup from generating a default import pattern.
- This definitively resolves: `No matching export in "vue" for import "default"` when consuming the ESM build in Vite/esbuild projects.

### ✅ Compatibility
- Confirmed proper usage with: `import { TvDemo } from '@todovue/tv-demo'` and `import TvDemo from '@todovue/tv-demo'` (default now maps correctly without forcing synthetic default of Vue).

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
[1.1.0]: https://github.com/TODOvue/tv-demo/pull/27/files
[1.0.6]: https://github.com/TODOvue/tv-demo/pull/24/files
[1.0.5]: https://github.com/TODOvue/tv-demo/pull/23/files
[1.0.4]: https://github.com/TODOvue/tv-demo/pull/22/files
[1.0.3]: https://github.com/TODOvue/tv-demo/pull/21/files
[1.0.2]: https://github.com/TODOvue/tv-demo/pull/20/files
[1.0.1]: https://github.com/TODOvue/tv-demo/pull/19/files
[1.0.0]: https://github.com/TODOvue/tv-demo/pull/18/files
