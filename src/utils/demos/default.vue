<template>
  <tv-demo
    :conponent="TvButton"
    :variants="demos"
    nameComponent="TvButton"
    npmInstall="@todovue/tv-button"
    sourceLink="https://github.com/TODOvue/tv-button"
    urlClone="https://github.com/TODOvue/tv-button.git"
    version="1.3.1"
  ></tv-demo>
</template>

<script setup>
import { defineAsyncComponent } from 'vue'
import TvDemo from '@todovue/tv-demo'

import { demos } from "../utils/mocks.js";

const TvButton = defineAsyncComponent(/* webpackChunkName: "TvDemo" */() => import('../components/TvButton.vue'));
</script>
