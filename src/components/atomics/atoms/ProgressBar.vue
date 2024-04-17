<template>
  <div
    class="progress-bar"
    :style="{
      '--from-color': `var(--${from})`,
      '--to-color': `var(--${to})`,
      '--progress': `${value}%`,
      height,
      width,
    }"
  ></div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue'

  export default defineComponent({
    name: 'ProgressBar',
    props: {
      height: {
        type: String,
        default: '1.5rem',
      },
      width: {
        type: String,
        default: '100%',
      },
      to: {
        type: String,
        default: 'humans',
      },
      from: {
        type: String,
        default: 'primary',
      },
      value: {
        type: Number,
        required: true,
      },
    },
  })
</script>

<style lang="scss">
  .progress-bar {
    border: 2px solid var(--from-color);
    padding: 3px;

    background: 3px 3px / calc(100% - 6px) calc(100% - 6px)
      linear-gradient(
        to right,
        var(--to-color) var(--progress),
        #0000 var(--progress) calc(var(--progress) + 1px),
        var(--from-color) calc(var(--progress) + 1px)
      )
      no-repeat;
  }
</style>
