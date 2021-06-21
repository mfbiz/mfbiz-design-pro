<style lang="less">

@themeColor: #1890ff;

.mfbiz-page-login__wrap {
  height: 100vh;

  .title {
    color: #202124;
    padding-bottom: 0;
    padding-top: 16px;
    font-family: "Google Sans", "Noto Sans Myanmar UI", arial, sans-serif;
    font-size: 24px;
    line-height: 1.3333;
  }

  .des {
    color: #202124;
    font-size: 16px;
    letter-spacing: 0.1px;
    line-height: 1.5;
    padding-bottom: 0;
    padding-top: 8px;
  }

  .title,
  .des {
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
      top: 35px;
      left: 16px;
      transition: 0.3s;
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

    .aside-active {
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
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(255, 255, 255, 0.3);
  }
  .warning {
    margin-top: 4px;
    color: #d93025;
    font-size: 13px;
  }

  .top {
    transform: translate3d(0, 0, 0);
  }

  .logo {
    text-align: center;
    img {
      height: 50px;
    }
  }

  .container-wrap {
    position: absolute;
    min-height: 500px;
    width: 448px;
    left: 50%;
    top: 50%;
    transform: translate3d(-50%, -50%, 0);

    .container {
      position: relative;
      min-height: 450px;
      padding: 48px 40px 36px;
      border-radius: 8px;
      border: 1px solid #dadce0;
    }

    .footer {
      font-size: 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 15px;

      .links {
        a {
          border-radius: 2px;
          color: #757575;
          display: inline-block;
          padding: 6px 16px;
        }
      }

      .language {
        color: #202124;
      }
    }
  }
}
</style>
<template>
  <div class="mfbiz-page-login__wrap">
    <div class="container-wrap">
      <main class="container">
        <div id="logo" class="logo">
          <img src="./logo.png" alt="每日优鲜" title="每日优鲜">
        </div>
        
        <div class="login-wrap">
          <h1 class="title">登录</h1>
          <p class="des">使用你的 优鲜 账号登录</p>
          <section class="item">
            <div class="form-user">
              <input 
                @input="handleChange($event, 'change', 'account')" 
                @focus="handleChange($event, 'focus', 'account')" 
                @blur="handleChange($event, 'blur', 'account')" 
                type="text" 
                placeholder="" 
                class="ipt" 
                :value="form.account" 
              />
              <aside ref="account">请输您的账号</aside>
              <div class="warning" v-show="form.userwarning && !form.account">
                <i class="el-icon-user" />
                &nbsp;
                <span>请输您的账号</span>
              </div>
            </div>
          </section>
          
          <section class="item">
            <div class="form-user">
              <input 
                type="password" 
                placeholder="" 
                class="ipt" 
                :value="form.password" 
                @input="handleChange($event, 'change', 'password')" 
                @focus="handleChange($event, 'focus', 'password')" 
                @blur="handleChange($event, 'blur', 'password')"
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
  


      </main>

      <footer class="footer">
        <div class="language">简体中文</div>
        <div class="links">
          <a href="javascript:;">帮助</a>
          <a href="javascript:;">隐私</a>
          <a href="javascript:;">条款</a>
        </div>
      </footer>
    </div>
  </div>
</template>

<script>


export default {

  name: 'MfBizPageLogin',

  props: {
    use: {
      type: Function,
      require: true,
      default: (ctx, next) => {}
    },
  },


  data () {
    return {
      res: {
        code: 0,
      },
      loading: false,
      percent: 0,
      form: {
        account: '',
        password: '',
        pwdwarning: false,
        userwarning: false,
      },
    }
  },
  methods: {

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

    confirmLogin() {

      if (this.form.account === '') {
        this.form.userwarning = true
        return
      }

      if (this.form.password === '') {
        this.form.pwdwarning = true
        return
      }

      let timer = null
      let num = 1

      this.loading = true

      timer = setInterval(() => {

        this.percent = this.percent + num
        
        if(this.percent >= 85) {
          clearInterval(timer)
        }
      }, 50)

      // 教给使用放去处理登录逻辑
      this.use({
        form: {
          account: this.form.account,
          password: this.form.password
        }
      }, ctx => {

        if ( !ctx ) {
          throw('next 函数第一个参数为必填项')
          return
        }

        const { code, message } = Object.assign({
          code: -1,
          message: '账号密码有误，请检查后重新登录',
        }, ctx.res)
        
        timer && clearInterval(timer)
        this.loading = false

        if  ( ctx.res ) {
          this.$router.push(ctx.res.route)
        } else {
          this.res.code = code || -1
          this.res.message = message
        }

      })

    },
    // 回车键登录
    handleKeyDown(ev) {
      if (  ev.keyCode === 13 ) {
        this.confirmLogin()
      }
    }

  }
}
</script>

