
import propsMixin from './mixin/props.js'
import notifyUpdateMixin from './mixin/notify-update.js'


export default {

  name: 'MfBizFormTextArea',

  mixins: [ propsMixin, notifyUpdateMixin ],

  props: {
    // 可自适应文本高度的文本域
    autosize: Boolean,
    // 输入框行数
    rows: {
      type: [ Number ],
      default: () => 2
    }
  },

  methods: {
  },

  render() {
    return (
      <el-input 
        ref="el"
        v-model={ this.v } 
        type="textarea"
        rows={ this.rows }
        maxlength={ this.maxlength }
        minlength={ this.minlength }
        clearable={ this.clearable }
        disabled={ this.disabled }
        placeholder={ this.placeholder }
        onChange={ this.handleChange.bind(this) }
      ></el-input>
    )
  },
}