import { flushPromises, mount } from '@vue/test-utils'
import { defineComponent, h, markRaw } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import TvDemo from './TvDemo.vue'
import type { DemoVariant } from '../types/demo'

const DemoComponent = defineComponent({
  name: 'DemoComponent',
  props: {
    label: {
      type: String,
      default: 'Emit',
    },
  },
  emits: ['clickButton'],
  template: `
    <button data-testid="demo-emitter" @click="$emit('clickButton', { from: 'demo' })">
      {{ label }}
    </button>
  `,
})

const TvPreviewFrameStub = defineComponent({
  name: 'TvPreviewFrame',
  props: {
    component: {
      type: [Object, Function],
      required: true,
    },
    componentProps: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props) {
    return () => h(props.component as never, props.componentProps ?? {})
  },
})

const variants: DemoVariant[] = [
  {
    id: 'default',
    title: 'Default',
    description: 'Main variant',
    propsData: { label: 'Emit event' },
    html: '<div>Default example</div>',
  },
  {
    id: 'secondary',
    title: 'Secondary',
    description: 'Secondary variant',
    propsData: { label: 'Another label' },
    html: '<div>Secondary example</div>',
  },
  {
    id: 'rich',
    title: 'Rich Controls',
    description: 'Covers playground control types',
    propsData: {
      enabled: true,
      count: 3,
      label: 'text',
      color: '#ff0000',
      nested: { deep: 'value' },
    },
    html: '<div>Rich example</div>',
  },
  {
    id: 'code',
    title: 'Code Variant',
    description: 'Has multiple code snippets',
    propsData: { label: 'code' },
    html: '<div>Code fallback</div>',
    code: [
      { type: 'Vue 3 Setup', content: '<div>setup</div>', lang: 'vue' },
      { type: 'TypeScript', content: 'const x: number = 1', lang: 'ts' },
    ],
  },
]

const mountTvDemo = (props: Record<string, unknown> = {}) =>
  mount(TvDemo, {
    props: {
      component: markRaw(DemoComponent),
      variants,
      componentName: 'TvDemo',
      manualEmits: ['clickButton'],
      showDocumentation: true,
      showChangelog: true,
      npmInstall: '@todovue/tv-demo',
      urlClone: 'https://github.com/TODOvue/tv-demo.git',
      version: '1.0.0',
      ...props,
    },
    global: {
      stubs: {
        TvPreviewFrame: TvPreviewFrameStub,
        ToastContainer: true,
        ToUp: true,
        HighCode: defineComponent({
          props: { codeValue: { type: String, default: '' } },
          template: '<pre data-testid="code">{{ codeValue }}</pre>',
        }),
        VueMarkdownIt: defineComponent({
          props: { source: { type: String, default: '' } },
          template: '<div data-testid="markdown">{{ source }}</div>',
        }),
      },
    },
  })

const getButtonByText = (
  wrapper: ReturnType<typeof mountTvDemo>,
  text: string,
  exact = true,
) => {
  const match = wrapper.findAll('button').find((button) => {
    const content = button.text().trim()
    return exact ? content === text : content.includes(text)
  })
  expect(match).toBeTruthy()
  return match!
}

