<template>
  <tv-demo
    :component="TvRelativeTime"
    :variants="demos"
    hide-background
    component-name="TvRelativeTime"
    npm-install="@todovue/tv-relative-time"
    source-link="https://github.com/TODOvue/tv-relative-time"
    url-clone="https://github.com/TODOvue/tv-relative-time.git"
    version="1.0.1"
  ></tv-demo>
</template>

<script setup>
import { defineAsyncComponent } from 'vue'
import TvDemo from '@todovue/tv-demo'

import { demos } from "../utils/mocks.js";

const TvRelativeTime = defineAsyncComponent(
  /* webpackChunkName: "TvRelativeTime" */
  () => import('../components/TvRelativeTime.vue')
);
</script>
