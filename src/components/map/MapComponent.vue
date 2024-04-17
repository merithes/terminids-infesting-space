<template>
  <div
    class="map flex-row flex-grow full-height"
    @wheel.prevent="handleZoom"
    :style="{
      '--svgScale': transform.scale,
      '--svgX': `${transform.x}%`,
      '--svgY': `${transform.y}%`,
    }"
  >
    <radio-svg-map
      :svgClass="[{ 'sector-selected': selectedSector }, 'sectors-map flex-grow']"
      ref="svgMap"
      v-model="selectedSector"
      :map="hdMap"
      toggle
      :location-attributes="
        sector => ({
          'vector-effect': 'non-scaling-stroke',
          'style':
            sectorOwner[sector.id as string] === 'humans'
              ? ''
              : `--owner-color: var(--${sectorOwner[(sector.id as string).replace(/\W/g, '').toLowerCase()]})`,
        })
      "
      location-class="sector"
    >
      <template
        #after
        v-if="planets"
      >
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
              :style="`--owner-color: var(--${planetOwner(planet)})`"
            >
              <circle
                class="planet-icon"
                r=".2"
              />
              <text
                paint-order="stroke"
                class="planet-label"
                y=".2"
                text-anchor="middle"
                dominant-baseline="hanging"
                >{{ planet.name }}</text
              >
              <text
                v-if="percentLiberated(planet) !== 100"
                paint-order="stroke"
                class="planet-liberated"
                y=".7"
                x="0"
                text-anchor="middle"
                dominant-baseline="hanging"
                >{{ percentLiberated(planet).toFixed(2) }}% liberated</text
              >
            </g>
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
  import type { Planet } from '@/interfaces'

  interface SvgTransformMatrix {
    scale?: number
    x?: number
    y?: number
  }

  export default defineComponent({
    name: 'MapComponent',
    components: { RadioSvgMap },
    props: {
      modelValue: {
        type: Number,
      },
      planets: Array as () => Planet[],
    },
    setup(props, { emit }) {
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
        selectedPlanet = ref<number | undefined>(props.modelValue)

      watch(
        () => props.modelValue,
        newVal => (selectedPlanet.value = newVal)
      )
      watch(selectedPlanet, newVal => emit('update:modelValue', newVal ?? undefined))

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

      const togglePlanetSelected = (planet: Planet | false) => {
        if (planet === false || planet.index === selectedPlanet.value) {
          selectedPlanet.value = undefined
          return
        }
        selectedPlanet.value = planet.index
      }

      const planetOwner = (planet: Planet) =>
        (
          (planet?.currentOwner === 'Automaton' ? 'Automatons' : planet?.currentOwner) ?? ''
        ).toLowerCase()

      return {
        hdMap,
        svgMap,
        selectedSector,
        transform,
        handleZoom,
        selectedPlanet,
        togglePlanetSelected,
        planetOwner,
        percentLiberated: (planet: Planet) =>
          planet?.currentOwner === 'Humans'
            ? 100
            : ((planet.maxHealth - planet.health) / planet.maxHealth) * 100,
        sectorOwner: computed(() => {
          const sectors = (props.planets ?? [])?.reduce(
            (a, current): { [key: string]: string } => {
              const sectorSanitized = current.sector.toLowerCase().replace(/\W/g, ''),
                owner = planetOwner(current).toLowerCase()
              if (typeof a[sectorSanitized] !== 'undefined' && a[sectorSanitized] !== 'humans')
                return a

              a[sectorSanitized] = owner
              return a
            },
            {} as { [key: string]: string }
          )

          return sectors
        }),
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
          --owner-color: #fff2;
        }
      }
      .container {
        transform: translate(50%, 50%);
        .wrapper {
          transform: scale(var(--svgScale)) translate(var(--svgX), var(--svgY));
        }
      }
      .sector {
        --owner-color: #{$grey-5};
        stroke: var(--owner-color);
        stroke-width: 3px;
        fill-opacity: 0.1;
        cursor: pointer;
        &:focus-visible,
        &:focus {
          outline: 0;
        }
        &[aria-checked='true'] {
          stroke-width: 15px;
          cursor: default;
          fill-opacity: 0.2;
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
                fill: transparent;
              }
              .planet-label {
                opacity: 0;
                stroke: #000b;
                stroke-width: 0.1px;
                fill: white;
                font-family: 'FS Sinclair';
                transition:
                  opacity 0.2s ease,
                  font-size 0.4s ease;
                cursor: pointer;
                font-size: min(0.5px, max(0.2px, calc(5px / var(--svgScale))));
              }
              .planet-liberated {
                stroke: #000b;
                stroke-width: 0.1px;
                opacity: 0;
                fill: white;
                cursor: pointer;
                font-size: min(0.3px, max(0.15px, calc(3px / var(--svgScale))));
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
            pointer-events: unset;
            .planet-icon {
              fill: var(--owner-color);
            }
            .planet-label {
              transition:
                opacity 0.4s ease 0.3s,
                font-size 0.4s ease;
              opacity: 1;
              stroke-miterlimit: 2;
            }
            .planet-liberated {
              transition:
                opacity 0.4s ease 0.3s,
                font-size 0.4s ease;
              opacity: 1;
            }
          }
        }
      }
    }
  }
</style>
