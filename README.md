<p align="center"><img width="150" src="https://firebasestorage.googleapis.com/v0/b/todovue-blog.appspot.com/o/logo.png?alt=media&token=d8eb592f-e4a9-4b02-8aff-62d337745f41" alt="TODOvue logo">
</p>

# TODOvue Demo
###### The TvDemo component is a useful tool for viewing and testing different variations of components on different themes.

[![npm](https://img.shields.io/npm/v/@todovue/tvdemo.svg)](https://www.npmjs.com/package/@todovue/tvdemo) [![Netlify Status](https://api.netlify.com/api/v1/badges/8c4e2401-fefe-4f40-ae83-40681ecc36a5/deploy-status)](https://app.netlify.com/sites/todovue-demo/deploys) [![npm](https://img.shields.io/npm/dm/@todovue/tvdemo.svg)](https://www.npmjs.com/package/@todovue/tvdemo)
[![npm](https://img.shields.io/npm/d18m/@todovue/tvdemo.svg)](https://www.npmjs.com/package/@todovue/tvdemo) ![GitHub](https://img.shields.io/github/license/TODOvue/todovue-demo) ![GitHub Release Date](https://img.shields.io/github/release-date/TODOvue/todovue-demo)

---
## **Important**: Documentation File Placement
To properly display the documentation within the demo, **the README file must be placed inside the `public/` folder** of your project. This ensures it is accessible when using `TvDemo`.

### Correct Setup
1. Move your `README.md` file to the `public/` folder:
   ```sh
   mv README.md public/

## 📖 Table of Contents
- [Demo](https://todovue-demo.netlify.app/)
- [Installation](#installation)
- [Usage](#usage)
- [Props](#props)
- [Customize](#customize)
- [Development](#development)
- [Changelog](https://github.com/TODOvue/todovue-demo/blob/main/CHANGELOG.md)
- [Contributing](https://github.com/TODOvue/todovue-demo/blob/main/CONTRIBUTING.md)
- [License](https://github.com/TODOvue/todovue-demo/blob/main/LICENSE)

## Installation
Install with npm or yarn as development dependency
```bash
npm install @todovue/tvdemo --save-dev
```
```bash
yarn add @todovue/tvdemo --dev
```

Import
```vue
<script setup>
  import TvDemo from '@todovue/tvdemo';
</script>
```

Or import it globally in main.js:
```js
import { createApp } from "vue";
import App from "./App.vue";
import TvDemo from '@todovue/tvdemo';

const app = createApp(App);
app.component("TvDemo", TvDemo);
app.mount("#app");
```

Add the following styles to your **App.vue** file
```css
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
```

## Usage
Basic use
```vue
<script setup>
import { shallowRef } from "vue";
import TvButton from "@todovue/tvbutton";
import { demos } from "@/utils/mocks.js";

const component = shallowRef(TvButton);
</script>

<template>
  <tv-demo
    :component="component"
    :variants="demos"
    nameComponent="TvDemo"
    npmInstall="@todovue/tvdemo"
    sourceLink="https://github.com/TODOvue/todovue-demo"
    urlClone="https://github.com/TODOvue/todovue-demo.git"
    is-dev-component
    version="1.0.0"
    readmePath="./README.md"
  ></tv-demo>
</template>
```
It is important to wrap it in a `shallowRef` to update the component without throwing an error
```js
const component = shallowRef(TvButton);
```

You can create the variations of the component in the same file or import them from another file
**utils/mocks.js**
##### It is important that the information is sent by `propsData`, since currently it cannot be sent by slot
```js
export const demos = [
  {
    id: 1,
    title: "TvButton Default",
    propsData: { titletextButton: "Press me!" },
    html: `<tv-button>
  Press me!
</tv-button>`, // It is necessary to create the html property, this will be displayed in the code
  },
  {
    id: 2,
    title: "TvButton Default",
    propsData: { titletextButton: "Press me!", isOutline: true },
    html: "<tv-button titletextButton='Press me!' isOutline />",
  },
];
```

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

## Customize
You can customize the component by passing the `demoStyle` property
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
Use it in your component:
```vue
<script setup>
import { ref } from "vue";

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
</script>

<template>
  <tv-demo
    :component="component"
    :variants="demos"
    :demoStyle="demoStyle"
    nameComponent="TvButton"
    npmInstall="@todovue/tvdemo"
    sourceLink="https://github.com/TODOvue/todovue-demo"
    urlClone="https://github.com/TODOvue/todovue-demo.git"
  ></tv-demo>
</template>
```
You can send the colors for both `dark` and `light`, these values are optional, so you can send only one or not send any, then it will take the default color

## Development
Clone the repository
```bash
git clone git@github.com:TODOvue/todovue-demo.git
```
Install the dependencies
```bash
yarn install
```
Run the project
```bash
yarn demo
```
Run the tests
```bash
yarn test:unit
```
Run the linter
```bash
yarn lint
```
Run the build It is not necessary to generate build, since it is generated when you do PR to the main branch
```bash
yarn build
```

## License
[MIT](https://github.com/TODOvue/todovue-demo/blob/main/LICENSE)
