<template>
  <div class="tab-list">
    <template
      v-for="({ label, value, disabled }, index) of options"
      :key="index"
    >
      <div class="tab-item-wrapper-col">
        <tab-item
          v-model="innerValue"
          :label="label"
          :value="value"
          :disabled="disabled"
          :nth="index + 1"
          class="full-width"
        />
      </div>
    </template>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, watch } from 'vue'
  import { TabItem } from '@/components/atomics'

  interface TabOption {
    value: unknown
    label: string
    disabled?: boolean | undefined
  }

  export default defineComponent({
    name: 'TabList',
    props: {
      modelValue: null as unknown as () => unknown,
      options: {
        type: Array as () => TabOption[],
      },
    },
    components: { TabItem },
    emits: ['update:modelValue'],
    setup(props, { emit }) {
      const innerValue = ref(props.modelValue)

      watch(
        () => props.modelValue,
        newVal => (innerValue.value = newVal)
      )
      watch(innerValue, newVal => emit('update:modelValue', newVal))

      return { innerValue }
    },
  })
</script>

<style scoped lang="scss">
  .tab-list {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-auto-rows: min-content;
    align-content: start;

    grid-column-gap: map-get($sizes, sm);
  }
</style>
