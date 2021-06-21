
import propsMixin from './mixin/props.js'
import notifyUpdateMixin from './mixin/notify-update.js'

export default {

  name: 'MfBizFormInputUrl',
  
  mixins: [ propsMixin, notifyUpdateMixin ],

  render() {

    return (
      <el-input 
        ref="el"
        v-model={ this.v } 
        clearable={ this.clearable }
        disabled={ this.disabled }
        placeholder={ this.placeholder }
        onChange={ this.handleChange.bind(this) }
      >
        <i slot="prefix" style="margin-left: 3px;" class="mfbizIconfont mfbiz-wangzhi_huaban"></i>
      </el-input>
    )
  },
}