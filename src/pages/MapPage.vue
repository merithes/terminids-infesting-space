<template>
  <div
    id="mapPage"
    class="flex-row full-height gap-none"
  >
    <hd-map
      v-model="planet"
      :planets="planetsList"
    />

    <transition
      appear
      mode="out-in"
      name="planet-toggle"
      :duration="400"
    >
      <div
        v-if="typeof planet === 'number'"
        class="planet-display-section position-relative"
      >
        <transition
          appear
          name="planet-change"
          mode="out-in"
          :duration="400"
        >
          <planet-view
            :value="planetsList[planet]"
            :key="planet"
          />
        </transition>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
  import { HdMap, PlanetView } from '@/components'
  import { usePlanetsStore } from '@/stores/planets'
  import { computed, defineComponent, ref } from 'vue'

  export default defineComponent({
    name: 'MapPage',
    components: { HdMap, PlanetView },
    setup() {
      const planet = ref<number>(),
        planetsStore = usePlanetsStore()

      if (planetsStore.needsFetching) planetsStore.fetch()

      return {
        planet,
        planetsList: computed(() => planetsStore.list),
      }
    },
  })
</script>

<style lang="scss">
  #mapPage {
    .planet-display-section {
      width: 500px;
    }
    .planet-toggle-enter-active,
    .planet-toggle-leave-active {
      transition: all 0.25s ease;
    }

    .planet-toggle-leave-to,
    .planet-toggle-enter-from {
      width: 0;
      opacity: 0;
    }

    .planet-toggle-enter-to,
    .planet-toggle-leave-from {
      width: 500px;
      opacity: 1;
    }

    .planet-change-enter-active,
    .planet-change-leave-active {
      transition: all 0.4s ease;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
    }

    .planet-change-leave-to {
      transform: translateY(-20px);
      opacity: 0;
    }
    .planet-change-enter-from {
      transform: translateY(20px);
      opacity: 0;
    }

    .planet-change-enter-to,
    .planet-change-leave-from {
      transform: translateY(0);
      opacity: 1;
    }
  }
</style>
