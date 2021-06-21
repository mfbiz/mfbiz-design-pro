export default {

  computed: {

  },

  data: () => ({
    create: {
      form: {},
      rules: {},
      config: {},
    }
  }),

  methods: {

    createInit() {
      
      if (!('create' in this.layout) || !('title' in this.layout.create)) {
        this.create.config = {
          width: '0',
          title: ''
        }
        return
      }

      this.create.config = this.layout.create

      
      let i = 0

      Object.keys(this.config.create).forEach(key => {

        i = 1

        this.$set(this.create.form, key,this.config.create[ key ].value || '')
        this.$set(this.create.rules, key, this.config.create[ key ].meta.rule || {})

      })

      
      if ( i === 0 ) return

    },

    cancelCreate(done) {

      const close = () => {

        this.$emit('update:visible', {
          ...this.visible,
          create: false
        })

        Object.keys(this.config.create).forEach(key => {
          this.$set(this.create.form, key, this.config.create[ key ].value || '')
        })
      }

      if (typeof done === 'function') { 
        this.$confirm('确认关闭？')
        .then(_ => {
          done()
          close()
        })
        .catch(_ => {})
      }else {
        close()
      }


    },

    affirmCreate() {

      this.$refs.createForm.validate((valid) => {
        if (valid) {
          
          this.loading.create = true

          let beforeHook =  null
          
          try {
            beforeHook = this.config.hook.create.before
          } catch(err) {
            beforeHook = function (params) { return params }
            console.warn('init beforeHook')
          }

          const params = beforeHook({
            ...this.config.params.create,
            ...this.create.form
          })
          
          this.config.request.create(params).then(res => {

            this.$message.success('创建成功')
            this.getList()
            this.cancelCreate()
            this.$emit('createSuccess')

            if ( this.config.hook && this.config.hook.create && this.config.hook.create.response ) {
              this.config.hook.create.response.call(this.$parent, res)
            }
          
          }).finally(() => {
            this.loading.create = false
          })
        } else {
          return false
        }
      })
    },

  }

}