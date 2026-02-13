import { computed, inject, nextTick, onBeforeUnmount, onMounted, ref, watch, watchEffect } from 'vue';
import type {
  BackgroundType,
  DemoContext,
  DemoEventLog,
  DemoStylePalette,
  DemoTab,
  DemoToast,
  DemoVariant,
  DemoVariantEntry,
  ThemeMode,
  ToastType,
  ToolTab,
  UseDemoProps,
  VariantKey,
  ViewportWidth,
} from '../types/demo';

const ITEM_HEIGHT = 72;
const OVERSCAN_COUNT = 6;
const VALID_TABS: DemoTab[] = ['demo', 'docs', 'changelog'];

const getVariantKey = (variant: DemoVariant, index: number): VariantKey =>
  variant?.id ?? variant?.title ?? `variant-${index}`;

const getSearchableText = (variant: DemoVariant = {}): string =>
  `${variant.title ?? ''} ${variant.description ?? ''}`.toLowerCase();

const useDemo = (props: UseDemoProps) => {
  const theme = ref<ThemeMode>('dark');
  const toasts = ref<DemoToast[]>([]);
  const readmeContent = ref('');
  const changelogContent = ref('');
  const selectedTab = ref<DemoTab>('demo');
  const searchQuery = ref('');
  const selectedVariantKey = ref<VariantKey | null>(null);
  const variantsListRef = ref<HTMLElement | null>(null);
  const viewportHeight = ref(360);
  const viewportWidth = ref<ViewportWidth>('100%');
  const backgroundType = ref<BackgroundType>('default');
  const isRtl = ref(false);
  const isGrid = ref(false);
  const isSidebarCompressed = ref(false);
  const scrollTop = ref(0);
  let resizeObserver: ResizeObserver | null = null;
  let fallbackResizeListenerAttached = false;
  const showScrollToTop = computed(() => scrollTop.value > 0);

  const demoContext = inject<DemoContext | null>('TV_DEMO_CONTEXT', null);

  const variantEntries = computed<DemoVariantEntry[]>(() =>
    (props.variants || []).map((variant, index) => ({
      variant,
      index,
      key: getVariantKey(variant, index),
      searchableText: getSearchableText(variant),
    })),
  );

  const totalVariantsCount = computed(() => variantEntries.value.length);

  const filteredEntries = computed<DemoVariantEntry[]>(() => {
    const term = searchQuery.value.trim().toLowerCase();
    if (!term) return variantEntries.value;
    return variantEntries.value.filter((entry) => entry.searchableText.includes(term));
  });

  const filteredVariantsCount = computed(() => filteredEntries.value.length);
  const emptySearchState = computed(
    () => Boolean(searchQuery.value.trim()) && filteredEntries.value.length === 0,
  );

  const updateViewportHeight = () => {
    viewportHeight.value = variantsListRef.value?.clientHeight ?? viewportHeight.value;
  };

  const detachFallbackResizeListener = () => {
    if (typeof window === 'undefined') return;
    if (fallbackResizeListenerAttached) {
      window.removeEventListener('resize', updateViewportHeight);
      fallbackResizeListenerAttached = false;
    }
  };

  watch(
    () => variantsListRef.value,
    (el) => {
      if (resizeObserver) {
        resizeObserver.disconnect();
        resizeObserver = null;
      }

      if (!el) {
        detachFallbackResizeListener();
        return;
      }

      nextTick(() => {
        updateViewportHeight();
        if (typeof ResizeObserver !== 'undefined') {
          resizeObserver = new ResizeObserver((entries) => {
            const entry = entries?.[0];
            if (entry) {
              viewportHeight.value = entry.contentRect.height;
            }
          });
          resizeObserver.observe(el);
        } else if (!fallbackResizeListenerAttached && typeof window !== 'undefined') {
          window.addEventListener('resize', updateViewportHeight);
          fallbackResizeListenerAttached = true;
        }
      });
    },
  );

  const isMounted = ref(false);
  let debounceTimer: ReturnType<typeof setTimeout> | null = null;

  const updateUrl = () => {
    if (typeof window === 'undefined') return;

    const url = new URL(window.location.href);

    if (selectedTab.value && selectedTab.value !== 'demo') {
      url.searchParams.set('tab', selectedTab.value);
    } else {
      url.searchParams.delete('tab');
    }

    if (searchQuery.value) {
      url.searchParams.set('search', searchQuery.value);
    } else {
      url.searchParams.delete('search');
    }

    if (selectedVariantKey.value !== null) {
      url.searchParams.set('variant', String(selectedVariantKey.value));
    } else {
      url.searchParams.delete('variant');
    }

    if (viewportWidth.value && viewportWidth.value !== '100%') {
      let viewportName = '';
      if (viewportWidth.value === '375px') viewportName = 'mobile';
      else if (viewportWidth.value === '768px') viewportName = 'tablet';
      else if (viewportWidth.value === '1280px') viewportName = 'desktop';

      if (viewportName) {
        url.searchParams.set('viewport', viewportName);
      } else {
        url.searchParams.delete('viewport');
      }
    } else {
      url.searchParams.delete('viewport');
    }

    if (url.href !== window.location.href) {
      window.history.replaceState(window.history.state, '', url.href);
    }
  };

  watch([selectedTab, searchQuery, selectedVariantKey, viewportWidth], () => {
    if (!isMounted.value) return;
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(updateUrl, 300);
  });

  onMounted(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'light' || storedTheme === 'dark') {
      theme.value = storedTheme;
    }

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      if (tabParam && VALID_TABS.includes(tabParam as DemoTab)) {
        selectedTab.value = tabParam as DemoTab;
      }

      const searchParam = params.get('search');
      if (searchParam) searchQuery.value = searchParam;

      const variantParam = params.get('variant');
      if (variantParam) {
        const match = variantEntries.value.find((entry) => String(entry.key) === variantParam);
        selectedVariantKey.value = match ? match.key : variantParam;
      }

      const viewportParam = params.get('viewport');
      if (viewportParam) {
        if (viewportParam === 'mobile') viewportWidth.value = '375px';
        else if (viewportParam === 'tablet') viewportWidth.value = '768px';
        else if (viewportParam === 'desktop') viewportWidth.value = '1280px';
      } else {
        const width = window.innerWidth;
        if (width < 768) {
          viewportWidth.value = '375px';
        } else if (width < 1280) {
          viewportWidth.value = '768px';
        } else {
          viewportWidth.value = '1280px';
        }
      }

      isMounted.value = true;
    }

    nextTick(updateViewportHeight);
  });

  const handleWindowClick = (event: MouseEvent) => {
    const targetNode = event.target;
    if (!(targetNode instanceof Node)) return;

    const installDropdown = document.querySelector('.install-dropdown');
    if (installDropdown && !installDropdown.contains(targetNode)) {
      closeInstallDropdown();
    }

    const themeDropdown = document.querySelector('.tv-demo-dropdown.theme-dropdown');
    if (themeDropdown && !themeDropdown.contains(targetNode)) {
      closeThemeDropdown();
    }
  };

  onMounted(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('click', handleWindowClick);
    }
  });

  onBeforeUnmount(() => {
    if (resizeObserver) {
      resizeObserver.disconnect();
      resizeObserver = null;
    }
    if (debounceTimer) {
      clearTimeout(debounceTimer);
      debounceTimer = null;
    }
    if (typeof window !== 'undefined') {
      window.removeEventListener('click', handleWindowClick);
    }
    detachFallbackResizeListener();
  });

  const fetchReadme = async () => {
    try {
      let url = props.readmePath ?? './README.md';
      if (demoContext?.resolvePath) {
        url = demoContext.resolvePath(props.componentName, 'readme', props.readmePath) ?? url;
      }

      const response = await fetch(url);
      if (!response.ok) throw new Error('README.md not found');
      readmeContent.value = await response.text();
    } catch {
      readmeContent.value = 'Documentation not found.';
    }
  };

  const fetchChangelog = async () => {
    try {
      let url = props.changelogPath ?? './CHANGELOG.md';
      if (demoContext?.resolvePath) {
        url = demoContext.resolvePath(props.componentName, 'changelog', props.changelogPath) ?? url;
      }

      const response = await fetch(url);
      if (!response.ok) throw new Error('CHANGELOG.md not found');
      changelogContent.value = await response.text();
    } catch {
      changelogContent.value = 'Changelog not found.';
    }
  };

  const toggleTheme = () => {
    theme.value = theme.value === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', theme.value);
  };

  watch(
    () => variantEntries.value,
    (entries) => {
      if (!entries.length) {
        selectedVariantKey.value = null;
        return;
      }

      if (!entries.some((entry) => entry.key === selectedVariantKey.value)) {
        const firstEntry = entries[0];
        if (firstEntry) {
          selectedVariantKey.value = firstEntry.key;
        }
      }
    },
    { immediate: true },
  );

  watch(
    () => filteredEntries.value,
    (entries) => {
      if (!entries.length) {
        selectedVariantKey.value = null;
        return;
      }

      if (!entries.some((entry) => entry.key === selectedVariantKey.value)) {
        const firstEntry = entries[0];
        if (firstEntry) {
          selectedVariantKey.value = firstEntry.key;
        }
      }
    },
  );

  const setScrollPosition = (value: number) => {
    if (!variantsListRef.value) return;
    variantsListRef.value.scrollTop = value;
    scrollTop.value = value;
  };

  watch(searchQuery, () => {
    setScrollPosition(0);
  });

  const selectedVariantIndex = computed(() =>
    filteredEntries.value.findIndex((entry) => entry.key === selectedVariantKey.value),
  );

  const visibleCount = computed(() => Math.max(1, Math.ceil(viewportHeight.value / ITEM_HEIGHT)));
  const virtualStartIndex = computed(() =>
    Math.max(0, Math.floor(scrollTop.value / ITEM_HEIGHT) - OVERSCAN_COUNT),
  );
  const virtualEndIndex = computed(() =>
    Math.min(
      filteredEntries.value.length,
      virtualStartIndex.value + visibleCount.value + OVERSCAN_COUNT * 2,
    ),
  );
  const virtualizedVariants = computed(() =>
    filteredEntries.value.slice(virtualStartIndex.value, virtualEndIndex.value),
  );
  const virtualPaddingTop = computed(() => virtualStartIndex.value * ITEM_HEIGHT);
  const virtualPaddingBottom = computed(() =>
    Math.max(0, (filteredEntries.value.length - virtualEndIndex.value) * ITEM_HEIGHT),
  );

  const ensureActiveVisible = () => {
    if (!variantsListRef.value) return;
    const index = selectedVariantIndex.value;
    if (index < 0) return;

    const itemTop = index * ITEM_HEIGHT;
    const itemBottom = itemTop + ITEM_HEIGHT;
    const viewportTop = scrollTop.value;
    const viewportBottom = viewportTop + viewportHeight.value;

    if (itemTop < viewportTop) {
      setScrollPosition(itemTop);
    } else if (itemBottom > viewportBottom) {
      setScrollPosition(itemBottom - viewportHeight.value);
    }
  };

  watch(selectedVariantKey, ensureActiveVisible);

  const variant = computed<DemoVariant>(() => {
    if (emptySearchState.value) {
      return {};
    }

    const entry =
      filteredEntries.value.find((item) => item.key === selectedVariantKey.value) ||
      variantEntries.value.find((item) => item.key === selectedVariantKey.value) ||
      filteredEntries.value[0] ||
      variantEntries.value[0];

    return entry?.variant || {};
  });

  const reactiveProps = ref<Record<string, unknown>>({});

  watch(
    () => variant.value,
    (newVariant) => {
      if (newVariant?.propsData) {
        try {
          reactiveProps.value = JSON.parse(JSON.stringify(newVariant.propsData)) as Record<
            string,
            unknown
          >;
        } catch {
          reactiveProps.value = { ...newVariant.propsData };
        }
      } else {
        reactiveProps.value = {};
      }
    },
    { immediate: true },
  );

  const eventLogs = ref<DemoEventLog[]>([]);

  const addLog = (eventName: string, payload: unknown) => {
    const timestamp = new Date().toLocaleTimeString();
    eventLogs.value.unshift({
      id: Date.now() + Math.random(),
      timestamp,
      eventName,
      payload,
    });
    if (eventLogs.value.length > 50) {
      eventLogs.value = eventLogs.value.slice(0, 50);
    }
  };

  const clearLogs = (showToast = true) => {
    eventLogs.value = [];
    if (showToast) {
      addToast('Event logs cleared', 'success', 2000);
    }
  };

  watch(selectedVariantKey, () => {
    clearLogs(false);
  });

  const handleVariantsScroll = (event: Event) => {
    const target = event.target as HTMLElement | null;
    if (!target) return;
    scrollTop.value = target.scrollTop;
  };

  const moveSelectionBy = (delta: number) => {
    const entries = filteredEntries.value;
    if (!entries.length) return;

    const baseIndex = selectedVariantIndex.value < 0 ? 0 : selectedVariantIndex.value;
    const nextIndex = Math.min(entries.length - 1, Math.max(0, baseIndex + delta));
    const nextEntry = entries[nextIndex];
    if (nextEntry) {
      selectedVariantKey.value = nextEntry.key;
    }
  };

  const handleVariantsKeydown = (event: KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        moveSelectionBy(1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        moveSelectionBy(-1);
        break;
      case 'Home':
        event.preventDefault();
        if (filteredEntries.value.length) {
          const firstEntry = filteredEntries.value[0];
          if (firstEntry) {
            selectedVariantKey.value = firstEntry.key;
          }
        }
        break;
      case 'End':
        event.preventDefault();
        if (filteredEntries.value.length) {
          const lastEntry = filteredEntries.value[filteredEntries.value.length - 1];
          if (lastEntry) {
            selectedVariantKey.value = lastEntry.key;
          }
        }
        break;
      default:
        break;
    }
  };

  const selectVariant = (key: VariantKey) => {
    selectedVariantKey.value = key;
  };

  const customStyle = computed(() => {
    const activeStyle: DemoStylePalette | undefined =
      theme.value === 'dark' ? props.demoStyle?.dark : props.demoStyle?.light;

    return {
      body: {
        backgroundColor: activeStyle?.backgroundBody || '',
        color: activeStyle?.color || '',
      },
      content: {
        backgroundColor: activeStyle?.backgroundContent || '',
        color: activeStyle?.color || '',
      },
    };
  });

  const setClickItem = (item: 'npm' | 'yarn' | 'pnpm' | 'bun' | 'clone' | string) => {
    let commandToCopy = '';

    switch (item) {
      case 'npm':
        commandToCopy = `npm install ${props.isDevComponent ? '-D ' : ''}${props.npmInstall ?? ''}`;
        break;
      case 'yarn':
        commandToCopy = `yarn add ${props.isDevComponent ? '-D ' : ''}${props.npmInstall ?? ''}`;
        break;
      case 'pnpm':
        commandToCopy = `pnpm add ${props.isDevComponent ? '-D ' : ''}${props.npmInstall ?? ''}`;
        break;
      case 'bun':
        commandToCopy = `bun add ${props.isDevComponent ? '-D ' : ''}${props.npmInstall ?? ''}`;
        break;
      default:
        commandToCopy = `git clone ${props.urlClone ?? ''}`;
        break;
    }

    navigator.clipboard
      .writeText(commandToCopy)
      .then(() => {
        addToast(`Copied to clipboard: ${commandToCopy}`, 'success', 2000);
      })
      .catch((err: unknown) => {
        addToast(`Failed to copy: ${String(err)}`, 'error', 2000);
      });
  };

  const addToast = (message: string, type: ToastType = 'success', duration = 3000) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
    toasts.value.push({ id, message, type, duration });
  };

  const isInstallDropdownOpen = ref(false);

  const toggleInstallDropdown = () => {
    isInstallDropdownOpen.value = !isInstallDropdownOpen.value;
  };

  const closeInstallDropdown = () => {
    if (isInstallDropdownOpen.value) {
      isInstallDropdownOpen.value = false;
    }
  };

  const isThemeDropdownOpen = ref(false);

  const toggleThemeDropdown = () => {
    isThemeDropdownOpen.value = !isThemeDropdownOpen.value;
  };

  const closeThemeDropdown = () => {
    if (isThemeDropdownOpen.value) {
      isThemeDropdownOpen.value = false;
    }
  };

  const removeToast = (id: string) => {
    const index = toasts.value.findIndex((toast) => toast.id === id);
    if (index > -1) {
      toasts.value.splice(index, 1);
    }
  };

  watchEffect(() => {
    void (async () => {
      await fetchReadme();
      await fetchChangelog();
    })();
  });

  const activeToolTab = ref<ToolTab>('playground');

  const resetProps = () => {
    if (variant.value?.propsData) {
      try {
        reactiveProps.value = JSON.parse(JSON.stringify(variant.value.propsData)) as Record<
          string,
          unknown
        >;
      } catch {
        reactiveProps.value = { ...variant.value.propsData };
      }
    } else {
      reactiveProps.value = {};
    }
    addToast('Props reset to default', 'success', 2000);
  };

  const selectedCodeType = ref('Vue 3 Setup');

  const availableCodeTypes = computed<string[]>(() => {
    if (variant.value?.code && Array.isArray(variant.value.code)) {
      return variant.value.code.map((item) => item.type);
    }
    return [];
  });

  const currentCode = computed<string>(() => {
    if (variant.value?.code && Array.isArray(variant.value.code)) {
      const match = variant.value.code.find((item) => item.type === selectedCodeType.value);
      return match ? match.content : '';
    }
    return variant.value?.html || '';
  });

  const currentLang = computed<string>(() => {
    if (variant.value?.code && Array.isArray(variant.value.code)) {
      const match = variant.value.code.find((item) => item.type === selectedCodeType.value);
      return match?.lang || 'html';
    }
    return 'html';
  });

  watch(
    () => availableCodeTypes.value,
    (types) => {
      if (types.length > 0 && !types.includes(selectedCodeType.value)) {
        const firstType = types[0];
        if (firstType) {
          selectedCodeType.value = firstType;
        }
      }
    },
    { immediate: true },
  );

  const copyCode = (code?: string) => {
    const textToCopy = code || currentCode.value;
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        addToast('Code copied to clipboard', 'success', 2000);
      })
      .catch((err: unknown) => {
        addToast(`Failed to copy: ${String(err)}`, 'error', 2000);
      });
  };

  return {
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
    addToast,
    removeToast,
    selectVariant,
    setClickItem,
    toggleTheme,
    handleVariantsScroll,
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
  };
};

export default useDemo;
