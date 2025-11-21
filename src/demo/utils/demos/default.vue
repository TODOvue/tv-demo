<template>
  <tv-demo
    :component="TvButton"
    :variants="demos"
    component-name="TvButton"
    npm-install="@todovue/tv-button"
    sour-ceLink="https://github.com/TODOvue/tv-button"
    url-clone="https://github.com/TODOvue/tv-button.git"
    version="1.3.1"
  ></tv-demo>
</template>

<script setup>
import { defineAsyncComponent } from 'vue'
import TvDemo from '@todovue/tv-demo'

import { demos } from "../utils/mocks.js";

const TvButton = defineAsyncComponent(
  /* webpackChunkName: "TvButton" */
  () => import('../components/TvButton.vue')
);
</script>
