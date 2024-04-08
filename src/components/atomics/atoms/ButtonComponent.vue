<template>
  <button
    class="hd-button"
    :class="`text-${textColor} hd-button-${buttonStyle}`"
    :style="{
      '--outline': `var(--${outlineColor})`,
      '--background': background ? `var(--${background}-transparent)` : '',
      width,
      minWidth,
    }"
    :disabled="disabled"
  >
    <div class="hd-button-inner">
      <slot>{{ label }}</slot>
    </div>
  </button>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'

  type ButtonStyle = 'default' | 'stripped'

  export default defineComponent({
    name: 'ButtonComponent',
    props: {
      label: String,
      color: String,
      outline: String,
      stripped: Boolean,
      default: Boolean,
      background: {
        type: String as () => boolean | string,
        default: 'white',
      },
      width: String,
      minWidth: String,
      disabled: Boolean,
    },
    computed: {
      buttonStyle(): ButtonStyle {
        if (this.stripped) return 'stripped'
        if (this.default) return 'default'
        return 'default'
      },
      textColor() {
        if (this.color) return this.color
        if (this.buttonStyle === 'stripped') return 'primary'
        return 'white'
      },
      outlineColor(): string {
        if (this.outline) return this.outline
        if (this.stripped && this.color) return this.color
        if (this.stripped && !this.color) return 'primary'
        return 'grey-2'
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

    font-family: 'FS Sinclair';
    text-transform: uppercase;
    font-size: 1.5em;

    text-shadow: #0000 0 0 0;

    .hd-button-inner {
      position: relative;
      z-index: 2;
    }

    &.hd-button-default {
      $padding-x-size: map-get($sizes, lg);
      $padding-y-size: map-get($sizes, md);

      padding-left: $padding-x-size;
      padding-right: $padding-x-size;
      padding-top: $padding-y-size;
      padding-bottom: $padding-y-size;

      &::before {
        content: '';
        position: absolute;

        $offset: map-get($sizes, xs);
        top: $offset;
        bottom: $offset;
        right: $offset;
        left: $offset;
        background-color: var(--background);

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
        transition: unset;

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
      /**
      ** DISABLED BUTTON BEHAVIOR
      **/

      &[disabled] {
        cursor: not-allowed;
        color: #{$grey-2};
        &::after {
          --outline: #{$grey-5};
        }
        &::before {
          opacity: 0.2;
        }
      }

      &:not([disabled]) {
        &:hover,
        &:focus-visible {
          transition: all 0.2s linear 0.15s;
          text-shadow: #0008 2px 2px 0px;
          &::before {
            transition: unset;
            opacity: 1;
          }
        }

        &:active {
          &::after {
            transition: all 0.4s ease;
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

        &:focus-visible {
          outline: 2px dashed $primary;
          outline-offset: map-get($sizes, xxs);
          transition: unset;
        }
      }
    }

    &.hd-button-stripped {
      $padding-x-size: map-get($sizes, md);
      $padding-y-size: map-get($sizes, sm);

      padding-left: $padding-x-size;
      padding-right: $padding-x-size;
      padding-top: $padding-y-size;
      padding-bottom: $padding-y-size;

      font-size: 1.6em;
      font-weight: normal;

      border: 3px solid var(--outline);
      transition:
        color 0.4s ease,
        border-color 0.4s ease;

      /**
      *** STRIPPED BACKGROUND
      *** As ::before because it needs to be semi-transparent
      **/
      &::before {
        content: '';
        position: absolute;
        top: 0;
        bottom: 0;
        right: 0;
        left: 0;
        opacity: 0.3;
        z-index: 0;
        $width: 1px;
        $mainColor: var(--outline);
        $secondaryColor: transparent;
        $halfWidth: calc($width / 2);
        background: center center / 9px 9px
          linear-gradient(
            45deg,
            $mainColor #{$halfWidth},
            $secondaryColor #{$halfWidth + 1px} calc(50% - #{$halfWidth + 1px}),
            $mainColor calc(50% - #{$halfWidth}) calc(50% + #{$halfWidth}),
            $secondaryColor calc(50% + #{$halfWidth + 1px}) calc(100% - #{$halfWidth + 1px}),
            $mainColor calc(100% - #{$halfWidth})
          );
      }

      &:active {
      }

      &[disabled] {
        cursor: not-allowed;
        color: #{$grey-2};
        --outline: #{$grey-3} !important;
        opacity: 0.8;
      }

      &:not([disabled]) {
        &:focus-visible {
          outline: 2px dashed $primary;
          outline-offset: map-get($sizes, xxs);
          transition: unset;
        }
      }
    }
  }
</style>
