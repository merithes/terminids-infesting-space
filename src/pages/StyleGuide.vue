<template>
  <hd-button>Change Ship Name</hd-button>
  <div class="hd-pa-md"></div>
  <hd-button label="test 2" />
</template>

<script lang="ts">
  import { HdButton } from '@/components/atomics'
  import { defineComponent } from 'vue'

  export default defineComponent({
    name: 'StyleGuide',
    components: { HdButton },
  })
</script>
