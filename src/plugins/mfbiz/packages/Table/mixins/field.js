
import _ from 'lodash'

export default {

  data: () => ({
    field: {
      list: [],
      active: [],
      map: {},
    },
    checked: false,
    dragging: false,
  }),

  methods: {

    async fieldInit() {

      if ( !( 'field' in this.config ) ) {
        this.view.table = true
        return
      }

      const tileData = this.config.field.reduce((prev, next) => prev.concat(next.list), [])
      
      const res = await this.config.request.getViewConfig({
        ...this.config.params.getViewConfig
      })


      if (Object.keys(res).length !== 0 ) {

        const viewFiledConfig = JSON.parse(res.viewFiledConfig)

        // 以最新配置数据为主
        const list = this.config.field.map(item => ({
          ...item,
          list: item.list.map(fieldItem => ({
            ...fieldItem,
            value: viewFiledConfig.map[ fieldItem.prop ] || false
          }))
        }))

        const active = []

        tileData.forEach(tileItem => {

          const data = viewFiledConfig.active.find(item => item.prop === tileItem.prop)
          
          if ( data ) {
            active.push({
              ...tileItem,
              value: data.value
            })
          }
        })


        this.$set(this, 'field', {
          ...viewFiledConfig,
          list,
          active
        })

        setTimeout(() => {
          this.columnsSort()
        })

        return
      }


      this.field.list = _.clone(this.config.field)

      this.field.active = tileData.filter(item => item.value)

      tileData.forEach(item => {
        this.$set(this.field.map, item.prop, item.value)
      })

      this.view.table = true

    },

    handleFiledValue(flag, item) {
      if ( flag === true ) {
        this.field.map[ item.prop ] = true
        this.field.active.push(item)
      } else {
        this.field.map[ item.prop ] = false
        this.field.active =  this.field.active.filter(activeItem => activeItem.prop !== item.prop)
      }
    },

    handleRemoveField(row, index) {

      
      for ( let i = 0; i < this.field.list.length; i++) {

        let flag = false
        let item = this.field.list[ i ]

        if ( flag ) break

        for ( let j = 0; j < item.list.length; j++ ) {

          const childItem = item.list[ j ]

          if ( childItem.prop === row.prop ) {
            this.field.list[ i ].list[ j ].value = false
            flag = true
            break
          }


        }

      }

      this.field.map[ row.prop ] = false 
      this.$delete(this.field.active, index)

    },

    cancelField() {
      this.$emit('update:visible', {
        ...this.visible,
        field: false
      })
    },

    affirmField() {

      this.cancelField()

      this.view.table = false

      this.config.request.updateViewConfig({
        ...this.config.params.updateViewConfig,
        viewFiledConfig: JSON.stringify({
          active: this.field.active,
          map: this.field.map,
        })
      }).then(v => {
        this.columnsSort()
      }).catch(err => {
        this.view.table = true
      })
      
     
    }

  }
}