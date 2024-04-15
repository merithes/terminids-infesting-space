<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :viewBox="map.viewBox"
    :aria-label="map.label"
    class="svg-map"
    ref="svg"
    vector-effect="non-scaling-stroke"
  >
    <slot name="before" />
    <g
      ref="containerGroup"
      class="container"
    >
      <g
        ref="wrapperGroup"
        class="wrapper"
      >
        <path
          v-for="(location, index) in map.locations"
          :id="location.id"
          :key="location.id"
          :name="location.name"
          :d="location.path"
          class="svg-map__location"
          :class="
            typeof locationClass == 'function' ? locationClass(location, index) : locationClass
          "
          :tabindex="
            typeof locationTabindex == 'function'
              ? locationTabindex(location, index)
              : locationTabindex
          "
          :role="locationRole"
          :aria-label="location.name"
          :aria-checked="isSelected(location.id as string)"
          v-bind="{
            ...$attrs,
            ...getLocationCustomProperties(location),
            ...(isSelected(location.id as string) ? activeAttributes(location, index) : {}),
            ...globalAttributes(location, index),
          }"
        />
      </g>
    </g>
    <slot name="after" />
  </svg>
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue'

  const LOCATION_DEFAULT_PROPERTIES = ['id', 'name', 'path']

  export interface Location {
    path: string
    id?: string
    name?: string
  }
  export interface Map {
    label: string
    viewBox: string
    locations: Location[]
  }

  export default defineComponent({
    name: 'SvgMap',
    props: {
      map: {
        type: Object as () => Map,
        required: true,
      },
      locationClass: {
        type: [String, Function] as unknown as () => string | ((a: Location, b: number) => string),
      },
      locationTabindex: {
        type: [String, Function] as unknown as () => string | ((a: Location, b: number) => string),
      },
      locationRole: {
        type: String,
        default: null,
      },
      selectedLocation: {
        type: [String, Array] as unknown as () => string[] | string,
      },
      activeLocationAttributes: [Object, Function] as unknown as () =>
        | { [key: string]: unknown }
        | ((a: Location, b: number) => { [key: string]: unknown }),
      locationAttributes: [Object, Function] as unknown as () =>
        | { [key: string]: unknown }
        | ((a: Location, b: number) => { [key: string]: unknown }),
    },
    setup() {
      return {
        svg: ref<HTMLElement & SVGElement>(),
        containerGroup: ref<SVGGElement & Node & HTMLElement>(),
        wrapperGroup: ref<SVGGElement & Node & HTMLElement>(),
      }
    },
    methods: {
      isSelected(locationId: string) {
        if (Array.isArray(this.selectedLocation)) return this.selectedLocation.includes(locationId)

        return this.selectedLocation === locationId
      },
      activeAttributes(location: Location, index: number): { [key: string]: unknown } | undefined {
        return typeof this.activeLocationAttributes === 'function'
          ? this.activeLocationAttributes(location, index)
          : (this.activeLocationAttributes as { [key: string]: unknown })
      },
      globalAttributes(location: Location, index: number): { [key: string]: unknown } | undefined {
        return typeof this.locationAttributes === 'function'
          ? this.locationAttributes(location, index)
          : (this.locationAttributes as { [key: string]: unknown })
      },
      /**
       * Get custom properties of a location to add custom attributes to <path>
       *
       * @param {Object} location - Location to parse
       * @returns {Object} Custom properties
       */
      getLocationCustomProperties(location: Location) {
        // Filter default properties to avoid invalid/duplicated attributes
        return Object.fromEntries(
          Object.entries(location).filter(([key]) => !LOCATION_DEFAULT_PROPERTIES.includes(key))
        )
      },
    },
  })
</script>
