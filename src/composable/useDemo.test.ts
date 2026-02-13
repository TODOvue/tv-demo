import { flushPromises } from '@vue/test-utils'
import { createApp, defineComponent, nextTick } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import useDemo from './useDemo'
import type { DemoVariant, UseDemoProps } from '../types/demo'

const variants: DemoVariant[] = [
  {
    id: 'alpha',
    title: 'Alpha',
    description: 'First variant',
    propsData: { enabled: true, label: 'A' },
    html: '<div>alpha</div>',
  },
  {
    id: 'beta',
    title: 'Beta',
    description: 'Second variant',
    propsData: { enabled: false, label: 'B' },
    html: '<div>beta</div>',
  },
  {
    id: 'code',
    title: 'Code Variant',
    description: 'Variant with multiple snippets',
    propsData: { size: 10 },
    html: '<div>fallback html</div>',
    code: [
      {
        type: 'Vue 3 Setup',
        content: '<script setup>const count = 1</script>',
        lang: 'vue',
      },
      {
        type: 'TypeScript',
        content: 'const count: number = 1',
        lang: 'ts',
      },
    ],
  },
]

const buildProps = (overrides: Partial<UseDemoProps> = {}): UseDemoProps => ({
  componentName: 'TvDemo',
  variants,
  npmInstall: '@todovue/tv-demo',
  showDocumentation: true,
  showChangelog: true,
  ...overrides,
})

type UseDemoResult = ReturnType<typeof useDemo>

const mountUseDemo = (
  overrides: Partial<UseDemoProps> = {},
  options: { provide?: Record<string, unknown> } = {},
) => {
  let result!: UseDemoResult
  const host = document.createElement('div')
  document.body.appendChild(host)

  const app = createApp(
    defineComponent({
      setup() {
        result = useDemo(buildProps(overrides))
        return () => null
      },
    }),
  )

  if (options.provide) {
    for (const [key, value] of Object.entries(options.provide)) {
      app.provide(key, value)
    }
  }

  app.mount(host)

  return {
    result,
    unmount() {
      app.unmount()
      host.remove()
    },
  }
}

