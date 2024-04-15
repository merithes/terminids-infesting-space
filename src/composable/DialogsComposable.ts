import type { ButtonComponentProps } from '@/components/atomics'
import { type Component, computed, reactive } from 'vue'

export interface DialogButton {
  label?: string
  color?: string
}

export interface PartialDialog {
  title?: string
  message?: string
  component?: Component
  componentProps?: object
  noRouteDismiss?: boolean
  noEscDismiss?: boolean
  noBackdropDismiss?: boolean
  noPromptDismiss?: boolean
  noPromptConfirm?: boolean
  confirmButton?: DialogButton | boolean
  dismissButton?: DialogButton | boolean
  actions?: (ButtonComponentProps & { dismiss?: boolean })[]
}

export interface Dialog extends PartialDialog {
  uuid: string
  dismiss: () => void
  confirm: () => void
  onDismiss: (callback: () => unknown) => Dialog
  onConfirm: (callback: () => unknown) => Dialog
  dismissCallback?: () => unknown
  okCallback?: () => unknown
}

/**
 * Global state
 */

const dialogs = reactive<Map<string, Dialog>>(new Map()),
  currentDialogKey = computed(() => (dialogs.size ? [...dialogs.keys()].pop() : undefined)),
  currentDialog = computed(() =>
    currentDialogKey.value ? dialogs.get(currentDialogKey.value) : undefined
  )

export function useDialogs() {
  const createDialog = (partialDialog: PartialDialog): Dialog => {
      const id = crypto.randomUUID(),
        dialog = {
          uuid: id,
          dismiss: () => dismissDialog(id),
          confirm: () => confirmDialog(id),
          onDismiss: (callback: () => unknown) => {
            dialog.dismissCallback = callback
            return dialog
          },
          onConfirm: (callback: () => unknown) => {
            dialog.okCallback = callback
            return dialog
          },
          update: (partialDialog: PartialDialog) => {
            dialogs.set(id, { ...(dialogs.get(id) as Dialog), ...partialDialog })
          },
          ...partialDialog,
        } as Dialog

      dialogs.set(dialog.uuid, dialog)

      return dialog
    },
    getDialog = (dialog: Dialog | null | string = null): Dialog | undefined => {
      if (typeof dialog !== 'string' && dialog !== null) return dialog

      const dialogId = dialog === null ? [...dialogs.keys()].pop() : dialog

      if (!dialogId) return

      return dialogs.get(dialogId)
    },
    deleteDialog = (inputDialog: Dialog | null | string = null) => {
      const dialog = getDialog(inputDialog)

      if (!dialog) return

      dialogs.delete(dialog.uuid)
    },
    dismissDialog = (inputDialog: Dialog | null | string = null) => {
      const dialog = getDialog(inputDialog)

      if (!dialog) return

      if (dialog.dismissCallback) dialog.dismissCallback()

      deleteDialog(dialog)
    },
    confirmDialog = (inputDialog: Dialog | null | string = null) => {
      const dialog = getDialog(inputDialog)

      if (!dialog) return

      if (dialog.okCallback) dialog.okCallback()

      deleteDialog(dialog)
    }

  return {
    dialogs,
    currentDialogKey,
    currentDialog,
    createDialog,
  }
}
