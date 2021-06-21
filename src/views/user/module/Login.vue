<template>
  <div class="login-wrap">
    <h1 class="title">登录</h1>
    <p class="des">使用你的 优鲜 账号登录</p>
    <section class="item">
      <div class="form-user">
        <input 
          @input="handleChange($event, 'change', 'username')" 
          @focus="handleChange($event, 'focus', 'username')" 
          @blur="handleChange($event, 'blur', 'username')" 
          type="text" 
          placeholder="" 
          class="ipt" 
          :value="form.username" 
          @keydown="handleKeyDown"
        />
        <aside ref="username">请输入邮箱前缀名称或者账号</aside>
        <div class="warning" v-show="form.userwarning && !form.username">
          <i class="el-icon-user" />
          &nbsp;
          <span>请输入邮箱前缀名称或者账号</span>
        </div>
      </div>
    </section>
    
    <section class="item">
      <div class="form-user">
        <input 
          @input="handleChange($event, 'change', 'password')" 
          @focus="handleChange($event, 'focus', 'password')" 
          @blur="handleChange($event, 'blur', 'password')" 
          type="password" 
          placeholder="" 
          class="ipt" 
          :value="form.password" 
          @keydown="handleKeyDown"
        />
        <aside ref="password">请输入您的密码</aside>
        <div class="warning" v-show="form.pwdwarning && !form.password || res.code !== 0">
          <i class="el-icon-lock" />
          &nbsp;
          <!-- 给接口返回消息用 -->
          <span v-if="res.code !== 0">账号密码有误，请检查</span>
          <span v-else>请输入您的密码</span>
        </div>
      </div>
    </section>

    <a href="http://ldap.missfresh.net/passwd/ltb/index.php?action=sendtoken" target="_black" class="tip">忘记密码？</a>

    <div class="next">
      <el-button 
        type="primary"
        @click="confirmLogin"
      >登录</el-button>
    </div>
    
    <div class="next-loading" v-if="loading">
      <div class="top">
        <el-progress 
          :stroke-linecap="'square'" 
          :stroke-width="5" 
          :percentage="percent" 
          color="#1890ff"
          :show-text="false"
        />
      </div>
    </div>
  </div>
</template>
<script>

import { mapMutations } from 'vuex'
import  * as http from '../api/login.js'
import appConfig from '@/app.config.js'


export default {

  name: 'Login',

  data: () => ({
    percent: 0,
    loading: false,
    form: {
      username: '',
      password: '',
      pwdwarning: false,
      userwarning: false,
    },
    res: {
      code: 0,
      message: '输入有误，请检查'
    }
  }),

  created() {
    window.localStorage.removeItem('userInfo')
  },

  methods: {

    // 监听enter登录
    handleKeyDown(ev) {

      if ( 
          ev.keyCode === 13 && 
          this.form.username && 
          this.form.password
      ) {
        this.confirmLogin()
      }

    },

    openNotification() {
      this.$notification.open({
        message: '小鲜提醒',
        description: '正在加急研发中，敬请期待！',
      })
    },

    // 正在登陆
    async confirmLogin() {

      if (this.form.username === '') {
        this.form.userwarning = true
        return
      }

      if (this.form.password === '') {
        this.form.pwdwarning = true
        return
      }

      let timer = null
      let num = 0.6

      this.loading = true


      const { code, message, data } = await http.login({
        account: this.form.username,
        password: this.form.password,
      })
      
      if ( code != 0) {
        this.loading = false
        this.res.code = code || -1
        this.res.message = message || '账号密码有误，请检查'
        return
      }


      this.updateStoreUserInfo(data)
      

      timer = setInterval(() => {
        this.percent = this.percent + num + num
        if(this.percent >= 90) {

          clearInterval(timer)

          setTimeout(() => {


            if ( this.$route.query[ 'redirect' ] && !decodeURIComponent(this.$route.query.redirect).includes('user/login')) {

              this.$router.push(decodeURIComponent(this.$route.query.redirect))
            } else {
              this.$router.push(appConfig.workbench.path)
            }

          },1000)
        }
      })



    
    },

    /**
     * @param { Object } ev event对象
     * @param { String } eventName  事件名
     * @param { String } key  表单key
     */
    handleChange(ev, eventName, key) {

      this.form[ key ] = ev.target.value

      const userText = this.$refs[ key ]

      this.res.code = 0

      if (eventName === 'blur') {
        userText.className = ev.target.value === '' ? '' : 'aside-active aside-show'
        return
      }
      
      if (eventName === 'focus') {
        userText.className = 'aside-active'
        return
      }

      if (eventName === 'change') {

        return
      }

      

    },

    ...mapMutations({
      updateStoreUserInfo: 'SET_APP_USER_INFO'
    })

  }
}
</script>
<style lang="less" scoped>

  @themeColor: #1890ff;

  .title {
    color: #202124;
    padding-bottom: 0;
    padding-top: 16px;
    font-family: 'Google Sans','Noto Sans Myanmar UI',arial,sans-serif;
    font-size: 24px;
    line-height: 1.3333;
  }

  .des {
    color: #202124;
    font-size: 16px;
    letter-spacing: .1px;
    line-height: 1.5;
    padding-bottom: 0;
    padding-top: 8px;
  }

  .title, .des {
    text-align: center;
  }

  .form-user {

    position: relative;
    padding-top: 20px;

    aside {
      pointer-events: none;
      position: absolute;
      color: #80868b;
      font-size: 17px;
      font-weight: 400;
      top: 35px; left: 16px;
      transition: .3s;
      background-color: #fff;
    }

    .ipt {
      width: 100%; 
      display: block;
      text-align: left;
      border-radius: 4px;
      color: #202124;
      font-size: 17px;
      z-index: 1;
      border: 1px solid #d5d7db;
      padding: 13px 15px;

      &:focus {
        border-color: @themeColor;
        border-width: 2px;
      }
    }

    .aside-active{
      top: 12px;
      font-size: 12px;
      color: @themeColor;
      padding-left: 4px;
      padding-right: 4px;
    }

    .aside-show {
      color: #80868b;
    }

  }

  .tip {
    display: block;
    color: @themeColor;
    cursor: pointer;
    padding-bottom: 3px;
    padding-top: 9px;
    font-size: 15px;
  }

  .next {
    margin-top: 25px;
    text-align: right;
    margin-bottom: 20px;
  }

  .next-loading {
    position: absolute;
    left: 0; top: 0; right: 0; bottom: 0;
    background-color: rgba(255,255,255, .3)
  }
  .warning {
    margin-top: 4px;
    color: #d93025; font-size: 13px;
  }

  .top {
    transform: translate3d(0,0,0);
  }
</style>