<template>
  <svg-map
    ref="svgMap"
    :map="map"
    role="group"
    location-role="checkbox"
    location-tabindex="0"
    @click.stop="toggleLocation"
    @keydown.prevent.space="toggleLocation"
    :selected-location="modelValue"
    :active-location-attributes="activeLocationAttributes"
    :location-attributes="locationAttributes"
  >
    <!-- Pass down slots to SvgMap: https://stackoverflow.com/a/50892881/9826498 -->
    <template
      v-for="(_, slotName) of $slots"
      v-slot:[slotName]="scope"
    >
      <slot
        v-bind="scope"
        :name="slotName"
      ></slot>
    </template>
  </svg-map>
</template>

<script lang="ts">
  import { computed, defineComponent, ref, watch } from 'vue'
  import { default as SvgMap, type Map, type Location } from './svg-map.vue'

  export default defineComponent({
    name: 'CheckboxSvgMap',
    components: {
      SvgMap,
    },
    model: {
      event: 'change',
    },
    props: {
      // Ids of selected locations (used for v-model)
      modelValue: {
        type: Array as () => string[],
        required: true,
      },
      map: {
        type: Object as () => Map,
        required: true,
      },
      activeLocationAttributes: [Object, Function] as unknown as () =>
        | { [key: string]: unknown }
        | ((a: Location, b: number) => { [key: string]: unknown }),
      locationAttributes: [Object, Function] as unknown as () =>
        | { [key: string]: unknown }
        | ((a: Location, b: number) => { [key: string]: unknown }),
    },
    setup(props, { emit }) {
      const svgMap = ref<InstanceType<typeof SvgMap>>(),
        value = ref<string[]>(props.modelValue)

      watch(value, newVal => emit('update:modelValue', newVal))
      watch(
        () => props.modelValue,
        newVal => value.value.splice(0, value.value.length, ...newVal)
      )
      return {
        locations: computed(() => svgMap.value?.svg?.querySelectorAll('path') ?? []),
        svgMap,
        value,
      }
    },
    methods: {
      isLocationSelected(location: Location) {
        return Array.isArray(this.value) && this.value?.includes(location.id as string)
      },

      selectLocation(location: HTMLElement & Node, doFocus = false) {
        if (!Array.isArray(this.value)) {
          this.value = [location.id]
          return
        }
        if (!this.value.includes(location.id)) {
          if (doFocus) location.focus()
          this.value.push(location.id)
        } else this.value.splice(this.value.indexOf(location.id), 1)
      },

      toggleLocation(event: Event) {
        const focusedLocation = event.target as HTMLElement

        this.selectLocation(focusedLocation)
      },
    },
  })
</script>
