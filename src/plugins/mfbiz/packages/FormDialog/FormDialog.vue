<template>
  <el-dialog
    :visible="visible"
    :before-close="cancel"
    v-bind="config.attributes"
    ref="mfbizDialogForm"
    :custom-class="`
      mfbiz-form-dialog__wrap
      ${ 
        (boxHeight && boxHeight < 500  )
        ?
        ''
        :
        ' mfbiz-form-dialog-center__wrap'
      }
      `"
  >

    <el-form 
      :rules="rules"
      :model="form" 
      ref="dialogForm" 
    >
      <template v-for="(key, index) in Object.keys(config.form)">
         <el-form-item 
          v-if="formVisible[ key ] === true"
          :key="index"
          :prop="key"
          :label="config.form[ key ].label" 
          class="mfbiz-form-dialog-item"
          :style="
            config.form[ key ].attributes 
            ?
            ( config.form[ key ].attributes[ 'style' ] || {} ) 
            :
            {}
          "
        > 
          <component
            :is="config.form[ key ].meta.type"
            :value.sync="form[ key ]"
            v-bind="config.form[ key ].meta"
            @change="handleChange($event, config.form[ key ], key)"
          />
        </el-form-item>
      </template>
     
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button type="text"  @click="cancel">取消</el-button>
      <el-button type="primary" :loading="loading.submit" @click="affirm">确定</el-button>
    </span>
  </el-dialog>
</template>
<script>

import UtilRender from '../util/render.js'

export default {
  
  name: 'MfBizFormDialog',

  props: {
    visible: Boolean,
    config: Object,
  },

  components: {
    UtilRender
  },

  watch: {
    visible: {
      deep: true,
      immediate: true,
      handler(n, o) {
        if( n !== o) this.init()
      }
    },
    config: {
      deep: true,
      handler() {
        this.init()
      }
    },
  },

  data: () => ({
    form: {},
    rules: {},
    boxHeight: null,
    loading: {
      submit: false,
    },
    formVisible: {},
    linkage: {},
  }),

  
  methods: {

    init() {

      Object.keys(this.config.form).forEach(key => {

        const item = this.config.form[ key ]

        this.$set(this.form, key, item.value)
        this.$set(this.rules, key, item.meta[ 'rule' ] || [])
        this.$set(this.formVisible, key, true)
        
        if ( 
          'linkage' in item
          &&
          'prop' in item.linkage
          &&
          typeof item.linkage.filter === 'function'
        ) {
          if ( item.linkage.prop in this.linkage ) {
            this.linkage[ item.linkage.prop ].prop.push(key)
          } else {
            this.$set(this.linkage, item.linkage.prop, {
              prop: [ key ]
            })
          }

          this.handleChange(item.value, item, this.form)

        }
        
      })

      this.$nextTick(() => {
        this.boxHeight = this.$refs.mfbizDialogForm.$el.querySelectorAll('.mfbiz-form-dialog__wrap')[ 0 ].offsetHeight
      })

    },

    handleChange(v, column, key) {

      if ( key in this.linkage ) {

        this.linkage[ key ].prop.forEach(k => {
          
          if ( this.config.form[ k ].linkage.filter(v, this.form) ) {
            this.$set(this.form, k, this.config.form[ k ].value || '')
            this.$set(this.rules, k, this.config.form[ k ].meta.rule || [])
            this.formVisible[ k  ] = true
          } else {
            this.$delete(this.form, k)
            this.$delete(this.rules, k)
            this.formVisible[ k  ] = false
          }

        })
      }
      
    },

    close() {
     this.$emit('update:visible', false) 
    },
    cancel() {

      this.$confirm('关闭后数据将被清空，是否确认关闭？',{
        type: 'warning',
      })
      .then(_ => {
        this.close()
      })
      .catch(_ => {
        this.$message.info('取消关闭！')
      })
      
    },

    affirm() {

      this.$refs.dialogForm.validate((valid) => {


        if (valid) {

          const params = {
            ...this.config.params,
          }



          Object.keys(this.form).forEach(k => {
            
            const { meta } = this.config.form[ k ]
            const v        = this.form[ k ]

            switch ( this.config.form[ k ].meta.type ) {

              case 'MfBizFormSelect':

                const LABEL_KEY = 'label'
                const VALUE_KEY = 'value'

                if ( Array.isArray(v) ) {
                  
                  v.forEach(item => {
                    
                    const data = {
                      [ LABEL_KEY ]: null,
                      [ VALUE_KEY ]: item,
                    }

                    params[ k ] = Array.isArray(params[ k ]) ? params[ k ].concat(data) : [ data ]
                  
                  })
                } else {
                  params[ k ] = {
                    [ LABEL_KEY ]: null,
                    [ VALUE_KEY ]: v,
                  }

                }
                

                break;
              default :
                params[ k ] = v
            }
          })

          this.config.request.call(this.$parent, params).then(res => {
            this.close()
            this.$emit('update', false)
            if ( this.config.response ) {
              this.config.response.call(this, res)
            }else {
              this.$message.success('操作成功')
            }
          }).finally(v => {
            this.loading.submit = false
          })
        } else {
          return false
        }
      })
    },

  }
}
</script>
<style lang="less">
.mfbiz-form-dialog__wrap {

  
  min-height: 300px;
  display: grid;
  grid-template-rows: 50px auto 68px;

  &.mfbiz-form-dialog-center__wrap {
    transform: translate3d(0, -50%, 0) !important;
    margin-bottom: 0 !important;
    top: 50%; margin-top: 0!important;
  }

  .mfbiz-form-dialog-item {
    width: 50%;
    display: inline-block;
    padding-right: 28px;
    margin-bottom: 18px;
  }


  .el-dialog__title {
    color: #333;
  }
  .el-dialog__body {
    border-top: 1px solid #e8e8e8;
    padding: 22px 2px 22px 26px;
    overflow-y: auto;
    max-height: 70vh;
  }

  .el-dialog__footer {
    border-top: 1px solid #eee;
    padding: 0 30px;
    height: 68px;
    align-items: center;
    display: flex;
    justify-content: flex-end;
    .el-button {
      font-weight: normal;
      font-size: 14px;
      &:first-of-type {
        color: #aaa;
      }
      &:last-of-type:hover {
        box-shadow: 0 2px 10px rgba(0, 0, 0, .3);
      }
      padding: 9px 30px;
    }
    .el-button--text:hover {
      color: var(--primary);
    }
  }
  .el-dialog__header {
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 30px;
    .el-dialog__title {
      font-size: 16px;
    }
  }
  .el-dialog__headerbtn {
    left: 0; top: 0;
    position: relative;
    font-size: 20px;
    color: #cacaca;
    transition: .2s;
    padding-left: 4px;
    padding-right: 4px;

    &:hover {
      background: rgba(52,143,228, 0.1);
      border-radius: 4px;
      i {
        color: var(--primary);
      }
    }
  }
}
</style>