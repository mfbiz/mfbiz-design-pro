
<template>
  <el-cascader
    v-model="v"
    style="width: 100%"
    ref="el"
    :debounce='debounce'
    :options='list'
    :props="props"
    :placeholder='placeholder'
    :filterable='filterable'
    :clearable='clearable'
    :collapse-tags='collapseTags'
    :show-all-levels='showAllLevels'
    :separator='separator'
    :size='size'
    @visible-change="handleHiddenSelect"
    @change="handleChange"
  >
    <template slot-scope="{ node, data }">
      <span>{{ data[ props.label ] }}</span>
      <span v-if="data.children"> ({{ data.children.length }}) </span>
    </template>
  </el-cascader>
</template>
<script>

import propsMixin from './mixin/props.js'
import notifyUpdateMixin from './mixin/notify-update.js'


// // value为对象时特殊处理
//     if (this.deconstructionValue && Object.prototype.toString.call(this.v) === '[object Object]') {

//       const data = this.$utils._.clone(this.v)
      
//       this.list.push({
//         label: data[ this.deconstructionValue.label ],
//         value: data[ this.deconstructionValue.value ],
//       })

//       this.v = data[ this.deconstructionValue.value ]
//     }


export default {

  name: 'MfBizFormCascader',

  mixins: [ propsMixin, notifyUpdateMixin ],

  props: {
    options: [ Array, Promise, Function, Object ],
    // 是否多选
    multiple: Boolean,
    // 是否折叠Tag
    collapseTags: Boolean,
    // 是否可清除
    clearable: Boolean,
    // 只展示最后一级( true为不展示 )
    showAllLevels: {
      type: Boolean,
      default: () => true
    },
    // 默认触发方式
    expandTrigger: {
      type: String,
      default: () => 'click'
    },
    // 输入框占位文本
    placeholder: String,
    // 是否支持搜索
    filterable: Boolean,
    // 延迟搜索
    debounce: {
      type: Number,
      default: () => 1000
    },
    // 默认分隔符
    separator: {
      type: String,
      default: () => '/'
    },
    // 文本框大小
    size: {
      type: String,
      default: () => 'medium'
    },
    // 是否远程搜索
    remove: [ Boolean ],
    // 展示key
    fieldKey: {
      value: 'value',
      label: 'label'
    },
    // 数据格式 true 带路径
    emitPath: Boolean,

  },


  data: () => ({
    props: { 
      multiple: false,
      expandTrigger: 'click',
      emitPath: true,
      checkStrictly: false,
      // lazy: false,
      // 暂不支持远程搜索
      // lazyLoad: (node, resolve) {
      //   return null
      // }
    },
    timer: null,
    list: [],
    filterValue: '',
  }),

  async mounted() {

    // 是否多选
    this.props.multiple = this.multiple 
    // 触发方式
    this.props.expandTrigger = this.expandTrigger
    // 数据格式路径
    this.props.emitPath = this.emitPath

    // 字段名自定义
    Object.keys(this.fieldKey).forEach(key => {
      this.$set(this.props, key, this.fieldKey[ key ])
    })

    // 非远程搜索,
    if ( !this.remote ) {
      
      if( Object.prototype.toString.call(this.options) === '[object Object]') {
        const res = await this.options.request(this.options.params(this.row))
        this.list = this.options.response(res)
      } else if ( typeof this.options === 'function') {
        this.list = await this.options(this.row)
      } else {
        this.list = await this.options || []
      }
    }

  },

  
  methods: {
    handleHiddenSelect(flag) {
      if ( !flag && this.value !== this.v) this.handleChange(this.v)
    }
  },
  
}
</script>
<style lang="less" scoped>
  .not-data-comment {
    font-size: 24px; color: #ccc;
    position: absolute;
    left: 0; top: 50px; right: 0; bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-flow: column;
  }
</style>