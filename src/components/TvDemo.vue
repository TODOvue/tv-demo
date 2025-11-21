<script setup>
import { defineAsyncComponent } from 'vue';
import { HighCode } from 'vue-highlight-code';
import VueMarkdownIt from 'vue3-markdown-it';
import 'github-markdown-css';

import useDemo from '../composable/useDemo';
const ToastContainer = defineAsyncComponent(/* webpackChunkName: "toastContainer" */() => import('./ToastContainer.vue'));

const props = defineProps({
  demoStyle: { type: Object, default: () => ({ body: {}, content: {} }) },
  hideBackground: Boolean,
  component: Object,
  variants: Array,
  componentName: { type: String, default: 'Component Demo' },
  sourceLink: { type: String, default: null },
  urlClone: { type: String, default: null },
  npmInstall: { type: String, default: null },
  isDevComponent: { type: Boolean, default: false },
  version: { type: String, default: '0.0.0' },
  readmePath: { type: String, default: "/README.md" },
  changelogPath: { type: String, default: "/CHANGELOG.md" },
  showDocumentation: { type: Boolean, default: true },
  showChangelog: { type: Boolean, default: true },
});

const {
  customStyle,
  toasts,
  readmeContent,
  changelogContent,
  selectedTab,
  searchQuery,
  selectedVariantKey,
  totalVariantsCount,
  filteredVariantsCount,
  variantsListRef,
  virtualizedVariants,
  virtualPaddingTop,
  virtualPaddingBottom,
  emptySearchState,
  theme,
  variant,

  removeToast,
  setClickItem,
  toggleTheme,
  selectVariant,
  handleVariantsScroll,
  handleVariantsKeydown,
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
          <button :class="{ active: selectedTab === 'demo' }" @click="selectedTab = 'demo'">Demo</button>
          <button v-if="showDocumentation" :class="{ active: selectedTab === 'docs' }" @click="selectedTab = 'docs'">Documentation</button>
          <button v-if="showChangelog" :class="{ active: selectedTab === 'changelog' }" @click="selectedTab = 'changelog'">Changelog</button>
        </div>

        <div v-if="selectedTab === 'demo'" class="tv-demo-layout">
          <aside class="tv-demo-sidebar" :class="`${theme}-mode`">
            <div class="tv-demo-sidebar-header">
              <div>
                <p class="tv-demo-sidebar-meta">{{ filteredVariantsCount }} / {{ totalVariantsCount }} variants</p>
                <h3>Variants</h3>
              </div>
              <button class="tv-demo-sidebar-collapse" aria-label="Scroll to top" @click="variantsListRef?.scrollTo({ top: 0, behavior: 'smooth' })">
                ⬆️
              </button>
            </div>
            <label class="tv-demo-search" :class="`${theme}-mode`">
              <span class="tv-demo-search-icon">🔍</span>
              <input
                v-model="searchQuery"
                type="search"
                placeholder="Search variants..."
                class="tv-demo-search-input"
                aria-label="Search variants"
                @keydown.down.prevent="handleVariantsKeydown($event)"
              />
              <button
                v-if="searchQuery"
                type="button"
                class="tv-demo-search-clear"
                aria-label="Clear search"
                @click="searchQuery = ''"
              >✕</button>
            </label>

            <div
              class="tv-demo-variants"
              :class="`${theme}-mode`
              "
              role="listbox"
              tabindex="0"
              aria-label="Available variants"
              :aria-activedescendant="selectedVariantKey ? `variant-${selectedVariantKey}` : null"
              @keydown="handleVariantsKeydown"
              ref="variantsListRef"
              @scroll="handleVariantsScroll"
            >
              <div :style="{ paddingTop: `${virtualPaddingTop}px`, paddingBottom: `${virtualPaddingBottom}px` }">
                <template v-if="!emptySearchState">
                  <button
                    v-for="entry in virtualizedVariants"
                    :key="entry.key"
                    :id="`variant-${entry.key}`"
                    type="button"
                    class="tv-demo-variant-card"
                    :class="{ active: entry.key === selectedVariantKey }"
                    role="option"
                    :aria-selected="entry.key === selectedVariantKey"
                    @click="selectVariant(entry.key)"
                  >
                    <span class="tv-demo-variant-card-content">
                      <span class="tv-demo-variant-card-title">{{ entry.variant.title }}</span>
                      <span class="tv-demo-variant-card-description">{{ entry.variant.description }}</span>
                    </span>
                    <span class="tv-demo-variant-card-icon">→</span>
                  </button>
                </template>
                <div v-else class="tv-demo-empty-state">
                  <p>No matches for "{{ searchQuery }}".</p>
                  <button class="tv-demo-reset" type="button" @click="searchQuery = ''">Clear filter</button>
                </div>
              </div>
            </div>
          </aside>

          <section class="tv-demo-content" aria-live="polite">
            <div class="tv-demo-content-header">
              <div>
                <p class="tv-demo-content-label">Preview</p>
                <h3>{{ variant.title || 'Select a variant' }}</h3>
              </div>
            </div>
            <p class="tv-demo-description">
              {{ variant.description || 'Select a variant from the list to view its details.' }}
            </p>

            <div class="tv-demo-component-content">
              <component v-if="variant && component" :is="component" v-bind="variant.propsData" />
              <p v-else class="tv-demo-empty-component">No component to render.</p>
            </div>

            <h3>Code:</h3>
            <HighCode
              v-if="variant?.html"
              class="tv-demo-code"
              :codeValue="variant.html"
              :theme="theme"
              lang="html"
              codeLines
              :key="variant.title"
              height="auto"
            />
            <p v-else class="tv-demo-empty-code">No snippet available.</p>
          </section>
        </div>

        <div v-if="selectedTab === 'docs' && showDocumentation" class="tv-demo-content">
          <div class="markdown-body" v-if="readmeContent" >
            <VueMarkdownIt :source="readmeContent" html />
          </div>
          <div v-else>No documentation available.</div>
        </div>

        <div v-if="selectedTab === 'changelog' && showChangelog" class="tv-demo-content">
          <div class="markdown-body" v-if="changelogContent" >
            <VueMarkdownIt :source="changelogContent" html />
          </div>
          <div v-else>No changelog available.</div>
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
          <span class="tv-demo-footer-brand-text">{{ componentName }}</span>
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
          © {{ new Date().getFullYear() }} TODOvue. All rights reserved.
        </p>
      </div>
    </div>
  </footer>

  <ToastContainer
    :toasts="toasts"
    @removeToast="removeToast"
  />
</template>

<style></style>
