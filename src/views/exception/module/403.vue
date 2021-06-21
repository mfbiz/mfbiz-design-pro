<style scoped>

</style>
<template>
  <ExceptionTemplate 
    type="403" 
  />
</template>

<script>

export default {

  name: '403',

  components: {
    ExceptionTemplate: () => import('../components/template.vue')
  }
}
</script>