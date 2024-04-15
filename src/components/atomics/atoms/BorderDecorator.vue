<template>
  <div
    class="border-decorator"
    :style="{
      height,
      '--decorator-color': `var(--${color})`,
      '--decorator-border-color': `var(--${borderColor})`,
    }"
    :class="{ flipped }"
  >
    <slot></slot>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'

  export default defineComponent({
    name: 'BorderDecorator',
    props: {
      flipped: Boolean,
      height: {
        type: String,
        default: '100%',
      },
      color: {
        type: String,
        default: 'grey-10',
      },
      borderColor: {
        type: String,
        default: 'grey-8',
      },
    },
  })
</script>

<style lang="scss">
  .border-decorator {
    position: relative;
    padding-left: map-get($sizes, lg);
    border-top: 2px solid var(--decorator-border-color);

    &::before {
      content: '';
      position: absolute;
      left: 3px;
      top: 3px;
      bottom: 3px;
      width: map-get($sizes, sm);

      @include borderDash(3px, 14px, var(--decorator-color), transparent);
    }

    &::after {
      content: '';
      position: absolute;
      top: -2px;
      left: -2px;
      bottom: -2px;
      width: calc(map-get($sizes, lg) + 2px);
      border: 2px solid var(--decorator-border-color);
      border-top: unset;
      border-right: unset;
    }

    &:not(.flipped) {
      border-right: none;
    }

    &.flipped {
      border-left: none;
      padding-left: unset;
      padding-right: map-get($sizes, lg);
    }

    &.flipped {
      &::before {
        left: unset;
        right: 2px;
      }
      &::after {
        left: unset;
        border-left: unset;
        border-right: 2px solid var(--decorator-border-color);
        right: -2px;
      }
    }
  }
</style>
