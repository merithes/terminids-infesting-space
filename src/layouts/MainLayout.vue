<template>
  <div
    id="mainLayout"
    class="flex-column"
  >
    <div class="hd-pa-md">
      <hd-nav-bar />
    </div>
    <div
      id="MainLayoutPage"
      class="hd-pa-md"
    >
      <router-view />
    </div>
  </div>
</template>
<script lang="ts">
  import { HdNavBar } from '@/components/layoutItems'
  import { defineComponent } from 'vue'
  export default defineComponent({
    name: 'MainLayout',
    components: { HdNavBar },
  })
</script>
<style>
  #mainLayout {
    height: 100vh;
    #MainLayoutPage {
      flex-grow: 1;
      overflow-y: auto;
      overflow-x: hidden;
    }
  }
</style>
