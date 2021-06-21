<template>
<article class="mf-biz-table__wrap">

  <ConditionLayout ref="conditionLayout" :conditionData="tableheader.search" :visible="Object.values(tableheader.search).length > 0" @clearHeaderCondition="handleClearHeaderCondition" />

  <!-- 字段配置 -->
  <el-dialog custom-class="mfbiztable-reset-field-dialog-style" v-if="'field' in config" :title="layout.field.title" :visible.sync="visible.field" :width="layout.field.width">
    <main class="mfbiz-config-field__wrap">
      <div class="field-area">
        <div class="checkbox-field__wrap">
          <template v-for="(item, index) in field.list">
            <main :key="index">
              <h4 class="field-area-title">{{ item.title }}</h4>
              <div class="checkbox-content">
                <template v-for="fieldItem in item.list">
                  <MfBizFormCheckBox :key="fieldItem.prop" :value.sync="fieldItem.value" :label="fieldItem.label" v-bind="fieldItem.meta" @change="handleFiledValue($event, fieldItem)" />
                </template>
              </div>
            </main>
          </template>
        </div>
        <div class="footer-btn__wrap">
          <el-button size="small" style="margin-right: 6px;" @click="cancelField">取消</el-button>
          <el-button size="small" type="primary" @click="affirmField">确认</el-button>
        </div>
      </div>
      <div class="sort-area">

        <h2>选定的字段</h2>

        <draggable :list="field.active" class="field-draggable-list" handle=".handle">
          <div class="field-item" v-for="(item, index) in field.active" :key="item.prop">
            <a href="javascript:;" class="mficonfont mftuozhuai handle"></a>
            <span>{{ item.label }}</span>
            <a v-if="'meta' in item ? !item.meta.disabled : true" @click="handleRemoveField(item, index)" href="javascript:;" class="el-icon-close field-remove"></a>
          </div>
        </draggable>

      </div>
    </main>
    <!-- <span slot="footer" class="dialog-footer">
        <el-button @click="cancelField">取 消</el-button>
        <el-button type="primary" @click="affirmField">确 定</el-button>
      </span> -->
  </el-dialog>

  <div v-loading="!view.table" class="mfbiz-table-box" :style="{
        height: layout.table ? layout.table.height : 'calc(100vh - 200px)' 
      }">

    <header class="mfbiz-table-header-opt" v-if="
            layout.table && 
            layout.table.extend && 
            'selection' in layout.table.extend
          ">

      <div class="l"></div>
      <div class="r" v-if="Object.keys(checkbox).filter(key => checkbox[ key ]).length !== 0">

        <template v-for="(item, index) in layout.table.customBatchOperate">

          <a href="javascript:;" :key="index" style="padding-right: 30px;">

            <el-button @click.stop="() => item.confirmHook.call($parent, Object.keys(checkbox).filter(key => checkbox[ key ]), ...arguments)" v-if="item.type === 'button'" type="text" icon="el-icon-delete">{{ item.label }}</el-button>

            <el-dropdown trigger="click" v-else-if="item.type === 'dropdown'" @command="command => item.confirmHook.call($parent, Object.keys(checkbox).filter(key => checkbox[ key ]), command)">
              <span class="el-dropdown-link">
                {{ item.label }}<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <template v-for="optionItem in item.options">
                  <el-dropdown-item :command="optionItem.value" :key="optionItem.value">{{ optionItem.label }}</el-dropdown-item>
                </template>
              </el-dropdown-menu>
            </el-dropdown>

          </a>
        </template>

      </div>
    </header>
    <el-table ref="eltable" v-if="view.table" v-loading="loading.table" width="100%" :height="layout.table ? layout.table.height : 'calc(100vh - 200px)'" :data="sourceList" v-bind="layout.table ? layout.table.attribute : { 
        }" :border="true" :span-method="handleCellMerge">

      <el-table-column prop="customSelection" v-if="
            layout.table && 
            layout.table.extend && 
            'selection' in layout.table.extend
          " :width="layout.table.extend.selection.width">
        <template slot="header" slot-scope="scope">
          <el-checkbox label="" v-model="checkboxAll" :indeterminate="checkboxImmediate" @change="handleCheckboxChange('all', $event)" :disabled="Object.keys(checkbox).length === 0" />
        </template>
        <template slot-scope="scope">
          <el-checkbox label="" v-model="checkbox[  scope.row.id ]" @change="handleCheckboxChange('one', $event, scope.row)" />
        </template>
      </el-table-column>

      <template v-for="(item, index) in sourceColumns">
        <el-table-column :key="index" v-if="'field' in config ? (item.prop === 'operate' || field.map[ item.prop ]) : true" :prop="item.prop" :label="item.label || ''" v-bind="item.attribute || item.attributes || {}">

          <!-- <template>
            <div>
              
            </div>
          </template>
          <el-table-column
            v-if="item.type === 'selection'"
            type="selection"
            v-bind="item.attribute || item.attributes || {}"
          >
          </el-table-column> -->

          <!-- 操作特殊处理 -->
          <template slot="header" slot-scope="scope">
            <span v-if="item.prop == 'operate'" :class="[
                  item.meta && 'tile' in item.meta && item.meta.tile ? 'global-mfbiz-head-tile-operate' : 'el-icon-setting global-mfbiz-head-not-tile-operate'
                ]">操作</span>
            <section v-else class="table-header__wrap" @mouseenter="handleColumnSearchIcon(item, 'enter', $event)" @mouseleave="handleColumnSearchIcon(item, 'out', $event)">
              {{ item.label || '' }}
              <span class="caret-wrapper" v-if="item.meta && item.meta.sort">
                <template v-for="(sortItem, sortIndex) in [{
                      class: 'ascending',
                      value: 'ASC',
                      label: '升序'
                    }, {
                      class: 'descending',
                      value: 'DESC',
                      label: '降序'
                    }
                  ]">
                  <i :key="sortIndex" :class="[ 
                      'sort-caret',
                      sortItem.class,
                      sort.orderFiled === item.prop && sort.orderCase === sortItem.value ? `sort-${ sortItem.value }-active` : ''
                    ]" @click="handleSort(item, sortItem.value)"></i>

                </template>
              </span>
              <span class="table-header-search__wrap" v-else-if="item.meta && item.meta.headerConfig && item.meta.headerConfig.search">
                <el-popover placement="bottom" width="330" trigger="click" @hide="handleHiddenSearch(item)" @show="handleClickSearch(item)" v-model="tableheader.search[ item.prop ].visible" popper-class="reset-popover-mfbiz-table-header-search__wrap">
                  <div class="mfbiz-table-header-search-config__wrap">
                    <header class="s-c-head-wrap">
                      <template v-for="sortItem in [{
                          value: 'ASC',
                          label: '升序'
                        }, {
                          value: 'DESC',
                          label: '降序'
                        }]">
                        <a href="javascript:;" :class="[
                              'mfbiz-table_operation-tile_item',
                              tableheader.search[ item.prop ].sortType === sortItem.value ? 'active': ''
                            ]" :key="sortItem.value" @click.stop="handleColumnSearchSort(item, sortItem)">{{ sortItem.label }}</a>
                      </template>

                    </header>
                    <!-- 临时隐藏Id不能筛选 -->
                    <main class="s-c-main-wrap" v-if="item.prop !== 'id'">
                      <div class="filter-menu-tab">
                        <template v-for="sortItem in [{
                            value: 'value',
                            label: '按值筛选'
                          }, {
                            value: 'condition',
                            label: '按条件筛选'
                          }]">
                          <a href="javascript:;" :class="[
                                'filter-menu-tab-item',
                                tableheader.search[ item.prop ].tmpScreenType === sortItem.value ? 'active': ''
                              ]" :key="sortItem.value" @click="cutScreenType(item, sortItem)">{{ sortItem.label }}</a>
                        </template>
                      </div>
                      <!-- 按值筛选 -->
                      <div class="filter-menu-value" v-if="tableheader.search[ item.prop ].tmpScreenType === 'value'">

                        <el-input placeholder="搜索" prefix-icon="el-icon-search" v-model="tableheader.search[ item.prop ].value.keyword" @input="monitorHeaderValueSearch(item, getHeaderSearch[ item.prop ].value.originList, $event)" />
                        <ul class="s-c-main-v-list">
                          <li>
                            <el-checkbox :indeterminate="getHeaderSearch[ item.prop ].value.indeterminate" v-model="tableheader.search[ item.prop ].value.checkAll" @change="handleSearchValueChecked(item, $event)">全选</el-checkbox>
                            <span>{{ getHeaderSearch[ item.prop ].value.checkedLength }}</span>
                          </li>
                          <li v-for="(valueItem, valueIndex) in tableheader.search[ item.prop ].value.list" :key="valueIndex">
                            <el-checkbox v-model="valueItem.checked" @change="handleHeaderValueItemCheckbox(item, valueItem,  getHeaderSearch[ item.prop ].value.list ,$event)">
                              {{ valueItem.label }}
                            </el-checkbox>
                            <span>{{ valueItem.count }}</span>
                          </li>
                        </ul>
                      </div>
                      <!-- 按条件筛选 -->
                      <div class="filter-menu-condition" v-if="getHeaderSearch[ item.prop ].tmpScreenType === 'condition'">
                        <el-cascader v-model="tableheader.search[ item.prop ].condition.active" placeholder="无" show-all-levels :options="getHeaderSearch[ item.prop ].condition.data" @change="handleCascaderChange(item, $event)" />
                        <article>
                          <component :is="getHeaderSearch[ item.prop ].condition.meta.type" :value.sync="getHeaderSearch[ item.prop ].condition.value" v-bind="getHeaderSearch[ item.prop ].condition.meta" />
                        </article>
                      </div>

                    </main>
                    <!-- 临时隐藏Id不能筛选 -->
                    <footer class="s-c-foot-wrap" v-if="item.prop !== 'id'">
                      <el-button size="mini" icon="el-icon-refresh-right" type="text" @click="clearColumnSearch(item)">清除筛选</el-button>
                      <div class="btns">
                        <el-button size="mini" @click="cancelColumnSearch(item)">取消</el-button>
                        <el-button size="mini" type="primary" :disabled="
                               getHeaderSearch[ item.prop ].tmpScreenType === 'value' &&
                               getHeaderSearch[ item.prop ].value.list.filter(item => item.checked).length === 0
                               
                            " @click="confirmColumnSearch(item)">确认</el-button>
                        <!-- :loading="getHeaderSearch[ item.prop ].loading.submit" -->
                      </div>
                    </footer>
                  </div>
                  <div :class="[
                        'show-all-icon',
                        `show-all-icon-${ item.prop }`
                      ]" slot="reference">

                    <i :class="[
                          'popover-sort-caret',
                          'el-icon-caret-top',
                        ]" :style="`
                          ${ 
                            (
                              tableheader.hover.field === item.prop &&
                              tableheader.hover.status !== 'enter' ||
                              tableheader.hover.field !== item.prop
                            )
                            &&
                            sort.orderFiled === item.prop && 
                            sort.orderCase === 'ASC' &&
                            !currentConditions.some(contItem => contItem.filed === item.prop)
                            ?
                              'display: block'
                            :
                              'display: none'
                          }
                        `">
                    </i>
                    <i :class="[
                          'popover-sort-caret',
                          'el-icon-caret-bottom',
                        ]" :style="`
                          ${ 
                            (
                              tableheader.hover.field === item.prop &&
                              tableheader.hover.status !== 'enter' ||
                              tableheader.hover.field !== item.prop
                            ) &&
                            sort.orderFiled === item.prop && 
                            sort.orderCase === 'DESC' && 
                            !currentConditions.some(contItem => contItem.filed === item.prop)
                            ?
                              'display: block'
                            :
                              'display: none'
                          }
                        `"></i>

                    <i data-index="2" class="screen-icon mfbizIconfont mfbiz-loudouzhuanhua"></i>
                    <i data-index="3" :class="[
                          'screen-icon',
                          'mfbizIconfont',
                          'mfbiz-loudou',
                          currentConditions.find(contItem => contItem.filed === item.prop)
                          ?
                          'popover-sort-caret-visible'
                          :
                          `${typeof currentConditions.find(contItem => contItem.filed === item.prop)}`
                        ]"></i>
                  </div>
                </el-popover>
              </span>
            </section>
          </template>

          <template slot-scope="scope">

            <template v-if="item.prop == 'operate'">

              <!-- 自定义操作按钮 -->
              <template v-if="item.meta && 'tile' in item.meta && item.meta.tile">
                <a :key="buttonIndex" v-for="(buttonItem, buttonIndex) in item.buttons" :class="[
                      'mfbiz-table_operation-tile_item',
                      buttonItem.icon || ''
                    ]" :title="buttonItem.icon ? buttonItem.name : ''" href="javascript:;" @click="handleOperate(buttonItem, scope.row)">{{ buttonItem.icon ? '' : buttonItem.name }}</a>
              </template>
              <el-popover v-else placement="bottom" title="" width="100" popper-class="global-table_reset_popover" trigger="click">
                <template>

                  <a v-for="(buttonItem, buttonIndex) in item.buttons" :key="buttonIndex" class="global-table_operation_item" href="javascript:;" @click="handleOperate(buttonItem, scope.row)">{{ buttonItem.name }}</a>
                </template>

                <span slot="reference" class="el-icon-more"></span>

              </el-popover>

            </template>

            <span v-else>

              <template v-if="typeof item.render === 'function'">
                <UtilRender :render="item.render.bind($parent)" :row="scope.row" />
              </template>
              <template v-else>
                <!-- 是否可编辑 -->

                <template v-if="
                      sourceColumns[ index ].meta && 
                      sourceColumns[ index ].meta.edit &&
                      ('authHook' in sourceColumns[ index ].meta ? sourceColumns[ index ].meta.authHook(scope.row) : true)
                    ">
                  <MfBizFormLayout :layout="false" :value.sync="scope.row[ item.prop ]" :row="scope.row" :column="handleColumnChiLd(sourceColumns[ index ])" @leaveupdate="handleLeaveupdate(sourceColumns[ index ], scope.row, index)" />
                </template>
                <template v-else>
                  <!-- 值展示前处理下 -->
                  <span 
                    :class="
                    [
                      'hooks' in sourceColumns[ index ] && 'click' in sourceColumns[ index ].hooks && 'mfbiz-global-form-layout-link'
                    ]"
                    @click.stop="handleTextClickHook('hooks' in sourceColumns[ index ] && 'click' in sourceColumns[ index ].hooks, sourceColumns[ index ], scope.row)"
                  >
                     {{ 'hooks' in item && item.hooks.value ? item.hooks.value(scope.row[ item.prop ], scope.row) : (scope.row[ item.prop ] || '--') }}
                  </span>
                </template>

              </template>
            </span>

          </template>

        </el-table-column>

      </template>

    </el-table>
  </div>

  <footer class="paging-wrap" v-if="(typeof layout.table === 'object' && layout.table.pagination && layout.table.pagination.visible == true) || !layout.table">
    <el-pagination background @size-change="handleSizeChange" @current-change="getList" :current-page.sync="params.page" :page-sizes="pageSizes" :page-size="(this.config.params.getList[ 'rows' ] || this.params.rows)" layout="total, sizes, prev, pager, next" :total="total">
    </el-pagination>
  </footer>

