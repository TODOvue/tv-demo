<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';

const props = defineProps({
  showOffset: { type: Number, default: 280 },
  scrollTarget: { type: [String, Object], default: null },
  theme: { type: String, default: 'dark' },
  ariaLabel: { type: String, default: 'Scroll back to top' },
});

const emit = defineEmits(['click']);

const isVisible = ref(false);
let scrollElement = null;

const resolveTarget = () => {
  if (typeof props.scrollTarget === 'string') {
    return document.querySelector(props.scrollTarget) || window;
  }

  if (props.scrollTarget instanceof HTMLElement) {
    return props.scrollTarget;
  }

  return window;
};

const isScrollable = (el) => {
  if (!el || el === window) return true;
  return el.scrollHeight > el.clientHeight;
};

const getScrollElement = () => {
  const candidate = resolveTarget();
  return isScrollable(candidate) ? candidate : window;
};

const updateVisibility = () => {
  if (!scrollElement) {
    isVisible.value = false;
    return;
  }

  const top = scrollElement === window
    ? window.scrollY || document.documentElement.scrollTop
    : scrollElement.scrollTop;

  isVisible.value = top >= props.showOffset;
};

const detachListeners = () => {
  if (!scrollElement) return;
  scrollElement.removeEventListener('scroll', updateVisibility);
};

const attachListeners = () => {
  detachListeners();
  scrollElement = getScrollElement();
  scrollElement.addEventListener('scroll', updateVisibility, { passive: true });
  updateVisibility();
};

const scrollToTop = () => {
  const behavior = { top: 0, behavior: 'smooth' };

  if (scrollElement && scrollElement !== window) {
    scrollElement.scrollTo(behavior);
  } else {
    window.scrollTo(behavior);
  }

  emit('click');
};

watch(() => props.scrollTarget, attachListeners);

onMounted(attachListeners);
onBeforeUnmount(detachListeners);
</script>

<template>
  <transition name="tv-to-up">
    <button
      v-if="isVisible"
      type="button"
      class="tv-to-up"
      :class="`${theme}-mode`"
      :aria-label="ariaLabel"
      @click="scrollToTop"
    >
      <span class="tv-to-up-icon" aria-hidden="true">↑</span>
    </button>
  </transition>
</template>
