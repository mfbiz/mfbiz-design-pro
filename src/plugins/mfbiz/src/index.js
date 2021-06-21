
import $utils from './utils'

const files = require.context('../packages/', true, /index\.js$/)
const components = {}



files.keys().forEach(key => {

  const module = files(key).default

  if ( 
      module.name === 'MfBizForm' 
      || 
      module.name === 'MfBizPage' 
      ||
      module.name === 'MfBizField' 
  ) {

    for (let k in module) components[ k ] = module[ k ]


  } else {
    components[ module.name ] = module
  }


})

const install = function(Vue, opts = {}) {

  Object.keys(components).forEach(key => {
    if ( key.includes('MfBiz')) Vue.component(components[ key ].name, components[ key ])
  })

  
  window.mfbiz = {
    $utils
  }

}


export default {
  version: '1.0.0',
  describe: '运维组业务组件库',
  install,
  ...components
}