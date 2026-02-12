<script setup>
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

