import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import ToUp from './ToUp.vue'

describe('ToUp', () => {
  it('shows button after window scroll and scrolls to top on click', async () => {
    const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 350 })

    const wrapper = mount(ToUp, {
      props: {
        showOffset: 280,
      },
    })

    window.dispatchEvent(new Event('scroll'))
    await nextTick()

    const button = wrapper.find('button.tv-to-up')
    expect(button.exists()).toBe(true)
    await button.trigger('click')

    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' })
    expect(wrapper.emitted('click')).toBeTruthy()
  })

  it('uses provided scroll target element when it is scrollable', async () => {
    const target = document.createElement('div')
    Object.defineProperty(target, 'scrollHeight', { configurable: true, value: 1000 })
    Object.defineProperty(target, 'clientHeight', { configurable: true, value: 300 })
    Object.defineProperty(target, 'scrollTop', { configurable: true, writable: true, value: 400 })
    const scrollTo = vi.fn()
    Object.defineProperty(target, 'scrollTo', { configurable: true, value: scrollTo })
    document.body.appendChild(target)

    const wrapper = mount(ToUp, {
      props: {
        showOffset: 100,
        scrollTarget: target,
      },
    })

    target.dispatchEvent(new Event('scroll'))
    await nextTick()

    const button = wrapper.find('button.tv-to-up')
    expect(button.exists()).toBe(true)
    await button.trigger('click')
    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' })
  })

  it('resolves selector target and falls back to window when element is not scrollable', async () => {
    const target = document.createElement('div')
    target.className = 'custom-scroll'
    Object.defineProperty(target, 'scrollHeight', { configurable: true, value: 100 })
    Object.defineProperty(target, 'clientHeight', { configurable: true, value: 100 })
    document.body.appendChild(target)

    const addWindow = vi.spyOn(window, 'addEventListener')
    const removeWindow = vi.spyOn(window, 'removeEventListener')
    const wrapper = mount(ToUp, {
      props: {
        scrollTarget: '.custom-scroll',
      },
    })
    await nextTick()
    wrapper.unmount()

    expect(addWindow).toHaveBeenCalledWith('scroll', expect.any(Function), { passive: true })
    expect(removeWindow).toHaveBeenCalledWith('scroll', expect.any(Function))
    target.remove()
  })
})
