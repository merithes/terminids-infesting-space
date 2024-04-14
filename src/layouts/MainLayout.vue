<template>
  <div
    id="mainLayout"
    class="flex-column"
    @mousemove="mouseMove"
    :style="parallax"
  >
    <div class="hd-pa-md">
      <hd-nav-bar />
    </div>
    <div
      id="MainLayoutPage"
      class="hd-pa-md"
    >
      <router-view v-slot="{ Component, route }">
        <!-- Use a custom transition or fallback to `fade` -->
        <transition
          :name="(route.meta.transition as string) || 'fade'"
          mode="out-in"
          :duration="250"
        >
          <component
            :is="Component"
            :key="route.path"
          />
        </transition>
      </router-view>
    </div>
  </div>
</template>
<script lang="ts">
  import { HdNavBar } from '@/components/layoutItems'
  import { defineComponent, reactive } from 'vue'
  export default defineComponent({
    name: 'MainLayout',
    components: { HdNavBar },
    setup() {
      const parallax = reactive({ '--px': '0px', '--py': '0px' }),
        firstMove = { x: 0, y: 0 },
        boundaries = {
          x: window.innerWidth,
          y: window.innerHeight,
        }

      const mouseMove = ({ clientX: x, clientY: y }: MouseEvent) => {
        if (firstMove.x === 0 && firstMove.y === 0) {
          Object.assign(firstMove, { x, y })
          return
        }

        Object.assign(parallax, {
          '--px': `${((x - firstMove.x) / boundaries.x) * 5}px`,
          '--py': `${((y - firstMove.y) / boundaries.y) * 5}px`,
        })
      }

      return { mouseMove, parallax }
    },
  })
</script>
<style lang="scss">
  #mainLayout {
    height: 100vh;
    $bg-layer-darkness: #000a;
    --px: 0px;
    --py: 0px;
    background:
      linear-gradient($bg-layer-darkness, $bg-layer-darkness),
      var(--px) var(--py) / 800px 800px url('/src/assets/images/stars1.svg'),
      linear-gradient($bg-layer-darkness, $bg-layer-darkness),
      calc(var(--px) / 5) calc(var(--py) / 5) / 390px 390px url('/src/assets/images/stars2.svg');

    #MainLayoutPage {
      flex-grow: 1;
      overflow-y: auto;
      overflow-x: hidden;

      .fade-enter-active,
      .fade-leave-active {
        transition: all 0.5s ease;
      }

      .fade-enter-from {
        opacity: 0;
        transform: translateX(-20px);
      }

      .fade-leave-to {
        opacity: 0;
        transform: translateX(20px);
      }
    }
  }
</style>
