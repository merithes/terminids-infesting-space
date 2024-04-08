<template>
  <div
    class="skeleton"
    :class="`skeleton-${type}`"
    :style="{ width, height }"
  ></div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'

  type SkeletonType = 'text' | 'block' | 'circle'

  export default defineComponent({
    name: 'SkeletonComponent',
    props: {
      type: {
        type: String as () => SkeletonType,
        default: 'text',
      },
      width: String,
      height: String,
    },
  })
</script>

<style lang="scss">
  .skeleton {
    cursor: wait;
    position: relative;
    overflow: hidden;
    background: #fff1;
    &::before {
      content: '\00a0';
    }
    &::after {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      right: 0;
      left: 0;
      transform: translateX(-100%);
      background: linear-gradient(to right, #0000, #fff2, #0000);
      animation: skeletonComponentAnimation 1.5s linear infinite;
    }
    &.skeleton-text {
      height: 1em;
      display: inline;
    }

    &.skeleton-circle {
      aspect-ratio: 1;
      border-radius: 50%;
    }
    @keyframes skeletonComponentAnimation {
      from {
        transform: translateX(-100%);
      }
      to {
        transform: translateX(100%);
      }
    }
  }
</style>
