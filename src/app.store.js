import Vue from 'vue'
import Vuex from 'vuex'
import Cookies from 'js-cookie'

import createLogger from 'vuex/dist/logger';

import config from './app.config.js'



const files = require.context('./views', true, /store\.js$/)
const modules = {}

files.keys().forEach(key => {
  
  const item = files(key).default

  if ( item.name && item.namespaced ) {
    modules[ item.name ] = item
  }

})


Vue.use(Vuex)

export default new Vuex.Store({
  
  modules,

  state: {
    user: {
      accessToken: '',
      name: ''
    }
  },
  getters: {
    getToken: state => state.user.accessToken,
    getUser: state => state.user,
  },
  mutations: {

    SET_APP_USER_INFO: (state, user) => {
      state.user = user
      Cookies.remove(process.env.VUE_APP_CONFIG_TOKEN_NAME)
      Cookies.set(
        process.env.VUE_APP_CONFIG_TOKEN_NAME,
        user.accessToken,
        {
          domain: '.missfresh.net',
          expires: 7
        }
      )
      
      window.localStorage.setItem('userInfo', JSON.stringify(user))
    }
  },
  actions: {

  },

  strict: config.store.logger,
  plugins: config.store.logger ? [ createLogger() ] : []
  
})



