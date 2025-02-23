<script setup>
import { defineAsyncComponent } from 'vue'

const TvDemo = defineAsyncComponent(/* webpackChunkName: "TvDemo" */() => import('../components/TvDemo.vue'))
</script>

<template>
  <tv-demo></tv-demo>
</template>

<style scoped>

</style>
