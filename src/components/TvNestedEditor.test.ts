import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import TvNestedEditor from './TvNestedEditor.vue'

describe('TvNestedEditor', () => {
  it('emits string, number and boolean primitive updates', async () => {
    const stringWrapper = mount(TvNestedEditor, {
      props: { name: 'title', modelValue: 'hello' },
    })
    await stringWrapper.get('input[type="text"]').setValue('updated')
    expect(stringWrapper.emitted('update:modelValue')?.[0]).toEqual(['updated'])

    const numberWrapper = mount(TvNestedEditor, {
      props: { name: 'count', modelValue: 1 },
    })
    await numberWrapper.get('input[type="number"]').setValue('12')
    expect(numberWrapper.emitted('update:modelValue')?.[0]).toEqual([12])

    const boolWrapper = mount(TvNestedEditor, {
      props: { name: 'enabled', modelValue: false },
    })
    await boolWrapper.get('input[type="checkbox"]').setValue(true)
    expect(boolWrapper.emitted('update:modelValue')?.[0]).toEqual([true])
  })

  it('shows null state for null/undefined values', () => {
    const nullWrapper = mount(TvNestedEditor, {
      props: { name: 'nullable', modelValue: null },
    })
    expect(nullWrapper.find('.tv-nested-null').text()).toBe('null')

    const undefinedWrapper = mount(TvNestedEditor, {
      props: { name: 'unknown' },
    })
    expect(undefinedWrapper.find('.tv-nested-null').text()).toBe('null')
  })

  it('expands object values and emits merged updates from children', async () => {
    const wrapper = mount(TvNestedEditor, {
      props: {
        name: 'settings',
        modelValue: { a: 'one', b: 'two' },
      },
    })

    await wrapper.get('.tv-nested-header').trigger('click')
    const rows = wrapper.findAll('.tv-nested-row')
    const rowA = rows.find((row) => row.text().includes('a'))
    expect(rowA).toBeTruthy()
    await rowA!.get('input[type="text"]').setValue('changed')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([{ a: 'changed', b: 'two' }])
  })

  it('updates array values from nested child updates', async () => {
    const wrapper = mount(TvNestedEditor, {
      props: {
        name: 'items',
        modelValue: ['one', 'two'],
      },
    })

    await wrapper.get('.tv-nested-header').trigger('click')
    const inputs = wrapper.findAll('input[type="text"]')
    expect(inputs).toHaveLength(2)
    await inputs[1]!.setValue('updated-two')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['one', 'updated-two']])
  })
})
