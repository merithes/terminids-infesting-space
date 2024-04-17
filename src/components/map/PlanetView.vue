<template>
  <div class="planet-description-wrapper">
    <div class="planet-description">
      <description-card
        :label="sectorName + ' sector'"
        innerClass="flex-column"
        outline-color="primary"
      >
        <striped-block
          color="grey-11"
          class="text-h4 flex-row items-center justify-center"
        >
          <span class="text-primary text-capitalize text-smallcaps">
            {{ value.name }}
          </span>
        </striped-block>
        <div>
          <progress-bar
            :value="percentLiberated"
            :from="(planetCurrentOwner as string).toLowerCase()"
          />
          <div class="hd-mt-md text-center text-h6 text-uppercase text-thin">
            {{ percentLiberated.toFixed(5) }}% liberated
          </div>
        </div>
        <div class="flex-row align-stretch">
          <border-decorator height="unset"> </border-decorator>
          <div class="hd-py-xs hd-px-sm flex-column">
            <div class="text-h6 text-smallcaps">
              <span class="text-grey-2">Biome: </span>{{ value.biome.name }}
            </div>
            <p class="test-body1">{{ value.biome.description }}</p>
          </div>
        </div>
        {{ value }}
      </description-card>
    </div>
  </div>
</template>
<script lang="ts">
  import type { Planet } from '@/interfaces/planets'
  import { computed, defineComponent } from 'vue'
  import { BorderDecorator, DescriptionCard, ProgressBar, StripedBlock } from '@/components/atomics'

  export default defineComponent({
    name: 'PlanetView',
    components: { DescriptionCard, BorderDecorator, StripedBlock, ProgressBar },
    props: {
      value: {
        type: Object as () => Planet,
        required: true,
      },
    },
    setup(props) {
      return {
        sectorName: computed(() =>
          (props.value.sector as string) === "Le'strade" ? "L'estrade" : props.value.sector
        ),
        planetCurrentOwner: computed(() =>
          props.value?.currentOwner === 'Automaton' ? 'Automatons' : props.value?.currentOwner
        ),
        percentLiberated: computed(() =>
          props.value?.currentOwner === 'Humans'
            ? 100
            : ((props.value.maxHealth - props.value.health) / props.value.maxHealth) * 100
        ),
      }
    },
  })
</script>
<style lang="scss">
  .planet-description-wrapper {
    overflow-x: hidden;
    width: 500px;

    .planet-description {
      width: 500px;
      padding: map-get($sizes, md);
    }
  }
</style>
