<style lang="less">
  .mfbiz-field-options-config {

    position: relative;

    .field-options-config-item {
      width: 100%;
      display: grid;
      grid-gap: 10px;
      margin-bottom: 20px;
      grid-template-columns: 18px auto auto 22px 22px;
      > a {
        height: 100%;
        display: flex;
        align-items: center;
      }
    }

    .icon-drag-btn {
      display: inline-block;
      margin-top: 50%;
      width: 20px;
      height: 20px;
      background: #f6f7fb;
      border-radius: 2px;
      font-size: 13px;
      text-align: center;
      color: #525975;
      line-height: 20px;
    }
    .field-options-config-item-add,
    .field-options-config-item-remove {
      color: #cacee0;
      font-size: 22px;
    }
    
  }
</style>
<template>
  <div class="mfbiz-field-options-config">
    <template v-for="(item, index) in options">
      <section :key="index" class="field-options-config-item">
        <span class="project-iconfont project-icon-drag icon-drag-btn">{{ index + 1 }}</span>
        <MfBizFormInput 
          :value.sync="item.label"
          placeholder="请输入显示文本"
          @change="handleChange"
        />
        <MfBizFormInput 
          :value.sync="item.value"
          placeholder="请输入选项编号"
          @change="handleChange"
        />
        <a href="javascript:;" class="el-icon-circle-plus field-options-config-item-add" @click.stop="add"></a>
        <a href="javascript:;" class="el-icon-remove field-options-config-item-remove"  @click.stop="remove(index)"></a>
      </section>
    </template>
    
  </div>
</template>
<script>
export default {

  name: 'MfBizFieldOptionsConfig',

  props: {
    meta: {
      type: Object,
      default: () => ({
        formData: []
      })
    },
  },


  data: () => ({
    options: [],
  }),

  mounted() {
    this.add()
  },

  methods: {

    handleChange() {
      this.$emit('change', this.options)
      this.$emit('update:value', this.options)
    },

    add() {
      this.options.push({
        label: '',
        value: ''
      })
    },

    remove(index) {
      this.$delete(this.options, index)
    }
  }
}
</script>