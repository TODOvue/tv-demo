# Changelog

All notable changes to `@todovue/tv-demo` will be documented in this file.

This project adheres to [Semantic Versioning](https://semver.org/).

---

## [1.0.1] - 2025-05-05

### 🐛 Fixed
- Improved layout consistency by wrapping the component preview inside `.tv-demo-component-content` with centered `flex` alignment.
- Moved variant description to a `<span>` with class `.tv-demo-description` for better semantic structure and styling.


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
[1.0.1]: https://github.com/TODOvue/tv-demo/pull/19
[1.0.0]: https://github.com/TODOvue/tv-demo/pull/18