describe('useDemo', () => {
  it('hydrates state from URL params and localStorage on mount', async () => {
    localStorage.setItem('theme', 'light')
    window.history.replaceState(
      {},
      '',
      '/?tab=docs&search=beta&variant=beta&viewport=mobile',
    )

    const { result, unmount } = mountUseDemo()

    await flushPromises()
    await nextTick()

    expect(result.theme.value).toBe('light')
    expect(result.selectedTab.value).toBe('docs')
    expect(result.searchQuery.value).toBe('beta')
    expect(result.selectedVariantKey.value).toBe('beta')
    expect(result.viewportWidth.value).toBe('375px')

    unmount()
  })

  it('keeps selected variant in sync with search results', async () => {
    const { result, unmount } = mountUseDemo()

    await flushPromises()
    await nextTick()
    expect(result.selectedVariantKey.value).toBe('alpha')

    result.searchQuery.value = 'code'
    await nextTick()

    expect(result.filteredVariantsCount.value).toBe(1)
    expect(result.selectedVariantKey.value).toBe('code')

    result.searchQuery.value = 'not-found'
    await nextTick()

    expect(result.emptySearchState.value).toBe(true)
    expect(result.selectedVariantKey.value).toBeNull()

    unmount()
  })

  it('supports keyboard navigation for the variants list', async () => {
    const { result, unmount } = mountUseDemo()

    await flushPromises()
    await nextTick()

    const preventDefault = vi.fn()
    result.handleVariantsKeydown({ key: 'End', preventDefault } as unknown as KeyboardEvent)
    expect(preventDefault).toHaveBeenCalled()
    expect(result.selectedVariantKey.value).toBe('code')

    result.handleVariantsKeydown({
      key: 'ArrowUp',
      preventDefault,
    } as unknown as KeyboardEvent)
    expect(result.selectedVariantKey.value).toBe('beta')

    result.handleVariantsKeydown({ key: 'Home', preventDefault } as unknown as KeyboardEvent)
    expect(result.selectedVariantKey.value).toBe('alpha')

    unmount()
  })

  it('copies install command with dev flag when selecting npm command', async () => {
    const writeText = vi.spyOn(window.navigator.clipboard, 'writeText').mockResolvedValue(undefined)
    const { result, unmount } = mountUseDemo({ isDevComponent: true })

    await flushPromises()
    result.setClickItem('npm')
    await flushPromises()

    expect(writeText).toHaveBeenCalledWith('npm install -D @todovue/tv-demo')
    expect(result.toasts.value[0]?.message).toContain('Copied to clipboard')

    unmount()
  })

  it('copies code from selected code type in code variants', async () => {
    const writeText = vi.spyOn(window.navigator.clipboard, 'writeText').mockResolvedValue(undefined)
    const { result, unmount } = mountUseDemo()

    await flushPromises()
    result.selectVariant('code')
    await nextTick()

    expect(result.availableCodeTypes.value).toEqual(['Vue 3 Setup', 'TypeScript'])

    result.selectedCodeType.value = 'TypeScript'
    result.copyCode()
    await flushPromises()

    expect(writeText).toHaveBeenCalledWith('const count: number = 1')
    expect(result.toasts.value[0]?.message).toContain('Code copied to clipboard')

    unmount()
  })

  it('updates URL query params when tab, search and viewport change', async () => {
    vi.useFakeTimers()
    const replaceState = vi.spyOn(window.history, 'replaceState')
    const { result, unmount } = mountUseDemo()

    await flushPromises()
    result.selectedTab.value = 'changelog'
    result.searchQuery.value = 'alpha'
    result.viewportWidth.value = '768px'
    result.selectVariant('alpha')

    vi.advanceTimersByTime(350)
    await nextTick()

    expect(replaceState).toHaveBeenCalled()
    const lastCall = replaceState.mock.calls[replaceState.mock.calls.length - 1]
    expect(String(lastCall?.[2])).toContain('tab=changelog')
    expect(String(lastCall?.[2])).toContain('search=alpha')
    expect(String(lastCall?.[2])).toContain('variant=alpha')
    expect(String(lastCall?.[2])).toContain('viewport=tablet')

    vi.useRealTimers()
    unmount()
  })

  it('uses viewport fallback from window width when no URL viewport is provided', async () => {
    const innerWidthSpy = vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(500)
    const { result, unmount } = mountUseDemo()

    await flushPromises()
    await nextTick()

    expect(result.viewportWidth.value).toBe('375px')

    innerWidthSpy.mockRestore()
    unmount()
  })

  it('limits event logs to the most recent 50 entries and can clear with toast', async () => {
    const { result, unmount } = mountUseDemo()
    await flushPromises()

    for (let index = 0; index < 55; index += 1) {
      result.addLog(`event-${index}`, index)
    }

    expect(result.eventLogs.value).toHaveLength(50)
    expect(result.eventLogs.value[0]?.eventName).toBe('event-54')

    result.clearLogs()
    expect(result.eventLogs.value).toHaveLength(0)
    expect(result.toasts.value[0]?.message).toContain('Event logs cleared')

    unmount()
  })

  it('resets reactive props from selected variant defaults', async () => {
    const { result, unmount } = mountUseDemo()
    await flushPromises()
    await nextTick()

    result.selectVariant('beta')
    await nextTick()
    expect(result.reactiveProps.value).toEqual({ enabled: false, label: 'B' })

    result.reactiveProps.value.label = 'Changed'
    result.resetProps()

    expect(result.reactiveProps.value).toEqual({ enabled: false, label: 'B' })
    expect(result.toasts.value[0]?.message).toContain('Props reset to default')

    unmount()
  })

  it('adds error toast when clipboard copy fails', async () => {
    vi.spyOn(window.navigator.clipboard, 'writeText').mockRejectedValueOnce(new Error('no access'))
    const { result, unmount } = mountUseDemo()
    await flushPromises()

    result.setClickItem('clone')
    await flushPromises()

    expect(result.toasts.value[0]?.type).toBe('error')
    expect(result.toasts.value[0]?.message).toContain('Failed to copy')

    unmount()
  })

  it('opens dropdowns and closes them when clicking outside', async () => {
    const { result, unmount } = mountUseDemo()
    await flushPromises()

    const install = document.createElement('div')
    install.className = 'install-dropdown'
    document.body.appendChild(install)
    const theme = document.createElement('div')
    theme.className = 'tv-demo-dropdown theme-dropdown'
    document.body.appendChild(theme)

    result.toggleInstallDropdown()
    result.toggleThemeDropdown()
    expect(result.isInstallDropdownOpen.value).toBe(true)
    expect(result.isThemeDropdownOpen.value).toBe(true)

    const outside = document.createElement('button')
    document.body.appendChild(outside)
    outside.click()
    await nextTick()

    expect(result.isInstallDropdownOpen.value).toBe(false)
    expect(result.isThemeDropdownOpen.value).toBe(false)
    outside.remove()
    install.remove()
    theme.remove()
    unmount()
  })

  it('supports package manager variants and clone command copy', async () => {
    const writeText = vi.spyOn(window.navigator.clipboard, 'writeText').mockResolvedValue(undefined)
    const { result, unmount } = mountUseDemo({
      isDevComponent: true,
      npmInstall: '@todovue/tv-demo',
      urlClone: 'https://example.com/repo.git',
    })
    await flushPromises()

    result.setClickItem('yarn')
    result.setClickItem('pnpm')
    result.setClickItem('bun')
    result.setClickItem('clone')
    await flushPromises()

    expect(writeText).toHaveBeenCalledWith('yarn add -D @todovue/tv-demo')
    expect(writeText).toHaveBeenCalledWith('pnpm add -D @todovue/tv-demo')
    expect(writeText).toHaveBeenCalledWith('bun add -D @todovue/tv-demo')
    expect(writeText).toHaveBeenCalledWith('git clone https://example.com/repo.git')
    unmount()
  })

  it('handles removeToast for existing and missing ids', async () => {
    const { result, unmount } = mountUseDemo()
    await flushPromises()

    result.addToast('one')
    result.addToast('two')
    const firstId = result.toasts.value[0]?.id
    expect(firstId).toBeTruthy()

    result.removeToast(firstId!)
    expect(result.toasts.value).toHaveLength(1)
    result.removeToast('missing-id')
    expect(result.toasts.value).toHaveLength(1)
    unmount()
  })

  it('falls back gracefully when there are no variants', async () => {
    const { result, unmount } = mountUseDemo({ variants: [] })
    await flushPromises()

    expect(result.totalVariantsCount.value).toBe(0)
    expect(result.selectedVariantKey.value).toBeNull()
    expect(result.variant.value).toEqual({})
    unmount()
  })

  it('handles non-serializable propsData when building reactive props and reset', async () => {
    const circular: Record<string, unknown> = { label: 'x' }
    circular.self = circular
    const badVariant: DemoVariant = {
      id: 'circular',
      title: 'Circular',
      propsData: circular,
      html: '<div />',
    }
    const { result, unmount } = mountUseDemo({ variants: [badVariant] })
    await flushPromises()
    await nextTick()

    expect(result.reactiveProps.value.label).toBe('x')
    result.resetProps()
    expect(result.reactiveProps.value.label).toBe('x')
    unmount()
  })

  it('uses provided resolvePath and fallback content when fetch fails', async () => {
    const fetchMock = vi.fn()
    fetchMock
      .mockResolvedValueOnce({ ok: true, text: vi.fn().mockResolvedValue('README via resolver') })
      .mockResolvedValueOnce({ ok: false, text: vi.fn() })
    vi.stubGlobal('fetch', fetchMock)

    const resolvePath = vi.fn((name: string, type: 'readme' | 'changelog') =>
      `/${name}/${type}.md`,
    )
    const { result, unmount } = mountUseDemo(
      {
        componentName: 'ResolverComponent',
      },
      {
        provide: {
          TV_DEMO_CONTEXT: { resolvePath },
        },
      },
    )
    await flushPromises()

    expect(resolvePath).toHaveBeenCalled()
    expect(result.readmeContent.value).toContain('README via resolver')
    expect(result.changelogContent.value).toBe('Changelog not found.')
    unmount()
  })

  it('resets selectedCodeType to first available option when current one is invalid', async () => {
    const { result, unmount } = mountUseDemo()
    await flushPromises()

    result.selectVariant('code')
    await nextTick()
    result.selectedCodeType.value = 'Invalid Type'
    result.selectVariant('alpha')
    await nextTick()
    result.selectVariant('code')
    await nextTick()

    expect(result.selectedCodeType.value).toBe('Vue 3 Setup')
    expect(result.currentLang.value).toBe('vue')
    unmount()
  })

  it('attaches and detaches fallback resize listener when ResizeObserver is unavailable', async () => {
    vi.stubGlobal('ResizeObserver', undefined)
    const addSpy = vi.spyOn(window, 'addEventListener')
    const removeSpy = vi.spyOn(window, 'removeEventListener')
    const { result, unmount } = mountUseDemo()
    await flushPromises()

    const list = document.createElement('div')
    Object.defineProperty(list, 'clientHeight', { configurable: true, value: 320 })
    result.variantsListRef.value = list
    await nextTick()
    await nextTick()

    expect(addSpy).toHaveBeenCalledWith('resize', expect.any(Function))
    result.variantsListRef.value = null
    await nextTick()
    expect(removeSpy).toHaveBeenCalledWith('resize', expect.any(Function))
    unmount()
  })

  it('handles scroll/key defaults and copyCode failure branch', async () => {
    const { result, unmount } = mountUseDemo()
    await flushPromises()

    result.handleVariantsScroll({ target: null } as unknown as Event)
    const list = document.createElement('div')
    Object.defineProperty(list, 'scrollTop', { configurable: true, value: 77 })
    result.handleVariantsScroll({ target: list } as unknown as Event)

    const preventDefault = vi.fn()
    result.handleVariantsKeydown({ key: 'ArrowDown', preventDefault } as unknown as KeyboardEvent)
    expect(preventDefault).toHaveBeenCalled()
    result.handleVariantsKeydown({ key: 'x', preventDefault } as unknown as KeyboardEvent)

    vi.spyOn(window.navigator.clipboard, 'writeText').mockRejectedValueOnce(new Error('denied'))
    result.copyCode('content')
    await flushPromises()
    expect(result.toasts.value[0]?.type).toBe('error')
    unmount()
  })

  it('supports tablet/desktop URL viewport and desktop fallback width', async () => {
    window.history.replaceState({}, '', '/?viewport=tablet')
    const mountOne = mountUseDemo()
    await flushPromises()
    expect(mountOne.result.viewportWidth.value).toBe('768px')
    mountOne.unmount()

    window.history.replaceState({}, '', '/?viewport=desktop')
    const mountTwo = mountUseDemo()
    await flushPromises()
    expect(mountTwo.result.viewportWidth.value).toBe('1280px')
    mountTwo.unmount()

    window.history.replaceState({}, '', '/')
    const widthSpy = vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(1400)
    const mountThree = mountUseDemo()
    await flushPromises()
    expect(mountThree.result.viewportWidth.value).toBe('1280px')
    widthSpy.mockRestore()
    mountThree.unmount()
  })

  it('resets props to empty object when current variant has no propsData', async () => {
    const noPropsVariant: DemoVariant = { id: 'empty', title: 'Empty', html: '<div />' }
    const { result, unmount } = mountUseDemo({ variants: [noPropsVariant] })
    await flushPromises()

    result.resetProps()
    expect(result.reactiveProps.value).toEqual({})
    unmount()
  })

  it('cleans URL params when returning to default state', async () => {
    vi.useFakeTimers()
    window.history.replaceState({}, '', '/?tab=docs&search=alpha&variant=beta&viewport=desktop')
    const replaceState = vi.spyOn(window.history, 'replaceState')
    const { result, unmount } = mountUseDemo()
    await flushPromises()

    result.selectedTab.value = 'demo'
    result.searchQuery.value = ''
    result.selectedVariantKey.value = null
    result.viewportWidth.value = '100%'

    vi.advanceTimersByTime(400)
    await nextTick()

    const last = String(replaceState.mock.calls[replaceState.mock.calls.length - 1]?.[2] ?? '')
    expect(last).not.toContain('tab=')
    expect(last).not.toContain('search=')
    expect(last).not.toContain('variant=')
    expect(last).not.toContain('viewport=')
    vi.useRealTimers()
    unmount()
  })

  it('falls back to documentation not found when readme fetch fails', async () => {
    const fetchMock = vi.fn()
    fetchMock
      .mockResolvedValueOnce({ ok: false, text: vi.fn() })
      .mockResolvedValueOnce({ ok: true, text: vi.fn().mockResolvedValue('ok changelog') })
    vi.stubGlobal('fetch', fetchMock)

    const { result, unmount } = mountUseDemo()
    await flushPromises()

    expect(result.readmeContent.value).toBe('Documentation not found.')
    expect(result.changelogContent.value).toContain('ok changelog')
    unmount()
  })

  it('maps desktop viewport in URL updates and removes unknown viewport values', async () => {
    vi.useFakeTimers()
    const replaceState = vi.spyOn(window.history, 'replaceState')
    const { result, unmount } = mountUseDemo()
    await flushPromises()

    result.viewportWidth.value = '1280px'
    vi.advanceTimersByTime(350)
    await nextTick()
    let last = String(replaceState.mock.calls[replaceState.mock.calls.length - 1]?.[2] ?? '')
    expect(last).toContain('viewport=desktop')

    result.viewportWidth.value = '999px' as never
    vi.advanceTimersByTime(350)
    await nextTick()
    last = String(replaceState.mock.calls[replaceState.mock.calls.length - 1]?.[2] ?? '')
    expect(last).not.toContain('viewport=')

    vi.useRealTimers()
    unmount()
  })
})
