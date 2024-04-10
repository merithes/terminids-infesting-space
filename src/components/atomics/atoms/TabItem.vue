<template>
  <button
    class="tab-item"
    :class="{ 'tab-selected': tabSelected }"
    :data-num="nth"
    @click="innerValue = value"
  >
    <div class="tab-item-inner">
      <slot>{{ label }}</slot>
    </div>
    <div class="tab-decoration"></div>
  </button>
</template>

<script lang="ts">
  import { computed, defineComponent, ref, watch } from 'vue'
  import isEqual from 'lodash.isequal'

  export default defineComponent({
    name: 'TabItem',
    props: {
      label: String,
      nth: {
        type: Number,
        default: 1,
      },
      active: Boolean,
      modelValue: null as unknown as () => unknown,
      value: null as unknown as () => unknown,
    },
    emits: ['update:modelValue'],
    setup(props, { emit }) {
      const innerValue = ref<unknown>(props.modelValue)

      watch(
        () => props.modelValue,
        newVal => (innerValue.value = newVal)
      )
      watch(innerValue, newVal => emit('update:modelValue', newVal))

      const tabSelected = computed(() => isEqual(props.value, innerValue.value))

      return {
        innerValue,
        tabSelected,
      }
    },
  })
</script>

<style lang="scss">
  .tab-item {
    font-size: 1.5rem;
    min-width: 180px;

    $inactive-color: $grey-8;
    $inactive-color-label: $grey-4;
    $active-color: $white;
    position: relative;
    text-transform: uppercase;
    font-family: 'FS Sinclair', sans-serif;
    display: inline-flex;
    flex-direction: column;

    min-height: 0;
    min-width: 0;

    color: $inactive-color-label;

    .tab-item-inner {
      padding: map-get($sizes, 'xs');
      padding-left: map-get($sizes, 'md');
      padding-right: map-get($sizes, 'md');
    }

    $nth-position: calc(1.5rem);

    $nth-padding: map-get($sizes, 'xxs');
    $notch-left: calc(100% - $nth-position - 1ch - $nth-padding);
    $notch-right: calc(100% - $nth-position + $nth-padding);

    &::before {
      transition: color 0.1s linear;
      content: attr(data-num);
      position: absolute;
      top: 1em;
      right: $nth-position;
      transform: translateY(50%);
      color: $inactive-color;
    }

    &::after {
      transition: border-color 0.1s linear;
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      right: 0;
      left: 0;
      border: 2px solid $inactive-color;
      border-top: unset;
      max-width: 100%;

      clip-path: polygon(
        119% -5%,
        119% 119%,
        $notch-right 119%,
        $notch-right calc(100% - 1000vw),
        $notch-left calc(100% - 1000vw),
        $notch-left 119%,
        -5% 119%,
        -5% -5%
      );
    }

    .tab-decoration {
      transition:
        height 0.1s linear,
        opacity 0.05s linear;
      opacity: 0;
      height: 0;
      margin-left: map-get($sizes, 'xs');
      margin-right: map-get($sizes, 'xs');
      margin-bottom: map-get($sizes, 'xs');

      $notch-left: calc($notch-left + map-get($sizes, 'xs'));
      $notch-right: calc($notch-right + map-get($sizes, 'xs'));

      clip-path: polygon(
        119% -5%,
        119% 119%,
        $notch-right 119%,
        $notch-right calc(100% - 1000vw),
        $notch-left calc(100% - 1000vw),
        $notch-left 119%,
        -5% 119%,
        -5% -5%
      );

      $width: 3px;
      $size: 12px;
      $mainColor: $inactive-color;
      $secondaryColor: transparent;
      $halfWidth: calc($width / 2);

      background: top left $width / #{$size} #{$size}
        linear-gradient(
          -45deg,
          $mainColor #{$halfWidth},
          $secondaryColor #{$halfWidth + 1px} calc(50% - #{$halfWidth + 1px}),
          $mainColor calc(50% - #{$halfWidth}) calc(50% + #{$halfWidth}),
          $secondaryColor calc(50% + #{$halfWidth + 1px}) calc(100% - #{$halfWidth + 1px}),
          $mainColor calc(100% - #{$halfWidth})
        );
    }

    &:hover {
      color: $active-color;

      &::before {
        color: $active-color;
      }
      &::after {
        border-color: $active-color;
      }
    }

    &.tab-selected {
      .tab-decoration {
        height: 0.9rem;
        opacity: 1;
      }

      color: $active-color;

      &::before {
        color: $active-color;
      }
      &::after {
        border-color: $active-color;
      }
    }
  }
</style>
