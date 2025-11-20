<template>
  <tv-demo
    :conponent="TvSearch"
    :demoStyle="demoStyle"
    :variants="demos"
    component-name="TvSearch"
    npm-install="@todovue/tv-search"
    source-link="https://github.com/TODOvue/tv-search"
    url-clone="https://github.com/TODOvue/tv-search.git"
    version="1.1.0"
  ></tv-demo>
</template>

<script setup>
import { defineAsyncComponent, ref } from 'vue'
import TvDemo from '@todovue/tv-demo'

import { demos } from "../utils/mocks.js";

const TvSearch = defineAsyncComponent(
  /* webpackChunkName: "TvSearch" */
  () => import('../components/TvSearch.vue')
);

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
