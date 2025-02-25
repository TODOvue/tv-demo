import { computed, onMounted, ref } from 'vue';

const useDemo = (props) => {
  const theme = ref('dark');
  const selectedVariantIndex = ref(0);
  const selectedTheme = ref('');
  const isCopy = ref(false);
  const messageCopy = ref('');
  const version = ref('');

  onMounted(async () => {
    const storedTheme = localStorage.getItem('theme');
    await fetchVersion()
    if (storedTheme) {
      theme.value = storedTheme;
      selectedTheme.value = storedTheme;
      return;
    }
    selectedTheme.value = theme.value;
  });
  
  const fetchVersion = async () => {
    try {
      const packagePath = `../../../node_modules/${props.npmInstall}/package.json`
      const packageJson = await import(/* @vite-ignore */ packagePath)
      version.value = packageJson.version || '0.0.0'
    } catch (error) {
      version.value = '0.0.0'
      console.error(`No se pudo obtener la versión de ${props.npmInstall}:`, error)
    }
  }
  
  const toggleTheme = () => {
    theme.value = selectedTheme.value;
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
        isCopy.value = true;
        messageCopy.value = `✅ Copied: ${commandToCopy}`;
      })
      .catch(err => {
        isCopy.value = true;
        messageCopy.value = `❌ Failed to copy: ${err}`;
      })
      .finally(() => {
        setTimeout(() => {
          isCopy.value = false;
          messageCopy.value = "";
        }, 2000);
      });
  };
  
  return {
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
  };
};

export default useDemo;
