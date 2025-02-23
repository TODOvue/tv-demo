<script setup>
import { HighCode } from 'vue-highlight-code';
import useDemo from '../composable/useDemo';

const props = defineProps({
  demoStyle: {
    type: Object,
    default: () => ({ body: {}, content: {} })
  },
  hideBackground: Boolean,
  component: Object,
  variants: Array
});

const {
  customStyle,
  selectedTheme,
  selectedVariantIndex,
  theme,
  toggleTheme,
  variant,
} = useDemo(props);
</script>

<template>
  <div :class="`${theme}-mode`" :style="customStyle.body">
    <div
      class="tv-demo-body"
      :class="{ [`${theme}-mode`]: !hideBackground }"
      :style="customStyle.content"
    >
      <div class="tv-demo-theme">
        <select
          class="tv-demo-select tv-demo-select-theme"
          v-model="selectedTheme"
          @change="toggleTheme"
        >
          <option disabled value="">Select theme</option>
          <option value="dark">Dark</option>
          <option value="light">Light</option>
        </select>
      </div>

      <div class="tv-demo-case">
        <div class="tv-demo-case-demo">
          <template v-if="variants?.length">
            <select
              class="tv-demo-select"
              v-model="selectedVariantIndex"
              v-if="variants.length > 1"
            >
              <option
                v-for="(variant, index) in variants"
                :key="variant.title"
                :value="index"
              >
                {{ variant.title }}
              </option>
            </select>

            <div class="tv-demo-component">
              <component :is="component" v-bind="variant.propsData" />
            </div>

            <HighCode
              class="code tv-demo-code"
              :codeValue="variant.html"
              :theme="theme"
              lang="html"
              codeLines
              :key="variant.title"
              height="auto"
            />
          </template>
          <template v-else>
            <h1 class="tv-demo-no-component">
              Here the different variations of the components will be shown.
            </h1>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss" src="../assets/scss/style.scss"></style>
