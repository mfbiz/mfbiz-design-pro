export default {
  
  name: 'fms',

  namespaced: true,

  state: {
    clickFaultData: {},
  },

  getters: {
    getClickFaultData: state => state.clickFaultData
  },

  mutations: {

    SET_FMS_CLICK_FAULT_DATA: (state, data) => {
      state.clickFaultData = data
    }

  },

  actions: {

  },
  
}
