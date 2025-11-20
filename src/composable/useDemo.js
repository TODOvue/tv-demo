import { computed, onMounted, ref, watchEffect } from 'vue';

const useDemo = (props) => {
  const theme = ref('dark');
  const selectedVariantIndex = ref(0);
  const toasts = ref([]);
  const readmeContent = ref('');
  const selectedTab = ref('demo');

  onMounted(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      theme.value = storedTheme;
    }
  });
  
  const fetchReadme = async () => {
    try {
      const response = await fetch(props.readmePath);
      if (!response.ok) throw new Error('README.md not found');
      readmeContent.value = await response.text();
    } catch (error) {
      readmeContent.value = '⚠️ Documentation not found.';
    }
  };

  const toggleTheme = () => {
    theme.value = theme.value === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', theme.value);
  };
  
  const variant = computed(() => props.variants?.[selectedVariantIndex.value] || {});
  
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
    let commandToCopy = "";
    
    if (item === "npm") {
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
  
  watchEffect(fetchReadme);
  
  return {
    customStyle,
    toasts,
    readmeContent,
    selectedTab,
    selectedVariantIndex,
    theme,
    variant,
    addToast,
    removeToast,
    setClickItem,
    toggleTheme,
  };
};

export default useDemo;
