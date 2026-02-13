import type { Component, CSSProperties } from 'vue'
import type { BackgroundType, DemoToast, UseDemoProps } from './demo'

export interface TestProps {
  variant?: string
  isDevComponent?: boolean
}

export interface TestEmits {
  clickButton: [payload: { test: number }]
  clickLabel: [payload: string]
  clickSecondaryButton: []
}

export interface ToastContainerProps {
  toasts: DemoToast[]
}

export interface ToastContainerEmits {
  removeToast: [id: string]
}

export type ToastNotificationProps = DemoToast

export interface ToastNotificationEmits {
  remove: [id: string]
}

export type ScrollTarget = string | HTMLElement | null
export type ScrollContainer = Window | HTMLElement

export interface ToUpProps {
  showOffset?: number
  scrollTarget?: ScrollTarget
  theme?: 'dark' | 'light'
  ariaLabel?: string
}

export interface ToUpEmits {
  click: []
}

export interface TvDemoProps extends Omit<UseDemoProps, 'component'> {
  component?: Component | Record<string, unknown>
}

export type AutoEventListeners = Record<string, (payload?: unknown) => void>

export interface NavigationApi {
  canGoBack?: boolean
  addEventListener?: (type: 'currententrychange', listener: () => void) => void
  removeEventListener?: (type: 'currententrychange', listener: () => void) => void
}

export interface WindowWithNavigation extends Window {
  navigation?: NavigationApi
}

export type NestedPrimitive = string | number | boolean | null | undefined
export interface NestedObject {
  [key: string]: NestedValue
}
export type NestedValue = NestedPrimitive | NestedValue[] | NestedObject

export interface TvNestedEditorProps {
  modelValue?: NestedValue
  name: string | number
  depth?: number
}

export interface TvNestedEditorEmits {
  'update:modelValue': [value: NestedValue]
}

export interface TvPreviewFrameProps {
  component: Component
  componentProps?: Record<string, unknown>
  title?: string
  viewportWidth?: string
  bodyClass?: string
  bodyStyle?: CSSProperties
  isRtl?: boolean
  backgroundType?: BackgroundType
  isGrid?: boolean
}
