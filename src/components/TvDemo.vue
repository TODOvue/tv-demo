<script setup>
import { defineAsyncComponent, onMounted, onBeforeUnmount, ref, computed } from 'vue';
import { HighCode } from 'vue-highlight-code';
import VueMarkdownIt from 'vue3-markdown-it';
import 'github-markdown-css';

import useDemo from '../composable/useDemo';
const ToastContainer = defineAsyncComponent(/* webpackChunkName: "toastContainer" */() => import('./ToastContainer.vue'));
const ToUp = defineAsyncComponent(/* webpackChunkName: "toUp" */() => import('./ToUp.vue'));
const TvPreviewFrame = defineAsyncComponent(/* webpackChunkName: "tvPreviewFrame" */() => import('./TvPreviewFrame.vue'));
const TvNestedEditor = defineAsyncComponent(/* webpackChunkName: "tvNestedEditor" */() => import('./TvNestedEditor.vue'));

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
  readmePath: { type: String, default: "./README.md" },
  changelogPath: { type: String, default: "./CHANGELOG.md" },
  showDocumentation: { type: Boolean, default: true },
  showChangelog: { type: Boolean, default: true },
  manualEmits: { type: Array, default: () => [] },
});

const canGoBack = ref(false);

const goBack = () => {
  if (typeof window === 'undefined') return;
  window.history.back();
};

onMounted(() => {
  const hasHistory = window.history.length > 1;
  const hasReferrer = typeof document !== 'undefined' && !!document.referrer;
  canGoBack.value = hasHistory || hasReferrer;
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
  handleVariantsKeydown,
  reactiveProps,
  eventLogs,
  addLog,
  clearLogs,
  viewportWidth,
  activeToolTab,
  resetProps,
  copyCode,
} = useDemo(props);

const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1200);

const updateWindowWidth = () => {
  windowWidth.value = window.innerWidth;
};

onMounted(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('resize', updateWindowWidth);
  }
});

onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', updateWindowWidth);
  }
});

const autoEventListeners = computed(() => {
  const listeners = {};
  const componentEmits = props.component && props.component.emits
    ? (Array.isArray(props.component.emits)
      ? props.component.emits
      : Object.keys(props.component.emits))
    : [];

  const allEmits = [...new Set([...componentEmits, ...props.manualEmits])];

  if (allEmits.length > 0) {
    allEmits.forEach(event => {
      listeners[`on${event.charAt(0).toUpperCase() + event.slice(1)}`] = (payload) => {
        addLog(event, payload);
      };
    });
  }
  return listeners;
});
</script>

