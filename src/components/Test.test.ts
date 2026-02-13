import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Test from './Test.vue'

describe('Test component', () => {
  it('renders variant text and slot content', () => {
    const wrapper = mount(Test, {
      props: {
        variant: 'custom',
      },
      slots: {
        default: '<p class="slot-content">Slot body</p>',
      },
    })

    expect(wrapper.text()).toContain('Test: custom')
    expect(wrapper.find('.slot-content').exists()).toBe(true)
  })

  it('emits all public events from action buttons', async () => {
    const wrapper = mount(Test)
    const buttons = wrapper.findAll('button.test-btn')

    await buttons[0]!.trigger('click')
    await buttons[1]!.trigger('click')
    await buttons[2]!.trigger('click')

    expect(wrapper.emitted('clickButton')?.[0]).toEqual([{ test: 1 }])
    expect(wrapper.emitted('clickLabel')?.[0]).toEqual(['label'])
    expect(wrapper.emitted('clickSecondaryButton')?.[0]).toEqual([])
  })
})
