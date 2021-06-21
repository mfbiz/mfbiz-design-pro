<template>
  <div id="userLayout" class="user-layout-wrapper">
    <div class="container-wrap">
      <main class="container">
        <div id="logo" class="logo">
          <img src="../assets/logo.png" alt="每日优鲜" title="每日优鲜">
        </div>
        <router-view></router-view>
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

  name: 'UserLayout',

  data () {
    return {}
  },
  mounted () {
  },
  beforeDestroy () {
  }
}
</script>

<style lang="less" scoped>

  .user-layout-wrapper {
    height: 100vh;
  }

  .logo {
    text-align: center;
    img {
      height: 50px;
    }
  }

  .container-wrap {
    position: absolute;
    min-height: 500px; width: 448px;
    left: 50%; top: 50%;
    transform: translate3d(-50%, -50%, 0);

    .container {
      position: relative;
      min-height: 450px;
      padding: 48px 40px 36px;
      border-radius: 8px;
      border: 1px solid #dadce0
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
</style>
