<template>
  <h1>Buttons</h1>
  <div class="row">
    <div class="col-6">
      <h1>Typography</h1>
    </div>
    <div class="col-6">
      <h2>Buttons</h2>
      <separator
        width="300px"
        color="primary"
      />
      <h3 class="hd-mt-xxl hd-mb-sm">Default style</h3>
      <separator width="100px" />
      <div class="flex-row gap">
        <hd-button>Regular</hd-button>
        <hd-button
          label="Disabled"
          disabled
        />
        <hd-button
          label="no BG + sizing"
          :background="false"
          min-width="300px"
        />
      </div>
      <h3 class="hd-mt-xxl hd-mb-sm">Striped style</h3>
      <separator width="100px" />
      <div class="flex-row gap">
        <hd-button
          label="Regular"
          :background="false"
          striped
        />
        <hd-button
          label="Positive"
          :background="false"
          striped
          color="positive"
        />
        <hd-button
          label="Locked"
          :background="false"
          striped
          color="negative"
        />
        <hd-button
          label="disabled"
          :background="false"
          striped
          disabled
        />
      </div>
      <h2 class="hd-mt-xxl">Skeleton</h2>
      <separator
        width="300px"
        color="primary"
      />
      <div class="flex-row gap items-start">
        <skeleton width="100px" />
        <skeleton
          type="circle"
          width="100px"
        />
      </div>
      <h2 class="hd-mt-xxl">Tabs</h2>
      <separator
        width="300px"
        color="primary"
      />
      <div class="flex-row gap items-start">
        <tab-list
          label="stratagems"
          v-model="tab2"
          :options="[
            { value: 'destroyer', label: 'destroyer' },
            { value: 'stratagem', label: 'stratagem' },
            { value: 'shipModule', label: 'Ship module' },
          ]"
          value="stratagems"
        />
      </div>
    </div>
  </div>
  <div class="hd-pa-md"></div>
</template>

<script lang="ts">
  import { HdButton, Separator, Skeleton, TabList } from '@/components/atomics'
  import { defineComponent, ref } from 'vue'

  export default defineComponent({
    name: 'StyleGuide',
    components: { HdButton, Separator, Skeleton, TabList },
    setup() {
      return {
        tab1: ref('destroyer'),
        tab2: ref('destroyer'),
      }
    },
  })
</script>
