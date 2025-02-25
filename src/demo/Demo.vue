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
    npmInstall="@todovue/tvdemo"
    sourceLink="https://github.com/TODOvue/todovue-demo"
    urlClone="https://github.com/TODOvue/todovue-demo.git"
    is-dev-component
  ></tv-demo>
</template>

