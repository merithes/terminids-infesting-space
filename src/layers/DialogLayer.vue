<template>
  <transition
    :duration="250"
    name="fade"
    mode="out-in"
    appear
  >
    <div
      v-if="currentDialog"
      class="dialog-container"
    >
      <div
        class="dialog-backdrop"
        @click="() => (currentDialog?.noBackdropDismiss ? null : currentDialog?.dismiss())"
        tabindex="0"
      ></div>
      <div class="dialog-wrapper">
        <template v-if="currentDialog.component">
          <component
            :is="currentDialog.component"
            :key="currentDialog.uuid"
            v-bind="currentDialog.componentProps"
          />
        </template>
        <div
          class="dialog-content"
          v-else
          :key="currentDialog.uuid"
        >
          <div
            v-if="currentDialog.title"
            class="dialog-title-wrapper text-uppercase"
          >
            <h3>
              {{ currentDialog.title }}
            </h3>
          </div>
          <div
            v-if="currentDialog.message"
            class="dialog-message-wrapper"
          >
            <p>{{ currentDialog.message }}</p>
          </div>
          <div
            v-if="
              !currentDialog.noPromptDismiss ||
              !currentDialog.noPromptConfirm ||
              currentDialog.actions?.length
            "
            class="dialog-actions flex-row justify-around"
          >
            <hd-button
              v-if="!currentDialog.noPromptDismiss"
              @click="currentDialog.dismiss"
              color="grey-1"
              stripeColor="grey-5"
              label="cancel"
              striped
            />
            <hd-button
              v-if="!currentDialog.noPromptConfirm"
              @click="currentDialog.confirm"
              striped
              label="confirm"
            />
            <template v-if="currentDialog.actions?.length">
              <hd-button
                v-for="(action, index) of currentDialog.actions"
                :key="index"
                v-bind="action"
                @click="() => (action.dismiss ? (currentDialog as Dialog).dismiss() : null)"
              />
            </template>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
  import { defineComponent, type ComputedRef } from 'vue'
  import { useDialogs, type Dialog } from '@/composable'
  import { HdButton } from '@/components/atomics'

  export default defineComponent({
    name: 'DialogLayer',
    components: { HdButton },
    setup() {
      const { dialogs, currentDialog } = useDialogs()

      return {
        dialogs,
        currentDialog: currentDialog as ComputedRef<Dialog>,
      }
    },
  })
</script>

<style lang="scss">
  .dialog-container {
    position: fixed;
    z-index: 2;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;

    display: flex;
    justify-content: center;
    align-items: center;

    .dialog-backdrop {
      position: fixed;
      z-index: 0;
      top: 0;
      bottom: 0;
      right: 0;
      left: 0;
      height: 100%;
      width: 100%;
      backdrop-filter: blur(10px);
    }

    .dialog-wrapper {
      position: relative;
      z-index: 1;
      min-height: MIN(400px, 80vh);
      width: 100%;
      justify-content: center;
      display: flex;
      padding-top: map-get($sizes, xxl);
      padding-bottom: map-get($sizes, xxl);

      border-top: 3px solid $grey-5;
      border-bottom: 3px solid $grey-5;

      background: linear-gradient(
        to right,
        rgba($grey-9, 0.1),
        rgba($grey-9, 0.5),
        rgba($grey-9, 0.1)
      );

      .dialog-content {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        display: flex;
        text-align: center;
        .dialog-title-wrapper h3 {
          font-family: 'Swiss 721';
        }
      }
    }
  }

  .fade-enter-active .dialog-wrapper,
  .fade-enter-active .dialog-backdrop,
  .fade-leave-active .dialog-wrapper,
  .fade-leave-active .dialog-backdrop {
    transition: all 0.25s ease;
  }

  .fade-enter-from {
    .dialog-wrapper {
      opacity: 0;
      transform: scale(1.2);
    }
    .dialog-backdrop {
      backdrop-filter: blur(0);
    }
  }

  .fade-leave-to {
    .dialog-wrapper {
      opacity: 0;
      transform: translateY(20px);
    }
    .dialog-backdrop {
      backdrop-filter: blur(0);
    }
  }
</style>
