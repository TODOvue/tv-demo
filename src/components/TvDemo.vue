<script setup>
import { HighCode } from 'vue-highlight-code';
import 'vue-highlight-code/dist/style.css';
import 'highlight.js/styles/monokai.css';
import 'github-markdown-css';
import VueMarkdownIt from 'vue3-markdown-it';

import useDemo from '../composable/useDemo';

const props = defineProps({
  demoStyle: { type: Object, default: () => ({ body: {}, content: {} }) },
  hideBackground: Boolean,
  component: Object,
  variants: Array,
  nameComponent: { type: String, default: 'Component Demo' },
  sourceLink: { type: String, default: null },
  urlClone: { type: String, default: null },
  npmInstall: { type: String, default: null },
  isDevComponent: { type: Boolean, default: false },
  version: { type: String, default: '0.0.0' },
  readmePath: { type: String, default: "/README.md" },
});

const {
  customStyle,
  isCopy,
  messageCopy,
  readmeContent,
  selectedTab,
  selectedTheme,
  selectedVariantIndex,
  theme,
  variant,

  setClickItem,
  toggleTheme,
} = useDemo(props);
</script>

<template>
  <div :class="`${theme}-mode`" :style="customStyle.body">
    <div class="tv-demo-body" :class="{ [`${theme}-mode`]: !hideBackground }" :style="customStyle.content">
      <div class="tv-demo-case">
        <div class="tv-demo-header">
          <div>
            <h1 class="tv-demo-title">
              {{ nameComponent }} <span>v{{ version }}</span>
            </h1>
            <div class="tv-demo-links">
              <template v-if="sourceLink || npmInstall || urlClone">
                <a v-if="sourceLink" :href="sourceLink" target="_blank" class="tv-demo-links-item">
                  📂 Source
                </a>
                <span v-if="sourceLink && (npmInstall || urlClone)"> | </span>
                <div v-if="npmInstall" class="tv-demo-links-item" @click="setClickItem('npm')">
                  📦 NPM Command
                </div>
                <span v-if="npmInstall && urlClone"> | </span>
                <div v-if="urlClone" class="tv-demo-links-item" @click="setClickItem('clone')">
                  📝 Clone Component
                </div>
              </template>
            </div>
          </div>

          <div>
            <div class="tv-demo-theme">
              <select class="tv-demo-select tv-demo-select-theme" v-model="selectedTheme" @change="toggleTheme">
                <option disabled value="">Select theme</option>
                <option value="dark">Dark</option>
                <option value="light">Light</option>
              </select>
            </div>
          </div>
        </div>

        <div class="tv-demo-tabs">
          <button :class="{ active: selectedTab === 'demo' }" @click="selectedTab = 'demo'">📌 Demo</button>
          <button :class="{ active: selectedTab === 'docs' }" @click="selectedTab = 'docs'">📖 Documentation</button>
        </div>

        <div v-if="selectedTab === 'demo'" class="tv-demo-content">
          <h3>Variations:</h3>
          <select class="tv-demo-select" v-model="selectedVariantIndex" v-if="variants.length > 1">
            <option v-for="(variant, index) in variants" :key="variant.title" :value="index">
              {{ variant.title }}
            </option>
          </select>

          <div class="tv-demo-component">
            <component :is="component" v-bind="variant.propsData" />
          </div>

          <h3>Code:</h3>
          <HighCode class="tv-demo-code" :codeValue="variant.html" :theme="theme" lang="html" codeLines :key="variant.title" height="auto" />

          <div v-if="isCopy" :class="hideBackground ? 'tv-demo-copy no-background' : 'tv-demo-copy'">
            {{ messageCopy }}
          </div>
        </div>

        <div v-if="selectedTab === 'docs'" class="tv-demo-content">
          <h2>📖 Documentation</h2>
          <div class="markdown-body" v-if="readmeContent" >
            <VueMarkdownIt :source="readmeContent" html />
          </div>
          <div v-else>No documentation available.</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss" src="../assets/scss/style.scss"></style>
