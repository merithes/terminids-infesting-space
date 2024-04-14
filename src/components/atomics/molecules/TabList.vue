<template>
  <div
    class="tab-list"
    :style="{ '--tab-list-length': options?.length ?? 0 }"
  >
    <template
      v-for="({ label, value, disabled, to }, index) of options"
      :key="index"
    >
      <tab-item
        v-model="innerValue"
        :label="label"
        :value="value"
        :disabled="disabled"
        :nth="index + 1"
        :active="to ? isCurrentPath(to) : isEqual(value, innerValue)"
        @click="() => (to ? null : (innerValue = value))"
        :to="to"
        class="full-width"
      />
    </template>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, watch } from 'vue'
  import { TabItem } from '@/components/atomics'
  import isEqual from 'lodash.isequal'

  interface TabOption {
    value?: unknown
    label: string
    disabled?: boolean | undefined
    to?: string
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

      return { innerValue, isEqual }
    },
    methods: {
      isCurrentPath: function (path: string) {
        return this.$route.path === path
      },
    },
  })
</script>

<style scoped lang="scss">
  .tab-list {
    display: grid;
    grid-template-columns: repeat(var(--tab-list-length), 1fr);
    grid-auto-rows: min-content;
    align-content: start;

    grid-column-gap: map-get($sizes, sm);
  }
</style>
