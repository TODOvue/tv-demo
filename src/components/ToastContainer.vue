<script setup lang="ts">
import ToastNotification from './ToastNotification.vue'
import type { ToastContainerEmits, ToastContainerProps } from '../types/components'

defineProps<ToastContainerProps>()

const emit = defineEmits<ToastContainerEmits>()

const removeToast = (id: string) => {
  emit('removeToast', id)
}
</script>

<template>
  <div class="toast-container">
    <ToastNotification
      v-for="toast in toasts"
      :key="toast.id"
      :id="toast.id"
      :message="toast.message"
      :type="toast.type"
      :duration="toast.duration"
      @remove="removeToast"
    />
  </div>
</template>

<style scoped lang="scss">
.toast-container {
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  pointer-events: none;

  & > * {
    pointer-events: auto;
  }
}

@media (max-width: 640px) {
  .toast-container {
    top: 12px;
    right: 12px;
    left: 12px;
    align-items: stretch;
  }
}
</style>

