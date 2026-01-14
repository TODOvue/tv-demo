<script setup>
import { computed, ref } from 'vue';

const props = defineProps({
  modelValue: {
    type: [Object, Array, String, Number, Boolean, null],
    default: undefined
  },
  name: {
    type: [String, Number],
    required: true
  },
  depth: {
    type: Number,
    default: 0
  }
});

const emit = defineEmits(['update:modelValue']);

const isOpen = ref(false);

const type = computed(() => {
  if (props.modelValue === null) return 'null';
  if (Array.isArray(props.modelValue)) return 'array';
  return typeof props.modelValue;
});

const isPrimitive = computed(() => {
  return ['string', 'number', 'boolean', 'null', 'undefined'].includes(type.value);
});

const toggle = () => {
  if (!isPrimitive.value) {
    isOpen.value = !isOpen.value;
  }
};

const updateValue = (value) => {
  emit('update:modelValue', value);
};

const onChildUpdate = (key, value) => {
  const newValue = Array.isArray(props.modelValue)
    ? [...props.modelValue]
    : { ...props.modelValue };
  newValue[key] = value;
  emit('update:modelValue', newValue);
};

const parseJson = (e) => {
  try {
    const val = JSON.parse(e.target.value);
    emit('update:modelValue', val);
  } catch (err) {
    console.error(err)
  }
};
</script>

<template>
  <div class="tv-nested-editor" :class="{ 'is-root': depth === 0 }">
    <div v-if="isPrimitive" class="tv-nested-row">
      <span class="tv-nested-label" :title="String(name)">{{ name }}</span>
      <div class="tv-nested-input-wrapper">
        <label v-if="type === 'boolean'" class="switch small">
          <input
            type="checkbox"
            :checked="modelValue"
            @change="updateValue($event.target.checked)"
          />
          <span class="slider round"></span>
        </label>

        <input
          v-else-if="type === 'number'"
          type="number"
          :value="modelValue"
          @input="updateValue(Number($event.target.value))"
          class="tv-demo-input"
        />

        <input
          v-else-if="type === 'string'"
          type="text"
          :value="modelValue"
          @input="updateValue($event.target.value)"
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
          <span class="tv-nested-type">{{ type === 'array' ? `Array[${modelValue.length}]` : 'Object' }}</span>
        </span>
      </div>

      <div v-if="isOpen" class="tv-nested-children">
        <TvNestedEditor
          v-for="(value, key) in modelValue"
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
