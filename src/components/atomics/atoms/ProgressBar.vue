<template>
  <div
    class="progress-outer"
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
      maxDecimals: {
        type: Number,
        default: 2,
      },
    },
  })
</script>

<style lang="scss">
  .progress-outer {
    border: 2px solid var(--from-color);
    padding: 3px;
    &::before {
      content: '';
      display: block;
      height: 100%;
      width: 100%;
      background-image: linear-gradient(
        to right,
        var(--to-color) var(--progress),
        #0000 var(--progress) calc(var(--progress) + 1px),
        var(--from-color) calc(var(--progress) + 1px)
      );
    }
  }
</style>
