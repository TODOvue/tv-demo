<script setup lang="ts">
import { computed, ref } from 'vue'
import type {
  NestedValue,
  TvNestedEditorEmits,
  TvNestedEditorProps,
} from '../types/components'

const props = withDefaults(defineProps<TvNestedEditorProps>(), {
  modelValue: undefined,
  depth: 0,
})

const emit = defineEmits<TvNestedEditorEmits>()

const isOpen = ref(false)

type NestedValueType = 'string' | 'number' | 'boolean' | 'null' | 'undefined' | 'array' | 'object'

const type = computed<NestedValueType>(() => {
  if (props.modelValue === null) return 'null'
  if (Array.isArray(props.modelValue)) return 'array'
  const rawType = typeof props.modelValue
  return rawType === 'object' ? 'object' : (rawType as NestedValueType)
})

const isPrimitive = computed(() => ['string', 'number', 'boolean', 'null', 'undefined'].includes(type.value))

const toggle = () => {
  if (!isPrimitive.value) {
    isOpen.value = !isOpen.value
  }
}

const updateValue = (value: NestedValue) => {
  emit('update:modelValue', value)
}

const onBooleanChange = (event: Event) => {
  const target = event.target as HTMLInputElement | null
  updateValue(Boolean(target?.checked))
}

const onNumberInput = (event: Event) => {
  const target = event.target as HTMLInputElement | null
  updateValue(Number(target?.value ?? 0))
}

const onTextInput = (event: Event) => {
  const target = event.target as HTMLInputElement | null
  updateValue(target?.value ?? '')
}

const onChildUpdate = (key: string | number, value: NestedValue) => {
  if (Array.isArray(props.modelValue)) {
    const nextValue = [...props.modelValue]
    nextValue[Number(key)] = value
    emit('update:modelValue', nextValue)
    return
  }

  const baseObject =
    props.modelValue && typeof props.modelValue === 'object' ? props.modelValue : {}
  emit('update:modelValue', { ...(baseObject as Record<string, NestedValue>), [String(key)]: value })
}

const complexModel = computed<NestedValue[] | Record<string, NestedValue>>(() => {
  if (Array.isArray(props.modelValue)) {
    return props.modelValue
  }
  if (props.modelValue && typeof props.modelValue === 'object') {
    return props.modelValue as Record<string, NestedValue>
  }
  return []
})

const modelArrayLength = computed(() => (Array.isArray(complexModel.value) ? complexModel.value.length : 0))
</script>

<template>
  <div class="tv-nested-editor" :class="{ 'is-root': depth === 0 }">
    <div v-if="isPrimitive" class="tv-nested-row">
      <span class="tv-nested-label" :title="String(name)">{{ name }}</span>
      <div class="tv-nested-input-wrapper">
        <label v-if="type === 'boolean'" class="switch small">
          <input
            type="checkbox"
            :checked="Boolean(modelValue)"
            @change="onBooleanChange"
          />
          <span class="slider round"></span>
        </label>

        <input
          v-else-if="type === 'number'"
          type="number"
          :value="modelValue"
          @input="onNumberInput"
          class="tv-demo-input"
        />

        <input
          v-else-if="type === 'string'"
          type="text"
          :value="modelValue"
          @input="onTextInput"
          class="tv-demo-input"
        />

        <span v-else class="tv-nested-null">null</span>
      </div>
    </div>
    <div v-else class="tv-nested-complex">
      <div
        class="tv-nested-header"
        @click="toggle"
        :class="{ 'is-open': isOpen }"
      >
        <span class="tv-nested-arrow">▶</span>
        <span class="tv-nested-label">
          {{ name }}
          <span class="tv-nested-type">{{ type === 'array' ? `Array[${modelArrayLength}]` : 'Object' }}</span>
        </span>
      </div>

      <div v-if="isOpen" class="tv-nested-children">
        <TvNestedEditor
          v-for="(value, key) in complexModel"
          :key="key"
          :name="key"
          :model-value="value"
          :depth="depth + 1"
          @update:modelValue="onChildUpdate(key, $event)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
