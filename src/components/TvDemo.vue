<script setup>
import { HighCode } from 'vue-highlight-code';
import VueMarkdownIt from 'vue3-markdown-it';
import 'github-markdown-css';

import useDemo from '../composable/useDemo';
import ToastContainer from './ToastContainer.vue';

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
  toasts,
  readmeContent,
  selectedTab,
  selectedVariantIndex,
  theme,
  variant,

  removeToast,
  setClickItem,
  toggleTheme,
} = useDemo(props);
</script>

<template>
  <div :class="`${theme}-mode tv-demo`" :style="customStyle.body">
    <div class="tv-demo-body" :class="{ [`${theme}-mode`]: !hideBackground }" :style="customStyle.content">
      <div class="tv-demo-case">
        <div class="tv-demo-header">
          <div>
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
              <span style="font-size: 0.9rem; opacity: 0.8;">Theme</span>
              <label class="switch">
                <input type="checkbox" :checked="theme === 'dark'" @change="toggleTheme" />
                <span class="slider round"></span>
              </label>
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
          <span class="tv-demo-description">
            {{ variant.description }}
          </span>

          <div class="tv-demo-component-content">
            <component :is="component" v-bind="variant.propsData" />
          </div>

          <h3>Code:</h3>
          <HighCode class="tv-demo-code" :codeValue="variant.html" :theme="theme" lang="html" codeLines :key="variant.title" height="auto" />
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
  <footer class="tv-demo-footer" :class="`${theme}-mode`">
    <div class="tv-demo-footer-content">
      <div class="tv-demo-footer-main">
        <div class="tv-demo-footer-brand">
          <span class="tv-demo-footer-logo">
            <img src="https://firebasestorage.googleapis.com/v0/b/todovue-blog.appspot.com/o/icono_git.png?alt=media&token=86270c30-8235-4424-b72b-7a585f228685" alt="">
          </span>
          <span class="tv-demo-footer-brand-text">{{ nameComponent }}</span>
          <span class="tv-demo-footer-brand-version">v{{ version }}</span>
        </div>
        <div class="tv-demo-footer-info">
          <p class="tv-demo-footer-text">
            Designed & Developed by
            <a
              href="https://cris-dev.com/"
              target="_blank"
              rel="noopener noreferrer"
              class="tv-demo-footer-link"
            >
              cris-dev.com
            </a>
          </p>
          <div class="tv-demo-footer-divider"></div>
          <p class="tv-demo-footer-text">
            Made with
            <span class="tv-demo-footer-heart">💙</span>
            using Vue.js
          </p>
        </div>
      </div>
      <div class="tv-demo-footer-bottom">
        <p class="tv-demo-footer-copyright">
          © {{ new Date().getFullYear() }} {{ nameComponent }}. All rights reserved.
        </p>
      </div>
    </div>
  </footer>

  <!-- Toast Notifications -->
  <ToastContainer :toasts="toasts" @removeToast="removeToast" />
</template>

<style></style>
