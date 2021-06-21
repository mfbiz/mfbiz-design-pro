<style scoped>

</style>
<template>
  <ExceptionTemplate 
    type="500" 
  />
</template>

<script>

export default {

  name: '500',

  components: {
    ExceptionTemplate: () => import('../components/template.vue')
  }
}
</script>