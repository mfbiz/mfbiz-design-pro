<style lang="less">
.project-list-search-wrap {
  .mf-biz-table__wrap .el-table--border th {
    background-color: #fafafa;
  }

  .project-list-operation {
    padding: 20px 30px 20px 20px;
    text-align: left;
    background-color: #fff;
  }
}
</style>
<template>
<div class="project-list-search-wrap">

  <header></header>

  <main style="padding: 20px; position: relative;">

    <article class="project-list-operation">
       <div>
         <MfBizFormSearch
          :config="searchConfig"
          @update="params => $refs.mfBizTable.getList({ loading: true, params })"
        />
       </div>
       <div>
         <el-button type="primary" size="mini" @click="visible.create = true" icon="el-icon-plus">新建</el-button>
       </div>
    </article>
    
    <MfBizTable style="width: 100%; padding: 0 20px 20px" ref="mfBizTable" :visible.sync="visible" :columns="columns" :layout="layout" :config="config" />
  </main>

  <MfBizFormDialog :visible.sync="visible.create" :config="createConfig" @update="$refs.mfBizTable.getList()" />

</div>
</template>

<script>

import * as http from '../../api/list'

import moment from 'moment'

import {
  mapMutations
} from 'vuex'

function updateHook(row, update) {
  http.update(row).then(() => {
    this.$message.success('修改成功')
    update()
  })
}

export default {

  name: "ProjectList",

  components: {
  },

  data: () => ({
    searchConfig: {
      form: {
        id: {
          label: 'ID',
          value: '',
          meta: {
            type: 'MfBizFormInput'
          },
        },
        title: {
          label: '项目标题',
          value: '',
          meta: {
            type: 'MfBizFormInput'
          },
        },
        startTime: {
          label: '开始时间',
          value: '',
          meta: {
            type: 'MfBizFormDate',
            format: 'yyyy-MM-dd HH:mm:ss',
            dateType: 'datetime',
            valueFormat: 'timestamp',
          },
        },
        endTime: {
          label: '结束时间',
          value: '',
          meta: {
            type: 'MfBizFormDate',
            format: 'yyyy-MM-dd HH:mm:ss',
            dateType: 'datetime',
            valueFormat: 'timestamp',
          },
        },
      }
    },
    createConfig: {
      attributes: {
        top: "15vh",
        title: "创建项目",
        width: "600px",
      },
      request: function() {
         return Promise.resolve({})
      },
      params: {},
      form: {
        title: {
          label: "项目标题",
          value: "",
          attributes: {
            style: {
              width: "100%",
            },
          },
          meta: {
            type: "MfBizFormInput",
            rule: [{
                required: true,
                message: "请输入项目标题",
                trigger: "blur"
              },
              {
                min: 1,
                max: 50,
                message: "长度在 1 到 255 个字符",
                trigger: "blur",
              },
            ],
          },
        },
        
        startTime: {
          label: "项目开始时间",
          value: "",
          attributes: {
            style: {
              width: "50%",
            },
          },
          meta: {
            type: 'MfBizFormDate',
            format: 'yyyy-MM-dd HH:mm:ss',
            dateType: 'datetime',
            valueFormat: 'timestamp',
          },
        },
        endTime: {
          label: "项目结束时间",
          value: "",
          attributes: {
            style: {
              width: "50%",
            },
          },
          meta: {
            type: 'MfBizFormDate',
            format: 'yyyy-MM-dd HH:mm:ss',
            dateType: 'datetime',
            valueFormat: 'timestamp',
          },
        },
      },
    },
    config: {
      request: {
        getList: http.getList
      },
      params: {
        getList: {},
      },
    },
    layout: {
      table: {
        height: "calc(100vh - 296px)",
        attribute: {},
        pagination: {
          visible: true,
        },
      },
    },
    visible: {
      create: false,
      details: false,
    },
    columns: [
      {
        prop: "id",
        label: "ID",
        attributes: {
          width: "80",
        },
      },
      {
        prop: "title",
        label: "项目标题",
        attributes: {
          "min-width": "200",
          "show-overflow-tooltip": true,
        },
        hooks: {
          click(row) {
            alert('跳转')
          }
        },
        meta: {
          edit: true,
          type: "MfBizFormInput",
          clickHook: function (row) {
          },
          updateHook
        },
      },
      {
        prop: "startTime",
        label: "开始时间",
        attributes: {
          "min-width": "200",
          "show-overflow-tooltip": true,
        },
        hooks: {
          value(v, row) {
            return v ? moment(v).format('yyyy-MM-DD HH:mm:ss') : '--'
          }
        },
        meta: {
          edit: true,
          type: 'MfBizFormDate',
          format: 'yyyy-MM-dd HH:mm:ss',
          dateType: 'datetime',
          valueFormat: 'timestamp',
          updateHook,
        }
      },
      {
        prop: "endTime",
        label: "结束时间",
        hooks: {
          value(v, row) {
            return v ? moment(v).format('yyyy-MM-DD HH:mm:ss') : '--'
          }
        },
        attributes: {
          "min-width": "200",
          "show-overflow-tooltip": true,
        },
        meta: {
          edit: true,
          type: 'MfBizFormDate',
          format: 'yyyy-MM-dd HH:mm:ss',
          dateType: 'datetime',
          valueFormat: 'timestamp',
          updateHook,
        }
      },
      {
        prop: "opt",
        label: "操作",
        attributes: {
          fixed: 'right',
          width: "80",
          align: "center",
        },
        render(h, row) {
          return (
            <el-button type="primary" onClick={ this.handleLookDetail.bind(this, row) }  size="mini">查看</el-button>
          )
        },
      },
    ],
  }),
  methods: {

    handleEditTableRow(row) {
      this.setStoreFmsClickData(row)
      this.visible.details = true
      this.$refs.detail.init()
    },

    handleLookDetail(row) {
      this.$router.push(`/list/basicDetail/${ row.id }`)
    },

   
    ...mapMutations('fms', {
      'setStoreFmsClickData': 'SET_FMS_CLICK_FAULT_DATA'
    })
  }
};
</script>
