export default {
  
  data: () => ({
    search: {
      flag: false,
      form: {},
      attributeKey: '',
      originData: {},
      params: {},
    },
  }),

  methods: {

    // 初始化筛选条件
    searchInit() {

      if ( !this.visible.search ) return
      
      this.attributeKey = 'filter' in this.config ? 'filter' : 'search'

      let i = 0
      
  
      Object.keys(this.config[ this.attributeKey ]).forEach(key => {
        i = 1
        this.$set(this.search.form, key, this.config[ this.attributeKey ][ key ].value || '')
      })

      if ( i === 0 ) return

      this.search.flag = true

    },

    handleSearchReset() {
      Object.keys(this.search.form).forEach(key => {
        this.$set(this.search.form, key,  this.config[ this.attributeKey ][ key ].value || '')
      })
      this.getList()
    },

    handleSearchChange(value, originValue, key) {
      this.search.originData[ key ] = originValue
    },

    async handleSearchQuery() {

      let params = this.search.form

      if ( 'hook' in this.config && 'search' in this.config.hook ) {
        params = this.config.hook.search(this.search.form, this.search.originData)
      } 

      this.search.params = params

      this.getList()
    },

    cancelSearch() {
      this.$emit('update:visible', {
        ...this.visible,
        search: false
      })
    },
  },
}