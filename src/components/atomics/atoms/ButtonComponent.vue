<template>
  <button
    class="hd-button"
    :class="`text-${color}`"
    :style="`--outline: var(--${outlineColor})`"
  >
    <div class="hd-button-inner">
      <slot>{{ label }}</slot>
    </div>
  </button>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'

  export default defineComponent({
    name: 'ButtonComponent',
    props: {
      label: String,
      color: {
        type: String,
        default: 'white',
      },
      outlineColor: {
        type: String,
        default: 'grey-2',
      },
    },
  })
</script>

<style lang="scss">
  .hd-button {
    position: relative;

    cursor: pointer;
    border-radius: 0;
    background-color: #0000;
    border: unset;

    $padding-x-size: map-get($sizes, xxl);
    $padding-y-size: map-get($sizes, md);

    padding-left: $padding-x-size;
    padding-right: $padding-x-size;
    padding-top: $padding-y-size;
    padding-bottom: $padding-y-size;

    font-family: 'FS Sinclair';
    text-transform: uppercase;
    font-size: 1.5em;

    text-shadow: #0000 0 0 0;

    .hd-button-inner {
      position: relative;
      z-index: 1;
    }

    &::before {
      content: '';
      position: absolute;

      $offset: map-get($sizes, xs);
      top: $offset;
      bottom: $offset;
      right: $offset;
      left: $offset;
      background-color: var(--white-transparent);

      transition: all 0.4s ease;

      opacity: 0.75;
      z-index: 0;
    }

    $o-min: -100px;
    $o-max: calc(100% + 100px);
    $a-min: map-get($sizes, sm);
    $a-max: calc(100% - map-get($sizes, sm));
    $i-min: calc(50% - map-get($sizes, sm));
    $i-max: calc(50% + map-get($sizes, sm));

    &::after {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      right: 0;
      left: 0;

      border: 3px solid var(--outline);
      transition: all 0.2s linear;

      clip-path: polygon(
        $o-min $o-min,
        $o-max $o-min,
        $o-max $i-min,
        $a-max $i-min,
        $a-max $i-max,
        $o-max $i-max,
        $o-max $o-max,
        $o-min $o-max,
        $o-min $i-max,
        $a-min $i-max,
        $a-min $i-min,
        $o-min $i-min
      );
    }

    &:hover {
      transition: all 0.2s linear 0.15s;
      text-shadow: #0008 2px 2px 0px;
      &::before {
        transition: unset;
        opacity: 1;
      }
    }

    &:active,
    &:focus {
      outline: unset;
      &::after {
        transition: unset;
        $i-min: calc(50% - map-get($sizes, xs));
        $i-max: calc(50% + map-get($sizes, xs));
        clip-path: polygon(
          $o-min $o-min,
          $o-max $o-min,
          $o-max $i-min,
          $a-max $i-min,
          $a-max $i-max,
          $o-max $i-max,
          $o-max $o-max,
          $o-min $o-max,
          $o-min $i-max,
          $a-min $i-max,
          $a-min $i-min,
          $o-min $i-min
        );
      }
    }
  }
</style>
