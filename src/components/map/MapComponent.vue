<template>
  <div class="map flex-row justify-center full-height">
    <radio-svg-map
      :map="hdMap"
      ref="svgMap"
      v-model="selectedSector"
      :location-attributes="{ 'vector-effect': 'non-scaling-stroke' }"
      toggle
      :class="{ 'sector-selected': selectedSector }"
      @vue:mounted="handleMounted"
    />
  </div>
</template>

<script lang="ts">
  import { defineComponent, nextTick, reactive, ref, watch } from 'vue'
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

      watch(selectedSector, (newVal): void => {
        if (!newVal) {
          Object.assign(transform, {
            scale: undefined,
            x: undefined,
            y: undefined,
          })
          return
        }
        const sectorPath = svgMap.value?.svgMap?.containerGroup?.querySelector(
            `#${newVal}`
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
      })

      watch(
        transform,
        (newVal): void => {
          const isFilled = !Object.keys(transform).some(
              e => typeof newVal[e as string as keyof SvgTransformMatrix] === 'undefined'
            ),
            pathGroup = svgMap.value?.svgMap?.wrapperGroup

          if (!pathGroup) return
          if (!isFilled) pathGroup.style.transform = 'translate(-50%, -50%)'

          if (isFilled) {
            pathGroup.style.transform = `scale(${newVal.scale}) translate(${newVal.x}%, ${newVal.y}%)`
          }
        },
        { deep: true }
      )

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
        fill: #0000;
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
