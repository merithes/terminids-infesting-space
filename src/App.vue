<template>
  <RouterView />
  <DialogLayer />
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  import { DialogLayer } from '@/layers'

  export default defineComponent({
    name: 'App',
    components: { DialogLayer },
  })
</script>

<style lang="scss">
  @import 'src/css/app.scss';
</style>
