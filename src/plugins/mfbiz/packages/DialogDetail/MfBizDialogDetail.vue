<style lang="less">
@import "./style.less";
.tip-info {
}
</style>
<template>
  <main 
    class="mfbiz-dialog-detail"
    v-if="visible"
  >
    
    <div class="mfbiz-dialog-detail-modal"></div>

    <div 
      class="mfbiz-dialog-detail-content"
    >

      <header class="mfbiz-d-d-header">
        <div class="mfbiz-d-d-h-left-area">
          <div class="title-id">
            <div class="title-id-modal"></div>
            <span class="title-id-text el-icon-set-up">ID - {{ config.data[ 'id' ] || '' }}</span>
          </div>
          <div class="title-type">{{ config.data[ 'title' ] || '' }}</div>
        </div>
        
        <div class="operation-area">
          <!-- <a href="javascript:;" class="operation-area-button el-icon-link"></a> -->
          <!-- <a href="javascript:;" class="operation-area-button el-icon-more"></a> -->
          <a 
            href="javascript:;" 
            class="operation-area-button el-icon-close"
            @click.stop="$emit('update:visible', false)"
          ></a>
        </div>
      </header>

      <main 
        :class="[
           layout.left && 'mfbiz-detail-content',
           layout.right && 'mfbiz-detail-flex'
        ]"
      >

        <article class="mfbiz-detail-left__wrap">
          <div class="mfbiz-detail-fixed-nav__wrap" >
            <a 
              href="javascript:;" 
              title="导航" 
              class="hover-btn mfbizIconfont mfbiz-liebiao"
            ></a>
            <div 
              :class="[
                'fixed-nav-list',
                visibleNav ? '' : 'fixed-nav-list-active'
              ]"
            >
              <nav class="fixed-nav">
                <template v-for="(item, index) in config.nav">
                  <a 
                    href="javascript:;" 
                    :class="[ 
                      index === 0 ? 'item' : '' 
                    ]"
                    :key="index" 
                  >{{ item.label }}</a>
                </template>
              </nav>
              <p class="tip-info">当前页面模块目录</p>
            </div>
          </div>


          <div 
            class="mfbiz-detail-content-item"
            v-for="(item, index) in  config.nav"
            :key="index"
            :id="item.value + 'Dialog'"
          >
            <h2 class="m-d-c-i-title">
              {{ item.label }}
            </h2>
            <slot :name="item.value"></slot>
          </div>
        </article>

        <article class="mfbiz-detail-right__wrap" v-if="layout.right">
          <slot name="rightAreaContent"></slot>
        </article>

      </main>


    </div>
    

  </main>
</template>
<script>
export default {

  name: 'MfBizDialogDetail',

  props: {


    visible: Boolean,

    config: {
      type: Object,
      required: true,
    },

    layout: {
      type: Object,
      default: () => ({
        left: true,
        right: false
      })
    }
  },

  watch: {
    visible: {
      deep: true,
      immediate: true,
      handler(v) {
        v && this.init()
      }
    }
  },

  data: () => ({
    visibleNav: true,
    tabs: [],
    // 传入的数据
    detail: {},
  }),


  methods: {

    // 初始化config
    init() {

      if ( 'tabs' in this.config ) {

        this.tabs = this.config.tabs.map(item => {

          // 字段回显value值
          if ( item.type === 'field' ) {
            Object.keys(item.form).forEach(key => {
              item.form[ key ].value = this.data[ key ] 
            })
          }

           return item

        })
      }

      this.detail = {
        form: {
          ...this.data
        },
      }
    },


    handleFieldChange(key, column, value) {
      this.detail.form[ key ] = value
      column.meta.updateHook.call(this.$parent, this.detail.form)
    }

  }

}
</script>