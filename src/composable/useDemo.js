import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch, watchEffect } from 'vue';

const ITEM_HEIGHT = 72;
const OVERSCAN_COUNT = 6;

const getVariantKey = (variant, index) => variant?.id ?? variant?.title ?? `variant-${index}`;
const getSearchableText = (variant = {}) => `${variant.title ?? ''} ${variant.description ?? ''}`.toLowerCase();

const useDemo = (props) => {
  const theme = ref('dark');
  const toasts = ref([]);
  const readmeContent = ref('');
  const changelogContent = ref('');
  const selectedTab = ref('demo');
  const searchQuery = ref('');
  const selectedVariantKey = ref(null);
  const variantsListRef = ref(null);
  const viewportHeight = ref(360);
  const viewportWidth = ref('100%');
  const scrollTop = ref(0);
  const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1200);
  let resizeObserver = null;
  let fallbackResizeListenerAttached = false;

  const updateWindowWidth = () => {
    windowWidth.value = window.innerWidth;
  };

  const variantEntries = computed(() =>
    (props.variants || []).map((variant, index) => ({
      variant,
      index,
      key: getVariantKey(variant, index),
      searchableText: getSearchableText(variant),
    }))
  );

  const totalVariantsCount = computed(() => variantEntries.value.length);

  const filteredEntries = computed(() => {
    const term = searchQuery.value.trim().toLowerCase();
    if (!term) return variantEntries.value;
    return variantEntries.value.filter((entry) => entry.searchableText.includes(term));
  });

  const filteredVariantsCount = computed(() => filteredEntries.value.length);
  const emptySearchState = computed(
    () => Boolean(searchQuery.value.trim()) && filteredEntries.value.length === 0
  );

  const updateViewportHeight = () => {
    viewportHeight.value = variantsListRef.value?.clientHeight || viewportHeight.value;
  };

  const detachFallbackResizeListener = () => {
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
        } else if (!fallbackResizeListenerAttached) {
          window.addEventListener('resize', updateViewportHeight);
          fallbackResizeListenerAttached = true;
        }
      });
    }
  );

  const isMounted = ref(false);
  let debounceTimer = null;

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

    if (selectedVariantKey.value) {
      url.searchParams.set('variant', selectedVariantKey.value);
    } else {
      url.searchParams.delete('variant');
    }

    if (url.href !== window.location.href) {
      window.history.replaceState(window.history.state, '', url.href);
    }
  };

  watch([selectedTab, searchQuery, selectedVariantKey], () => {
    if (!isMounted.value) return;
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(updateUrl, 300);
  });

  onMounted(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      theme.value = storedTheme;
    }

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      if (tabParam) selectedTab.value = tabParam;

      const searchParam = params.get('search');
      if (searchParam) searchQuery.value = searchParam;

      const variantParam = params.get('variant');
      if (variantParam) {
        const match = variantEntries.value.find((entry) => String(entry.key) === variantParam);
        selectedVariantKey.value = match ? match.key : variantParam;
      }

      isMounted.value = true;
      window.addEventListener('resize', updateWindowWidth);
    }

    nextTick(updateViewportHeight);
  });

  onBeforeUnmount(() => {
    if (resizeObserver) {
      resizeObserver.disconnect();
      resizeObserver = null;
    }
    detachFallbackResizeListener();
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', updateWindowWidth);
    }
  });

  const fetchReadme = async () => {
    try {
      const response = await fetch(props.readmePath);
      if (!response.ok) throw new Error('README.md not found');
      readmeContent.value = await response.text();
    } catch (error) {
      readmeContent.value = 'Documentation not found.';
    }
  };

  const fetchChangelog = async () => {
    try {
      const response = await fetch(props.changelogPath);
      if (!response.ok) throw new Error('CHANGELOG.md not found');
      changelogContent.value = await response.text();
    } catch (error) {
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
        selectedVariantKey.value = entries[0].key;
      }
    },
    { immediate: true }
  );

  watch(
    () => filteredEntries.value,
    (entries) => {
      if (!entries.length) {
        selectedVariantKey.value = null;
        return;
      }

      if (!entries.some((entry) => entry.key === selectedVariantKey.value)) {
        selectedVariantKey.value = entries[0].key;
      }
    }
  );

  const setScrollPosition = (value) => {
    if (!variantsListRef.value) return;
    variantsListRef.value.scrollTop = value;
    scrollTop.value = value;
  };

  watch(searchQuery, () => {
    setScrollPosition(0);
  });

  const selectedVariantIndex = computed(() =>
    filteredEntries.value.findIndex((entry) => entry.key === selectedVariantKey.value)
  );

  const visibleCount = computed(() => Math.max(1, Math.ceil(viewportHeight.value / ITEM_HEIGHT)));
  const virtualStartIndex = computed(() =>
    Math.max(0, Math.floor(scrollTop.value / ITEM_HEIGHT) - OVERSCAN_COUNT)
  );
  const virtualEndIndex = computed(() =>
    Math.min(
      filteredEntries.value.length,
      virtualStartIndex.value + visibleCount.value + OVERSCAN_COUNT * 2,
    )
  );
  const virtualizedVariants = computed(() =>
    filteredEntries.value.slice(virtualStartIndex.value, virtualEndIndex.value)
  );
  const virtualPaddingTop = computed(() => virtualStartIndex.value * ITEM_HEIGHT);
  const virtualPaddingBottom = computed(() =>
    Math.max(0, (filteredEntries.value.length - virtualEndIndex.value) * ITEM_HEIGHT)
  );

  const ensureActiveVisible = () => {
    if (!variantsListRef.value) return;
    const index = selectedVariantIndex.value;
    if (index < 0) return;

    const start = virtualStartIndex.value + 2;
    const end = virtualEndIndex.value - 3;

    if (index < start) {
      setScrollPosition(Math.max(0, index * ITEM_HEIGHT));
    } else if (index > end) {
      const offset = Math.max(0, index - visibleCount.value + 1);
      setScrollPosition(offset * ITEM_HEIGHT);
    }
  };

  watch(selectedVariantKey, ensureActiveVisible);

  const variant = computed(() => {
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

  const reactiveProps = ref({});

  watch(
    () => variant.value,
    (newVariant) => {
      if (newVariant?.propsData) {
        try {
          reactiveProps.value = JSON.parse(JSON.stringify(newVariant.propsData));
        } catch (e) {
          reactiveProps.value = { ...newVariant.propsData };
        }
      } else {
        reactiveProps.value = {};
      }
    },
    { immediate: true }
  );

  const eventLogs = ref([]);

  const addLog = (eventName, payload) => {
    const timestamp = new Date().toLocaleTimeString();
    eventLogs.value.unshift({
      id: Date.now() + Math.random(),
      timestamp,
      eventName,
      payload
    });
    if (eventLogs.value.length > 50) {
      eventLogs.value = eventLogs.value.slice(0, 50);
    }
  };

  const clearLogs = () => {
    eventLogs.value = [];
  };

  watch(selectedVariantKey, () => {
    clearLogs();
  });

  const handleVariantsScroll = (event) => {
    scrollTop.value = event.target.scrollTop;
  };

  const moveSelectionBy = (delta) => {
    const entries = filteredEntries.value;
    if (!entries.length) return;

    const baseIndex = selectedVariantIndex.value < 0 ? 0 : selectedVariantIndex.value;
    const nextIndex = Math.min(entries.length - 1, Math.max(0, baseIndex + delta));
    selectedVariantKey.value = entries[nextIndex].key;
  };

  const handleVariantsKeydown = (event) => {
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
          selectedVariantKey.value = filteredEntries.value[0].key;
        }
        break;
      case 'End':
        event.preventDefault();
        if (filteredEntries.value.length) {
          selectedVariantKey.value = filteredEntries.value[filteredEntries.value.length - 1].key;
        }
        break;
      default:
        break;
    }
  };

  const selectVariant = (key) => {
    selectedVariantKey.value = key;
  };

  const customStyle = computed(() => {
    const style = theme.value === 'dark' ? props.demoStyle?.dark : props.demoStyle?.light;
    return {
      body: {
        backgroundColor: style?.backgroundBody || '',
        color: style?.color || '',
      },
      content: {
        backgroundColor: style?.backgroundContent || '',
        color: style?.color || '',
      },
    };
  });

  const setClickItem = (item) => {
    let commandToCopy = '';

    if (item === 'npm') {
      commandToCopy = `npm install ${props.isDevComponent ? '-D ' : ''}${props.npmInstall}`;
    } else {
      commandToCopy = `git clone ${props.urlClone}`;
    }

    navigator.clipboard.writeText(commandToCopy)
      .then(() => {
        addToast(`Copied to clipboard: ${commandToCopy}`, 'success', 3000);
      })
      .catch(err => {
        addToast(`Failed to copy: ${err}`, 'error', 3000);
      });
  };

  const addToast = (message, type = 'success', duration = 3000) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    toasts.value.push({ id, message, type, duration });
  };

  const removeToast = (id) => {
    const index = toasts.value.findIndex(toast => toast.id === id);
    if (index > -1) {
      toasts.value.splice(index, 1);
    }
  };

  watchEffect(async () => {
    await fetchReadme();
    await fetchChangelog();
  });

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
    windowWidth,
  };
};

export default useDemo;
