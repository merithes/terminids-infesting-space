<template>
  <div
    id="mapPage"
    class="flex-row full-height gap-none"
  >
    <three-test />
  </div>
</template>

<script lang="ts">
  import { ThreeTest } from '@/components'
  import { defineComponent } from 'vue'

  export default defineComponent({
    name: 'MapPage',
    components: { ThreeTest },
    setup() {
      return {}
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
