<script setup>
defineProps({
  variant: {
    type: String,
    default: 'default',
  },
  isDevComponent: {
    type: Boolean,
    default: false,
  }
})

const emit = defineEmits(["clickButton", "clickLabel", "clickSecondaryButton"]);
</script>

<template>
  <div class="test-component">
    <h1>Test: {{ variant }}</h1>
    <div class="test-actions">
      <button class="test-btn" @click="emit('clickButton', { test: 1 })">Click Button</button>
      <button class="test-btn" @click="emit('clickLabel', 'label')">Click Label</button>
      <button class="test-btn secondary" @click="emit('clickSecondaryButton')">Click Secondary</button>
    </div>
    <slot></slot>
  </div>
</template>

<style scoped>
.test-component {
  border: #1d4ed8 solid 1px;
  width: 100%;
  height: 100%;
}
h1 {
  margin-bottom: 1rem;
  font-family: sans-serif;
}

.test-actions {
  display: flex;
  gap: 10px;
  margin-bottom: 1rem;
}

.test-btn {
  padding: 8px 16px;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
}

.test-btn:hover {
  background-color: #2563eb;
}

.test-btn.secondary {
  background-color: #64748b;
}

.test-btn.secondary:hover {
  background-color: #475569;
}

@media (min-width: 1024px) {
  .test-component {
    background-color: rgba(59, 130, 246, 0.05);
  }
}

@media (min-width: 601px) and (max-width: 1023px) {
  .test-component {
    background-color: rgba(16, 185, 129, 0.05);
    border-color: #10b981;
  }
}

@media (max-width: 600px) {
  .test-actions {
    flex-direction: column;
  }

  .test-btn {
    width: 100%;
    text-align: center;
  }

  h1 {
    color: #ef4444;
    font-size: 1.2rem;
  }

  .test-component {
     background-color: rgba(239, 68, 68, 0.05);
     border-color: #ef4444;
  }
}
</style>
