<template>
  <!-- <router-link to="/">Home</router-link>
  <router-link to="/styleguide">StyleGuide</router-link>
  <router-link to="/map">map</router-link> -->
  <div class="flex-row column-gap-md">
    <tab-list
      :options="[
        { label: 'Home', to: '/' },
        { label: 'StyleGuide', to: '/styleguide' },
        { label: 'Map', to: '/map' },
      ]"
    />
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue'
  import { TabList } from '@/components/atomics'

  export default defineComponent({
    name: 'NavBar',
    components: { TabList },
    methods: {
      isCurrentPath: function (path: string) {
        return this.$route.path === path
      },
    },
  })
</script>
