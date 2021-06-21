export default {

  name: '运维组',
  theme: {
    color: [ 
      {
        value :'#ff6eb1',
        label: '经典'
      }, {
        value :'#4e8afa',
        label: '深蓝'
      }, {
        value :'#66c060',
        label: '护眼'
      }, {
        value :'#484848',
        label: '黑白'
      }, {
        value :'#22d7bb',
        label: '清新'
      }, {
        value :'#febc20',
        label: '落日'
      }, {
        value :'#6f76fa',
        label: '淡雅'
      }, {
        value :'#2dbcff',
        label: '湖蓝'
      }, {
        value :'#48525c',
        label: '灰调'
      },
    ]
  },
  workbench: {
    path: '/list/search'
  },
  
  request: {
    notTip: [
      '/api/matrix/auth/ccs/login',
    ]
  },



  store: {
    logger: true,
  },

  menu: {
    attribute: {
      'default-active': '/list/search',
    },
    list: [
      {
        icon: 'el-icon-monitor',
        title: '工作台',
        children: [
          {
            title: '面板',
            path: '/dashboard/workplace',
          },
          {
            title: '图表',
            path: '/dashboard/analysis',
          },
        ],
      },
      {
        icon: 'el-icon-s-grid',
        title: '列表',
        children: [
          {
            title: '搜索列表',
            path: '/list/search',
          },
          {
            title: '基本列表',
            path: '/list/basic',
          },
        ],
      }

    ]

  }

}