import Vue from 'vue'
import Router from 'vue-router'

import appConfig from './app.config'

Vue.use(Router)


const files = require.context('./views', true, /router\.js$/)
const routes = [{
  path: '/',
  name: '',
  redirect: appConfig.workbench.path,
}]

files.keys().forEach(key => {

  const item = files(key).default

  if ( item.component && item.path ) {
    routes.push(item)
  }

})

export default new Router({
  routes,
  mode: 'hash'
})


