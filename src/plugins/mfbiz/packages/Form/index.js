
import MfBizFormDialogBox from './dialogBox'
import MfBizFormLayout from './layout.vue'
import MfBizFormCascader from './cascader.vue'
import MfBizFormCompose from './compose/index.vue'
import MfBizFormEditor from './editor/index.vue'

const components = {
  MfBizFormDialogBox,
  MfBizFormLayout,
  MfBizFormCascader,
  MfBizFormCompose,
  MfBizFormEditor
}

const files = require.context('./', false, /\.js$/)


files.keys().forEach(key => {
  if ( !key.includes('index') ) {
    components[ files(key).default.name ] = files(key).default
  }
})


export default {
  name: 'MfBizForm',
  ...components,
}


// {
//   type: 'input',    // 渲染类型
//   maxlength: 10,    // 最大输入值(input/inputNumber/textarea)
//   minlength: 0,     // 最小输入值(input/inputNumber/textarea)
//   placeholder: '请输入',  // 输入框占位文本
//   clearable: false, // 是否可清空
//   disabled: false, // 禁用   boolean
//   value: '',// 传入值
//   autosize: false, // 自适应内容高度，只对 textarea 有效
//   rows: 2, // 输入框行数，只对 textarea 有效
//   precision: 0, // 数值精度 只对inputNumber 有效
//   size: 'medium', // 计数器尺寸 只对inputNumber 有效
//   filterable: false, // 是否可搜索，只对select有效
//   remote: false, // 是否为远程搜索 只对select有效
//   remoteMethod: function(){}, // 远程搜索方法 只对select有效并且remote为true
//   multiple: false, // 是否多选 只对select有效
//   options: [], // 数据列表  只对select有效
//   format: 'yyyy-MM-dd', // 显示在输入框中的格式 只对date有效
//   dateType: 'datetime', // 显示类型  year/month/date/dates/ week/datetime/datetimeran  只对date有效
// }

