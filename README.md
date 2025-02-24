<p align="center"><img width="150" src="https://firebasestorage.googleapis.com/v0/b/todovue-blog.appspot.com/o/logo.png?alt=media&token=d8eb592f-e4a9-4b02-8aff-62d337745f41" alt="TODOvue logo">
</p>

# TODOvue Demo
###### The TvDemo component is a useful tool for viewing and testing different variations of components on different themes.

[![npm](https://img.shields.io/npm/v/@todovue/tvdemo.svg)](https://www.npmjs.com/package/@todovue/tvdemo) [![Netlify Status](https://api.netlify.com/api/v1/badges/8c4e2401-fefe-4f40-ae83-40681ecc36a5/deploy-status)](https://app.netlify.com/sites/todovue-demo/deploys) [![npm](https://img.shields.io/npm/dm/@todovue/tvdemo.svg)](https://www.npmjs.com/package/@todovue/tvdemo)
[![npm](https://img.shields.io/npm/d18m/@todovue/tvdemo.svg)](https://www.npmjs.com/package/@todovue/tvdemo) ![GitHub](https://img.shields.io/github/license/TODOvue/todovue-demo) ![GitHub Release Date](https://img.shields.io/github/release-date/TODOvue/todovue-demo)

<img width="600" src="https://firebasestorage.googleapis.com/v0/b/todovue-blog.appspot.com/o/imagesGit%2Ftodovue-demo.png?alt=media&token=b408f7d7-e015-4ac4-a8a1-3d23d7d09279" alt="TODOvue Demo">

## Table of Contents
- [Demo](https://todovue-demo.netlify.app/)
- [Installation](#installation)
- [Usage](#usage)
- [Props](#props)
- [Customize](#customize)
- [Development](#development)
- [Changelog](https://github.com/TODOvue/todovue-demo/blob/master/CHANGELOG.md)
- [Contributing](https://github.com/TODOvue/todovue-demo/blob/master/CONTRIBUTING.md)
- [License](https://github.com/TODOvue/todovue-demo/blob/master/LICENSE)

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
import TvDemo from 'todovue/tvdemo';
</script>
```
In your **main.js** file
```js
import "vue-highlight-code/dist/style.css"; // Styles are imported to display the code
```

You can also import it directly in the **main.js** file, so you don't have to import it in the pages
```js
import { createApp } from "vue";
import App from "./App.vue";
import "vue-highlight-code/dist/style.css"; // Styles are imported to display the code
import TvDemo from 'todovue/tvdemo';

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
import TvButton from "@/component/TvButton.vue";
import { demos } from "@/utils/mocks.js";

const component = shallowRef(TvButton);
</script>

<template>
  <tv-demo :component="component" :variants="demos"></tv-demo>
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
| Name           | Type    | Default | Description                               | Required  |
|----------------|---------|---------|-------------------------------------------|-----------|
| component      | Object  |         | Component to display                      | `true`    |
| variants       | Array   |         | Variations of the component               | `true`    |
| hideBackground | Boolean | `false` | Hide the background of the component demo | `false`   |
| demoStyle      | Object  |         | Style of the component                    | `false`   |
| propsData      | Object  |         | Props of the component                    | `false`   |

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
And you send that object to the component
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
  <tv-demo :component="component" :variants="demos" :demoStyle="demoStyle"></tv-demo>
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
Run the build It is not necessary to generate build, since it is generated when you do PR to the master branch
```bash
yarn build
```

## License
[MIT](https://github.com/TODOvue/todovue-demo/blob/master/LICENSE)
