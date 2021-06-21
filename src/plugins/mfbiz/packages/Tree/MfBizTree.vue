<template>
  <div 
    :class="[
      'mfbiz-custom-tree-container',
      layoutShow ? '' : 'hidden-mfbiz-custom-tree-container'
    ]"
    ref="MfBizTree"
  >
  
    <header class="thy-card-header">
      <div class="thy-card-header-title">
        <h1 v-html="title"></h1>
        <div class="thy-card-header-opt">
          <el-tooltip 
            class="item" 
            effect="dark" 
            :content="layoutShow ? '隐藏': '显示'" 
            placement="top"
          >
            <a 
              href="javascript:;" 
              class="tree-fold-btn"
              @click="handleTreeLayout"
            >
              <svg 
                viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fit="" 
                height="16"  width="16" preserveAspectRatio="xMidYMid meet" focusable="false"
              >
                <g id="knnavigation/outdent" stroke-width="1">
                  <path 
                    d="M.993 8l3.014-2.5v5L.993 8zm-.4-4.803a.596.596 0 0 1-.593-.6c0-.332.265-.6.593-.6h14.814c.328 0 .593.268.593.6 0 .331-.265.6-.593.6H.593zM.603 14A.601.601 0 0 1 0 13.4c0-.331.27-.6.603-.6h14.794c.333 0 .603.269.603.6 0 .331-.27.6-.603.6H.603zm7.565-5.803a.6.6 0 1 1 0-1.2H15.4a.6.6 0 0 1 0 1.2H8.168z"
                  ></path>
                </g>
              </svg>
            </a>
          </el-tooltip>
        </div>
      </div>
    </header>

    <aside class="mfbiz-tree-shade-content" v-if="!layoutShow" v-html="title"></aside>
  
    <main style="overflow: auto">
      <div 
        style="padding: 20px 20px 0"
        v-if="filter"
      >
        <el-input
          placeholder="输入关键字进行过滤"
          v-model="filterText"
        />
      </div>
      <div 
          class="tree-main-wrap"
          v-loading="loading.first"
        >
      
          <el-tree
            ref="elTree"
            :data="data"
            node-key="id"
            highlight-current
            :show-checkbox="showCheckbox"
            :filter-node-method="filterNode"
            :expand-on-click-node="false"
            :render-content="renderContent"
            icon-class="el-icon-arrow-right"
            :lazy="lazy"
            :load="loadNode"
            :props="defaultProps"
            @check="handleNodeCheck"
            v-bind="config.attributes ? config.attributes : {
              'default-expand-all': lazy ? false : true
            }"
          />
        </div>
    </main>
    
  </div>
</template>
<script>

