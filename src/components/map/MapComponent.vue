<template>
  <div
    class="map flex-row justify-center full-height"
    @wheel.prevent="handleZoom"
    :style="{
      '--svgScale': transform.scale,
      '--svgX': `${transform.x}%`,
      '--svgY': `${transform.y}%`,
    }"
  >
    <radio-svg-map
      class="sectors-map full-width"
      ref="svgMap"
      v-model="selectedSector"
      :map="hdMap"
      toggle
      :location-attributes="{ 'vector-effect': 'non-scaling-stroke' }"
      :class="{ 'sector-selected': selectedSector }"
    >
      <template #after>
        <g class="container planets-map">
          <g class="wrapper">
            <circle
              v-for="(planet, index) of planets"
              :key="index"
              @click.stop="console.log(planet)"
              r=".5"
              :cx="50 + planet.position.x * 49"
              :cy="50 + planet.position.y * -49"
              fill="red"
            />
          </g>
        </g>
      </template>
    </radio-svg-map>
  </div>
</template>

<script lang="ts">
  import { computed, defineComponent, nextTick, onMounted, reactive, ref, watch } from 'vue'
  import hdMap from '@/assets/map'
  import { RadioSvgMap } from '@/components/map/svgMap'
  import { usePlanetsStore } from '@/stores/planets'

  interface SvgTransformMatrix {
    scale?: number
    x?: number
    y?: number
  }

  export default defineComponent({
    name: 'MapComponent',

    components: { RadioSvgMap },
    setup() {
      const selectedSector = ref(),
        svgMap = ref<InstanceType<typeof RadioSvgMap>>(),
        transform = reactive<SvgTransformMatrix>({
          scale: 1,
          x: -50,
          y: -50,
        }),
        targetTransform = {
          sizeX: 90,
          sizeY: 90,
          posX: 50,
          posY: 50,
        }

      const focusSector = (sector: string): void => {
        if (!sector) {
          Object.assign(transform, {
            scale: 1,
            x: -50,
            y: -50,
          })
          return
        }
        const sectorPath = svgMap.value?.svgMap?.containerGroup?.querySelector(
            `#${sector}`
          ) as SVGGraphicsElement,
          boundaries = sectorPath?.getBBox(),
          scale = Math.min(
            targetTransform.sizeX / boundaries.width,
            targetTransform.sizeY / boundaries.height
          ),
          transformAfterScale = {
            x: -boundaries.x - boundaries.width / 2,
            y: -boundaries.y - boundaries.height / 2,
          }
        Object.assign(transform, { scale }, transformAfterScale)
      }

      watch(selectedSector, focusSector)
      onMounted(() => nextTick().then(() => focusSector(selectedSector.value)))

      const handleZoom = (event: WheelEvent) => {
        if (!event.target) return

        const { deltaY: direction, clientX: pointerX, clientY: pointerY } = event,
          { innerWidth: width, innerHeight: height } = window,
          newTransform = {
            x: transform.x ?? -50,
            y: transform.y ?? -50,
            scale: transform.scale ?? 1,
          }

        if (direction > 0) newTransform.scale /= 1.1
        if (direction < 0) newTransform.scale *= 1.1

        newTransform.x += ((pointerX - width / 2) / width) * (direction > 0 ? 1 : -1)
        newTransform.y += ((pointerY - height / 2) / height) * (direction > 0 ? 1 : -1)

        Object.assign(transform, newTransform)
      }

      const planets = usePlanetsStore()

      if (planets.needsFetching) planets.fetch()

      return {
        hdMap,
        svgMap,
        selectedSector,
        transform,
        handleZoom,
        planets: computed(() => planets.list),
        loading: computed(() => planets.loading),
      }
    },
  })
</script>

<style lang="scss">
  .map {
    position: relative;
    .sector-selected {
      path:not([aria-checked='true']) {
        stroke: #fff2;
      }
    }
    .sectors-map {
      max-width: 100%;
      max-height: 100%;
      * {
        transition: all 0.4s ease;
      }
      g {
        transform-origin: top left;
      }
      .container {
        transform: translate(50%, 50%);
        .wrapper {
          transform: scale(var(--svgScale)) translate(var(--svgX), var(--svgY));
        }
      }
      path {
        stroke: $grey-5;
        stroke-width: 3px;
        fill: #0005;
        cursor: pointer;
        &:focus-visible,
        &:focus {
          outline: 0;
        }
        &[aria-checked='true'] {
          stroke: $primary;
          stroke-width: 5px;
        }
      }
    }
    .planets-map {
      pointer-events: none;
      position: absolute;
      top: 0;
      bottom: 0;
      right: 0;
      left: 0;
      width: 100%;
      height: 100%;
      * {
        transition: all 0.4s ease;
      }
      g {
        transform-origin: top left;
      }
      .container {
        transform: translate(50%, 50%);
        .wrapper {
          transform: scale(var(--svgScale)) translate(var(--svgX), var(--svgY));
        }
      }
    }
    .sector-selected .planets-map {
      pointer-events: unset;
    }
  }
</style>
