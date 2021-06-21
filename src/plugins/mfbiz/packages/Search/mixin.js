export default {
  
  
  data: () => ({
    form: [],
  }),

  methods: {

    handleData(obj) {

      let form = {}

      Object.keys(obj).forEach(key => {
        form[ key ] = obj[ key ].value || ''
      })
      
      return form

    },
    
    // 初始化筛选条件
    init() {
      this.handleSearchReset()
    },

    
    handleSearchReset() {

      let obj = []

      if ( this.layout.group ) {
        this.config.forEach(item => {
          obj.push({
            ...item,
            data: this.handleData(item.data)
          })
        })
      }else {
        
        obj = {}

        Object.keys(this.config.form).forEach(key => {
          obj[ key ] = this.config.form[ key ].value || ''
        })
      }

      this.form = obj

    },

    handleSearchQuery() {

      let params = {}

      if ( this.layout.group ) {
        this.form.forEach(item => {
          if ( typeof item.prop !== 'string' ) {
            params = {
              ...params,
              ...item.data
            }
          } else {
            params[ item.prop ] = item.data
          }
        })
      } else {
        params = this.form
      }
      

      this.$emit('notice', params)

    },

    cancelSearch() {
      this.$emit('update:visible', false)
      this.handleSearchReset()
    }
  },
}