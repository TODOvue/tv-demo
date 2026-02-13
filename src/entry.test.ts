import { describe, expect, it, vi } from 'vitest'
import type { App } from 'vue'

vi.mock('./components/TvDemo.vue', () => ({
  default: { name: 'TvDemoMock' },
}))

import TvDemoPlugin, { TvDemo } from './entry'

describe('entry plugin', () => {
  it('registers TvDemo component when install is called', () => {
    const component = vi.fn()
    TvDemoPlugin.install?.({ component } as Partial<App> as App)
    expect(component).toHaveBeenCalledWith('TvDemo', TvDemo)
  })
})
