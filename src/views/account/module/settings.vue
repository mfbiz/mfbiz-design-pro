<style lang="less" scoped>
.account-settings-wrap {
  padding: 20px;
}
.account--settings-content {
  padding: 20px;
  background: #fff;
  display: flex;
}
.account-settings-left-menu {
  width: 224px;
  border-right: 1px solid #f0f0f0;
  > a {
    height: 40px;
    line-height: 40px;
    padding-left: 24px;
    margin-top: 4px;
    margin-bottom: 4px;
    padding: 0 16px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: block;
    color: inherit; font-size: 14px;
    &.active {
      color: var(--primary);
      border-right: 3px solid var(--primary);
    }
  }
}

.account-settings-right-content-item-title {
  margin-bottom: 22px;
  color: rgba(0,0,0,.85);
  font-weight: 500;
  font-size: 20px;
  line-height: 28px;
}

.account-settings-right-content {
  padding: 8px 40px;
}
.account-right-content-row {
  // display: flex;
  width: 100%;
  margin-bottom: 30px;;
  > div {
    font-size: 14px; 
    color: rgba(0,0,0,.85);
    &:nth-of-type(1) {
      margin-bottom: 14px;;
    }
    &:nth-of-type(2) {
      padding: 4px 11px;
      color: rgba(0,0,0,.85);
      font-size: 14px;
      line-height: 1.5715;
      background-color: #f4f4f4;
      background-image: none;
      border: 1px solid #d9d9d9;
      border-radius: 2px;
      transition: all .3s;
      min-width: 250px;;
    }
  }
}

.account-right-content-child-title {
  font-size: 14px; color: rgba(0, 0, 0, 0.85);
  margin-bottom: 20px;
}

.theme-colors-wrap {

  .theme-color-item {
    width: 20px; height: 20px;
    margin-right: 12px; font-size: 20px; color: #fff;
    display: inline-block;
    text-align: center;
    line-height: 20px;;
    position: relative;
    overflow: hidden;
  }
}

</style>
<template>
  <div class="account-settings-wrap">
    <main  class="account--settings-content">

      <div class="account-settings-left-menu">
        <template v-for="(item, index) in [{
          label: '基本设置',
          value: 'basic'
        }, {
          label: '个性化设置',
          value: 'special'
        }]">
          <a 
            href="javascript:;" 
            :key="index"
            :class="[
              menu === item.value ? 'active' : ''
            ]"
            @click.stop="handleMenu(item)"
          >{{ item.label }}</a>
        </template>
      </div>
      <div class="account-settings-right-content">
        <main class="account-settings-right-content-item" v-if="menu === 'basic'">
          <h1 class="account-settings-right-content-item-title">基本设置</h1>
          <section class="account-right-content-row">
            <div>昵称</div>
            <div>{{ getUser.name }}</div>
          </section>
          <section class="account-right-content-row">
            <div>用户名</div>
            <div>{{ getUser.account }}</div>
          </section>
          <section class="account-right-content-row">
            <div>邮箱</div>
            <div>{{ getUser.email }}</div>
          </section>
        </main>
        <main class="account-settings-right-content-item" v-else-if="menu === 'special'">
          <h1 class="account-settings-right-content-item-title">个性化设置</h1>
          <!-- <section class="account-right-content-row">
            <h3 class="account-right-content-child-title">整体风格设置</h3>
            <div></div>
          </section> -->
          <section class="account-right-content-row">
            <h3 class="account-right-content-child-title">主题色设置</h3>
            <div class="theme-colors-wrap">
              
              <a 
                href="javascript:;" 
                v-for="(item, index) in theme.color"
                :key="index"
                :title="item.label"
                :style="`background-color: ${ item.value }`"
                :class="[
                  'theme-color-item',
                  theme.activeColor === item.value ? 'el-icon-check' : ''
                ]"
                
                @click.stop="updateThemeColor(item)"
              >
              </a>
              <el-color-picker 
                style="transform: translateY(6px);" 
                @change="updateThemeColor" 
                size="small"
              ></el-color-picker>
            </div>
          </section>
          <!-- <section class="account-right-content-row">
            <h3 class="account-right-content-child-title">页面背景设置</h3>
            <div></div>
          </section> -->
          <!-- <section class="account-right-content-row">
            <h3 class="account-right-content-child-title">导航模式</h3>
            <div></div>
          </section>
          <section class="account-right-content-row">
            <h3 class="account-right-content-child-title">内容区域宽度</h3>
            <div></div>
          </section> -->
        </main>
      </div>
    </main>
  </div>
</template>
<script>

import appConfig from '@/app.config.js'

export default {

  computed: {
    getUser() {
      return this.$store.getters.getUser
    }
  },

  data: () => ({
    menu: 'special',
    theme: {
      activeColor: appConfig.theme.color[ 0 ].value,
      ...appConfig.theme,
    }
    ,
  }),
  

  mounted() {
  },

  methods: {

    updateThemeColor(color) {

      const value = typeof color === 'string' ? color : color.value
     
      this.theme.activeColor = value
      document.documentElement.style.setProperty(`--primary`, value)
    },

    handleMenu({ value }) {
      this.menu = value
    }

  }

};
</script>