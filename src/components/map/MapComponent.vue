<template>
  <div
    class="map flex-row justify-center full-height"
    @wheel.prevent="handleZoom"
  >
    <radio-svg-map
      ref="svgMap"
      v-model="selectedSector"
      :map="hdMap"
      toggle
      :location-attributes="{ 'vector-effect': 'non-scaling-stroke' }"
      @vue:mounted="handleMounted"
      class="full-width"
      :class="{ 'sector-selected': selectedSector }"
    />
  </div>
</template>

<script lang="ts">
  import { defineComponent, nextTick, onMounted, reactive, ref, watch } from 'vue'
  import hdMap from '@/assets/map'
  import { RadioSvgMap } from '@/components/map/svgMap'

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
          scale: undefined,
          x: undefined,
          y: undefined,
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

      watch(
        transform,
        (newVal): void => {
          const pathGroup = svgMap.value?.svgMap?.wrapperGroup

          if (!pathGroup) return

          pathGroup.style.transform = `scale(${newVal.scale}) translate(${newVal.x}%, ${newVal.y}%)`
        },
        { deep: true }
      )

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

      const handleMounted = () => {
        nextTick().then(() => {
          if (!svgMap.value?.svgMap?.containerGroup || !svgMap.value?.svgMap?.wrapperGroup) return
          svgMap.value.svgMap.containerGroup.style.transform = 'translate(50%, 50%)'
          svgMap.value.svgMap.wrapperGroup.style.transform = 'translate(-50%, -50%)'
        })
      }

      return {
        hdMap,
        svgMap,
        selectedSector,
        transform,
        handleMounted,
        handleZoom,
      }
    },
  })
</script>

<style lang="scss">
  .map {
    .sector-selected {
      path:not([aria-checked='true']) {
        stroke: #fff2;
      }
    }
    svg {
      max-width: 100%;
      max-height: 100%;
      * {
        transition: all 0.4s ease;
      }
      g {
        transform-origin: top left;
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
        }
      }
    }
  }
</style>
