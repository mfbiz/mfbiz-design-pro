<template>
  <div>
    <template v-for="(item, index) in meta.formData">
      <component
        :key="index"
        :is="item.type"
        :value.sync="value[ index ]"
        v-bind="item"
      />{{ index === meta.formData.length - 1 ? '' : '&nbsp;-&nbsp;' }}
    </template>
  </div>
</template>
<script>
export default {

  name: 'MfBizFormCompose',

  props: {
    meta: {
      type: Object,
      default: () => ({
        formData: []
      })
    },
  },


  data: () => ({
    value: [],
  }),

  methods: {

  }
}
</script>