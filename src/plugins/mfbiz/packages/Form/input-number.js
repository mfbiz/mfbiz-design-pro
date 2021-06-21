
import propsMixin from './mixin/props.js'
import notifyUpdateMixin from './mixin/notify-update.js'

export default {

  name: 'MfBizFormInputNumber',
  
  mixins: [ propsMixin, notifyUpdateMixin ],

  props: {
    // 数值精度
    precision: {
      type: Number,
      default: () => 0
    },
    // 计数器尺寸 medium、small、mini
    size: {
      type: String,
      default: () => 'medium'
    }
  },

  render() {

    return (
      <el-input-number
        style="width: 100%;"
        ref="el"
        v-model={ this.v }
        size={ this.size }
        clearable={ this.clearable }
        precision={ this.precision }
        disabled={ this.disabled }
        placeholder={ this.placeholder }
        onChange={ this.handleChange.bind(this) }
      ></el-input-number>

    )
  },
}