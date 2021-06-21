

const components = {
}

const files = require.context('./', false, /\.vue$/)


files.keys().forEach(key => {
  if ( !key.includes('index') ) {
    components[ files(key).default.name ] = files(key).default
  }
})


export default {
  name: 'MfBizField',
  ...components,
}
