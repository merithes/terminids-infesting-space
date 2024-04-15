<template>
  <div>
    <h1 class="fs-sinclair">Styling elements</h1>
    <separator
      width="60%"
      color="primary"
      dashed
    />
    <div class="row">
      <div class="col-6">
        <h2>Typography</h2>
        <separator
          width="300px"
          color="primary"
        />
        <h3 class="hd-mt-xxl hd-mb-sm">Fonts</h3>
        <separator
          width="100px"
          color="primary"
        />
        <div>
          <div
            class="font-sinclair"
            style="font-size: 2rem"
          >
            FS Sinclair
            <p class="text-body1">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit,<br />
              sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.<br />
              Ut enim ad minim veniam, quis nostrud exercitation ullamco<br />
              laboris nisi ut aliquip ex ea commodo consequat.
            </p>
          </div>
          <div
            class="font-swiss"
            style="font-size: 2rem"
          >
            Swiss 721
            <p class="text-body1">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit,<br />
              sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.<br />
              Ut enim ad minim veniam, quis nostrud exercitation ullamco<br />
              laboris nisi ut aliquip ex ea commodo consequat.
            </p>
          </div>
        </div>
        <h3 class="hd-mt-xxl hd-mb-sm">Text bodies</h3>
        <separator
          width="100px"
          color="primary"
        />
        <div class="flex-column gap-md">
          <div class="text-h1">h1 .text-h1 Headline 1</div>
          <div class="text-h2">h2 .text-h2 Headline 2</div>
          <div class="text-h3">h3 .text-h3 Headline 2</div>
          <div class="text-subtitle1">.text-subtitle1 Subtitle 1</div>
          <div class="text-subtitle2">.text-subtitle2 Subtitle 2</div>
          <div class="text-body1">.text-body1 Body 1</div>
          <div class="text-body2">.text-body2 Body 2</div>
          <div class="text-caption">.text-caption Caption text</div>
        </div>
        <h3 class="hd-mt-xxl hd-mb-sm">Font weights</h3>
        <separator
          width="100px"
          color="primary"
        />
        <div class="flex-column gap-md">
          <div class="text-weight-thin">.text-weight-thin Lorem ipsum sit amet</div>
          <div class="text-weight-light">.text-weight-light Lorem ipsum sit amet</div>
          <div class="text-weight-regular">.text-weight-regular Lorem ipsum sit amet</div>
          <div class="text-weight-medium">.text-weight-medium Lorem ipsum sit amet</div>
          <div class="text-weight-bold">.text-weight-bold Lorem ipsum sit amet</div>
          <div class="text-weight-bolder">.text-weight-bolder Lorem ipsum sit amet</div>
        </div>
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
        <separator width="100px" />
        <div class="flex-row gap items-start">
          <skeleton width="100px" />
          <skeleton
            type="circle"
            width="100px"
          />
        </div>
        <h2 class="hd-mt-xxl">Tabs</h2>
        <separator width="100px" />
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
        <h2 class="hd-mt-xxl">Dialog</h2>
        <separator width="100px" />
        <div class="flex-row gap items-start">
          <hd-button
            @click="
              createDialog({ title: 'Title example', message: 'Lorem Ipsum you know the stuff' })
            "
            label="dialog"
          />
        </div>
        <h2 class="hd-mt-xxl">Decorators</h2>
        <separator width="100px" />
        <div
          class="flex-row gap items-start"
          style="height: 300px"
        >
          <border-decorator />
          <border-decorator flipped />

          <border-decorator height="auto">
            <div class="hd-pa-md">
              with some content <br />
              and some more
            </div>
          </border-decorator>
          <striped-block width="100px" />
          <striped-block
            width="200px"
            color="grey-5"
          />
        </div>
        <h2 class="hd-mt-xxl">Card</h2>
        <separator width="100px" />
        <div class="flex-row gap items-start">
          <description-card label="Stats">
            <div class="text-uppercase font-sinclair">
              <div>Call-in time</div>
              <div>Uses</div>
              <div>Cooldown time</div>
            </div>
          </description-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import {
    BorderDecorator,
    HdButton,
    Separator,
    Skeleton,
    TabList,
    DescriptionCard,
    StripedBlock,
  } from '@/components/atomics'
  import { useDialogs } from '@/composable'
  import { defineComponent, ref } from 'vue'

  export default defineComponent({
    name: 'StyleGuide',
    components: {
      HdButton,
      Separator,
      Skeleton,
      TabList,
      BorderDecorator,
      DescriptionCard,
      StripedBlock,
    },
    setup() {
      const { createDialog } = useDialogs()
      return {
        tab1: ref('destroyer'),
        tab2: ref('destroyer'),
        createDialog,
      }
    },
  })
</script>
