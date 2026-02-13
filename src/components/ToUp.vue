<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { ScrollContainer, ToUpEmits, ToUpProps } from '../types/components'

const props = withDefaults(defineProps<ToUpProps>(), {
  showOffset: 280,
  scrollTarget: null,
  theme: 'dark',
  ariaLabel: 'Scroll back to top',
})

const emit = defineEmits<ToUpEmits>()

const isVisible = ref(false)
let scrollElement: ScrollContainer | null = null

const resolveTarget = (): ScrollContainer => {
  if (typeof props.scrollTarget === 'string') {
    return (document.querySelector(props.scrollTarget) as HTMLElement | null) || window
  }

  if (props.scrollTarget instanceof HTMLElement) {
    return props.scrollTarget
  }

  return window
}

const isScrollable = (el: ScrollContainer | null): boolean => {
  if (!(el instanceof HTMLElement)) return true
  return el.scrollHeight > el.clientHeight
}

const getScrollElement = (): ScrollContainer => {
  const candidate = resolveTarget()
  return isScrollable(candidate) ? candidate : window
}

const updateVisibility = () => {
  if (!scrollElement) {
    isVisible.value = false
    return
  }

  const top =
    scrollElement instanceof HTMLElement
      ? scrollElement.scrollTop
      : window.scrollY || document.documentElement.scrollTop

  isVisible.value = top >= props.showOffset
}

const detachListeners = () => {
  if (!scrollElement) return
  scrollElement.removeEventListener('scroll', updateVisibility)
}

const attachListeners = () => {
  detachListeners()
  scrollElement = getScrollElement()
  scrollElement.addEventListener('scroll', updateVisibility, { passive: true })
  updateVisibility()
}

const scrollToTop = () => {
  const behavior = { top: 0, behavior: 'smooth' as const }

  if (scrollElement instanceof HTMLElement) {
    scrollElement.scrollTo(behavior)
  } else {
    window.scrollTo(behavior)
  }

  emit('click')
}

watch(() => props.scrollTarget, attachListeners)

onMounted(attachListeners)
onBeforeUnmount(detachListeners)
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
