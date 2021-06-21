export default {


  // 保留插槽，后续扩展
  // <template slot="operate" slot-scope="row"></template>
  // <slot name="operate" :row="scope.row"></slot>
  // 保留render，后续可扩展
  // <util-render 
  //   :render="item.render" 
  //   :row="scope.row"
  // /> 
  // </template>

  /**
   * 处理用户点击操作
   * @param  { Object } item 当前点击按钮信息
   */
  methods: {

    handleOperate(buttonItem, row) {
      
      let flag = this.loading.table

      const handleLoading = () => {
        flag = !flag
        this.loading.table = flag
      }
      
      buttonItem.clickHook.call(this.$parent, row, this.getList, handleLoading)
    }

  }

}