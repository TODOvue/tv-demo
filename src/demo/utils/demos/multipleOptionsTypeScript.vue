<script lang="ts" setup>
import { ref } from 'vue'

const count = ref<number>(0)
</script>

<template>
  <button @click="count++">Count is: {{ count }}</button>
</template>