export default {

  name: "MfBizTree",

  props: {

    value: [ String, Number ],

    defaultProps: {
      type: Object,
      default: () => ({
        label: 'label',
        children: 'children'
      })
    },

    filter: Boolean,

    showLengthField: {
      type: String,
      default: () => ''
    },
    

    title: String,

    // 节点是否可被选择
    'showCheckbox': Boolean,

    // 是否懒加载子节点，需与 load 方法结合使用
    lazy: Boolean,
    load: [ Object, Function, String ],

    config: {
      type: Object,
      default: () => ({
        request: {
          loadTree: () => ([])
        },
        params: {
          loadTree: {}
        },
        attributes: {}
        // 操作按钮权限
        // actionButtons
      })
    },
    
  },

  watch: {
    filterText(v) {
      this.$refs.elTree.filter(v);
    },
    value: {
      deep: true,
      immediate: true,
      handler(v) {
        // 初始化赋值
        if ( this.selectActive.id !== v ) this.selectActive.id = v
      }
    }
  },

  data() {
    return {
      filterText: '',
      rootNodeData: {}, 
      data: [],
      loading: {
        first: true
      },
      clickActive: {
        id: null,
        type: null
      },
      selectActive: {
        id: null
      },
      layoutShow: true,
    }
  },

  mounted() {
    // 非异步请求执行
    if ( !this.lazy ) this.init()
  },

  methods: {
    

    async init() {
      this.data = await this.getTree()
    },

    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },

    handleNodeCheck() {
      this.$emit('checked', this.$refs.elTree.getCheckedNodes())
    },

    getTree() {

      return this.config.request.loadTree({
        ...this.config.params.loadTree
      }).then(v => {
        return v
      }).finally(() => {
        setTimeout(() => {
          this.loading.first = false
        }, 500)
      })

    },

    /** 
     *
     *  isRequest lazy 为false情况看下，是否重新请求接口，默认请求
     */
    async updateNode(isRequest = true) {
      
      if ( this.lazy ) {

        let node = null

        if ( this.clickActive.type === 'create') {
          node = this.$refs.elTree.getNode(this.clickActive.data)
        }else if( this.clickActive.type === 'delete' ||  this.clickActive.type === 'update') {
          node = this.$refs.elTree.getNode( this.clickActive.node.parent ? this.clickActive.node.parent.data : this.clickActive.node.data)
        } else if ( this.selectActive.id ) {
          node = this.$refs.elTree.getNode(this.selectActive.data)
        }else {
          node = this.$refs.elTree.getNode(this.rootNodeData[ 0 ] || this.data[ 0 ])
        }

        setTimeout(() => {
            node.loaded = false
            node.expand()
        }, 500)
        
      } else {
        
        if ( isRequest ) {
          this.data = (await this.getTree() || [])
        } else {
          
          if ( this.clickActive.type === 'delete' ) {
            const parent = this.clickActive.node.parent
            const children = parent.data.children || parent.data
            const index = children.findIndex(d => d.id === this.clickActive.data.id)
            children.splice(index, 1)
          }
         
        }

      }
    },


    handleTreeLayout() {
      this.layoutShow = !this.layoutShow
    },

    async loadNode(node, resolve) {

      if ( node.level === 0 ) {
        const data = await this.getTree()
        this.rootNodeData = data
        resolve(data)
      }else {
        this.load(...arguments)
      }

    },

    handleMore(ev) {
      ev.stopPropagation()
      ev.preventDefault()
    },

    selectOperation(node, data, store, type) {
      this.$set(this.clickActive, 'type', type)
      this.$set(this.clickActive, 'data', data)
      this.$emit('operation', {
        data,
        type,
        node
      }, this.updateNode.bind(this))

      this.$refs.MfBizTree.click()
    },

    selectNode(node, data, store) {

      // 点击文本，委托触发修复checkbox
      if ( this.showCheckbox && !node.disabled) {
        node.checked = !node.checked
        this.$nextTick(() => {
          this.handleNodeCheck()
        })
      }
      
      this.$set(this, 'selectActive', {
        id: data.id,
        node,
        data,
        label: data[ this.defaultProps.label ]
      })
      this.$emit('select', data, node)
      this.$emit('update:value', data)
    },

    showPopover(node, { id }, store, ev) {
      this.$set(this, 'clickActive', {
        id,
        node
      })
    },

    hidePopover() {
      this.clickActive.id = ''
      this.selectActive.id = ''
    },

    renderContent(h, { node, data, store }) {
      
      let status = {
        operation: false,
        update: {
          visible: true
        },
        delete: {
          visible: true
        },
        create: {
          visible: true
        }
      }

      if ( typeof this.config.actionButtons === 'function' ) {
        status = Object.assign(status, this.config.actionButtons(node, data))
      }

      return (
        <span 
          class="custom-tree-node "
          onClick={ this.selectNode.bind(this, node, data, store) } 
        >
          <span 
            class={
              `mfbiz-tree-name ${ this.selectActive.id === data.id ? 'mfbiz-tree-name-active': '' }`
            }
          >
            <i class={
              `
                 mfbizIconfont ${ node.expanded && !node.isLeaf ? 'mfbiz-wenjianjia1' : 'mfbiz-wenjianjia' } mfbiz-node-status-icon
              `
            }></i>
            <span> { data[ this.defaultProps.label ] }&nbsp;{ this.showLengthField !== '' ? data[ this.showLengthField ] : '' }</span>
          </span>
          <aside 
            style={{ 'display': status.operation ? 'block' : 'none' }}
            class="mfbiz-tree-operation" 
          >
            <el-popover
              popper-class="custom-mfbiz-tree-popover-node"
              placement="bottom"
              title=""
              width="150"
              trigger="click"
              onHide={ this.hidePopover.bind(this, node, data, store) }
              onShow={ this.showPopover.bind(this, node, data, store) }
            >
              <main class="mfbiz-tree-node-operation__wrap">
                <a 
                  onClick={ this.selectOperation.bind(this, node, data, store, 'create') } 
                  href="javascript:;" 
                  class="node-operation-btn-item"
                  style={{ 'display': status.create.visible ? 'block' : 'none' }}
                >
                  <span class="o-b-icon el-icon-circle-plus-outline"></span>
                  <span>新建</span>
                </a>
                <a 
                  onClick={ this.selectOperation.bind(this, node, data, store, 'update') } 
                  href="javascript:;" 
                  class="node-operation-btn-item"
                  style={{ 'display': status.update.visible ? 'block' : 'none' }}
                >
                  <span class="o-b-icon el-icon-edit"></span>
                  <span>编辑</span>
                </a>
                <a 
                  onClick={ this.selectOperation.bind(this, node, data, store, 'delete') } 
                  href="javascript:;" 
                  class="node-operation-btn-item"
                  style={{ 'display': status.delete.visible ? 'block' : 'none' }}
                >
                  <span class="o-b-icon el-icon-delete"></span>
                  <span>删除</span>
                </a>
              </main>
              <i 
                style={ `display: ${ !status.update.visible && !status.create.visible && !status.delete.visible ? 'none' : 'block' }` }
                title="更多" 
                slot="reference" 
                onClick={ this.handleMore.bind(this) }
                class={
                  `el-icon-more tree-move-icon ${ this.clickActive.id === data.id && 'tree-move-icon-active'  } `
                }
              ></i>
            </el-popover>
            
          </aside>
        </span>
      );
    }
  }
};
</script>

