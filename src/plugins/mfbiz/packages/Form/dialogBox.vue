<template>
  <main
   @click.stop="() => {}"
  >
      <el-dialog
        v-bind="config.attributes"
        :visible="visible"
        :before-close="() => $emit('update:visible', false)"
      >
        <el-form 
          :inline="config.layout.inline" 
          :model="form" 
          :rules="rules"
          ref="dialogForm" 
          v-bind="config.layout.attributes"
        >
          <el-form-item 
            v-for="(key, index) in Object.keys(this.config.params)"
            :key="index"
            :prop="key"
            :label="config.params[ key ].label" 
          > 
            <component
              :is="config.params[ key ].meta.type"
              :value.sync="form[ key ]"
              :row="row || {}"
              v-bind="Object.assign(config.params[ key ].meta.attributes, config.params[ key ].meta, {})"
            />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="$emit('update:visible', false)">取 消</el-button>
          <el-button :loading="loading.btn" type="primary" @click="confirm" >确 定</el-button>
        </span>
      </el-dialog>
  </main>
</template>  

<script>

  import propsMixin from './mixin/props.js'
  import notifyUpdateMixin from './mixin/notify-update.js'

  export default {

    name: 'MfBizFormDialogBox',

    props: {
      config: Object,
      visible: Boolean,
      row: [ String, Number, Object, Array ],
    },

    mixins: [ propsMixin, notifyUpdateMixin ],

    components: {
      FormInput: require('./input.js').default,
      FormTextarea: require('./textarea.js').default,
      FormSelect: require('./select.js').default
    },

    data: () => ({
      loading: {
        btn: false,
      },
      form: {},
      rules: {},
    }),

    created () {
      this.init()
    },


    methods: {

      init() {
        Object.keys(this.config.params).forEach(key => {

           let value = this.config.params[ key ].value || ''

           if ( typeof this.config.params[ key ].meta.valueHook  === 'function') {
             value = this.config.params[ key ].meta.valueHook(value, this.row)
           }

          this.$set(this.form, key, value)
          this.$set(this.rules, key, this.config.params[ key ].meta.rules || [])
        })
      },

      confirm() {

        this.loading.btn = true

        this.$refs.dialogForm.validate((valid) => {
          if (valid) {
            this.config.updateHook.call(this, this.row || {}, this.form, () => {
              this.$emit('update:visible', false)
              this.config.notice && this.config.notice()
              this.config.update()
              this.loading.btn = false
            })
          } else {
            return false
          }
        })
      }
    },

  }
</script>

