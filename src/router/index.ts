import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/layouts/MainLayout.vue'),
      children: [
        {
          path: '',
          component: () => import('@/pages/HomePage.vue'),
        },
        {
          path: 'styleguide',
          component: () => import('@/pages/StyleGuide.vue'),
        },
        {
          path: 'map',
          component: () => import('@/pages/MapPage.vue'),
        },
      ],
    },
    {
      path: '/:catchAll(.*)*',
      component: () => import('@/layouts/NotFound.vue'),
    },
  ],
})

export default router
