<script setup>
import { defineAsyncComponent } from 'vue'

import { demos } from "../utils/mocks.js";

const TvDemo = defineAsyncComponent(/* webpackChunkName: "TvDemo" */() => import('../components/TvDemo.vue'));
const Component = defineAsyncComponent(/* webpackChunkName: "Test" */() => import('../components/Test.vue'));

</script>

<template>
  <tv-demo
    :conponent="Component"
    :variants="demos"
    nameComponent="TvDemo"
    npmInstall="@todovue/tv-demo"
    sourceLink="https://github.com/TODOvue/tv-demo"
    urlClone="https://github.com/TODOvue/tv-demo.git"
    is-dev-component
    version="1.0.0"
  ></tv-demo>
</template>

