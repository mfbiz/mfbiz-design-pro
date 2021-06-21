
import propsMixin from './mixin/props.js'
import notifyUpdateMixin from './mixin/notify-update.js'

import eventBus from '../util/eventBus.js'

export default {

  name: 'MfBizFormSelect',

  mixins: [ propsMixin, notifyUpdateMixin ],

  props: {

    // 解构Value
    deconstructionValue: Object,

    // 是否多选
    multiple: Boolean,
    
    // 是否可搜索
    filterable: Boolean,
    // 是否为远程搜索,
    remote: Boolean,
    // 远程搜索方法
    remoteMethod: Function,
    // 数据列表
    options: [ Array, Promise, Function, Object ],
    // 远程搜索参数钩子
    remoteParamHook: {
      type: Function,
      default: () => () => ({})
    },
    'labelKey': {
      type: String,
      default: () => 'label'
    },
    'valueKey': {
      type: String,
      default: () => 'value'
    },
    disabledKey: {
      type: String,
      default: () => 'disabled'
    },
    
  },

  data: () => ({
    timer: null,
    list: [],
    filterValue: '',
  }),

  async mounted() {

    // 解决iframe无法关闭时间弹框问题，待后续处理
    // eventBus._events[ 'closeMfBizFormSelect' ] = []
    eventBus.$on('closeMfBizFormSelect', () => {
      try {
        this.$refs.el.blur()
      } catch(err) {
        console.error(err, 'el.blur()')
      }
    })

    // 非远程搜索,
    if ( !this.remote ) {
      
      switch ( Object.prototype.toString.call(this.options) ) {
        case '[object Object]':
          break;
        case '[object Function]':
          this.list = await this.options(this.row)
          break;
        default :
          this.list = await this.options || []
      }
      
    }


    // 强行展开优先级
    // if ( this.autofocus === true ) {
    //   this.$refs.el.toggleMenu()
    // }

  },

  methods: {
    

    handleFocus() {
      this.filterValue = ''
    },
    
    handleLayout() {
      
      let str = ''

      if ( 'meta' in this.column && 'layout' in this.column.meta ) {
        str = this.column.meta.layout.label(this.value, this.column)
      }

      return str

    },

    async getList(v) {

      if ( this.filterable ) {
        this.filterValue = v
        return 
      }

      const params = this.remoteParamHook(v)

      if ( typeof params !== 'object' ) throw 'RemoteParamHook Processing Error！'

      this.list = await this.remoteMethod(params) || []
    },

    async filterMethod() {
      
      if ( this.timer ) {
        clearTimeout(this.timer)
      }

      this.timer = setTimeout(() => {
        this.getList(...arguments)
      }, 300)
      
    },

  },


  render() {   
    
    return (
      
      <el-select 
        ref="el"
        style="width: 100%;"
        v-model={ this.v } 
        multiple={ this.multiple }
        filterable={ this.remote || this.filterable }
        filterMethod={ this.filterMethod.bind(this) }
        clearable={ this.clearable }
        disabled={ this.disabled }
        placeholder={ this.placeholder }
        onChange={ this.handleChange.bind(this) }
        onFocus={ this.handleFocus.bind(this) }
      >
        {
          this.list.map(item => {
            return (
              <el-option
                style={ this.filterable && { display: item.label.includes(this.filterValue) || this.filterValue === '' ? 'block' : 'none' }}
                label={ item[ this.labelKey ] }
                value={ item[ this.valueKey ] }
                disabled={ item[ this.disabledKey ] || false }
              >
              </el-option>
            )
          })
        }
      </el-select>
    )
  },
}