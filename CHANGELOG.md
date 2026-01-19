# Changelog

All notable changes to `@todovue/tv-demo` will be documented in this file.

This project adheres to [Semantic Versioning](https://semver.org/).

## [1.4.3] - 2026-01-19

### Fixed
- Updated the key binding for the `HighCode` component to include `selectedVariantKey`, ensuring the component re-renders correctly when the variant changes.

## [1.4.2] - 2026-01-19

### Added
- Updated the release workflow to enable automated publishing to GitHub Packages.
- Implemented a theme selection dropdown to allow user-driven UI customization.

### Changed
- Applied responsive styles to ensure the layout adapts correctly to various screen sizes.

## [1.4.1] - 2026-01-19

### Added
- Implement install command dropdown with multiple package manager options.
- Added support for multiple code variants with dynamic source switching.
- Added dynamic language support for code variants.

### Fixed
- Improved horizontal scrolling support and custom scrollbar styling.

## [1.4.0] - 2026-01-16

### Added
- Added viewport handling for responsive layout adjustments.
- Added RTL support and grid layout toggle.
- Added background color customization options.
- Enhanced layout controls for improved flexibility.
- Implemented sidebar compression feature with responsive layout adjustments.
- Added scroll handling for the variants list and improved viewport calculations.
- Added scroll-to-top button visibility logic based on scroll position.

### Fixed
- Fixed the key binding for selecting variants in the `HighCode` component.
- Enhanced layout responsiveness and adjusted viewport width settings.
- Adjusted alignment and layout for improved centering.
- Fixed `vue-highlight-code` error: Cannot read properties of null in tool panels and adding validation for `variant.html`.

### Changed
- Updated button styles and improved link interactions.
- Replaced back button styles and updated class name for consistency.

## [1.3.2] - 2026-01-14

### Fixed
- Fixed and improved styling and layout for better responsiveness.

## [1.3.1] - 2026-01-13

### Added
- Add manual emits support for custom event handling in component previews.
- Add TvPreviewFrame component for enhanced component preview functionality.
- Add enhanced tool tab functionality with improved event logging UI.
- Add TvNestedEditor component for editing complex reactive properties.

### Changed
- Refactor tab structure and improve layout for better usability.

### Dependencies
- Update `sass` to `^1.97.2`.
- Update `vite` to `^7.3.1`.

## [1.3.0] - 2026-01-13

### Updated
- Updated footer logo image source.

### Added
- Added back navigation button and styling.
- Implemented reactive controls for dynamic property manipulation.
- Added event logging functionality with clear logs option.
- Implemented URL parameter synchronization for selected tab, search query, variant, and viewport width.

## [1.2.7] - 2025-12-16

### Changed
- Changed the default value of `readmePath` and `changelogPath` to `./` to simplify configuration in monorepo projects.

## [1.2.6] - 2025-12-16

### Changed
- Changed the `base` option in `vite.config.js` for website deployment to `/tv-demo/`.

## [1.2.5] - 2025-12-16

### Fixed
- Fixed repository URL in `package.json` to point to the correct GitHub repository.
- Force update with new token.

## [1.2.4] - 2025-12-16

### Fixed
- Fixed the token configuration used to generate the package in the GitHub Actions workflow `release.yml`.

## [1.2.3] - 2025-12-16

### Added
- Added automatic publishing to the Todovue cPanel in `release.yml` for each release, simplifying package distribution and updates.
- Added `package-lock.json` to the repository to ensure dependency consistency and facilitate version management across development and production environments.

### Changed
- Updated dependency versions in `package.json` to maintain compatibility and benefit from improvements and bug fixes in the used libraries.

## [1.2.2] - 2025-11-24

### Changed
- Updated background and text colors for dark and light themes to improve readability and visual comfort.

## [1.2.1] - 2025-11-21

### Fixed
- Fixed links color when the component use `hide-background` demo style.

## [1.2.0] - 2025-11-20

### Added
- Added `CHANGELOG.md` to tab navigation for easy access to version history.
- Added prop `showChangelog` to toggle visibility of the changelog tab.
- Added prop `showDocumentation` to toggle visibility of the documentation tab.
- Added `ToUp` component for quick navigation to the top of the demo page.

### Changed
- Removed emojis from the component and changelog to maintain a more professional and consistent style.
- Updated header link styles, removing emojis and redundant text.
- Changed `conponent` to `component` prop name for correct spelling.

## [1.1.1] - 2025-11-20

### Fixed
- Fixed max height in sidebar to ensure it appears correctly on the screen.

## [1.1.0] - 2025-11-20

### Added
- Added sidebar listing component variations to improve navigation across demos.
- Added Toast component for copy code notifications, providing visual feedback to the user.

### Changed
- Updated `TvDemo` footer styles for improved visual consistency with the overall app design.
- Updated copy code button styles to improve usability and aesthetics.
- Refined global `TvDemo` styles for better user experience and visual appearance.
- Updated documentation markdown to improve content readability and presentation.

### Fixed
- Corrected property typing from `nameComponent` to `componentName` for consistency and clarity.
- Fixed demos and their documentation to accurately reflect `TvDemo` features and functionality.

## [1.0.10] - 2025-11-15

### Fixed
- Fixed: updated `package.json` style export from `./dist/style.css` to `./dist/tv-demo.css`; updated documentation.

## [1.0.9] - 2025-11-14

### Changed
- Removed CSS injection via `vite-plugin-css-injected-by-js`.
- Styles are now served from a separate CSS file generated by Vite (`dist/*.css`).
- The CSS must now be imported explicitly in the application (SPA or Nuxt).
- Improved SSR/SSG compatibility (especially for Nuxt).
- Theme selection now switches CSS files instead of toggling classes.

## [1.0.8] - 2025-10-17

### Changed
- Enhanced copy notification visual design with modern UI elements and animations for better user experience when copying code snippets.

## [1.0.7] - 2025-10-01

### Changed
- Updated Node.js version requirement from `>=16.0.0` to `>=20.19.0` in `package.json` to meet Vite 7.x compatibility requirements.
- Updated CI/CD workflow (`.github/workflows/release.yml`) to use Node.js 20 instead of Node.js 18.

### Dependencies
- Ensures compatibility with Vite `^7.0.0` which requires Node.js version 20.19+ or 22.12+.

## [1.0.6] - 2025-09-06

### Changed
- Moved `vue-highlight-code` and `vue3-markdown-it` to `peerDependencies` to avoid internal bundling that could trigger interop / synthetic default Vue imports in pre-bundling environments (esbuild / Vite optimizeDeps).
- Added `verify:dist` script that ensures the bundle does not contain `import <default> from 'vue'` nor mixed default + named imports.

### Fixed
- Additional mitigation for the error: `No matching export in "vue" for import "default"` in SPA consumers by guaranteeing only named imports and properly externalized dependencies.

## [1.0.5] - 2025-09-05

### Fixed
- Eliminated unintended synthetic default import of Vue by:
  - Switching library entry to `src/entry.ts` (already in 1.0.4) and
  - Adding `output.exports = 'named'` plus externalizing `vue3-markdown-it` and `vue-highlight-code` to prevent Rollup from generating a default import pattern.
- This definitively resolves: `No matching export in "vue" for import "default"` when consuming the ESM build in Vite/esbuild projects.

### Compatibility
- Confirmed proper usage with: `import { TvDemo } from '@todovue/tv-demo'` and `import TvDemo from '@todovue/tv-demo'` (default now maps correctly without forcing synthetic default of Vue).

## [1.0.4] - 2025-09-05

### Changed
- Fixed the library entry point in `vite.config.js` to point to `src/entry.ts` instead of the `.vue` file. This resolves the default import error from Vue (`No matching export in "vue" for import "default"`) and ensures full compatibility with Vue 3 in both SPA and SSR (Nuxt 3).

## [1.0.3] - 2025-09-05

### Added
- SSR (Server Side Rendering) compatibility: the component can now be used seamlessly in Nuxt 3 and other SSR frameworks.
- Automatic import of all required CSS (global styles and highlight.js) when importing the component, so no manual CSS import is needed in SPA or SSR environments.
- Improved documentation and usage examples for both SPA and SSR (Nuxt 3) in the README.

### Changed
- Refactored `entry.ts` to ensure styles are always loaded and the component is exportable for universal usage.
- README and changelog updated to reflect SSR support and new usage patterns.

## [1.0.2] - 2025-05-05

### Fixed
- Adjusted font size for demo component description for better readability.

### Dependencies
- Updated `vite` to version `^6.0.0` in `devDependencies`.

## [1.0.1] - 2025-05-05

### Fixed
- Improved layout consistency by wrapping the component preview inside `.tv-demo-component-content` with centered `flex` alignment.
- Moved variant description to a `<span>` with class `.tv-demo-description` for better semantic structure and styling.

## [1.0.0] - 2025-05-05

### Added
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

[1.4.3]: https://github.com/TODOvue/tv-demo/pull/48/files
[1.4.2]: https://github.com/TODOvue/tv-demo/pull/47/files
[1.4.1]: https://github.com/TODOvue/tv-demo/pull/46/files
[1.4.0]: https://github.com/TODOvue/tv-demo/pull/45/files
[1.3.2]: https://github.com/TODOvue/tv-demo/pull/44/files
[1.3.1]: https://github.com/TODOvue/tv-demo/pull/43/files
[1.3.0]: https://github.com/TODOvue/tv-demo/pull/42/files
[1.2.7]: https://github.com/TODOvue/tv-demo/pull/41/files
[1.2.6]: https://github.com/TODOvue/tv-demo/pull/40/files
[1.2.5]: https://github.com/TODOvue/tv-demo/pull/39/files
[1.2.4]: https://github.com/TODOvue/tv-demo/pull/38/files
[1.2.3]: https://github.com/TODOvue/tv-demo/pull/37/files
[1.2.2]: https://github.com/TODOvue/tv-demo/pull/36/files
[1.2.1]: https://github.com/TODOvue/tv-demo/pull/35/files
[1.2.0]: https://github.com/TODOvue/tv-demo/pull/34/files
[1.1.1]: https://github.com/TODOvue/tv-demo/pull/33/files
[1.1.0]: https://github.com/TODOvue/tv-demo/pull/32/files
[1.0.10]: https://github.com/TODOvue/tv-demo/pull/31/files
[1.0.9]: https://github.com/TODOvue/tv-demo/pull/30/files
[1.0.8]: https://github.com/TODOvue/tv-demo/pull/29/files
[1.0.7]: https://github.com/TODOvue/tv-demo/pull/28/files
[1.0.6]: https://github.com/TODOvue/tv-demo/pull/24/files
[1.0.5]: https://github.com/TODOvue/tv-demo/pull/23/files
[1.0.4]: https://github.com/TODOvue/tv-demo/pull/22/files
[1.0.3]: https://github.com/TODOvue/tv-demo/pull/21/files
[1.0.2]: https://github.com/TODOvue/tv-demo/pull/20/files
[1.0.1]: https://github.com/TODOvue/tv-demo/pull/19/files
[1.0.0]: https://github.com/TODOvue/tv-demo/pull/18/files
