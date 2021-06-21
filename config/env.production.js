module.exports = {
  fileName: '.env.production',
  // 多环境配置
  env: {
    // 禁止删除
    default: {
      NODE_ENV: 'production',
      VUE_APP_API_BASE_URL: '',
      VUE_APP_TOKEN_NAME: 'token',
    },
    test: {
      NODE_ENV: 'production',
      VUE_APP_API_BASE_URL: '',
      VUE_APP_TOKEN_NAME: 'token-test',
    }
  }
}
