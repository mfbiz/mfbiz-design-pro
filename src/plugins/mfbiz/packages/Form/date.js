
import propsMixin from './mixin/props.js'
import notifyUpdateMixin from './mixin/notify-update.js'

import eventBus from '../util/eventBus.js'

export default {

  name: 'MfBizFormDate',
  
  mixins: [ propsMixin, notifyUpdateMixin ],

  props: {

    // 发送值前钩子函数
    beforeHook: Function,

    // 显示在输入框中的格式
    format: {
      type: [ String ],
      default: () => 'yyyy-MM-dd'
    },
    // 显示类型  year/month/date/dates/ week/datetime/datetimeran
    dateType: {
      type: String,
      default: () => 'month'
    },

    'rangeSeparator': {
      type: String,
      default: () => '-'
    },

    'startPlaceholder': {
      type: String,
      default: () => ''
    },

    'endPlaceholder': {
      type: String,
      default: () => ''
    },

    'valueFormat': {
      type: String,
      default: () => ''
    }
  },

  mounted() {

    // 解决iframe无法关闭时间弹框问题, 暂不清楚这个问题
    // eventBus._events[ 'closeMfBizFormDate' ] = []
    eventBus.$on('closeMfBizFormDate', () => {
      this.$refs.el.hidePicker()
    })
  },

  methods: {
  },
  

  render() {

    return (
      <el-date-picker
        
        ref="el"
        style="width: 100%;"
        v-model={ this.v } 
        type={ this.dateType }
        format={ this.format }
        value-format={ this.valueFormat }
        clearable={ this.clearable }
        disabled={ this.disabled }
        placeholder={ this.placeholder }
        onChange={ this.handleChange.bind(this) }
        start-placeholder={ this.startPlaceholder }
        end-placeholder={ this.endPlaceholder }
        range-separator={ this.rangeSeparator }
      ></el-date-picker>
    )
  },
}