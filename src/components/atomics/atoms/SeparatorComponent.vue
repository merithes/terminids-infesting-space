<template>
  <div
    class="separator hd-my-md"
    :class="color ? `text-${color}` : ''"
    :style="{ width, borderBottomWidth: height, minWidth, borderBottomStyle: style }"
  ></div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue'

  export default defineComponent({
    name: 'SeparatorComponent',
    props: {
      width: String,
      minWidth: String,
      height: String,
      color: String,
      dotted: Boolean,
      dashed: Boolean,
      solid: Boolean,
      double: Boolean,
      groove: Boolean,
      ridge: Boolean,
      inset: Boolean,
      outset: Boolean,
    },
    computed: {
      style() {
        if (this.dotted) return 'dotted'
        if (this.dashed) return 'dashed'
        if (this.double) return 'double'
        if (this.groove) return 'groove'
        if (this.ridge) return 'ridge'
        if (this.inset) return 'inset'
        if (this.outset) return 'outset'
        if (this.solid) return 'solid'
        return 'solid'
      },
    },
  })
</script>
<style scoped lang="scss">
  .separator {
    border-bottom: 2px solid currentColor;
  }
</style>
