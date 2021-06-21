
import {  BasicLayout } from '@/layouts'

export default  {
    path: '/list',
    name: 'list',
    component: BasicLayout,
    redirect: '/list/search',
    children: [
      {
        path: 'search',
        name: 'list-search',
        meta: {
        },
        component: () => import(/* webpackChunkName: "list-search" */ './module/list/search.vue')
      },
      {
        path: 'basic',
        name: 'list-basic',
        meta: {
        },
        component: () => import(/* webpackChunkName: "list-basic" */ './module/list/basic.vue')
      },
      {
        path: 'basicDetail/:id',
        name: 'list-basic-detail',
        meta: {
        },
        component: () => import(/* webpackChunkName: "list-basic" */ './module/detail/basic.vue')
      },
    ]
}

