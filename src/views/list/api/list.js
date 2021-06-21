
import { axios } from '@/app.utils.js'


// export const getList = params => axios.get(`/api/fms/faultContent/getFaultType`, params)

// 直接返回假数据
export const getList = async function() {
  return {
    total: 3,
    list: [
      {
        id: 1,
        title: '项目管理系统',
      },
      {
        id: 2,
        title: '发布系统',
      },
      {
        id: 3,
        title: '故障系统',
      }
    ]
  }
}

export const update = params => Promise.resolve()
