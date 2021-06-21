<style lang="less">
.project-fe-basic-layout__wrap {
  display: flex;
  height: 100%;

  .el-menu {
    border-right-width: 0;
  }
}

.project-fe-basic-layout-menu {
  width: 220px;
  box-shadow: 2px 0 8px 0 rgba(29,35,41,.1);
  position: relative;
  z-index: 2;
}

.project-fe-basic-layout-logo {
  display: flex;
  align-items: center;
  padding: 20px;
  img {
    width: 40px;
  }
  .project-fe-basic-title {
    text-indent: 10px;
    color: var(--primary);
  }
}

.project-fe-basic-layout-content {
  background: #f0f2f6;
  flex: 1;
}
.project-fe-content-global-header {
  position: relative;
  display: flex;
  align-items: center;
  height: 48px;
  padding: 0 16px;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
}
.project-fe-components-global-header-index-action {
  display: flex;
  align-items: center;
}

.project-fe-c-g-h-index-user-name {
  text-indent: 10px;
  font-size: 14px;
  display: inline-block;
  cursor: pointer;
}

.project-fe-components-global-header-index-left {
  flex: 1;
}
.project-fe-components-global-header-index-right {
  justify-content: flex-end;
}
.project-fe-basic-menu-status {
  position: absolute;
  bottom: 0;
  left: 0; right: 0;
  height: 40px;
  display: flex;
  align-items: center;
  border-top: 1px solid #f0f0f0;
  padding-left: 20px;
  a { 
    position: relative;
    color: #303133; font-size: 20px;
    transition: .3s;
  }
  .menu-status-close {
    transform: rotate(180deg);
  }
}
.project-fe-basic-layout-logo-simple {
  img {
    transform: translate3d(-6px,0,0)
  }
  span.project-fe-basic-title {
    display: none;
  }
}
</style>
<template>
  <div class="project-fe-basic-layout__wrap">
    <div 
      class="project-fe-basic-layout-menu"
      :style="isCollapse ? 'width: 70px;' : ''"
    >
      <header 
        :class="[
          'project-fe-basic-layout-logo',
          isCollapse ? 'project-fe-basic-layout-logo-simple' : ''
        ]"
      >
        <img src="../assets/logo.png" alt="每日优鲜" title="每日优鲜" />
        <span class="project-fe-basic-title">{{ appConfig.name }}</span>
      </header>
      <el-menu
        class="project-fe-basic-layout-el-menu"
        @select="selectMenuItem"
        :collapse="isCollapse"
        :default-active="$route.path"
      >
        <template v-for="(item, index) in appConfig.menu.list">


          <el-menu-item v-if="!Array.isArray(item.children)" :key="index" :index="item.path">
            <i :class="item.icon"></i>
            <span slot="title">{{ item.title }}</span>
          </el-menu-item>
          <el-submenu v-else :key="index" :index="String(index)">
            <template slot="title">
              <i :class="item.icon"></i>
              <span slot="title">{{ item.title }}</span>  
            </template>
            <template v-for="(childrenItem, childrenIndex) in item.children">
              <el-menu-item 
                :key="index + '-' + childrenIndex" 
                :index="childrenItem.path"
              >{{ childrenItem.title }}</el-menu-item>
            </template>
          </el-submenu>
        </template>
      </el-menu>

      <div class="project-fe-basic-menu-status">
        <a 
          href="javascript:;" 
          @click.stop="handleCollapse"
          :class="[
            'tmpvue2-iconfont tmp-vue2-menu_fold',
            isCollapse ? 'menu-status-close' : ''
          ]"
        ></a>
      </div>
    </div>
    <div class="project-fe-basic-layout-content">
      <header class="project-fe-content-global-header">
        <div class="project-fe-components-global-header-index-left"></div>
        <div class="project-fe-components-global-header-index-right">
          <div class="project-fe-components-global-header-index-action">
            <el-avatar size="small" icon="el-icon-user-solid"></el-avatar>
            <el-dropdown @command="path => $router.push(path)">
              <span class="el-dropdown-link">
                <span class="project-fe-c-g-h-index-user-name">{{ user.name }}</span
                ><i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="/account/settings">个人设置</el-dropdown-item>
                <el-dropdown-item command="/user/login">注销登录</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
      </header>
      <router-view></router-view>
    </div>
  </div>
</template>
<script>

import appConfig from '../app.config.js'

export default {
  name: "BasicLayout",

  computed: {
    user() {
      return this.$store.getters.getUser
    }
  },
  components: {},

  watch: {},

  data: () => ({
    appConfig,
    isCollapse: false,
  }),

  

  mounted() {
      
  },

  methods: {


    handleCollapse() {
      this.isCollapse = !this.isCollapse
    },

    selectMenuItem(path) {
      if ( this.$route.path !== path ) this.$router.push(path)
    },
  },
};
</script>