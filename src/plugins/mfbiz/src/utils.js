
import { axios } from '@/app.utils.js'

export default {
  
  transformField() {

  },

  /**
   * 转换字段config
   * @param { Object } config 
   */
  transformFieldConfig(type, config = {}) {

    const NEW_CONFIG = {
      ...config
    }

    // 把0和1转 true false
    switch ( type ) {

      case 'REMOTE_SELECT' :

        Object.keys(config).forEach(key => {

          const fk = [ 'multiple', 'clearable', 'filterable' ].find(k => k === key )
          
          if ( fk ) {
            NEW_CONFIG [ fk ] = NEW_CONFIG [ fk ] === 1
          }
        })

        break;
    }


    return NEW_CONFIG


  },
  transformType({ metaFiled: { type: BASE_TYPE, isRequired, ...fieldMeta } }) {
    
    const CONFIG   = this.transformFieldConfig(BASE_TYPE, JSON.parse(fieldMeta.config || "{}"))


    let FIELD_DATA = {
      prop: fieldMeta.prop,
      label: fieldMeta.label,
      value: fieldMeta.value || null,
      // elementAttribute JAVA转了一层    element_attribute数据库取名
      attribute: JSON.parse(fieldMeta.elementAttribute || fieldMeta.element_attribute || '{}'),
      hooks: {},
      meta: {
        ...CONFIG,
        type: '',
        rules: [
          { required: isRequired, message: '此项为必填项', trigger: 'blur' }
        ]
      },
    }


    switch ( BASE_TYPE ) {

      case 'TEXT' :
        FIELD_DATA.meta = {
          ...FIELD_DATA.meta,
          type: 'MfBizFormInput',
        }
        break;
      case 'CHECKBOX' :
        FIELD_DATA.meta = {
          ...FIELD_DATA.meta,
          type: 'MfBizFormCheckbox',
        }
        break;
      case 'COLORPICKER' :
        FIELD_DATA.meta = {
          ...FIELD_DATA.meta,
          type: 'MfBizFormColorPicker',
        }
        break;
      case 'DATE' :
        FIELD_DATA.meta = {
          ...FIELD_DATA.meta,
          type: 'MfBizFormDate',
          // 表单类型 暂时使用 datatype来区分
          dateType: CONFIG.type,
        }
        break;
      case 'EDITOR' :
        FIELD_DATA.meta = {
          ...FIELD_DATA.meta,
          type: 'MfBizFormEditor',
        }
        break;
      case 'EMAIL' :
        FIELD_DATA.meta = {
          ...FIELD_DATA.meta,
          type: 'MfBizFormEmall',
        }
        break;
      case 'FILE' :
        FIELD_DATA.meta = {
          ...FIELD_DATA.meta,
          type: 'MfBizFormFile',
        }
        break;
      case 'NUMBER' :
        FIELD_DATA.meta = {
          ...FIELD_DATA.meta,
          type: 'MfBizFormInputNumber',
        }
        break;
      case 'RATE' :
        FIELD_DATA.meta = {
          ...FIELD_DATA.meta,
          type: 'MfBizFormRate',
        }
        break;
      case 'REMOTE_CASCADER' :
        FIELD_DATA.meta = {
          ...FIELD_DATA.meta,
          type: 'MfBizFormCascader',
        }
        break;
      case 'REMOTE_SELECT' :


        // 暂且分为远程可搜索和远程不可搜索2类
        const METHOD_KEY = FIELD_DATA.meta.filterable ? 'remoteMethod' : 'options'

        FIELD_DATA.meta = {
          ...FIELD_DATA.meta,
          remote: METHOD_KEY !== 'options',
          type: 'MfBizFormSelect',
          labelKey: FIELD_DATA.meta.label_key,
          valueKey: FIELD_DATA.meta.value_key,
          [ METHOD_KEY ]: function(params = {}) {
            return axios({
              url: CONFIG.request_url,
              method: CONFIG.request_method,
              params
              // [ CONFIG.request_method === 'get' ? 'params' : 'data' ]: params
            })
          },
          filterable: false,
        }
        
        // 远程搜索专用
        if ( METHOD_KEY === 'remoteMethod' ) {
          FIELD_DATA.meta[ 'remoteParamHook' ] = function(v) {
            return {
              condition: v
            }
          }
        }

        delete FIELD_DATA.meta[ 'label_key' ]
        delete FIELD_DATA.meta[ 'value_key' ]
        delete FIELD_DATA.meta[ 'request_method' ]
        delete FIELD_DATA.meta[ 'request_url' ]

        break;
      case 'SELECT' :
        FIELD_DATA.meta = {
          ...FIELD_DATA.meta,
          type: 'MfBizFormSelect',
        }
        break;
      case 'SWITCH' :
        FIELD_DATA.meta = {
          ...FIELD_DATA.meta,
          type: 'MfBizFormSwitch',
        }
        break;
      case 'TEL' :
        FIELD_DATA.meta = {
          ...FIELD_DATA.meta,
          type: 'MfBizFormTel',
        }
        break;
      case 'URL' :
        FIELD_DATA.meta = {
          ...FIELD_DATA.meta,
          type: 'MfBizFormInputUrl',
        }
        break;
      case 'TEXT' :
        FIELD_DATA.meta = {
          ...FIELD_DATA.meta,
          type: 'MfBizFormText',
        }
        break;
      case 'TEXT_AREA' :
        FIELD_DATA.meta = {
          ...FIELD_DATA.meta,
          type: 'MfBizFormTextArea',
        }
        break;
    }


    // console.log(FIELD_DATA)

    return FIELD_DATA
  },

}