<template>
  <div :class="`${theme}-mode tv-demo`" :style="customStyle.body">
    <div class="tv-demo-body" :class="{ [`${theme}-mode`]: !hideBackground }" :style="customStyle.content">
      <div v-if="canGoBack" class="tv-demo-back-row">
        <button type="button" class="tv-demo-back-button" aria-label="Back" @click="goBack">← Back</button>
      </div>
      <div class="tv-demo-case">
        <div class="tv-demo-header">
          <div>
            <div class="tv-demo-links">
              <template v-if="sourceLink || npmInstall || urlClone">
                <a v-if="sourceLink" :href="sourceLink" target="_blank" class="tv-demo-links-item">
                  View source code
                </a>
                <span v-if="sourceLink && (npmInstall || urlClone)"> | </span>
                <div v-if="npmInstall" class="tv-demo-links-item" @click="setClickItem('npm')">
                  Copy install command
                </div>
                <span v-if="npmInstall && urlClone"> | </span>
                <div v-if="urlClone" class="tv-demo-links-item" @click="setClickItem('clone')">
                  Copy repository clone URL
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

        <div class="tv-demo-tools main-tabs">
          <div class="tv-demo-tools-tabs">
            <button 
              class="tv-demo-tools-tab" 
              :class="{ active: selectedTab === 'demo' }" 
              @click="selectedTab = 'demo'"
            >
              Demo
            </button>
            <button 
              v-if="showDocumentation" 
              class="tv-demo-tools-tab" 
              :class="{ active: selectedTab === 'docs' }" 
              @click="selectedTab = 'docs'"
            >
              Documentation
            </button>
            <button 
              v-if="showChangelog" 
              class="tv-demo-tools-tab" 
              :class="{ active: selectedTab === 'changelog' }" 
              @click="selectedTab = 'changelog'"
            >
              Changelog
            </button>
          </div>

          <div class="tv-demo-tools-content main-content">
            <div v-show="selectedTab === 'demo'" class="tv-demo-layout">
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
                  :class="`${theme}-mode`"
                  role="listbox"
                  tabindex="0"
                  aria-label="Available variants"
                  :aria-activedescendant="selectedVariantKey ? `variant-${selectedVariantKey}` : null"
                  @keydown="handleVariantsKeydown"
                  ref="variantsListRef"
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
                  <div class="tv-demo-viewport-controls">
                    <button
                      type="button"
                      class="tv-demo-viewport-btn"
                      :class="{ active: viewportWidth === '375px' }"
                      @click="viewportWidth = '375px'"
                      aria-label="Mobile view (375px)"
                      title="Mobile (375px)"
                    >
                      Mobile
                    </button>
                    <button
                      v-if="windowWidth >= 600"
                      type="button"
                      class="tv-demo-viewport-btn"
                      :class="{ active: viewportWidth === '768px' }"
                      @click="viewportWidth = '768px'"
                      aria-label="Tablet view (768px)"
                      title="Tablet (768px)"
                    >
                      Tablet
                    </button>
                    <button
                      v-if="windowWidth >= 1024"
                      type="button"
                      class="tv-demo-viewport-btn"
                      :class="{ active: viewportWidth === '100%' }"
                      @click="viewportWidth = '100%'"
                      aria-label="Desktop view (100%)"
                      title="Desktop (100%)"
                    >
                      Desktop
                    </button>
                  </div>
                </div>
                <p class="tv-demo-description">
                  {{ variant.description || 'Select a variant from the list to view its details.' }}
                </p>

                <div class="tv-demo-component-content" :style="{ width: viewportWidth }">
                  <TvPreviewFrame
                    v-if="variant && component"
                    :component="component"
                    :component-props="{ ...reactiveProps, ...autoEventListeners }"
                    :viewport-width="viewportWidth"
                    :body-class="`${theme}-mode`"
                    :body-style="hideBackground ? {} : customStyle.content"
                  />
                  <p v-else class="tv-demo-empty-component">No component to render.</p>
                </div>

                <div class="tv-demo-tools">
                  <div class="tv-demo-tools-tabs">
                    <button
                      class="tv-demo-tools-tab"
                      :class="{ active: activeToolTab === 'playground' }"
                      @click="activeToolTab = 'playground'"
                    >
                      Playground
                    </button>
                    <button
                      class="tv-demo-tools-tab"
                      :class="{ active: activeToolTab === 'events' }"
                      @click="activeToolTab = 'events'"
                    >
                      Events
                      <span v-if="eventLogs.length > 0" class="tv-demo-badge">{{ eventLogs.length }}</span>
                    </button>
                    <button
                      class="tv-demo-tools-tab"
                      :class="{ active: activeToolTab === 'code' }"
                      @click="activeToolTab = 'code'"
                    >
                      Code
                    </button>
                  </div>

                  <div class="tv-demo-tools-content">
                    <div v-show="activeToolTab === 'playground'" class="tv-demo-tool-pane">
                      <div class="tv-demo-toolbar">
                        <h3 class="tv-demo-tool-title">Props</h3>
                        <button class="tv-demo-btn-secondary is-small" @click="resetProps">
                          Reset Props
                        </button>
                      </div>

                      <div v-if="Object.keys(reactiveProps).length > 0" class="tv-demo-controls-grid">
                        <div v-for="(value, key) in reactiveProps" :key="key" class="tv-demo-control-item" :class="{ 'is-complex': typeof value === 'object' && value !== null }">
                          <template v-if="typeof value !== 'object' || value === null">
                             <span class="tv-demo-control-label" :title="key">{{ key }}</span>
                             <div class="tv-demo-control-input-wrapper">
                                <label v-if="typeof value === 'boolean'" class="switch small">
                                  <input type="checkbox" v-model="reactiveProps[key]" :id="`control-${key}`" />
                                  <span class="slider round"></span>
                                </label>
                                <input
                                  v-else-if="typeof value === 'number'"
                                  v-model.number="reactiveProps[key]"
                                  type="number"
                                  class="tv-demo-input"
                                  :id="`control-${key}`"
                                />
                                <input
                                  v-else
                                  v-model="reactiveProps[key]"
                                  type="text"
                                  class="tv-demo-input"
                                  :id="`control-${key}`"
                                />
                             </div>
                          </template>
                          <template v-else>
                            <TvNestedEditor
                              v-model="reactiveProps[key]"
                              :name="key"
                            />
                          </template>
                        </div>
                      </div>
                      <div v-else class="tv-demo-empty-state small">
                        No props available for this component.
                      </div>
                    </div>

                    <div v-show="activeToolTab === 'events'" class="tv-demo-tool-pane">
                      <div class="tv-demo-toolbar">
                        <h3 class="tv-demo-tool-title">Event Logger</h3>
                        <button v-if="eventLogs.length > 0" @click="clearLogs" class="tv-demo-btn-secondary is-small">Clear</button>
                      </div>
                      <div class="tv-demo-logs-container">
                        <div v-if="eventLogs.length === 0" class="tv-demo-logs-empty">
                          Listening for events...
                        </div>
                        <div v-else v-for="log in eventLogs" :key="log.id" class="tv-demo-log-item">
                          <span class="tv-demo-log-time">{{ log.timestamp }}</span>
                          <span class="tv-demo-log-name">{{ log.eventName }}</span>
                          <span class="tv-demo-log-payload" v-if="log.payload !== undefined">
                            {{ JSON.stringify(log.payload) }}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div v-show="activeToolTab === 'code'" class="tv-demo-tool-pane">
                      <div class="tv-demo-toolbar">
                        <h3 class="tv-demo-tool-title">Generated Code</h3>
                        <button class="tv-demo-btn-secondary is-small" @click="copyCode(variant.html)">
                          Copy Code
                        </button>
                      </div>
                      <HighCode
                        :key="selectedVariantKey"
                        class="tv-demo-code"
                        :codeValue="variant.html"
                        :theme="theme"
                        lang="html"
                        codeLines
                        height="auto"
                        :copy="false"
                      />
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <div v-if="selectedTab === 'docs' && showDocumentation">
              <div class="markdown-body" v-if="readmeContent" >
                <VueMarkdownIt :source="readmeContent" html />
              </div>
              <div v-else>No documentation available.</div>
            </div>

            <div v-if="selectedTab === 'changelog' && showChangelog">
              <div class="markdown-body" v-if="changelogContent" >
                <VueMarkdownIt :source="changelogContent" html />
              </div>
              <div v-else>No changelog available.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <footer class="tv-demo-footer" :class="`${theme}-mode`">
    <div class="tv-demo-footer-content">
      <div class="tv-demo-footer-main">
        <div class="tv-demo-footer-brand">
          <span class="tv-demo-footer-logo">
            <img src="https://res.cloudinary.com/denj4fg7f/image/upload/v1766183906/icono_git_bvxian.png" alt="Icon TODOvue">
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

  <ToUp
    :theme="theme"
    scroll-target=".tv-demo-body"
    aria-label="Back to top"
  />
</template>

<style></style>
