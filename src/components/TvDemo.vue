<script setup>
import { HighCode } from 'vue-highlight-code';
import useDemo from '../composable/useDemo';

const props = defineProps({
  demoStyle: {
    type: Object,
    default: () => ({ body: {}, content: {} }),
  },
  hideBackground: Boolean,
  component: Object,
  variants: Array,
  nameComponent: {
    type: String,
    default: 'Component Demo',
  },
  sourceLink: {
    type: String,
    default: null,
  },
  urlClone: {
    type: String,
    default: null,
  },
  npmInstall: {
    type: String,
    default: null,
  },
  isDevComponent: {
    type: Boolean,
    default: false,
  },
});

const {
  customStyle,
  isCopy,
  messageCopy,
  selectedTheme,
  selectedVariantIndex,
  theme,
  variant,
  version,

  setClickItem,
  toggleTheme,
} = useDemo(props);
</script>

<template>
  <div :class="`${theme}-mode`" :style="customStyle.body">
    <div
      class="tv-demo-body"
      :class="{ [`${theme}-mode`]: !hideBackground }"
      :style="customStyle.content"
    >
      <div class="tv-demo-case">
        <div class="tv-demo-case-demo">
          <template v-if="variants?.length">
            <div class="tv-demo-header">
              <div>
                <h1 class="tv-demo-title">{{ nameComponent }} <span>v{{ version }}</span></h1>
                <div class="tv-demo-links">
                  <template v-if="sourceLink || npmInstall || urlClone">
                    <a
                      v-if="sourceLink"
                      :href="sourceLink"
                      target="_blank"
                      class="tv-demo-links-item"
                    >
                      📂 Source
                    </a>
                    <span v-if="sourceLink && (npmInstall || urlClone)"> | </span>
                    <div
                      v-if="npmInstall"
                      class="tv-demo-links-item"
                      @click="setClickItem('npm')"
                    >
                      📦 NPM Command
                    </div>
                    <span v-if="npmInstall && urlClone"> | </span>
                    <div
                      v-if="urlClone"
                      class="tv-demo-links-item"
                      @click="setClickItem('clone')"
                    >
                      📝 Clone Component
                    </div>
                  </template>
                </div>
              </div>
              <div>
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
              </div>
            </div>
            <h3>Variations:</h3>
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

            <h3>Code:</h3>
            <HighCode
              class="code tv-demo-code"
              :codeValue="variant.html"
              :theme="theme"
              lang="html"
              codeLines
              :key="variant.title"
              height="auto"
            />
            <div
              v-if="isCopy"
              class="tv-demo-copy"
            >
              {{ messageCopy }}
            </div>
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
