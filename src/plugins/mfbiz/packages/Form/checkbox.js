
import propsMixin from './mixin/props.js'
import notifyUpdateMixin from './mixin/notify-update.js'

export default {

  name: 'MfBizFormCheckBox',
  
  mixins: [ propsMixin, notifyUpdateMixin ],

  props: {
    label : String
  },
  
  render() {
    return (
      <el-checkbox 
        ref="el"
        v-model={ this.v } 
        disabled={ this.disabled }
        onChange={ this.handleChange.bind(this) }
      >{ this.label }</el-checkbox>
    )
  },
}