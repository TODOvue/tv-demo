<script setup>
defineProps({
  variant: {
    type: String,
    default: 'default',
  }
})
</script>

<template>
  <h1>Test: {{ variant }}</h1>
  <slot></slot>
</template>
