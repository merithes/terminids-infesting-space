<template>
  <div
    class="description-card"
    :style="{ '--outline-color': `var(--${outlineColor})` }"
  >
    <div class="description-card-label">
      <slot name="label">{{ label }}</slot>
    </div>
    <div
      class="description-card-inner"
      :class="innerClass"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'

  export default defineComponent({
    name: 'DescriptionCard',
    props: {
      outlineColor: {
        type: String,
        default: 'grey-8',
      },
      label: String,
      innerClass: [Object, String, Array] as unknown as () => unknown,
    },
  })
</script>

<style lang="scss">
  .description-card {
    position: relative;
    padding: map-get($sizes, md);
    border: 2px solid var(--outline-color);
    margin-top: 0.5em;
    border-top: unset;
    .description-card-label {
      position: absolute;
      top: 0;
      left: -2px;
      right: -2px;
      font-family: 'FS Sinclair';

      display: flex;
      align-items: center;
      transform: translateY(-50%);
      text-transform: uppercase;
      &::before {
        content: '';
        width: calc(map-get($sizes, md) - 5px);
        margin-right: 5px;
        border-top: 2px solid var(--outline-color);
        display: inline-block;
      }
      &::after {
        content: '';
        width: auto;
        flex-grow: 1;
        margin-left: 5px;
        border-top: 2px solid var(--outline-color);
        display: inline-block;
      }
    }
  }
</style>
