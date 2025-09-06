<p align="center"><img width="150" src="https://firebasestorage.googleapis.com/v0/b/todovue-blog.appspot.com/o/logo.png?alt=media&token=d8eb592f-e4a9-4b02-8aff-62d337745f41" alt="TODOvue logo">
</p>

# TODOvue Demo Catalog (TvDemo)
A flexible, framework-agnostic Vue 3 component catalog for demos, documentation, and playgrounds. Compatible with both SPA and SSR (Nuxt 3), with automatic style injection and no DOM assumptions.

[![npm](https://img.shields.io/npm/v/@todovue/tv-demo.svg)](https://www.npmjs.com/package/@todovue/tv-demo)
[![npm downloads](https://img.shields.io/npm/dm/@todovue/tv-demo.svg)](https://www.npmjs.com/package/@todovue/tv-demo)
![License](https://img.shields.io/github/license/TODOvue/tv-demo)

> Demo: https://tv-demo.netlify.app/

---
## Table of Contents
- [Features](#features)
- [Installation](#installation)
- [Quick Start (SPA)](#quick-start-spa)
- [Nuxt 3 / SSR Usage](#nuxt-3--ssr-usage)
- [Component Registration Options](#component-registration-options)
- [Props](#props)
- [Events](#events)
- [Customization (Styles)](#customization-styles)
- [SSR Notes](#ssr-notes)
- [Roadmap](#roadmap)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)

---
## Features
- Visual catalog for Vue 3 components with live variants.
- SPA and SSR (Nuxt 3) compatible.
- Automatic import of global and highlight.js styles (no manual CSS import needed).
- Interactive code highlighting and markdown documentation support.
- Modular structure, easy to extend.
- Tree-shake friendly and ready for modern bundlers.

---
## Installation
Using npm:
```bash
npm install @todovue/tv-demo
```
Using yarn:
```bash
yarn add @todovue/tv-demo
```
Using pnpm:
```bash
pnpm add @todovue/tv-demo
```

---
## Quick Start (SPA)
Global registration (main.js / main.ts):
```js
import { createApp } from 'vue'
import App from './App.vue'
import TvDemo from '@todovue/tv-demo'

createApp(App)
  .component('TvDemo', TvDemo)
  .mount('#app')
```
Local import inside a component:
```vue
<script setup>
import { TvDemo } from '@todovue/tv-demo'
</script>

<template>
  <TvDemo />
</template>
```

---
## Nuxt 3 / SSR Usage
Create a plugin file: `plugins/tv-demo.client.ts` (or without suffix for SSR, it's safe):
```ts
import { defineNuxtPlugin } from '#app'
import TvDemo from '@todovue/tv-demo'

export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.vueApp.component('TvDemo', TvDemo)
})
```
Use anywhere:
```vue
<TvDemo />
```
Direct import (no plugin):
```vue
<script setup>
import { TvDemo } from '@todovue/tv-demo'
</script>
```

---
## Component Registration Options
| Approach                                                    | When to use                                    |
|-------------------------------------------------------------|------------------------------------------------|
| Global via `app.component('TvDemo', TvDemo)`                | Frequent use across the app                    |
| Local named import `{ TvDemo }`                             | Isolated/code-split contexts                   |
| Direct default import `import TvDemo from ...`              | Single use or manual registration              |

---
## Props
| Name           | Type    | Default       | Description                                                         | Required |
|----------------|---------|---------------|---------------------------------------------------------------------|----------|
| component      | Object  |               | Component to display                                                | `true`   |
| variants       | Array   |               | Variations of the component                                         | `true`   |
| hideBackground | Boolean | `false`       | Hide the background of the component demo                           | `false`  |
| demoStyle      | Object  |               | Style of the component                                              | `false`  |
| nameComponent  | String  | `null`        | Name of the component to display in the demo                        | `false`  |
| npmInstall     | String  | `null`        | Command to install the component (without `npm install`)            | `false`  |
| sourceLink     | String  | `null`        | Link to the source code of the component                            | `false`  |
| urlClone       | String  | `null`        | Link to clone the repository of the component (without `git clone`) | `false`  |
| isDevComponent | Boolean | `false`       | Indicates that the component is in development (to include `-D`)    | `false`  |
| version        | String  | `1.0.0`       | Version of the component                                            | `false`  |
| readmePath     | String  | `./README.md` | Path to the README file of the component                            | `false`  |

---
## Events
| Event name      | Description                                 |
|-----------------|---------------------------------------------|
| select-demo     | Emitted when a demo/variant is selected     |

Usage:
```vue
<TvDemo @select-demo="onSelectDemo" />
```

---
## Customization (Styles)
- All global and highlight.js styles are injected automatically.
- You can override styles by passing the `demoStyle` prop:
```js
const demoStyle = ref({
  dark: {
    backgroundBody: "#000000",
    backgroundContent: "#1f1f1f",
    color: "#ffffff",
  },
  light: {
    backgroundBody: "#ffffff",
    backgroundContent: "#f5f5f5",
    color: "#000000",
  },
});
```
Use in your component:
```vue
<TvDemo :component="component" :variants="demos" :demoStyle="demoStyle" />
```
You can provide colors for both `dark` and `light` themes, or just one. Defaults are used if not provided.

---
## SSR Notes
- No direct DOM (`window` / `document`) access in the source code—safe for SSR.
- Styles are injected automatically when you import the library.
- Code highlighting works in both Vite and Nuxt.
- Markdown documentation is supported by placing your `README.md` in the `public/` folder and referencing it via the `readmePath` prop.

---
## Roadmap
| Item                                 | Status      |
|--------------------------------------|-------------|
| More highlight.js themes              | Planned     |
| Advanced integration examples         | Planned     |
| Accessibility improvements            | Planned     |
| Dark mode support                     | Considering |

---
## Development
```bash
git clone https://github.com/TODOvue/tv-demo.git
cd tv-demo
yarn install
yarn dev     # run local demo
yarn build   # build library
```
The local demo is served with Vite using `index.html` and examples in `src/demo`.

---
## Contributing
PRs and issues are welcome. See [CONTRIBUTING.md](../CONTRIBUTING.md) and [CODE_OF_CONDUCT.md](../CODE_OF_CONDUCT.md).

---
## License
MIT © TODOvue

---
### Attributions
Crafted for the TODOvue component ecosystem
