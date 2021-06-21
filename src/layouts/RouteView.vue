<script>
export default {
  name: 'RouteView',
  props: {
    keepAlive: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {}
  },
  render () {
    const { $route: { meta }, $store: { getters } } = this
    const inKeep = (
      <keep-alive>
        <router-view key={ this.$route.fullPath }/>
      </keep-alive>
    )
    const notKeep = (
      <router-view key={ this.$route.fullPath }/>
    )
    // 这里增加了 multiTab 的判断，当开启了 multiTab 时
    // 应当全部组件皆缓存，否则会导致切换页面后页面还原成原始状态
    // if (getters.multiTab && !meta.keepAlive) {
    //   return notKeep
    // }

    return meta.keepAlive ? inKeep : notKeep
  }
}
</script>
