

import {  BasicLayout } from '@/layouts'

export default  {
    path: '/account',
    name: 'account',
    component: BasicLayout,
    redirect: '/account/settings',
    children: [
      {
        path: 'settings',
        name: 'accountSettings',
        meta: {
        },
        component: () => import(/* webpackChunkName: "account-settings" */ './module/settings.vue')
      },
    ]
}

