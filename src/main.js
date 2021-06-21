import Vue from 'vue'
import App from './App'


import elementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import mfbizUI from "@mfbiz/element-ui";
import "@mfbiz/element-ui/lib/index.css";

Vue.use(elementUI)
Vue.use(mfbizUI)

import store from './app.store.js'
import router from './app.router.js'

const vm = new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app')

window.vm = vm
