<script setup>
import { defineAsyncComponent } from 'vue'
import { demos } from './utils/mocks.js'

const TvDemo = defineAsyncComponent(/* webpackChunkName: "TvDemo" */() => import('../components/TvDemo.vue'))
const Component = defineAsyncComponent(/* webpackChunkName: "Test" */() => import('../components/Test.vue'))
</script>

<template>
  <TvDemo
    :component="Component"
    :manual-emits="['clickButton', 'clickLabel', 'clickSecondaryButton']"
    :variants="demos"
    component-name="TvDemo"
    is-dev-component
    npm-install="@todovue/tv-demo"
    source-link="https://github.com/TODOvue/tv-demo"
    url-clone="https://github.com/TODOvue/tv-demo.git"
    version="1.4.11"
  />
</template>
