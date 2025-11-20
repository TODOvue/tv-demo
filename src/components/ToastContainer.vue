<script setup>
import { defineProps } from 'vue';
import ToastNotification from './ToastNotification.vue';

defineProps({
  toasts: { type: Array, required: true },
});

const emit = defineEmits(['removeToast']);

const removeToast = (id) => {
  emit('removeToast', id);
};
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
  top: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  pointer-events: none;

  & > * {
    pointer-events: auto;
  }
}

@media (max-width: 640px) {
  .toast-container {
    top: 10px;
    right: 10px;
    left: 10px;
    align-items: center;
  }
}
</style>

