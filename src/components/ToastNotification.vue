<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps({
  id: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, default: 'success' },
  duration: { type: Number, default: 3000 },
});

const emit = defineEmits(['remove']);

const isVisible = ref(false);
const isLeaving = ref(false);

onMounted(() => {
  setTimeout(() => {
    isVisible.value = true;
  }, 10);

  setTimeout(() => {
    closeToast();
  }, props.duration);
});

const closeToast = () => {
  isLeaving.value = true;
  setTimeout(() => {
    emit('remove', props.id);
  }, 300);
};

const getIcon = () => {
  switch (props.type) {
    case 'success':
      return '✓';
    case 'error':
      return '✕';
    case 'warning':
      return '⚠';
    case 'info':
      return 'ℹ';
    default:
      return '✓';
  }
};

const getIconColor = () => {
  switch (props.type) {
    case 'success':
      return '#22c55e';
    case 'error':
      return '#ef4444';
    case 'warning':
      return '#f59e0b';
    case 'info':
      return '#3b82f6';
    default:
      return '#22c55e';
  }
};
</script>

<template>
  <div
    class="toast-notification"
    :class="[type, { visible: isVisible, leaving: isLeaving }]"
  >
    <div class="toast-icon" :style="{ backgroundColor: `${getIconColor()}20`, color: getIconColor() }">
      {{ getIcon() }}
    </div>
    <div class="toast-content">
      <p class="toast-message">{{ message }}</p>
    </div>
    <button class="toast-close" @click="closeToast" aria-label="Cerrar notificación">
      ✕
    </button>
  </div>
</template>

<style scoped lang="scss">
@keyframes slideInRight {
  from {
    transform: translateX(400px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideOutRight {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(400px);
    opacity: 0;
  }
}

.toast-notification {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 320px;
  max-width: 450px;
  padding: 14px 16px;
  margin-bottom: 12px;
  border-radius: 12px;
  box-shadow:
    0 10px 30px rgba(0, 0, 0, 0.2),
    0 0 0 1px rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  background: linear-gradient(135deg, rgba(30, 30, 30, 0.95) 0%, rgba(20, 20, 20, 0.95) 100%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  opacity: 0;
  transform: translateX(400px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: currentColor;
  }

  &.visible {
    animation: slideInRight 0.3s ease-out forwards;
  }

  &.leaving {
    animation: slideOutRight 0.3s ease-in forwards;
  }

  &.success::before {
    background: #22c55e;
  }

  &.error::before {
    background: #ef4444;
  }

  &.warning::before {
    background: #f59e0b;
  }

  &.info::before {
    background: #3b82f6;
  }
}

.toast-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  font-weight: bold;
  font-size: 14px;
  flex-shrink: 0;
}

.toast-content {
  flex: 1;
  min-width: 0;
}

.toast-message {
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  color: #ffffff;
  line-height: 1.4;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.toast-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.6);
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  font-weight: bold;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    color: rgba(255, 255, 255, 0.9);
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }
}

/* Light theme support */
.light-mode .toast-notification {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(245, 245, 245, 0.98) 100%);
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow:
    0 10px 30px rgba(0, 0, 0, 0.15),
    0 0 0 1px rgba(0, 0, 0, 0.05);

  .toast-message {
    color: #1f2937;
  }

  .toast-close {
    background: rgba(0, 0, 0, 0.05);
    color: rgba(0, 0, 0, 0.5);

    &:hover {
      background: rgba(0, 0, 0, 0.1);
      color: rgba(0, 0, 0, 0.8);
    }
  }
}
</style>

