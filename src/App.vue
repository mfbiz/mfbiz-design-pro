<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>

import { mapMutations } from 'vuex'

export default {

  name: "app",

  components: {},

  created() {

    return
    if ( this.$route.path === '/user/login' ) {
      window.localStorage.removeItem('userInfo')
    }else {

      try {

        const USER_INFO = JSON.parse(window.localStorage.getItem('userInfo'))

        if ( USER_INFO ) {
          this.updateStoreUserInfo(USER_INFO)
        } else {
          throw 'undefined userInfo';
        }
        
      } catch (err) {
        this.$router.push('/user/login')
      }
    }


    if ( navigator.userAgent.indexOf("Chrome") == -1 ) {
      this.$alert('请使用Chrome浏览器以获得最佳产品体验', '警告', {
        confirmButtonText: '确定',
        callback: (action) => {
          this.$message.error('已关闭使用警告')
        }
      })
    }
  
  },

  methods: {

    ...mapMutations({
      updateStoreUserInfo: 'SET_APP_USER_INFO'
    }),

  },
};
</script>

<style lang="less">
  @import './style/index.less';
</style>