<style lang="less">

  .mfbiz-tree-node-operation__wrap {

    .node-operation-btn-item {
      display: block;
      height: 30px;
      line-height: 30px;
      color :#666; font-size: 14px;
      transition: .1s;
      padding-left: 20px; 
      padding-right: 20px; 
      span {
        &.o-b-icon {
          font-size: 17px;
          color: #aaa; 
        }
        &:last-of-type {
          color: #666;
          font-size: 14px;
          display: inline-block;
          padding-left: 8px;
        }
      }
      &:hover {
        background-color: #f1f1f1;
      }
    }
  }

  .mfbiz-custom-tree-container {

    position: relative;
    background: #fff;
    display: grid;
    grid-template-rows: 51px auto;

    .thy-card-header {
      padding: 0 20px;
    }
    
    .thy-card-header-title {  
      display: flex;  
      align-items: center;
      padding-top: 10px;
      padding-bottom: 10px;
      border-bottom: 1px solid #efefef;
      > h1 {
        flex: 1;
        font-size: 15px;
        color: #888;
      }
      .tree-fold-btn {
        color: #aaa;
        g {
          fill: #aaa;
        }
        &:hover {
          g {
            fill: var(--primary);
          }
        }
      }

      .thy-card-header-opt {
        transform: translate3d(0,3px,0);
      }
    }

    .tree-main-wrap {
      margin-top: 12px;
    }

    .el-tree-node {
      width: fit-content;
      min-width: 100%;
    }

    .el-tree-node .el-tree-node__content {
      height: 30px;
      &:hover {
        background-color: #f1f1f1;
        .tree-move-icon {
          visibility: visible;
        }
      }
    }

    .is-focusable {
      .el-tree-node__content {
        background: #fff;
      }
    }


    .el-icon-arrow-right {
      font-size: 16px;
      margin-left: 14px;
    }

  }

  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .mfbiz-tree-name {

    flex: 1;
    color: #666; font-size: 14px;
    padding-right: 8px;

    .mfbiz-node-status-icon {
      color: #ddd; font-size: 18px;
      padding-right: 2px; display: inline-block;
    }

  }
  .mfbiz-tree-name-active {
    color: var(--primary);
    i.mfbizIconfont {
      color: inherit
    }
  }
  
  .mfbiz-tree-operation {
    height: 100%;
    padding-right: 10px;
    .tree-move-icon {
      outline: none;
      font-size: 16px;
      visibility: hidden;
    }
    &:hover {
      .tree-move-icon {
        color: var(--primary);
      }
    }
    .tree-move-icon-active {
      visibility: visible;
      color: var(--primary);
    }
  }

  .custom-mfbiz-tree-popover-node {
    padding-left: 0 !important;
    padding-right: 0 !important;
  }

  .hidden-mfbiz-custom-tree-container {
    width: 50px !important;
    .thy-card-header-title {
      h1 {
        display: none;
      }
    }
    .mfbiz-tree-shade-content {
      position: absolute;
      top: 30px;
      font-size: 15px;
      color: #888;
      left: 0; right: 0;
      background-color: #fff;
      bottom: 0;
      z-index: 2;
      padding: 12px 10px 12px 20px;
    }
  }
</style>