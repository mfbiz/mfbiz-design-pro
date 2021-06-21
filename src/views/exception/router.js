


import BasicLayout from '@/layouts/BasicLayout.vue'

export default {
  path: '/',
  name: '',
  component: BasicLayout,
  children: [
    {
      path: '403',
      name: '403',
      component: () => import('./module/403.vue'),
    }, {
      path: '404',
      name: '404',
      component: () => import('./module/404.vue'),
    }, {
      path: '500',
      name: '500',
      component: () => import('./module/500.vue'),
    }
  ]
}

