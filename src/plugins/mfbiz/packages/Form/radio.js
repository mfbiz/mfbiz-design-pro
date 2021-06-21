
import propsMixin from './mixin/props.js'
import notifyUpdateMixin from './mixin/notify-update.js'

export default {

  name: 'MfBizFormRadio',
  
  mixins: [ propsMixin, notifyUpdateMixin ],

  props: {
    // 数据列表
    options: [ Array ],
  },
  
  render() {

    return (

      <el-radio-group 
        ref="el"
        v-model={ this.v }
        onChange={ this.handleChange.bind(this) }
        style="width: 100%;"
      > 
        {
          this.options.map(item => {
            return (
              <el-radio 
                disabled={ item[ 'disabled' ] || false } 
                label={ item.value }
              >{ item.label }</el-radio>
            )
          })
        }
        
      </el-radio-group>

    )
  },
}