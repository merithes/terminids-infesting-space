<template>
  <div
    class="map flex-row justify-center full-height gap-none"
    @wheel.prevent="handleZoom"
    :style="{
      '--svgScale': transform.scale,
      '--svgX': `${transform.x}%`,
      '--svgY': `${transform.y}%`,
    }"
  >
    <radio-svg-map
      class="sectors-map flex-grow"
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
            <g
              v-for="(planet, index) of planets"
              :key="index"
              @click.stop="() => togglePlanetSelected(planet)"
              class="planet"
              :class="[
                {
                  'focused-planet':
                    selectedSector === planet.sector.toLowerCase().replace(/\W/g, ''),
                },
                `planet-${planet.name.toLowerCase().replace(/\W/g, '-')}`,
              ]"
              :transform="`translate(${50 + planet.position.x * 49} ${50 + planet.position.y * -49})`"
              :data-sector="planet.sector"
            >
              <circle
                class="planet-icon"
                r=".2"
              />
              <text
                paint-order="stroke"
                class="planet-label"
                style="font-size: 0.5px"
                y=".2"
                line-j
                text-anchor="middle"
                dominant-baseline="hanging"
                >{{ planet.name }}</text
              >
            </g>
          </g>
        </g>
      </template>
    </radio-svg-map>
    <transition
      appear
      mode="out-in"
      name="planet-description"
      :duration="400"
    >
      <div
        v-if="selectedPlanet"
        class="planet-description-wrapper"
      >
        <div class="planet-description">
          <description-card
            :label="selectedPlanet.name"
            innerClass="flex-column"
          >
            <div class="flex-row align-stretch">
              <border-decorator height="unset"> </border-decorator>
              <div class="hd-py-xs hd-px-sm flex-column">
                <div class="text-h6 text-smallcaps">
                  <span class="text-grey-2">Biome: </span>{{ selectedPlanet.biome.name }}
                </div>
                <p class="test-body1">{{ selectedPlanet.biome.description }}</p>
              </div>
            </div>
            {{ selectedPlanet }}
          </description-card>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
  import { computed, defineComponent, nextTick, onMounted, reactive, ref, watch } from 'vue'
  import hdMap from '@/assets/map'
  import { RadioSvgMap } from '@/components/map/svgMap'
  import { usePlanetsStore } from '@/stores/planets'
  import type { Planet } from '@/interfaces'
  import { BorderDecorator, DescriptionCard } from '../atomics'

  interface SvgTransformMatrix {
    scale?: number
    x?: number
    y?: number
  }

  export default defineComponent({
    name: 'MapComponent',

    components: { RadioSvgMap, DescriptionCard, BorderDecorator },
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
        },
        selectedPlanet = ref<Planet>()

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

      const togglePlanetSelected = (planet: Planet | false) => {
        if (planet === false || planet.index === selectedPlanet.value?.index) {
          selectedPlanet.value = undefined
          return
        }
        selectedPlanet.value = planet
      }

      return {
        hdMap,
        svgMap,
        selectedSector,
        transform,
        handleZoom,
        planets: computed(() => planets.list),
        loading: computed(() => planets.loading),
        selectedPlanet,
        togglePlanetSelected,
      }
    },
  })
</script>

<style lang="scss">
  .map {
    position: relative;
    .sectors-map {
      max-width: 100%;
      max-height: 100%;
      * {
        transition: all 0.4s ease;
      }
      g {
        transform-origin: top left;
      }
      &.sector-selected {
        path:not([aria-checked='true']) {
          stroke: #fff2;
        }
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
          cursor: default;
        }
      }
      .planets-map {
        // pointer-events: none;
        position: absolute;
        top: 0;
        bottom: 0;
        right: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z2 * {
          transition: all 0.4s ease;
        }
        g {
          transform-origin: top left;
        }
        &.container {
          transform: translate(50%, 50%);
          .wrapper {
            transform: scale(var(--svgScale)) translate(var(--svgX), var(--svgY));
            .planet {
              pointer-events: none;
              .planet-icon {
                stroke: transparent;
                stroke-width: 0;
              }
              .planet-label {
                opacity: 0;
                stroke: #000b;
                stroke-width: 0.1px;
                fill: white;
                font-family: 'FS Sinclair';
                transition: all 0.2s ease;
                cursor: pointer;
              }
            }
          }
        }
      }
      &.sector-selected .planets-map.container {
        pointer-events: unset;
        .wrapper {
          .planet {
            fill: #0000;
            transition: all 0.2s ease;
          }
          .focused-planet {
            transition: ease 0.4s;
            fill: #fff8;
            pointer-events: unset;
            .planet-label {
              transition: all 0.4s ease 0.3s;
              opacity: 1;
            }
          }
        }
      }
    }
    .planet-description-wrapper {
      overflow-x: hidden;
      width: 500px;
      &.planet-description-enter-active,
      &.planet-description-leave-active {
        transition: all 0.25s ease;
      }

      &.planet-description-leave-to,
      &.planet-description-enter-from {
        width: 0;
        opacity: 0;
      }

      .planet-description {
        width: 500px;
        padding: map-get($sizes, md);
      }
    }
  }
</style>
