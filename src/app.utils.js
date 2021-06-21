import axios from 'axios'
import appConfig from './app.config.js'

import { Notification, Message } from 'element-ui'

const service = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL,
  timeout: 10000 
})

const err = (error) => {

  // 超时处理
  if ( error.message.includes('timeout') ) {
    Notification.error({
      title: '请求超时',
      message: error.message
    })
  }

  // 接口不存在
  if ( error.reques && error.request.status === 404 ) {
    Notification.error({
      title: '404',
      message: `接口地址不存在`
    })
  } else if ( error.response ) {
    
    const first = (error.response.status + '').substr(0, 1)

    if ( first == 5 || first == 4) {
      Notification.error({
        title: error.response.status,
        message: '请联系开发人员'
      })
    }
  }


  return Promise.reject('接口异常')
}

service.interceptors.request.use(config => {

  if ( config.method === 'get' ) {
    config.params = {
      ...config.params,
      // 处理服务端强缓冲问题
      timestamp: Date.now()
    }
  }

  return config
}, err)


service.interceptors.response.use(({ data, config }) => {

  // 白名单中禁止全局提示的直接返回data
  if ( appConfig.request.notTip.some(item => config.url.includes(item)) ) {
    return data
  }

  // 后台需强制返回{ data, code, message }，后台偷懒
  if ( data.code == 0) {
    return data[ 'data' ] || {}
  } else {
    // 接口统一抛错
    Message.error(data.message)
    // 用户未登录, 
    if ( data.code == '4001' || data.code == '4003' ) {
      window.location.href = window.location.origin + `/#/user/login?redirect=${ encodeURIComponent(window.location.hash.substr(1)) }`
    }
  }

  return Promise.reject('抛错统一处理')

}, err)


export {
  service as axios
}
