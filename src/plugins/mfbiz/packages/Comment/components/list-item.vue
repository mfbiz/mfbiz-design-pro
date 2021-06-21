<script>
export default {

  name: 'ListItem',

  props: {
    item: Object
  },

  methods: {
    clickAvatar() {
      this.$emit('clickAvatar', this.item)
    }
  }
}
</script>
<template>
   <div 
     class="mf-biz-comment-item"
    >
      <div 
        :class="[
          'mf-biz-comment-item-avatar',
          item[ 'isReply' ] !== false && 'mf-biz-comment-item-avatar-pointer'
        ]"
        @click.stop="clickAvatar"
      >
        <el-avatar icon="el-icon-user-solid" size="small"></el-avatar>
      </div>
      <div class="mf-biz-comment-item-wrap">
        <div class="comment-item-header">
          <span class="comment-item-header-name">{{ item.user }}</span>
          <span class="comment-item-header-time">{{ item.time }}</span>
        </div>
        <div class="comment-item-content">
          <p v-html="item.content"></p>
          <slot name="children"></slot>
        </div>
      </div>
    </div>
</template>

<style lang="less">
  .mf-biz-comment-item{
    padding-top: 15px;
    position: relative;
    display: flex;
  }
  .mf-biz-comment-item-avatar {
    width: 30px;
    &.mf-biz-comment-item-avatar-pointer {
      cursor: pointer;
    }
  }
  .mf-biz-comment-item-wrap {
    flex: 1;
    padding-left: 10px;
    .comment-item-header {
      line-height: 24px;
      margin-bottom: 1px;
      display: flex;
      justify-content: space-between;
    }
    .comment-item-header-name {
      display: inline-block;
      font-size: 14px;
      margin-right: 10px;
      color: #262626;
      cursor: pointer;

    }
    .comment-item-header-time{
      color: #aaa;
      font-size: 12px;

    }
    .comment-item-content {
      color: #262626;
      font-size: 14px;
    }
  }
</style>