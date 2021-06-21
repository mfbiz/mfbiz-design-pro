
import {  LoginLayout } from './layouts'

export default  {
    path: '/user',
    name: 'user',
    component: LoginLayout,
    redirect: '/user/login',
    children: [
      {
        path: 'login',
        name: 'login',
        meta: {
        },
        component: () => import(/* webpackChunkName: "user-login" */ './module/Login.vue')
      },
    ]
}

