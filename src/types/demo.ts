export type ThemeMode = 'dark' | 'light'
export type ToastType = 'success' | 'error' | 'warning' | 'info'
export type DemoTab = 'demo' | 'docs' | 'changelog'
export type ToolTab = 'playground' | 'events' | 'code'
export type ViewportWidth = '100%' | '375px' | '768px' | '1280px'
export type BackgroundType = 'default' | 'checkered' | 'white' | 'dark'
export type VariantKey = string | number

export interface DemoStylePalette {
  backgroundBody?: string;
  backgroundContent?: string;
  color?: string;
}

export interface DemoStyleConfig {
  dark?: DemoStylePalette;
  light?: DemoStylePalette;
}

export interface DemoCodeVariant {
  type: string;
  content: string;
  lang?: string;
}

export type DemoPropsData = Record<string, unknown>

export interface DemoVariant {
  id?: VariantKey;
  title?: string;
  description?: string;
  propsData?: DemoPropsData;
  html?: string;
  code?: DemoCodeVariant[];
}

export interface DemoVariantEntry {
  variant: DemoVariant;
  index: number;
  key: VariantKey;
  searchableText: string;
}

export interface DemoToast {
  id: string;
  message: string;
  type: ToastType;
  duration: number;
}

export interface DemoEventLog {
  id: number;
  timestamp: string;
  eventName: string;
  payload?: unknown;
}

export interface DemoContext {
  resolvePath?: (
    componentName: string,
    resourceType: 'readme' | 'changelog',
    fallbackPath?: string | null
  ) => string;
}

export interface UseDemoProps {
  demoStyle?: DemoStyleConfig;
  hideBackground?: boolean;
  component?: unknown;
  variants?: DemoVariant[];
  componentName: string;
  sourceLink?: string | null;
  urlClone?: string | null;
  npmInstall?: string | null;
  isDevComponent?: boolean;
  version?: string;
  readmePath?: string;
  changelogPath?: string;
  showDocumentation?: boolean;
  showChangelog?: boolean;
  manualEmits?: string[];
}
