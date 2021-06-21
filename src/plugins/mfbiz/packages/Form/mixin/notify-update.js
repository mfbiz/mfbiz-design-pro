
export default {

  watch: {
    value: {
      deep: true,
      immediate: true,
      handler(v) {
        if ( v !== this.v ) this.v = v || ''
      }
    },
  },

  data: () => ({
    v: ''
  }),


  mounted() {
    this.init()
  },
  
  methods: {
    
    // 初始化
    init() {


      switch ( this.type ) {
        case 'MfBizFormInputNumber':
          this.v = this.value !== '' ? this.value : undefined
        break
        default :
          this.v = this.value
      }

      if ( this.visible && this.autofocus) {
        if ( this.type === 'MfBizFormTextarea' ) {
          this.$refs.el.$el.querySelectorAll('textarea')[0].focus()
        } else {
          if ( 
            this.type !== 'MfBizFormCascader' 
            && 
            this.type !== 'MfBizFormRadio'
          ) {
            this.$refs.el.$el.querySelectorAll('input')[0].focus()
          }
        }
      }
    },

    handleChange(v) {

      if ( this.v === this.value ) return
      
      // let _value = null
      
      switch ( this.type ) {

        case 'MfBizFormSelect' :

          // 远程搜索，值为空需要清空下拉框中的数据
          if ( this.type && v === '' && this.remote) {
            this.list = []
          }
          break;
        // case 'MfBizFormCascader' :
        //   _value = this.list
        //   break;
        // case 'MfBizFormDate' :
        //   _value = this.v.toString()
      }

      this.$emit('update:value', this.v)
      this.$emit('change', this.v)
      // this.$emit('close', true)

    } 

  },

  


}