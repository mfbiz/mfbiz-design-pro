<template>
  <main 
    class="condition-layout-wrap"
    v-if="pageFlag"
  >
    <aside class="copy-screen-condition">
      筛选条件
      <a href="javascript:;" class="el-icon-link" @click.stop="handleCopyUrl"></a>
    </aside>
    <div class="condition-show-wrap">
      <span v-html="conditionLayoutText"></span>
      <a href="javascript:;" class="el-icon-close clear-condition" @click="clearAllHeaderCondition"></a>
    </div>
  </main>
</template>
<script>

import utils from '../../util/index.js'
import _ from 'lodash'

export default {

  props: {
    visible: Boolean,
    conditionData: Object,
  },


  watch: {
    
  },

  data: () => ({
    pageFlag: true,
    filedInfo: {},
    conditionSymbolMap: {},
    conditionLayoutText: ''
  }),

  mounted() {

    let flag = true

    this.$parent.columns.forEach((item, index) => {
   
      this.filedInfo[ item.prop ] = {
        label: item.label,
        meta: item.meta
      }

      if ( flag && item.meta && item.meta.headerConfig && item.meta.headerConfig.search ) {
        
        item.meta.headerConfig.search.condition.all.reduce((prev, next) => prev.concat(next.children), []).forEach(item => {
          this.conditionSymbolMap[ item.value ] = item.label
        })
        flag = false
      }
    })


    const query = this.$route.query 

    if ( query.conditions && query.conditions !== '{}' ) {
      this.init(JSON.parse(decodeURIComponent(query.conditions)))
    }else {
      this.init(null)
    }


  },
  
  methods: {


    init(conditions) {

  
      const sort = {
        DESC: '按 降序 排序',
        ASC: '按 升序 排序',
      }

      let str = ''
      

      if ( conditions && Object.keys('conditions').length !== 0) {

        Object.keys(conditions).forEach(key => {

          const item = conditions[ key ]
          const label = this.filedInfo[ key ].label
          const meta = this.filedInfo[ key ].meta

          const screenType = item.value ? 'value' : 'condition'
        
          if ( screenType === 'value' ) {

            const valueData = item.value
            
            if ( valueData.list.length !== 0 ) {

              let value = valueData.list.map(item => item.split('0x1m^f0')).reduce((prev, next) => prev.concat(next), [])
            
              if ( 
                meta[ 'type' ] === 'MfBizFormSelect' && 
                Array.isArray(meta.options) &&
                meta.options.length !== 0
              ) {
                value = value.map(item =>  (meta.options.concat({ label: '空白的', value: '0'}).find(optionItem => optionItem.value == item))[ 'label' ])
              } else if ( meta[ 'type' ] === 'MfBizFormDate' ) {
                value = _.uniqBy(value.map(item => this.$utils.moment(Number(item)).format('YYYY-MM-DD')))
              }

              str += ` <strong>${ label }</strong> 等于 ${ value.length == 1 ? value[ 0 ] : '( ' + value.join(',') + ' )' } ${ sort[ item.sortType ] || '' } `
            }
          } else {

            const conditionData = item.condition


            if ( 'value' in conditionData ) {

              let value = Array.isArray(conditionData.value) ? conditionData.value : [ conditionData.value ]

              if ( meta.type === 'MfBizFormDate' ) {
                // 时间类型非异步请求字段时间需要转换成YYYY-MM-DD
                if ( !meta.headerConfig.search.condition[ 'processing' ] ) {
                  value = _.uniqBy(value.map(item => this.$utils.moment(item).format('YYYY-MM-DD')))
                }
              }

              str += ` 
                <strong>${ label }</strong> ${  this.conditionSymbolMap[ conditionData.active[ 1 ] ] } ${'( ' + value.join(',') + ' )' } ${ sort[ item.sortType ] || '' } 
              `
            }
          }

        })

        this.conditionLayoutText = str

      } else {
        this.conditionLayoutText = ''
      }

      this.pageFlag = this.conditionLayoutText ? true : false

    },

    handleCopyUrl() {
      utils.copyPageUrl.call(this)
    },

    // 清除所有表头条件
    clearAllHeaderCondition() {
      this.pageFlag = false
      this.$emit('clearHeaderCondition')
    }

  }
}
</script>
<style scoped lang="less">
  .copy-screen-condition {
     font-size: 16px;
     a {
       font-size: inherit;
     }
  }
  .condition-show-wrap {
    margin-top: 10px;
    margin-bottom: 20px;
  }
  .clear-condition {
    display: inline-block;
    margin-left: 10px;
    font-size: 16px;
    transform: translate3d(0, 2px, 0);
  }
</style>