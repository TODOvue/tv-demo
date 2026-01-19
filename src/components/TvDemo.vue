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

const checkCanGoBack = () => {
  if (typeof window === 'undefined') return;
  const hasReferrer = typeof document !== 'undefined' && !!document.referrer;

  if (window.navigation && typeof window.navigation.canGoBack === 'boolean') {
    canGoBack.value = window.navigation.canGoBack || hasReferrer;
  } else if (window.history.state && typeof window.history.state.position === 'number') {
    canGoBack.value = window.history.state.position > 0 || hasReferrer;
  } else {
    canGoBack.value = hasReferrer;
  }
};

onMounted(() => {
  checkCanGoBack();
  if (typeof window !== 'undefined') {
    window.addEventListener('popstate', checkCanGoBack);
    if (window.navigation) {
      window.navigation.addEventListener('currententrychange', checkCanGoBack);
    }
  }
});

onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('popstate', checkCanGoBack);
    if (window.navigation) {
      window.navigation.removeEventListener('currententrychange', checkCanGoBack);
    }
    window.removeEventListener('resize', updateWindowWidth);
  }
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
  backgroundType,
  isRtl,
  isGrid,
  handleVariantsScroll,
  isSidebarCompressed,
  showScrollToTop,
  isInstallDropdownOpen,
  toggleInstallDropdown,
  isThemeDropdownOpen,
  toggleThemeDropdown,
  selectedCodeType,
  availableCodeTypes,
  currentCode,
  currentLang,
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
        <button type="button" class="tv-demo-btn-secondary" aria-label="Back" @click="goBack">← Back</button>
      </div>
      <div class="tv-demo-case">
        <div class="tv-demo-header">
          <div>
            <div class="tv-demo-links">
              <template v-if="sourceLink || npmInstall || urlClone">
                <a v-if="sourceLink" :href="sourceLink" target="_blank" class="tv-demo-btn-secondary is-small" style="text-decoration: none; display: inline-flex; align-items: center;">
                  View source code
                </a>
                <div v-if="npmInstall" class="tv-demo-dropdown click-mode install-dropdown" :class="{ 'is-open': isInstallDropdownOpen }">
                  <button class="tv-demo-btn-secondary is-small" @click.stop="toggleInstallDropdown">
                    Copy install command
                  </button>
                  <div class="tv-demo-dropdown-content">
                    <button @click="setClickItem('npm'); toggleInstallDropdown()">
                      <svg role="img" viewBox="0 0 24 24" width="16" height="16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M1.763 0C.786 0 0 .786 0 1.763v20.474C0 23.214.786 24 1.763 24h20.474c.977 0 1.763-.786 1.763-1.763V1.763C24 .786 23.214 0 22.237 0zM5.13 5.323l13.837.019-.009 13.836h-3.464l.01-10.382h-3.456L12.04 19.17H5.113z"/></svg>
                      npm
                    </button>
                    <button @click="setClickItem('yarn'); toggleInstallDropdown()">
                      <svg role="img" viewBox="0 0 24 24" width="16" height="16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 0C5.375 0 0 5.375 0 12s5.375 12 12 12 12-5.375 12-12S18.625 0 12 0zm.768 4.105c.183 0 .363.053.525.157.125.083.287.185.755 1.154.31-.088.468-.042.551-.019.204.056.366.19.463.375.477.917.542 2.553.334 3.605-.241 1.232-.755 2.029-1.131 2.576.324.329.778.899 1.117 1.825.278.774.31 1.478.273 2.015a5.51 5.51 0 0 0 .602-.329c.593-.366 1.487-.917 2.553-.931.714-.009 1.269.445 1.353 1.103a1.23 1.23 0 0 1-.945 1.362c-.649.158-.95.278-1.821.843-1.232.797-2.539 1.242-3.012 1.39a1.686 1.686 0 0 1-.704.343c-.737.181-3.266.315-3.466.315h-.046c-.783 0-1.214-.241-1.45-.491-.658.329-1.51.19-2.122-.134a1.078 1.078 0 0 1-.58-1.153 1.243 1.243 0 0 1-.153-.195c-.162-.25-.528-.936-.454-1.946.056-.723.556-1.367.88-1.71a5.522 5.522 0 0 1 .408-2.256c.306-.727.885-1.348 1.32-1.737-.32-.537-.644-1.367-.329-2.21.227-.602.412-.936.82-1.08h-.005c.199-.074.389-.153.486-.259a3.418 3.418 0 0 1 2.298-1.103c.037-.093.079-.185.125-.283.31-.658.639-1.029 1.024-1.168a.94.94 0 0 1 .328-.06zm.006.7c-.507.016-1.001 1.519-1.001 1.519s-1.27-.204-2.266.871c-.199.218-.468.334-.746.44-.079.028-.176.023-.417.672-.371.991.625 2.094.625 2.094s-1.186.839-1.626 1.881c-.486 1.144-.338 2.261-.338 2.261s-.843.732-.899 1.487c-.051.663.139 1.2.343 1.515.227.343.51.176.51.176s-.561.653-.037.931c.477.25 1.283.394 1.71-.037.31-.31.371-1.001.486-1.283.028-.065.12.111.209.199.097.093.264.195.264.195s-.755.324-.445 1.066c.102.246.468.403 1.066.398.222-.005 2.664-.139 3.313-.296.375-.088.505-.283.505-.283s1.566-.431 2.998-1.357c.917-.598 1.293-.76 2.034-.936.612-.148.57-1.098-.241-1.084-.839.009-1.575.44-2.196.825-1.163.718-1.742.672-1.742.672l-.018-.032c-.079-.13.371-1.293-.134-2.678-.547-1.515-1.413-1.881-1.344-1.997.297-.5 1.038-1.297 1.334-2.78.176-.899.13-2.377-.269-3.151-.074-.144-.732.241-.732.241s-.616-1.371-.788-1.483a.271.271 0 0 0-.157-.046z"/></svg>
                      yarn
                    </button>
                    <button @click="setClickItem('pnpm'); toggleInstallDropdown()">
                      <svg role="img" viewBox="0 0 24 24" width="16" height="16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M0 0v7.5h7.5V0zm8.25 0v7.5h7.498V0zm8.25 0v7.5H24V0zM8.25 8.25v7.5h7.498v-7.5zm8.25 0v7.5H24v-7.5zM0 16.5V24h7.5v-7.5zm8.25 0V24h7.498v-7.5zm8.25 0V24H24v-7.5z"/></svg>
                      pnpm
                    </button>
                    <button @click="setClickItem('bun'); toggleInstallDropdown()">
                      <svg role="img" viewBox="0 0 24 24" width="16" height="16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 22.596c6.628 0 12-4.338 12-9.688 0-3.318-2.057-6.248-5.219-7.986-1.286-.715-2.297-1.357-3.139-1.89C14.058 2.025 13.08 1.404 12 1.404c-1.097 0-2.334.785-3.966 1.821a49.92 49.92 0 0 1-2.816 1.697C2.057 6.66 0 9.59 0 12.908c0 5.35 5.372 9.687 12 9.687v.001ZM10.599 4.715c.334-.759.503-1.58.498-2.409 0-.145.202-.187.23-.029.658 2.783-.902 4.162-2.057 4.624-.124.048-.199-.121-.103-.209a5.763 5.763 0 0 0 1.432-1.977Zm2.058-.102a5.82 5.82 0 0 0-.782-2.306v-.016c-.069-.123.086-.263.185-.172 1.962 2.111 1.307 4.067.556 5.051-.082.103-.23-.003-.189-.126a5.85 5.85 0 0 0 .23-2.431Zm1.776-.561a5.727 5.727 0 0 0-1.612-1.806v-.014c-.112-.085-.024-.274.114-.218 2.595 1.087 2.774 3.18 2.459 4.407a.116.116 0 0 1-.049.071.11.11 0 0 1-.153-.026.122.122 0 0 1-.022-.083 5.891 5.891 0 0 0-.737-2.331Zm-5.087.561c-.617.546-1.282.76-2.063 1-.117 0-.195-.078-.156-.181 1.752-.909 2.376-1.649 2.999-2.778 0 0 .155-.118.188.085 0 .304-.349 1.329-.968 1.874Zm4.945 11.237a2.957 2.957 0 0 1-.937 1.553c-.346.346-.8.565-1.286.62a2.178 2.178 0 0 1-1.327-.62 2.955 2.955 0 0 1-.925-1.553.244.244 0 0 1 .064-.198.234.234 0 0 1 .193-.069h3.965a.226.226 0 0 1 .19.07c.05.053.073.125.063.197Zm-5.458-2.176a1.862 1.862 0 0 1-2.384-.245 1.98 1.98 0 0 1-.233-2.447c.207-.319.503-.566.848-.713a1.84 1.84 0 0 1 1.092-.11c.366.075.703.261.967.531a1.98 1.98 0 0 1 .408 2.114 1.931 1.931 0 0 1-.698.869v.001Zm8.495.005a1.86 1.86 0 0 1-2.381-.253 1.964 1.964 0 0 1-.547-1.366c0-.384.11-.76.32-1.079.207-.319.503-.567.849-.713a1.844 1.844 0 0 1 1.093-.108c.367.076.704.262.968.534a1.98 1.98 0 0 1 .4 2.117 1.932 1.932 0 0 1-.702.868Z"/></svg>
                      bun
                    </button>
                  </div>
                </div>
                <button v-if="urlClone" class="tv-demo-btn-secondary is-small" @click="setClickItem('clone')">
                  Copy repository clone URL
                </button>
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
            <div v-show="selectedTab === 'demo'" class="tv-demo-layout" :class="{ 'is-compressed': isSidebarCompressed }">
              <aside class="tv-demo-sidebar" :class="[`${theme}-mode`, { 'is-compressed': isSidebarCompressed }]">
                <div class="tv-demo-sidebar-header">
                  <div v-show="!isSidebarCompressed">
                    <p class="tv-demo-sidebar-meta">{{ filteredVariantsCount }} / {{ totalVariantsCount }} variants</p>
                    <h3>Variants</h3>
                  </div>
                  <div class="tv-demo-sidebar-actions">
                    <button v-show="!isSidebarCompressed && showScrollToTop" class="tv-demo-sidebar-collapse" aria-label="Scroll to top" @click="variantsListRef?.scrollTo({ top: 0, behavior: 'smooth' })">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="12" y1="19" x2="12" y2="5"></line>
                        <polyline points="5 12 12 5 19 12"></polyline>
                      </svg>
                    </button>
                     <button
                      class="tv-demo-sidebar-collapse"
                      :aria-label="isSidebarCompressed ? 'Expand sidebar' : 'Collapse sidebar'"
                      :class="{ 'is-rotated': isSidebarCompressed }"
                      @click="isSidebarCompressed = !isSidebarCompressed"
                     >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="19" y1="12" x2="5" y2="12"></line>
                        <polyline points="12 19 5 12 12 5"></polyline>
                      </svg>
                     </button>
                  </div>
                </div>
                <div v-show="!isSidebarCompressed" class="tv-demo-sidebar-content-wrapper">
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
                    @scroll="handleVariantsScroll"
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
                      type="button"
                      class="tv-demo-viewport-btn"
                      :class="{ active: viewportWidth === '1280px' }"
                      @click="viewportWidth = '1280px'"
                      aria-label="Desktop view (1280px)"
                      title="Desktop (1280px)"
                    >
                      Desktop
                    </button>
                    <div class="tv-demo-separator"></div>
                    <button
                      type="button"
                      class="tv-demo-icon-btn"
                      :class="{ active: isRtl }"
                      @click="isRtl = !isRtl"
                      title="Toggle RTL"
                      aria-label="Toggle RTL"
                    >
                      ⇄
                    </button>
                    <button
                      type="button"
                      class="tv-demo-icon-btn"
                      :class="{ active: isGrid }"
                      @click="isGrid = !isGrid"
                      title="Toggle Grid"
                      aria-label="Toggle Grid"
                    >
                      #
                    </button>
                     <div class="tv-demo-dropdown theme-dropdown click-mode" :class="{ 'is-open': isThemeDropdownOpen }">
                      <button
                        type="button"
                        class="tv-demo-icon-btn"
                        title="Background Color"
                        aria-label="Change Background"
                        @click.stop="toggleThemeDropdown"
                      >
                        🎨
                      </button>
                      <div class="tv-demo-dropdown-content">
                        <button @click="backgroundType = 'default'; toggleThemeDropdown()" :class="{ active: backgroundType === 'default' }">Default</button>
                        <button @click="backgroundType = 'checkered'; toggleThemeDropdown()" :class="{ active: backgroundType === 'checkered' }">Checkered</button>
                        <button @click="backgroundType = 'white'; toggleThemeDropdown()" :class="{ active: backgroundType === 'white' }">White</button>
                        <button @click="backgroundType = 'dark'; toggleThemeDropdown()" :class="{ active: backgroundType === 'dark' }">Dark</button>
                      </div>
                    </div>
                  </div>
                </div>
                <p class="tv-demo-description">
                  {{ variant.description || 'Select a variant from the list to view its details.' }}
                </p>

                <div class="tv-demo-component-content">
                  <TvPreviewFrame
                    v-if="variant && component"
                    :component="component"
                    :component-props="{ ...reactiveProps, ...autoEventListeners }"
                    :viewport-width="viewportWidth"
                    :body-class="`${theme}-mode`"
                    :body-style="hideBackground ? {} : customStyle.content"
                    :is-rtl="isRtl"
                    :background-type="backgroundType"
                    :is-grid="isGrid"
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
                             <div v-if="typeof value === 'string' && (key.toLowerCase().includes('color') || key.toLowerCase().includes('background') || /^#([0-9A-F]{3}){1,2}$/i.test(value))" class="tv-demo-control-input-wrapper color-wrapper">
                                <input
                                  type="color"
                                  v-model="reactiveProps[key]"
                                  :id="`control-color-${key}`"
                                  class="tv-demo-color-picker"
                                />
                                <input
                                  v-model="reactiveProps[key]"
                                  type="text"
                                  class="tv-demo-input"
                                  :id="`control-${key}`"
                                />
                             </div>
                            <TvNestedEditor
                              v-else
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

                    <div v-if="activeToolTab === 'events'" class="tv-demo-tool-pane">
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

                    <div v-if="activeToolTab === 'code'" class="tv-demo-tool-pane">
                      <div class="tv-demo-toolbar">
                        <div class="tv-demo-code-header">
                          <h3 class="tv-demo-tool-title">Generated Code</h3>
                          <div v-if="availableCodeTypes.length > 1" class="tv-demo-code-switcher">
                            <button
                              v-for="type in availableCodeTypes"
                              :key="type"
                              class="tv-demo-code-tab"
                              :class="{ active: selectedCodeType === type }"
                              @click="selectedCodeType = type"
                            >
                              {{ type }}
                            </button>
                          </div>
                        </div>
                        <button class="tv-demo-btn-secondary is-small" @click="copyCode(currentCode)">
                          Copy Code
                        </button>
                      </div>
                        <HighCode
                          v-if="currentCode"
                          class="tv-demo-code"
                          :key="`${selectedCodeType}-${selectedVariantKey}`"
                          :codeValue="currentCode"
                          :theme="theme"
                          :lang="currentLang"
                          codeLines
                          height="auto"
                          :copy="false"
                        />
                      <div v-else class="tv-demo-empty-state small">
                        No code available for this variant.
                      </div>
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
