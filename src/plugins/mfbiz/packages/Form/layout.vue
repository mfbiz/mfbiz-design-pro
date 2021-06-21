


<template>
  <article 
    class="form-layout__wrap"
    ref="formLayout"
  >

    <div class="form-row-preview" v-show="!edit">

    
      <a v-if="(column.meta.href === true || column.meta.type === 'MfBizFormInputUrl')&& value" :href="value" target="_blank">
        {{  handleValue(value) }}
      </a>
      <span 
        v-else 
        :class="[
          getHookClickStatus && 'mfbiz-global-form-layout-link',
          column.meta.clickArea === 'text' ? 'click-area-text' : ''
        ]"
        @click.stop="handleTextClickHook(getHookClickStatus)"
        :style="'style' in column ? column.style : {}"
      >
        <i v-html="this.handleLayout()"></i>
        <span v-html="originValue.label || handleValue(value)"></span>
      </span>

      <i 
        class="el-icon-edit-outline" 
        @click.stop="handleEdit(true)"
        v-show="column.meta.clickArea !== 'text'"
        v-if="'meta' in column && 'type' in column.meta"
      ></i>
    </div>
    <div 
      class="form-row-edit" 
      v-if="edit"
      @click.stop=""
    >
      <component
        :autofocus="
          column.meta.type !== 'MfBizFormSelect' 
          ? 
          true 
          : 
          ( column.meta.clickArea === 'text' )
        "
        :visible.sync="edit"
        :is='column.meta.type' 
        v-bind="column.meta"
        :row="row"
        :value="handleDataFlow(value)"
        @change="handleChange"
      />
    </div>

  </article>
</template>
<script>


// column.meta.clickArea 如果为text 点击区域改为span ，隐藏编辑按钮, 点击后需强制打开下拉框

export default {
  
  name: 'MfBizFormLayout',

  props: {

    row: [ String, Number, Object, Array ],
    
    column: {
      type: Object,
      default: () => ({})
    },

    value: [ String, Number, Object, Array ],


    status: {
      type: String,
      // edit/preview
      default: () => 'preview'
    }
  },

  watch: {
    status: {
      deep: true,
      immediate: true,
      handler(v) {
        this.edit = v === 'edit'
      }
    }
  },

  components: {
  },

  computed: {
    getHookClickStatus() {
      return 'hooks' in this.column && 'click' in this.column.hooks
    } 
  },

  data: () => ({
    edit: false,
    originValue: {
      value: '',
      label: ''
    },
  }),

  created() {

    this.column.meta  && 'type' in this.column.meta 
    document.body.removeEventListener('click', () => {}, false)

    // if ( 
    //   this.column.meta.type !== 'MfBizFormTextarea' &&
    //   this.column.meta.type !== 'MfBizFormInput' &&
    //   this.column.meta.type !== 'MfBizFormSelect'
    // ) {
      document.body.addEventListener('click', () => {
        this.handleEdit(false)
      })
    // }
    
  },

  mounted() {

    

    const node = this.recursive(this.$refs.formLayout, 'td')

    if ( node ) {
      // node.onmouseleave = () => {
      //   // 临时解决方法
      //   if ( !this.column.meta.type.includes('FormSelect', 'FormDate') ) {
      //     this.handleNotice()
      //   }
      // }
    }
  },

  methods: {

    // 处理数据流
    handleDataFlow(v) {


      let NEW_VALUE = v

      const { meta } = this.column

      switch( Object.prototype.toString.call( v ) ) {
        case '[object Array]':
          NEW_VALUE = (NEW_VALUE.map(({ value }) => value) || [])
         break;
        case '[object Object]':
          NEW_VALUE = NEW_VALUE[ 'value' ] || ''
         break;
      }

      return NEW_VALUE

    },

    monitorClose() {

      console.info('close edit layout !')

      if ( 
        this.column.meta.type === 'MfBizFormTextarea' || 
        this.column.meta.type === 'MfBizFormInput' || 
        this.column.meta.type === 'MfBizFormSelect'
      ) {
        this.handleEdit = false
      }
    },

    handleEdit(flag = false) {
      this.edit = flag
    },

    handleTextClickHook(flag) {
      
      if( this.column.meta.clickArea && this.column.meta.clickArea === 'text' ) {
        this.handleEdit(true)
      }


      if ( 
        flag
        &&
        'hooks' in this.column
        &&
        'click' in this.column.hooks
      ) {

        let _this = this.$parent;

        if ( this.$parent.$el.nodeName.toLocaleLowerCase() == 'table' ) {
          _this = this.$parent.$parent.$parent.$parent
        }

        
        this.column.hooks.click.call(_this, this.row)
      }

      
    },

    handleLayout() {
      
      let str = ''

      if ( 'meta' in this.column && 'layout' in this.column.meta ) {
        str = this.column.meta.layout.label(this.value, this.column)
      }

      return str

    },

    handleValue(v) {

      let NEW_VALUE = v

      if ( 'hooks' in this.column && 'value' in this.column.hooks ) {
        NEW_VALUE = this.column.hooks.value.call(this.$parent, v, this.row, this.column)
      }

      switch( Object.prototype.toString.call( v ) ) {
        case '[object Array]':
          NEW_VALUE = (NEW_VALUE.map(({ label }) => label) || []).join(',')
         break;
        case '[object Object]':
          NEW_VALUE = NEW_VALUE[ 'label' ] || ''
         break;
      }

      if ( 
          NEW_VALUE == '' 
          || 
          NEW_VALUE == undefined 
          ||
          NEW_VALUE == null 
      ) {
        NEW_VALUE = '--'
      }
      
      return NEW_VALUE
    },

    handleNotice() {
      this.edit = false
      this.$emit('leaveupdate')
    },

    recursive(node) {
      if ( node.nodeName === 'BODY' ) return null
      return node.nodeName === 'TD' ? node : this.recursive(node.parentNode)
    },


    handleChange(v, _v) {
      
      const { meta } = this.column
      let NEW_VALUE  =  null

      switch ( meta.type ) {

        case 'MfBizFormSelect':

          const LABEL_KEY = 'label'
          const VALUE_KEY = 'value'

           NEW_VALUE = Array.isArray(v) ? v.map(item => ({
            [ LABEL_KEY ]: null,
            [ VALUE_KEY ]: item,
          })) : {
            [ LABEL_KEY ]: null,
            [ VALUE_KEY ]: v,
          }

          break;
        default :
          NEW_VALUE = v
      }

      this.$emit('update:value', NEW_VALUE)
      this.$emit('change', NEW_VALUE)
      this.handleNotice()
    }
  }

}
</script>
<style lang="less" scoped>

  .form-layout__wrap {


    .form-row-preview {
      display: flex;
      align-items: center;
      min-height: 30px;
      > a {
        font-size: 14px;
      }
      a, > span {
        display: block;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
        font-weight: 300;
        &.click-area-text{
          cursor: pointer;
          display: block;
          &:hover {
            padding-right: 4px;
            background-color: var(--red);
            color: #fff
          }
        }
      }
    }

    .el-icon-edit-outline {
      cursor: pointer;
      color: var(--gray);
      display: none;
      font-size: 18px;
      padding-left: 6px;
      padding-right: 6px;
      width: 26px;
      text-align: center;
    }

    &:hover {
      .el-icon-edit-outline {
        display: block;
      }
    }
   
  }
</style>