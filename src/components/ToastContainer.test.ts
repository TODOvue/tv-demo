import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import { describe, expect, it } from 'vitest'
import ToastContainer from './ToastContainer.vue'

describe('ToastContainer', () => {
  it('renders all toasts and re-emits removeToast from child notifications', async () => {
    const wrapper = mount(ToastContainer, {
      props: {
        toasts: [
          { id: 'a', message: 'A', type: 'success', duration: 1000 },
          { id: 'b', message: 'B', type: 'error', duration: 1000 },
        ],
      },
      global: {
        stubs: {
          ToastNotification: defineComponent({
            props: {
              id: { type: String, required: true },
              message: { type: String, required: true },
            },
            emits: ['remove'],
            template:
              '<button class="toast-mock" @click="$emit(\'remove\', id)">{{ message }}</button>',
          }),
        },
      },
    })

    const items = wrapper.findAll('.toast-mock')
    expect(items).toHaveLength(2)
    expect(items[0]?.text()).toBe('A')
    expect(items[1]?.text()).toBe('B')

    await items[1]!.trigger('click')
    expect(wrapper.emitted('removeToast')?.[0]).toEqual(['b'])
  })
})
