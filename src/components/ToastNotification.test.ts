import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import ToastNotification from './ToastNotification.vue'

describe('ToastNotification', () => {
  it('becomes visible shortly after mount and auto-removes after duration', async () => {
    vi.useFakeTimers()
    const wrapper = mount(ToastNotification, {
      props: {
        id: 'toast-1',
        message: 'Hello world',
        type: 'success',
        duration: 100,
      },
    })

    expect(wrapper.classes()).not.toContain('visible')
    vi.advanceTimersByTime(10)
    await Promise.resolve()
    expect(wrapper.classes()).toContain('visible')

    vi.advanceTimersByTime(100)
    await Promise.resolve()
    expect(wrapper.classes()).toContain('leaving')

    vi.advanceTimersByTime(300)
    expect(wrapper.emitted('remove')?.[0]).toEqual(['toast-1'])
    vi.useRealTimers()
  })

  it('emits remove when close button is clicked', async () => {
    vi.useFakeTimers()
    const wrapper = mount(ToastNotification, {
      props: {
        id: 'toast-2',
        message: 'Close me',
        type: 'warning',
        duration: 5000,
      },
    })

    await wrapper.get('button.toast-close').trigger('click')
    expect(wrapper.classes()).toContain('leaving')

    vi.advanceTimersByTime(300)
    expect(wrapper.emitted('remove')?.[0]).toEqual(['toast-2'])
    vi.useRealTimers()
  })

  it('renders icon and color for each toast type', () => {
    const cases = [
      { type: 'success', icon: '✓' },
      { type: 'error', icon: '✕' },
      { type: 'warning', icon: '⚠' },
      { type: 'info', icon: 'ℹ' },
    ] as const

    for (const testCase of cases) {
      const wrapper = mount(ToastNotification, {
        props: {
          id: `toast-${testCase.type}`,
          message: testCase.type,
          type: testCase.type,
          duration: 1000,
        },
      })

      expect(wrapper.classes()).toContain(testCase.type)
      expect(wrapper.get('.toast-icon').text()).toContain(testCase.icon)
      expect(wrapper.get('.toast-icon').attributes('style')).toContain('background-color')
    }
  })

  it('falls back to default icon/color for unknown toast type', () => {
    const wrapper = mount(ToastNotification, {
      props: {
        id: 'toast-unknown',
        message: 'unknown',
        type: 'custom' as never,
        duration: 1000,
      },
    })

    expect(wrapper.get('.toast-icon').text()).toContain('✓')
    expect(wrapper.get('.toast-icon').attributes('style')).toContain('background-color')
  })
})
