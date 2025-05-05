<template>
  <tv-demo
    :conponent="TvRelativeTime"
    :variants="demos"
    hide-background
    nameComponent="TvRelativeTime"
    npmInstall="@todovue/tv-relative-time"
    sourceLink="https://github.com/TODOvue/tv-relative-time"
    urlClone="https://github.com/TODOvue/tv-relative-time.git"
    version="1.0.1"
  ></tv-demo>
</template>

<script setup>
import { defineAsyncComponent } from 'vue'
import TvDemo from '@todovue/tv-demo'

import { demos } from "../utils/mocks.js";

const TvRelativeTime = defineAsyncComponent(/* webpackChunkName: "TvDemo" */() => import('../components/TvRelativeTime.vue'));
</script>
