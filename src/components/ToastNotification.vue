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
@use '../assets/scss/variables.scss';

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
  width: min(420px, calc(100vw - 32px));
  padding: 14px 16px;
  margin-bottom: 12px;
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
  backdrop-filter: blur(12px);
  background: rgba(15, 23, 42, 0.9);
  border: 1px solid rgba(148, 163, 184, 0.2);
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
  color: #e2e8f0;
  font-family: variables.$font-text;
  letter-spacing: 0.01em;
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
  background: rgba(148, 163, 184, 0.16);
  color: rgba(226, 232, 240, 0.7);
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  font-weight: bold;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    background: rgba(59, 130, 246, 0.2);
    color: #93c5fd;
  }

  &:active {
    transform: translateY(1px);
  }
}

.dark-mode .toast-notification {
  background: rgba(15, 23, 42, 0.9);
  border-color: rgba(148, 163, 184, 0.25);

  .toast-message {
    color: #e2e8f0;
  }

  .toast-close {
    background: rgba(148, 163, 184, 0.16);
    color: rgba(226, 232, 240, 0.7);

    &:hover {
      background: rgba(59, 130, 246, 0.2);
      color: #93c5fd;
    }
  }
}

.light-mode .toast-notification {
  background: rgba(248, 250, 252, 0.9);
  border-color: rgba(71, 85, 105, 0.2);

  .toast-message {
    color: #1e293b;
  }

  .toast-close {
    background: rgba(100, 116, 139, 0.12);
    color: rgba(30, 41, 59, 0.65);

    &:hover {
      background: rgba(30, 64, 175, 0.12);
      color: #1d4ed8;
    }
  }
}
</style>

