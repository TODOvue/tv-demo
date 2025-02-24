import { computed, onMounted, ref } from 'vue';

const useDemo = (props) => {
  const theme = ref('dark');
  const selectedVariantIndex = ref(0);
  const selectedTheme = ref('');
  
  onMounted(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      theme.value = storedTheme;
      selectedTheme.value = storedTheme;
      return;
    }
    selectedTheme.value = theme.value;
  });
  
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
  
  return {
    selectedTheme,
    selectedVariantIndex,
    theme,
    toggleTheme,
    variant,
    customStyle,
  };
};

export default useDemo;