describe('TvDemo', () => {
  it('shows back button when history state allows it and navigates back', async () => {
    window.history.replaceState({ position: 1 }, '', '/')
    const backSpy = vi.spyOn(window.history, 'back').mockImplementation(() => {})
    const wrapper = mountTvDemo()
    await flushPromises()

    const backButton = wrapper.find('button[aria-label="Back"]')
    expect(backButton.exists()).toBe(true)
    await backButton.trigger('click')
    expect(backSpy).toHaveBeenCalled()
    wrapper.unmount()
  })

  it('switches between demo, documentation and changelog tabs', async () => {
    const wrapper = mountTvDemo()

    await flushPromises()

    expect(wrapper.text()).toContain('Variants')

    await getButtonByText(wrapper, 'Documentation').trigger('click')
    await flushPromises()
    expect(wrapper.text()).toContain('Mock content')

    await getButtonByText(wrapper, 'Changelog').trigger('click')
    await flushPromises()
    expect(wrapper.text()).toContain('Mock content')

    await getButtonByText(wrapper, 'Demo').trigger('click')
    await flushPromises()
    expect(wrapper.text()).toContain('Variants')
  })

  it('filters variants and shows empty state when there are no matches', async () => {
    const wrapper = mountTvDemo()
    await flushPromises()

    const search = wrapper.get('input[aria-label="Search variants"]')
    await search.setValue('unknown-variant')
    await flushPromises()

    expect(wrapper.text()).toContain('No matches for "unknown-variant".')

    await wrapper.get('button.tv-demo-reset').trigger('click')
    await flushPromises()

    expect(wrapper.text()).not.toContain('No matches for "unknown-variant".')
    expect(wrapper.text()).toContain('Default')
  })

  it('logs emitted events in Events tab and clears them', async () => {
    const wrapper = mountTvDemo()
    await flushPromises()

    await wrapper.get('[data-testid="demo-emitter"]').trigger('click')
    await flushPromises()

    await getButtonByText(wrapper, 'Events', false).trigger('click')
    await flushPromises()

    expect(wrapper.text()).toContain('clickButton')

    const clearButton = wrapper.findAll('button').find((button) => button.text().trim() === 'Clear')
    expect(clearButton).toBeTruthy()
    await clearButton!.trigger('click')
    await flushPromises()

    expect(wrapper.text()).toContain('Listening for events...')
  })

  it('copies generated code from Code tab', async () => {
    const writeText = vi.spyOn(window.navigator.clipboard, 'writeText').mockResolvedValue(undefined)
    const wrapper = mountTvDemo()
    await flushPromises()

    await getButtonByText(wrapper, 'Code').trigger('click')
    await flushPromises()

    await getButtonByText(wrapper, 'Copy Code').trigger('click')
    await flushPromises()

    await getButtonByText(wrapper, 'Playground').trigger('click')
    await flushPromises()

    expect(writeText).toHaveBeenCalled()
  })

  it('hides optional docs and changelog tabs when disabled', async () => {
    const wrapper = mountTvDemo({
      showDocumentation: false,
      showChangelog: false,
    })
    await flushPromises()

    expect(wrapper.text()).not.toContain('Documentation')
    expect(wrapper.text()).not.toContain('Changelog')
  })

  it('renders empty component fallback when component prop is missing', async () => {
    const wrapper = mountTvDemo({
      component: undefined,
    })
    await flushPromises()

    expect(wrapper.text()).toContain('No component to render.')
  })

  it('toggles viewport, rtl, grid and background controls', async () => {
    const wrapper = mountTvDemo()
    await flushPromises()

    await getButtonByText(wrapper, 'Mobile').trigger('click')
    expect(wrapper.find('button[aria-label="Mobile view (375px)"]').classes()).toContain('active')

    await getButtonByText(wrapper, 'Tablet').trigger('click')
    await getButtonByText(wrapper, 'Desktop').trigger('click')

    await wrapper.get('button[aria-label="Toggle RTL"]').trigger('click')
    expect(wrapper.get('button[aria-label="Toggle RTL"]').classes()).toContain('active')

    await wrapper.get('button[aria-label="Toggle Grid"]').trigger('click')
    expect(wrapper.get('button[aria-label="Toggle Grid"]').classes()).toContain('active')

    await wrapper.get('button[aria-label="Change Background"]').trigger('click')
    await flushPromises()
    await getButtonByText(wrapper, 'Default').trigger('click')
    await wrapper.get('button[aria-label="Change Background"]').trigger('click')
    await getButtonByText(wrapper, 'Checkered').trigger('click')
    await wrapper.get('button[aria-label="Change Background"]').trigger('click')
    await getButtonByText(wrapper, 'White').trigger('click')
    await wrapper.get('button[aria-label="Change Background"]').trigger('click')
    await getButtonByText(wrapper, 'Dark').trigger('click')
    await flushPromises()
    expect(wrapper.findAll('.tv-demo-dropdown.theme-dropdown.is-open')).toHaveLength(0)
  })

  it('opens install dropdown and copies npm command', async () => {
    const writeText = vi.spyOn(window.navigator.clipboard, 'writeText').mockResolvedValue(undefined)
    const wrapper = mountTvDemo()
    await flushPromises()

    await getButtonByText(wrapper, 'Copy install command').trigger('click')
    expect(wrapper.find('.install-dropdown').classes()).toContain('is-open')

    await getButtonByText(wrapper, 'npm').trigger('click')
    await flushPromises()
    expect(writeText).toHaveBeenCalledWith('npm install @todovue/tv-demo')
  })

  it('toggles theme from switch control', async () => {
    const wrapper = mountTvDemo()
    await flushPromises()

    expect(wrapper.find('.tv-demo').classes()).toContain('dark-mode')
    await wrapper.get('.tv-demo-theme input[type="checkbox"]').setValue(false)
    await flushPromises()
    expect(wrapper.find('.tv-demo').classes()).toContain('light-mode')
  })

  it('renders and edits mixed playground controls for rich variant', async () => {
    const wrapper = mountTvDemo()
    await flushPromises()

    await getButtonByText(wrapper, 'Rich Controls', false).trigger('click')
    await flushPromises()

    expect(wrapper.find('#control-enabled').exists()).toBe(true)
    expect(wrapper.find('#control-count').exists()).toBe(true)

    await wrapper.find('#control-count').setValue('7')
    await wrapper.find('#control-label').setValue('updated label')
    await wrapper.find('#control-enabled').setValue(false)
    await wrapper.find('input[aria-label="Search variants"]').trigger('keydown.down')
    await wrapper.find('input[aria-label="Search variants"]').setValue('rich')
    await wrapper.get('button[aria-label="Clear search"]').trigger('click')
    await wrapper.find('.tv-demo-variants').trigger('scroll')
    await wrapper.find('.tv-demo-variants').trigger('keydown', { key: 'ArrowDown' })
    await getButtonByText(wrapper, 'Reset Props').trigger('click')
    await flushPromises()

    expect(wrapper.text()).toContain('Props')
  })

  it('switches code variants using code tabs', async () => {
    const writeText = vi.spyOn(window.navigator.clipboard, 'writeText').mockResolvedValue(undefined)
    const wrapper = mountTvDemo()
    await flushPromises()

    await getButtonByText(wrapper, 'Code Variant', false).trigger('click')
    await getButtonByText(wrapper, 'Code').trigger('click')
    await flushPromises()

    await getButtonByText(wrapper, 'TypeScript').trigger('click')
    await getButtonByText(wrapper, 'Copy Code').trigger('click')
    await flushPromises()

    expect(writeText).toHaveBeenCalledWith('const x: number = 1')
  })
})
