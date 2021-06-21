
import initSnapshotConfig from '../utils/initSnapshotConfig.js'

export default {

  computed: {

    getHeaderSearch() {
      return this.tableheader.search
    },

  },

  data: () => ({
    tableheader: {
      search: {},
      hover: {
        parentNode: '',
        el: null,
        index: null,
        empty: true,
        field: '',
        status: '',
        time: null,
        isClick: false
      },
    },
    currentConditions: [],
    query: {
      conditions: null,
      sort: null
    }
  }),


  created() {


    const list = this.columns.filter(item => item.meta &&  item.meta.headerConfig && item.meta.headerConfig.search)
    
    list.forEach(item => {
      
      this.$set(this.tableheader.search, item.prop, {
        originColumn: item, 
        sortType: '',
        sort: false,
        screenType: 'value',
        tmpScreenType: 'value',
        visible: false,
        loading: {
          submit: false
        },
        condition: {
          processing: item.meta.headerConfig.search.condition.processing,
          data: item.meta.headerConfig.search.condition.data,
          active: [],
          transformValues: [],
          meta: {
            type: ''
          },
          value: null,
        },
        value: {
          indeterminate: false,
          checkedLength: 0,
          checkAll: true,
          keyword: '',
          list: [],
          originList: [],
        },
      })
    })

    const query = this.$route.query
   

    if ( query.conditions && query.conditions !== '{}' ) {

      const conditions = JSON.parse(decodeURIComponent(query.conditions))

      this.query.conditions = conditions

      this.formattedConditionData(conditions, { prop: '' }, 'url').then(v => {

        this.$set(this, 'currentConditions', v)
        this.getList({
          loading: true,
          params: {
            conditions: v
          },
        })
      })

    } 

    if ( query.sort && query.sort !== '{}') {

      const sort = JSON.parse(query.sort)

      this.query.sort = sort

      Object.keys(sort).forEach(key => {
        this.sort[ key ] = sort[ key ]
      })

      if ( sort.orderFiled && sort.orderCase ) {
        this.tableheader.search[ sort.orderFiled ][ 'sortType' ] = sort.orderCase
        this.tableheader.search[ sort.orderFiled ][ 'sort' ] = true
      }
      
    }

    
  },


  methods: {

    handleColumnSearchIcon(column, type, ev) {
      
      if ( Object.keys(this.tableheader.search).length === 0 ) return
      
      const iconParentNode = ev.target.querySelectorAll(`.show-all-icon-${ column.prop }`)[ 0 ]
      const iconNode = iconParentNode.querySelectorAll('i')
      
      const activeData = this.currentConditions.find(item => item.filed === column.prop)

      switch ( type ) {

        case 'enter' :

          this.tableheader.hover.parentNode = iconParentNode
          this.tableheader.hover.status = 'enter'
          this.tableheader.hover.isClick = false

          if ( 
            activeData || 
            activeData && activeData.values.length !== 0
          ) {
            
          } else {

            this.isCheckedTableSortIconStatus(column, 'add')

            iconNode[ 2 ].style.display= 'block'
            this.tableheader.hover.index = 2
            this.tableheader.hover.el = iconNode[ 2 ]
            

            
          }

    
          break;
        case 'out' :

          if ( this.tableheader.hover.isClick ) {
            this.tableheader.hover.status = 'out'
          } else {
            iconNode[ 2 ].style.display= 'none'
            this.tableheader.hover.status = ''
            this.isCheckedTableSortIconStatus(column, 'remove')
          }
          break;
      }
    },

    handleColumnSearchSort(column, item ) {

      Object.keys(this.tableheader.search).filter(key => key !== column.prop).forEach(key => {
        this.tableheader.search[ key ].sortType = ''
        this.tableheader.search[ key ].sort = false
      })

      this.tableheader.search[ column.prop ].sortType = item.value
      this.tableheader.search[ column.prop ].sort = true

      this.sort.orderFiled = column.prop
      this.sort.orderCase = item.value

      this.tableheader.search[ column.prop ].visible = false

      initSnapshotConfig.replaceRouteHashParams.call(this, 'sort', JSON.stringify(this.sort))
      this.query.sort = this.sort

      this.getList({
        loading: true,
        params: {
          conditions: this.currentConditions
        },
      })


    },

    /**
     * data定义数据转换为后台所需数据
     * @param { Object } originConditions 指初始化时格式的数据
     * @param { Object } column 当前列属性配置
     * @param { String } origin 数据来源
     */
    formattedConditionData(originConditions, column, origin) {
      
      const list = []
      const fieldKeyMap = Object.keys(originConditions)

      fieldKeyMap.filter(key => key !== column.prop).forEach(key => {

        const item = originConditions[ key ]

        if ( 'value' in item ) {
          list.push({
            filed: key,
            // 数据来源URL不需要二次加工过滤
            values: origin === 'url' ? (
              Array.isArray(item.value.list) 
              ?
              item.value.list.map(item => item.split('0x1m^f0')).reduce((prev, next) => prev.concat(next), [])
              :
              item.value.list
            ) : item.value.list.filter(item => item.checked).reduce((prev, next) => prev.concat(next.value), []),
            condition: 'in',
          })
        } else if( 'condition' in item ) {

          list.push({
            filed: key,
            values: item.condition.processing
                    ?
                    item.condition.transformValues
                    :
                    (
                      Array.isArray(item.condition.value) ? item.condition.value : [ item.condition.value ]
                    )
                    ,
            /*
             * 1、级联为数组，取第二项值
             * 2、processing为真，如果需要异步获取数据，写死为in，因为数据自己拉了一遍
             */
            condition: this.tableheader.search[ key ].condition.processing ? 'in' : item.condition.active[ 1 ],
          })
        }

      })

      return Promise.resolve(list)

    },
    
    clearColumnSearch(column) {

      const item = this.tableheader.search[ column.prop ]

      if ( item.screenType === 'value' ) {
        this.tableheader.search[ column.prop ].value = {
          ...this.tableheader.search[ column.prop ].value,
          list: [],
          originList: [],
          keyword: '',
        }
      } else {
        this.tableheader.search[ column.prop ].condition = {
          ...this.tableheader.search[ column.prop ].condition,
          value: '',
          active: [],
          meta: {
            type: ''
          }
        }
      }

      
      this.tableheader.search[ column.prop ].screenType = 'value'
      this.tableheader.search[ column.prop ].value.list = []
      this.tableheader.search[ column.prop ].visible = false

      this.currentConditions = this.currentConditions.filter(item => item.filed !== column.prop )
      
      // 清除完条件需要搜索下
      setTimeout(() => {
        this.saveDataToUrl(this.currentConditions, column)
      }, 300)
    },

    // 清空所有条件, 并且搜索
    handleClearHeaderCondition() {

      this.currentConditions = []

      Object.keys(this.tableheader.search).forEach(key => {

        if ( this.tableheader.search[ key ].screenType === 'value' ) {
          this.tableheader.search[ key ].value.keyword = ''
          this.tableheader.search[ key ].value.list = []
        } else {
          this.tableheader.search[ key ].condition.value = ''
          this.tableheader.search[ key ].condition.active = {
            meta: {
              type: ''
            }
          }
        }
        this.tableheader.search[ key ].sortType = ''
        this.tableheader.search[ key ][ 'sort' ] = false
        this.tableheader.search[ key ].screenType = 'value'
        
      })

      this.saveDataToUrl([], {})
    },

    handleSearchValueChecked(column, flag) {
      this.tableheader.search[ column.prop ].value.list = this.tableheader.search[ column.prop ].value.list.map(item => ({
        ...item,
        checked: flag
      }))

      if ( !flag ) {
        this.tableheader.search[ column.prop ].value.indeterminate = flag
      }
    },

    // 切换筛选类型
    cutScreenType(column, sortItem) {
      this.tableheader.search[ column.prop ].tmpScreenType = sortItem.value
    },

    // 关闭筛选条件
    handleHiddenSearch(column) {

      this.tableheader.hover.el.style.display = 'none'
      this.tableheader.hover.field = ''
      this.tableheader.hover.status = 'out'


      this.isCheckedTableSortIconStatus(column, 'remove')
      
    },

    isCheckedTableSortIconStatus(column, type = 'add') {
      
      if ( this.sort.orderFiled === column.prop ) {

        const el = this.tableheader.hover.parentNode.querySelectorAll('i')

        if (  this.sort.orderCase === 'ASC' ) {
          el[ 0 ].classList[ type ]('popover-sort-caret-hidden')
        } else {
          el[ 1 ].classList[ type ]('popover-sort-caret-hidden')
        }
      }
    },
    // 点击筛选条件初始化
    async handleClickSearch(column) {

      // 保存当前节点选中态
      this.tableheader.hover.field = column.prop
      this.tableheader.hover.isClick = true

      async function initList(conditions) {

        // 接口参数中是否存在默认筛选条件
        if ( this.config.params.getList.conditions ) {
          conditions = conditions.concat(this.config.params.getList.conditions)
        }
        
        const list = await column.meta.headerConfig.search.value.getList({
          filedKey: column.prop,
          conditions: conditions,
        })
  
        this.tableheader.search[ column.prop ].value.list = list
        this.tableheader.search[ column.prop ].value.originList = list
  
        if ( this.query.conditions && this.query.conditions[ column.prop ]) {
  
          const item = this.query.conditions[ column.prop ]

          const screenType = item.value ? 'value' : 'condition'

          this.tableheader.search[ column.prop ].screenType = screenType
          this.tableheader.search[ column.prop ].tmpScreenType = screenType

          
          // 排序
          if ( this.sort.orderFiled === column.prop ) {
            this.tableheader.search[ column.prop ].sort = true
            this.tableheader.search[ column.prop ].sortType =  this.sort.orderCase
          }
  
          switch ( screenType ) {
  
            case 'value' :
                  
              this.tableheader.search[ column.prop ].value.keyword = item.value.keyword
  
              this.tableheader.search[ column.prop ].value.list = list.map(listItem => {
                
                return {
                  ...listItem,
                   // 如果回显list为0就默认全部勾选，否则去遍历老数据
                  checked: item.value.list.length == 0 
                           ? 
                           true 
                           : 
                           item.value.list.some(v => v == listItem.value)
                }
              })

              

              // 是否全选
              if ( list.length === this.tableheader.search[ column.prop ].value.list.filter(v => v.checked).length ) {
                this.tableheader.search[ column.prop ].value.indeterminate = false
                this.tableheader.search[ column.prop ].value.checkAll = true
              }else {
                this.tableheader.search[ column.prop ].value.indeterminate = true
              }
  
              break;
            case 'condition' :
              
              this.handleCascaderChange(column, item.condition.active)

              this.tableheader.search[ column.prop ].condition.active = item.condition.active
              this.tableheader.search[ column.prop ].condition.value = item.condition.value
              this.tableheader.search[ column.prop ].condition.transformValues = item.condition.transformValues

              break;
          }
  
  
        }
  
        
        let num = 0
  
        // 累加Length
        list.forEach(item => {
          num += item.count
        })
  
        this.tableheader.search[ column.prop ].value.checkedLength = num

      }

      if ( this.query.conditions && this.query.conditions !== '{}' ) {
        const conditions = await this.formattedConditionData(this.query.conditions, column, 'url')
        initList.call(this, conditions)
      }else {
        initList.call(this, [])
      }
      
    },

    handleCascaderChange(column, [ type, value ]) {

      const data = column.meta.headerConfig.search.condition.all.find(item => item.value === type)
      const active = data.children.find(item => item.value === value)

      this.tableheader.search[ column.prop ].condition.meta = active.meta
    },

    // 监听值筛选列表关键字过滤搜索, 
    monitorHeaderValueSearch(column, list, keyword = '') {

      let num = 0

      // 每次搜索直接全部修改checked为true
      this.tableheader.search[ column.prop ].value.list = list.filter(item => item.label.includes(keyword)).map(item => {
        num += item.count
        item.checked = true
        return item
      })

      // 累计Length
      this.tableheader.search[ column.prop ].value.checkedLength = num
    },

    // 处理表头值筛选列表点击checkbox
    handleHeaderValueItemCheckbox(column, { checked, value }, list) {
      const active = list.filter(item => item.checked)
      this.tableheader.search[ column.prop ].value.indeterminate = active.length === this.tableheader.search[ column.prop ].value.list.length ? false : true
    },

    cancelColumnSearch(column) {
      this.tableheader.search[ column.prop ].visible = false
    },

    // 提交列搜索
    async confirmColumnSearch(column) {

      
      if ( this.tableheader.search[ column.prop ].loading.submit ) return

      this.tableheader.search[ column.prop ].loading.submit = true
      this.tableheader.search[ column.prop ].screenType = this.tableheader.search[ column.prop ].tmpScreenType

      const columnItem = this.tableheader.search[ column.prop ]

      Object.keys(this.tableheader.search).forEach(key => {
        this.tableheader.search[ key ][ 'sort' ] = (key === column.prop && this.tableheader.search[ key ].sortType !== '' ? true : false)
      })


      let conditions = []

      // 当前列的字段
      switch ( columnItem.screenType ) {
        case 'value' :
          conditions.push({
            filed: column.prop,
            sortCase: columnItem.sortType,
            values: columnItem.value.list.filter(item => item.checked).map(item => item.value.split('0x1m^f0')).reduce((prev, next) => prev.concat(next),[]),
            condition: 'in',
            sort: columnItem[ 'sort' ]
          })
          break;
        case 'condition' :

          // 非标题 时间类请求
          if ( columnItem.condition.processing ) {
            
            const result = await column.meta.headerConfig.search.condition.getList({
              filedKey: column.prop,
              conditions: [{
                filed: column.prop,
                condition: columnItem.condition.active[ 1 ],
                values: Array.isArray(columnItem.condition.value) ? columnItem.condition.value : [ columnItem.condition.value ],
              }].concat(this.currentConditions.filter(v => v.filed !==  column.prop))
            })

            const params = column.meta.headerConfig.search.params || {}
            
            conditions.push({
              filed: column.prop,
              sortCase: columnItem.sortType,
              values: result || [],
              // 级联返回数组，取第二项
              condition: columnItem.condition.active[ 1 ],
              sort: columnItem[ 'sort' ],
              ...params
            })

          } else {

            conditions.push({
              filed: column.prop,
              sortCase: columnItem.sortType,
              values: Array.isArray(columnItem.condition.value) ? columnItem.condition.value : [ columnItem.condition.value ],
              condition: columnItem.condition.active[ 1 ],
              sort: columnItem[ 'sort' ],
            })
          }
          

          
          break
      }
      
      this.currentConditions = this.currentConditions.filter(item => item.filed !== column.prop).concat(conditions)

      this.tableheader.search[ column.prop ].visible = false

      await this.saveDataToUrl(this.currentConditions, column)


    },

    // 确认过后，筛选数据拼接到URL
    saveDataToUrl(conditions = [], column) {

      this.getList({
        loading: true,
        params: {
          conditions
        },
        hook: {
          response: function() {
            if ( !column[ 'prop' ] ) return
            this.tableheader.search[ column.prop ].loading.submit = false
            this.tableheader.search[ column.prop ].visible = false
          }
        }
      })
      
      // 存数据
      const storeSearchData = {}

      Object.keys(this.tableheader.search).forEach(key => {

        const conditionData = conditions.find(item => item.filed === key)

        if ( conditionData ) {

          let item = JSON.parse(JSON.stringify(this.tableheader.search[ key ]))
          let value = null
          let condition = null

          if ( item.screenType === 'value') {

            value = JSON.parse(JSON.stringify(item.value))

            value = {
              keyword: item.value.keyword,
              list:  item.value.list.filter(item => item.checked).map(item => item.value)
            }

            storeSearchData[ key ] = {
              value,
            }
          } else {
            
            condition = {
              active: item.condition.active,
              value: item.condition.value
            }

            if ( item.condition.processing ) condition[ 'transformValues' ] = conditionData.values

            storeSearchData[ key ] = {
              condition,
            }

          } 
          
        }

      })

      initSnapshotConfig.replaceRouteHashParams.call(this, 'conditions',JSON.stringify(storeSearchData))
      this.query.conditions = storeSearchData

      this.$refs.conditionLayout.init(storeSearchData)

    }
    

  }
  
}