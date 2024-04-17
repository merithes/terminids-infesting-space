<template>
  <div
    class="striped-block"
    :style="{ width, height }"
    :class="`text-${color}`"
  >
    <slot></slot>
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue'

  export default defineComponent({
    name: 'StripedBlock',
    props: {
      width: {
        type: String,
        default: '100%',
      },
      height: {
        type: String,
        default: '2em',
      },
      color: {
        type: String,
        default: 'primary',
      },
    },
  })
</script>
<style scoped lang="scss">
  .striped-block {
    @include borderDash(0.8px, 8px, currentColor);
  }
</style>
