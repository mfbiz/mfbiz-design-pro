function valueHook(v, row) {
  return v
}
export default {

  props: {
    
    // 当前组件名称
    type: String,

    visible: [ Boolean ],

    // 自动获取焦点
    autofocus: {
      type: Boolean,
      default: () => false
    },

    // 表格当前行数据
    row: [ String, Number, Object, Array ],

    // 加工展示value值
    valueHook: {
      type: [ Function ],
      default: valueHook
    },

    // 最大输入值
    maxlength: {
      type: [ String, Number ],
      default: () => 500
    },

    // 最小输入值
    mixlength: {
      type: [ String, Number ],
      default: () => 0
    },


    // 输入框占位文本
    placeholder: {
      type: [ String, Number ],
      default: () => '请输入'
    },

    // 禁用
    disabled: Boolean,

    // 是否可清空
    clearable: Boolean,

    // 传入值
    value: {
      type: [ String, Number, Date, Object, Array, Boolean ],
      default: () => ''
    },

    // 布局
    layout: Object
  }

  
}