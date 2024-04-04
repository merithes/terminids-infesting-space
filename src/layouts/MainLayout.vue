<template>
  <div id="mainLayout">
    <div>
      <hd-nav-bar />
    </div>
    <div>
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
