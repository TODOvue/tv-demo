<template>
  <tv-demo
    :component="TvLabel"
    :variants="demos"
    is-dev-component
    component-name="TvLabel"
    npm-install="@todovue/tv-label"
    source-link="https://github.com/TODOvue/tv-label"
    url-clone="https://github.com/TODOvue/tv-label.git"
    version="1.0.1"
  ></tv-demo>
</template>

<script setup>
import { defineAsyncComponent } from 'vue'
import TvDemo from '@todovue/tv-demo'

import { demos } from "./utils/mocks.js";

const TvLabel = defineAsyncComponent(
  /* webpackChunkName: "TvLabel" */
  () => import('../components/TvLabel.vue')
);
</script>
