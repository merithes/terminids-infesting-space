<template>
  <svg-map
    ref="svgMap"
    :map="map"
    role="radiogroup"
    location-role="radio"
    :location-tabindex="getLocationTabindex"
    :selected-location="modelValue"
    @click.stop="(event: Event) => selectLocation(event.target as HTMLElement)"
    @keydown.space.prevent.stop="toggleLocation"
    @keydown.down.prevent.stop="selectNextLocation"
    @keydown.right.prevent.stop="selectNextLocation"
    @keydown.up.prevent.stop="selectPreviousLocation"
    @keydown.left.prevent.stop="selectPreviousLocation"
    :active-location-attributes="activeLocationAttributes"
    :location-attributes="locationAttributes"
    :svgClass="svgClass"
    :location-class="locationClass"
  >
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
  import { computed, ref, watch } from 'vue'
  import { default as SvgMap, type Map, type Location } from './svg-map.vue'

  export default {
    name: 'RadioSvgMap',
    components: {
      SvgMap,
    },
    props: {
      toggle: Boolean,
      map: {
        type: Object as () => Map,
        required: true,
      },
      svgClass: {},
      modelValue: String as () => string | undefined,
      locationClass: {
        type: [String, Function] as unknown as () => string | ((a: Location, b: number) => string),
        default: null,
      },
      locationTabindex: {
        type: [String, Function] as unknown as () => string | ((a: Location, b: number) => string),
        default: null,
      },
      activeLocationAttributes: [Object, Function] as unknown as () =>
        | { [key: string]: unknown }
        | ((a: Location, b: number) => { [key: string]: unknown }),
      locationAttributes: [Object, Function] as unknown as () =>
        | { [key: string]: unknown }
        | ((a: Location, b: number) => { [key: string]: unknown }),
    },
    emits: ['update:modelValue'],
    setup(props, { emit }) {
      const svgMap = ref<InstanceType<typeof SvgMap>>(),
        value = ref<string | undefined>(props.modelValue)

      watch(value, newVal => emit('update:modelValue', newVal))
      watch(
        () => props.modelValue,
        newVal => (value.value = newVal)
      )

      return {
        locations: computed(() => svgMap.value?.svg?.querySelectorAll('path') ?? []),
        svgMap,
        svg: computed(() => (svgMap.value ? svgMap.value.svg : '')),
        value,
      }
    },
    methods: {
      /**
       * Get tabindex value of a location
       *
       * @param {Object} location - Location object
       * @param {number} index - Index of location
       * @returns {string} Value of tabindex HTML attribute
       */
      getLocationTabindex(location: Location, index: number) {
        if (!this.value) return this.isLocationSelected(location) ? '0' : '-1'
        return index === 0 ? '0' : '-1'
      },

      /**
       * Indicate whether a location is selected
       *
       * @param {Object} location - Location object
       * @returns {boolean} True if the location is selected
       */
      isLocationSelected(location: Location) {
        return this.value === location.id
      },

      /**
       * Select a location
       *
       * @param {Node} location - DOM node of location to select
       */
      selectLocation(location: HTMLElement & Node, doToggle = true, doFocus = false) {
        if (
          (this.svgMap?.wrapperGroup && this.svgMap?.wrapperGroup === location) ||
          (this.svgMap?.containerGroup && this.svgMap?.containerGroup === location)
        )
          return
        if (!location.id.length) {
          this.value = undefined
        }
        if (location?.id !== this.value) {
          if (doFocus) location.focus()
          this.value = location.id
        } else if (doToggle && this.toggle) {
          this.value = undefined
        }
      },

      /**
       * Select focused location if not already selected
       *
       * @param {Event} event - Triggered event
       */
      toggleLocation(event: Event) {
        const focusedLocation = event.target as HTMLElement

        this.selectLocation(focusedLocation)
      },

      /**
       * Select next or first location
       *
       * @param {Event} event - Triggered event
       */
      selectNextLocation(event: Event) {
        // Next sibling can be anything in `after` slot
        const nextSibling = (event?.target as HTMLElement)?.nextSibling
        const nextLocation =
          nextSibling && nextSibling.nodeName === 'path' ? nextSibling : this.locations[0]

        this.selectLocation(nextLocation as HTMLElement & Node, false, true)
      },

      /**
       * Select previous or last location
       *
       * @param {Event} event - Triggered event
       */
      selectPreviousLocation(event: Event) {
        // Previous sibling can be anything in `before` slot
        const previousSibling = (event?.target as HTMLElement).previousSibling
        const previousLocation =
          previousSibling && previousSibling.nodeName === 'path'
            ? previousSibling
            : (this.locations[this.locations.length - 1] as unknown as Node)

        this.selectLocation(previousLocation as HTMLElement & Node, false, true)
      },
    },
  }
</script>
