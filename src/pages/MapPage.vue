<template>
  <div class="full-height">
    <hd-map />
  </div>
</template>

<script lang="ts">
  import { HdMap } from '@/components'
  import { defineComponent } from 'vue'

  export default defineComponent({
    name: 'MapPage',
    components: { HdMap },
  })
</script>

<style lang="scss">
  #mapGraphic {
    .sector {
      position: relative;
      z-index: 1;
      &:hover {
        fill: red;
        z-index: 2;
        position: relative;
        filter: drop-shadow(0 0 5px white);
      }
    }
  }
</style>
