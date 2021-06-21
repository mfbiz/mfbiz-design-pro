<style scoped>

</style>
<template>
  <ExceptionTemplate 
    type="404" 
  />
</template>

<script>

export default {

  name: '404',

  components: {
    ExceptionTemplate: () => import('../components/template.vue')
  }
}
</script>