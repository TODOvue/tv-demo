<template>
  <tv-demo
    :conponent="TvLabel"
    :variants="demos"
    is-dev-component
    nameComponent="TvLabel"
    npmInstall="@todovue/tv-label"
    sourceLink="https://github.com/TODOvue/tv-label"
    urlClone="https://github.com/TODOvue/tv-label.git"
    version="1.0.1"
  ></tv-demo>
</template>

<script setup>
import { defineAsyncComponent } from 'vue'
import TvDemo from '@todovue/tv-demo'

import { demos } from "../utils/mocks.js";

const TvLabel = defineAsyncComponent(/* webpackChunkName: "TvDemo" */() => import('../components/TvLabel.vue'));
</script>
