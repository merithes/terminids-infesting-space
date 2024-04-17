<template>
  <div>
    <div>examplePage</div>
    <div>
      <!-- <skeleton v-if="loading" />
      <pre v-else>{{ planets }}</pre> -->
      <hd-button
        label="test"
        @click="promptDialogTest"
      />
    </div>
  </div>
</template>
<script lang="ts">
  import { HdButton } from '@/components/atomics'
  import { useDialogs } from '@/composable'
  import { usePlanetsStore } from '@/stores/planets'
  import { computed, defineComponent } from 'vue'

  export default defineComponent({
    name: 'HomePage',
    components: { HdButton },
    setup() {
      const planets = usePlanetsStore(),
        { createDialog } = useDialogs()

      if (planets.needsFetching) {
        planets.fetch()
      }

      const promptDialogTest = () =>
        createDialog({
          title: 'testTitle',
          message: 'testMessage',
          noPromptConfirm: true,
          noPromptDismiss: true,
          actions: [{ label: 'helloWorld', color: 'red', dismiss: true }],
        })
          .onConfirm(() => console.log('ok'))
          .onDismiss(() => console.log('dismiss'))

      return {
        planets: computed(() => planets.list),
        loading: computed(() => planets.loading),
        promptDialogTest,
      }
    },
  })
</script>
