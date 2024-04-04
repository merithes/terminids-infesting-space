<template>
  <router-link to="/">Home</router-link>
  <router-link to="/styleguide">StyleGuide</router-link>
</template>
<script lang="ts">
  import { defineComponent } from 'vue'

  export default defineComponent({
    name: 'NavBar',
  })
</script>
