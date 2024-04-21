t
<template>
  <canvas
    id="canvas"
    ref="canvas"
    :style="{ cursor }"
    @click="selectSector"
  ></canvas>
</template>

<script lang="ts">
  import { computed, defineComponent, onMounted, onUnmounted, ref, toRaw } from 'vue'
  import * as THREE from 'three'
  import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
  import { OutlinePass } from 'three/addons/postprocessing/OutlinePass.js'

  import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
  import { SMAAPass } from 'three/addons/postprocessing/SMAAPass.js'
  import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
  import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
  import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader.js'
  import TWEEN from '@tweenjs/tween.js'

  export default defineComponent({
    name: 'ThreeTest',
    setup() {
      const canvas = ref<HTMLCanvasElement>(),
        scene = new THREE.Scene(),
        loader = new GLTFLoader(),
        mouse = new THREE.Vector2(),
        selectedObjects = ref<(THREE.Object3D | THREE.Scene)[]>([]),
        raycaster = new THREE.Raycaster()

      let renderer: THREE.WebGLRenderer,
        composer: EffectComposer,
        outlinePass: OutlinePass,
        antiAliasingPass: SMAAPass,
        camera: THREE.PerspectiveCamera,
        elementGroup: THREE.Object3D,
        canInteract: boolean = true,
        prevLook: THREE.Vector3 = new THREE.Vector3(0, 0, -1),
        defaultFov: number = 50

      let selectedSector: string | false = false

      const initThree = () => {
        if (!canvas.value) return

        /**
         * Setup canvas sizing
         */
        canvas.value.width = canvas.value.clientWidth * window.devicePixelRatio
        canvas.value.height = canvas.value.clientHeight * window.devicePixelRatio

        /**
         * Setup camera
         */
        camera = new THREE.PerspectiveCamera(
          defaultFov,
          canvas.value.width / canvas.value.height,
          0.1,
          1000
        )

        camera.position.z = 1

        /**
         * Setup renderer
         */
        renderer = new THREE.WebGLRenderer({
          canvas: toRaw(canvas.value),
          alpha: true,
        })
        renderer.setSize(canvas.value.width, canvas.value.height)

        /**
         * Setup composer
         */
        composer = new EffectComposer(renderer)
        composer.setSize(canvas.value.width, canvas.value.height)

        /**
         * Setup lights
         */
        {
          const color = 0xffffff
          const intensity = 3
          const light = new THREE.DirectionalLight(color, intensity)
          light.position.set(0, 1, 0.5)
          scene.add(light)
        }
        {
          const color = 0xffffff
          const intensity = 0.5
          const light = new THREE.DirectionalLight(color, intensity)
          light.position.set(0, -1, 0.5)
          scene.add(light)
        }
        {
          const color = getComputedStyle(document.body).getPropertyValue('--humans')
          const intensity = 3
          const light = new THREE.DirectionalLight(color, intensity)
          light.position.set(0, -1, 0)
          scene.add(light)
        }
        {
          const color = getComputedStyle(document.body).getPropertyValue('--automatons')
          const intensity = 3
          const light = new THREE.DirectionalLight(color, intensity)
          light.position.set(-1, 0.5, 0.5)

          scene.add(light)
        }
        {
          const color = getComputedStyle(document.body).getPropertyValue('--terminids')
          const intensity = 3
          const light = new THREE.DirectionalLight(color, intensity)
          light.position.set(1, 0.5, 0.5)

          scene.add(light)
        }

        /**
         * Setup renderPass
         */
        const renderPass = new RenderPass(scene, camera)
        composer.addPass(renderPass)

        /**
         * Add a gamma correction pass
         */
        const gammaCorrectionPass = new ShaderPass(GammaCorrectionShader)
        composer.addPass(gammaCorrectionPass)

        /**
         * Setup outlinePass
         */
        outlinePass = new OutlinePass(
          new THREE.Vector2(canvas.value.width, canvas.value.height),
          scene,
          camera
        )

        outlinePass.edgeStrength = Number(5)
        outlinePass.edgeGlow = Number(0)
        outlinePass.edgeThickness = Number(0.1)
        outlinePass.usePatternTexture = false

        outlinePass.visibleEdgeColor.set('#ffffff')
        outlinePass.hiddenEdgeColor.set('#000000')
        composer.addPass(outlinePass)

        /**
         * Setup AA pass
         */
        antiAliasingPass = new SMAAPass(canvas.value.width, canvas.value.height)
        composer.addPass(antiAliasingPass)

        loader.load('/src/assets/map/map.glb', gltf => {
          if (!scene) return

          const box = new THREE.Box3().setFromObject(gltf.scene),
            size = box.getSize(new THREE.Vector3())

          let baseLen = Math.max(size.x, size.y) / 2,
            newFov =
              1 +
              ((Math.atan(
                baseLen / camera.position.distanceTo(box.getCenter(new THREE.Vector3()))
              ) *
                180) /
                Math.PI) *
                2

          camera.fov = newFov

          defaultFov = newFov
          camera.updateProjectionMatrix()

          elementGroup = new THREE.Object3D()

          gltf.scene.position.y = size.y / -2
          elementGroup.add(gltf.scene)

          elementGroup.rotation.x = Math.PI / 2
          elementGroup.scale.y = 0.2

          scene.add(elementGroup)
        })

        renderer.domElement.addEventListener('pointermove', onPointerMove)
      }

      const resizeFromCanvas = () => {
        if (!scene || !renderer || !camera || !canvas.value) return

        canvas.value.width = canvas.value.clientWidth * window.devicePixelRatio
        canvas.value.height = canvas.value.clientHeight * window.devicePixelRatio

        camera.aspect = canvas.value.width / canvas.value.height
        camera.updateProjectionMatrix()

        renderer.setSize(canvas.value.width, canvas.value.height)
        composer.setSize(canvas.value.width, canvas.value.height)
      }

      const render = () => {
        if (!composer) return
        TWEEN.update()
        composer.render()
        requestAnimationFrame(render)
      }

      function onPointerMove(event: PointerEvent) {
        const boundingRect = (event.target as HTMLElement).getBoundingClientRect()
        if (event.isPrimary === false || !canvas.value || !boundingRect) return

        mouse.x = ((event.clientX - boundingRect.left) / canvas.value.width) * 2 - 1
        mouse.y = -((event.clientY - boundingRect.top) / canvas.value.height) * 2 + 1

        checkIntersection()
      }

      function addSelectedObject(object: THREE.Object3D | THREE.Scene) {
        selectedObjects.value.splice(0, selectedObjects.value.length, object)
      }

      function checkIntersection() {
        if (!scene || !renderer || !camera || !outlinePass) return
        raycaster.setFromCamera(mouse, camera)

        const intersects = raycaster.intersectObject(scene, true)

        if (intersects.length > 0) {
          const selectedObject = intersects[0].object
          addSelectedObject(selectedObject)
        } else {
          selectedObjects.value.splice(0, selectedObjects.value.length)
        }
        outlinePass.selectedObjects = toRaw(selectedObjects.value)
      }

      onMounted(() => window.addEventListener('resize', resizeFromCanvas))
      onUnmounted(() => window.removeEventListener('resize', resizeFromCanvas))

      onMounted(initThree)
      onMounted(() => requestAnimationFrame(render))

      // const box = new THREE.Box3(),
      //   size = new THREE.Vector3(),
      //   center = new THREE.Vector3()
      // function fitCameraToSelection(object: THREE.Object3D | THREE.Scene, fitOffset = 1.2) {
      //   box.makeEmpty()
      //   box.setFromObject(object)

      //   box.getSize(size)
      //   box.getCenter(center)

      //   const maxSize = Math.max(size.x, size.y, size.z)
      //   const fitHeightDistance = maxSize / (2 * Math.atan((Math.PI * camera.fov) / 360))
      //   const fitWidthDistance = fitHeightDistance / camera.aspect
      //   const distance = fitOffset * Math.max(fitHeightDistance, fitWidthDistance)

      //   camera.near = distance / 100
      //   camera.fov = 10
      //   camera.far = distance * 1
      //   camera.updateProjectionMatrix()
      // }
      function fitCameraToObject(object: THREE.Object3D | THREE.Scene | false, offset = 0.5) {
        let newFov, center

        if (object) {
          const boundingBox = new THREE.Box3()

          boundingBox.setFromObject(object)

          center = boundingBox.getCenter(new THREE.Vector3())
          const { x: sizeX, y: sizeY } = boundingBox.getSize(new THREE.Vector3()),
            baseLen = Math.max(sizeX, sizeY) / 2

          newFov =
            offset + ((Math.atan(baseLen / camera.position.distanceTo(center)) * 180) / Math.PI) * 2
        } else {
          newFov = defaultFov
          center = new THREE.Vector3(0, 0, -1)
        }

        canInteract = false

        new TWEEN.Tween({ dir: prevLook, fov: camera.fov })
          .to({ dir: center, fov: newFov }, 500)
          .onUpdate(camProps => {
            camera.lookAt(camProps.dir)
            camera.fov = camProps.fov
            camera.updateProjectionMatrix()
            checkIntersection()
          })
          .easing(TWEEN.Easing.Quadratic.Out)
          .start()
          .onComplete(() => {
            canInteract = true
            prevLook = center
          })
      }

      const selectSector = () => {
        if (!canInteract || !selectedObjects.value.length) return

        const sector = toRaw(selectedObjects.value[0])

        // const test = new THREE.Box3()
        // test.setFromObject(sector)
        // console.log(test)

        // new TWEEN.Tween({ val: camera.zoom })
        //   .to({ val: 13 }, 1000)
        //   .onUpdate(({ val }) => {
        //     console.log(val)
        //     camera.zoom = val
        //     camera.updateProjectionMatrix()
        //   })
        //   .start()

        if (!sector) return
        let maybeSector = sector.userData.name as string
        selectedSector = maybeSector === selectedSector ? false : maybeSector

        fitCameraToObject(selectedSector ? sector : false)
      }

      return {
        canvas,
        cursor: computed(() => (selectedObjects.value.length ? 'pointer' : 'default')),
        selectSector,
      }
    },
  })
</script>

<style lang="scss">
  #canvas {
    width: 100% !important;
    height: 100% !important;
  }
</style>
