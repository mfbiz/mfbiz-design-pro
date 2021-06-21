
import propsMixin from './mixin/props.js'
import notifyUpdateMixin from './mixin/notify-update.js'

export default {

  name: 'MfBizFormSwitch',
  
  mixins: [ propsMixin, notifyUpdateMixin ],

  props: {

  },
  
  render() {
    return (
      <el-switch
        ref="el"
        v-model={ this.v } 
        disabled={ this.disabled }
        onChange={ this.handleChange.bind(this) }
      >
      </el-switch>
    )
  },
}