</article>
</template>

<script>
import _ from 'lodash'

import UtilRender from '../util/render.js'
import draggable from 'vuedraggable'

import operateMinxis from './mixins/operate'
import fieldMixins from './mixins/field'
import headerSearchMixins from './mixins/headerSearch'

import initSnapshotConfig from './utils/initSnapshotConfig.js'

const config = () => ({
  request: function () {},
  params: {},
  filter: {}, // 逐渐废弃
  search: {},
  create: {},
})

export default {

  name: 'MfBizTable',

  mixins: [
    operateMinxis,
    fieldMixins,
    headerSearchMixins
  ],

  components: {
    UtilRender,
    draggable,
    ConditionLayout: () => import('./module/conditionLayout.vue')
  },

  props: {

    visible: {
      type: Object,
      default: () => ({
        create: false,
        search: false
      })
    },

    layout: {
      type: Object,
      default: () => ({
        create: {
          title: '新建项目',
          width: '600px'
        },
        search: {
          title: '高级搜索',
          width: ''
        },
        table: {
          height: 'calc(100vh - 200px)',
          attribute: {},
          extend: {
            selection: false,
          },
          pagination: {
            visible: true
          },
        }

      })
    },

    // 基础配置
    config: {
      type: Object,
      default: config
    },

    // 当前页展示条数
    pageSizes: {
      type: Array,
      default: () => [5, 10, 15, 25, 30, 50]
    },

    columns: {
      type: Array,
      default: () => []
    },

    // 主题
    theme: {
      type: String,
      default: () => 'dark'
    },

    // 是否需要展示分页
    paging: {
      type: Boolean,
      default: () => false
    }

  },

  data: () => ({

    view: {
      table: false
    },
    loading: {
      table: true,
      create: false,
      search: false,
    },
    sourceList: [],
    total: 0,
    sort: {
      orderFiled: '',
      orderCase: ''
    },
    params: {
      page: 1,
      rows: 10
    },
    sourceColumns: [],
    checkboxImmediate: false,
    checkboxAll: false,
    checkbox: {},
  }),

  mounted() {
    this.init()
  },

  methods: {

    handleTextClickHook(flag, column, row) {
      flag && column.hooks.click.call(this.$parent, row)
    },
    handleCheckboxChange(type, flag, row) {

      if (type === 'one') {

        if (Object.values(this.checkbox).some(item => item === false)) {
          this.checkboxImmediate = !(Object.values(this.checkbox).filter(item => item === true).length === 0)
          this.checkboxAll = false
        } else {
          this.checkboxImmediate = false
          this.checkboxAll = true
        }

      } else {

        const flag = Object.values(this.checkbox).some(item => item === false)

        Object.keys(this.checkbox).forEach(key => {
          this.checkbox[key] = flag
        })

        this.checkboxImmediate = false
        this.checkboxAll = flag
      }

    },

    handleSort(item, value) {

      this.sort.orderFiled = item.prop
      this.sort.orderCase = value

      // 简单排序排序会与高级筛选中排序有冲突，需要清空高级筛选的排序
      if (Object.keys(this.tableheader.search).length !== 0) {

        Object.keys(this.tableheader.search).forEach(key => {
          this.tableheader.search[key].sortType = ''
          this.tableheader.search[key].sort = false
        })

        // initSnapshotConfig.replaceRouteHashParams.call(this, 'sort', JSON.stringify(this.sort))
      }

      this.getList({
        loading: true,
        params: {
          conditions: this.currentConditions
        },
      })
    },

    handleCellMerge({
      row,
      column,
      rowIndex,
      columnIndex
    }) {

      if (row.colspan && typeof row.colspan == 'object') {

        if (row.colspan[column.property]) {
          return {
            rowspan: 1,
            colspan: row.colspan[column.property]
          }
        } else {
          return {
            rowspan: 1,
            colspan: 0
          }
        }

      }

    },

    init() {

      this.columnsInit()
      this.fieldInit()

      // URL不带条件直接执行，否则由条件模块的方法调用
      if (!this.$route.query.conditions || this.$route.query.conditions === '{}') {
        this.getList()
      }
    },

    // 处理column孩子,
    handleColumnChiLd(column) {

      if ('meta' in column && 'config' in column.meta) {
        column.meta.config['update'] = this.getList
      }

      return _.clone(column)
    },

    // 加工处理Columns数据
    async columnsInit() {

      const that = this
      const columns = _.clone(this.columns)
      const len = columns.length - 1

      handle(0)

      async function handle(i) {

        if (i > len) {
          return that.sourceColumns = columns
        }

        const {
          meta
        } = columns[i]

        // 下拉选项 options的数据有可能为promise，避免重复渲染
        if (meta && meta.type === 'MfBizFormSelect' && Object.prototype.toString.call(meta.options) === '[object Promise]') {
          columns[i].meta.options = await meta.options
          handle(++i)
        } else {
          handle(++i)
        }

      }

    },

    columnsSort() {

      const sourceColumns = this.sourceColumns
      const before = []
      const after = []

      this.sourceColumns = []

      this.field.active.forEach(activeItem => {

        let data = sourceColumns.find(item => activeItem.prop === item.prop && activeItem.value === true)

        if (data) before.push(data)

      })

      sourceColumns.forEach(item => {
        if (!this.field.active.some(activeItem => activeItem.prop === item.prop && activeItem.value === true)) {
          after.push(item)
        }
      })

      setTimeout(() => {
        this.sourceColumns = before.concat(after)
        this.view.table = true
      }, 1000)
    },

    getList(config = {}) {

      this.loading.table = typeof config === 'object' && ('loading' in config) ? config.loading : true

      this.sourceList = []

      const params = {
        ...this.sort,
        ...this.params,
        ...this.config.params.getList,
      }

      let responseHook = function () {}

      if (
        typeof config === 'object' && config.params && typeof config.params === 'object'
      ) {

        // 条件需要拼接
        Object.keys(config.params).forEach(key => {

          if (key === 'conditions') {
            params['conditions'] = 'conditions' in params ? params.conditions.concat(config.params[key]) : config.params[key]
          } else {
            params[key] = config.params[key]
          }

        })

        responseHook = config.hook ? config.hook.response : function () {}
      } else {

        // 表头条件不为空，并且没有传进来conditions
        if (this.currentConditions && this.currentConditions.length !== 0) {
          if ('conditions' in params) {
            params['conditions'] = params.conditions.concat(this.currentConditions)
          } else {
            params['conditions'] = this.currentConditions
          }
        }

      }

      this.config.request.getList.call(this.$parent, params).then(res => {

        let {
          total,
          list
        } = this.config.hook && this.config.hook.getList ? this.config.hook.getList.response.call(this.$parent, res) : res

        this.sourceList = list || []
        this.total = total || 0

        // 通知父组件接口加载完成
        this.$emit('done', list)

        if (
          !(
            this.layout.table &&
            this.layout.table.extend &&
            'selection' in this.layout.table.extend
          )
        ) return

        this.checkbox = {}
        this.checkboxImmediate = false
        this.checkboxAll = false

        // Tree形结构
        if (list[0] && list[0].children) {
          list.forEach(item => {
            item.children.forEach(childItem => {
              this.$set(this.checkbox, childItem.id, false)
            })
          })
        } else {
          list.forEach(item => {
            this.$set(this.checkbox, item.id, false)
          })
        }

      }).finally(() => {
        responseHook.call(this)
        this.loading.table = false
      })

    },

    handleLeaveupdate(column, row, index) {

      column.meta.updateHook.call(this.$parent, row, params => {
        this.getList({
          loading: true,
          params: {
            conditions: this.currentConditions
          },
        })
      }, column, index)
    },

    handleSizeChange(rows) {
      this.params.rows = rows
      this.getList()
    },
  },

}
</script>

<style lang="less">
@import './style.less';

.sort-DESC-active {
  border-top-color: var(--primary) !important
}

.sort-ASC-active {
  border-bottom-color: var(--primary) !important
}

.mf-biz-table__wrap {

  background-color: #fff;

  .paging-wrap {
    text-align: right;
    margin-top: 20px;
  }

  .mf-biz-filter-form {
    .query-form-row {
      margin-right: 30px;

      &:last-of-type {
        margin-right: 0;
      }
    }
  }

}

// 强制替换所有页面边框线
.mf-biz-table__wrap {

  .el-table--group,
  .el-table--border {
    border-width: 0 !important;
  }

  .el-table::before,
  .el-table::after {
    display: none;
  }

  .el-table--border td {
    border-right-width: 0;
  }

  .el-table--border th {
    border-right-color: rgba(0, 0, 0, 0);

    &:hover {
      border-right-color: #e6e6e6;
    }
  }
}

.mfbiz-table_operation-tile_item {
  padding-left: 10px;
  display: inline-block;
  position: relative;
  color: #aaa;
  font-size: 18px;

  &:first-of-type {
    padding-left: 0;
  }
}
</style>
