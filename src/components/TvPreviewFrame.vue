<script setup>
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue';
import { createApp, h } from 'vue';

const props = defineProps({
  component: {
    type: [Object, Function],
    required: true
  },
  componentProps: {
    type: Object,
    default: () => ({})
  },
  title: {
    type: String,
    default: 'Component Preview'
  },
  viewportWidth: {
    type: String,
    default: '100%'
  },
  bodyClass: {
    type: String,
    default: ''
  },
  bodyStyle: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits([]);

const iframeRef = ref(null);
let appInstance = null;
let resizeObserver = null;
let headObserver = null;

const cloneNodeIntoDoc = (node, doc) => {
  if (node.tagName === 'LINK' && (node.rel === 'stylesheet' || node.href.includes('.css'))) {
    const newLink = doc.createElement('link');
    newLink.rel = 'stylesheet';
    newLink.href = node.href;
    return newLink;
  }
  if (node.tagName === 'STYLE') {
    const newStyle = doc.createElement('style');
    newStyle.textContent = node.textContent;
    const observer = new MutationObserver(() => {
        newStyle.textContent = node.textContent;
    });
    observer.observe(node, { characterData: true, childList: true });
    return newStyle;
  }
  return null;
};

const setupHeadObserver = (iframeDoc) => {
  if (headObserver) headObserver.disconnect();

  const copyAll = () => {
     Array.from(document.querySelectorAll('link[rel="stylesheet"], link[href*=".css"], style')).forEach(node => {
       const clone = cloneNodeIntoDoc(node, iframeDoc);
       if (clone) iframeDoc.head.appendChild(clone);
     });
  };
    copyAll();

  headObserver = new MutationObserver((mutations) => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        const clone = cloneNodeIntoDoc(node, iframeDoc);
        if (clone) iframeDoc.head.appendChild(clone);
      });
    });
  });

  headObserver.observe(document.head, { childList: true, subtree: false });
};

const syncBody = (doc) => {
  if (!doc || !doc.body) return;
  doc.body.className = props.bodyClass;
  Object.assign(doc.body.style, props.bodyStyle);
  doc.body.style.margin = '0';

  doc.body.style.display = 'flex';
  doc.body.style.flexDirection = 'column';
  doc.body.style.alignItems = 'center';
  doc.body.style.boxSizing = 'border-box';
  doc.body.style.padding = '0';
};

const syncApp = (doc) => {
  if (!doc) return;
  const appEl = doc.getElementById('app');
  if (appEl) {
    appEl.style.display = 'flex';
    appEl.style.justifyContent = 'center';
    appEl.style.width = '100%';
  }
};

const updateHeight = () => {
  if (!iframeRef.value) return;
  const doc = iframeRef.value.contentDocument;
  if (!doc || !doc.body) return;

  const appEl = doc.getElementById('app');
  let contentHeight = 0;

  if (appEl) {
     contentHeight = appEl.getBoundingClientRect().height;
  }

  const totalHeight = contentHeight + 40;
  iframeRef.value.style.height = `${totalHeight + 50}px`;
};

const setupResizeObserver = (doc) => {
  if (resizeObserver) resizeObserver.disconnect();
  resizeObserver = new ResizeObserver(() => { updateHeight(); });
  if (doc.body) {
    resizeObserver.observe(doc.body);
    const appEl = doc.getElementById('app');
    if (appEl) resizeObserver.observe(appEl);
  }
};

const mountApp = () => {
  if (!iframeRef.value) return;
  const iframeDoc = iframeRef.value.contentDocument || iframeRef.value.contentWindow.document;

  iframeDoc.open();
  iframeDoc.write('<!DOCTYPE html><html><head></head><body><div id="app"></div></body></html>');
  iframeDoc.close();

  setupHeadObserver(iframeDoc);
  syncBody(iframeDoc);
  syncApp(iframeDoc);

  const container = iframeDoc.getElementById('app');

  if (appInstance) {
    appInstance.unmount();
  }

  appInstance = createApp({
    render() {
        return h(props.component, props.componentProps);
    }
  });

  appInstance.mount(container);

  nextTick(() => {
    setupResizeObserver(iframeDoc);
    updateHeight();
  });
};

const updateApp = () => {
  if (!iframeRef.value) return;
  const iframeDoc = iframeRef.value.contentDocument;
  if (!iframeDoc) return;

  syncBody(iframeDoc);
  syncApp(iframeDoc);

  let container = iframeDoc.getElementById('app');

  if(!container) {
     mountApp();
     return;
  }

  if (appInstance) {
    appInstance.unmount();
  }

  appInstance = createApp({
    render() {
      return h(props.component, props.componentProps);
    }
  });
  appInstance.mount(container);

  nextTick(() => {
     setupResizeObserver(iframeDoc);
     updateHeight();
  });
};

onMounted(() => {
  mountApp();
});

onBeforeUnmount(() => {
  if (appInstance) {
    appInstance.unmount();
  }
  if (resizeObserver) {
    resizeObserver.disconnect();
  }
  if (headObserver) {
    headObserver.disconnect();
  }
});

watch(() => [props.component, props.componentProps, props.viewportWidth, props.bodyClass, props.bodyStyle], () => {
  updateApp();
}, { deep: true });


</script>

<template>
  <div class="tv-preview-frame-container" :style="{ width: viewportWidth }">
    <iframe
      ref="iframeRef"
      :title="title"
      class="tv-preview-frame"
      @load="mountApp"
    ></iframe>
  </div>
</template>

<style scoped>
.tv-preview-frame-container {
  margin: 0 auto;
  transition: width 0.3s ease;
  background: transparent;
  flex-shrink: 0;
}

.tv-preview-frame {
  width: 100%;
  height: 100%;
  min-height: 400px;
  border: none;
  display: block;
  background-color: transparent;
}
</style>
