
import propsMixin from './mixin/props.js'
import notifyUpdateMixin from './mixin/notify-update.js'

export default {

  name: 'MfBizFormInput',
  
  mixins: [ propsMixin, notifyUpdateMixin ],

  // mounted() {
  //   setTimeout(() => {
  //     this.$refs.ipt.$el.children[0].focus()
  //   }, 5000)

  // },
  render() {

    return (
      <el-input 
        ref="el"
        v-model={ this.v } 
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