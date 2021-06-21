
<style lang="less" scoped>
.input-wrapper {
  &.inline {
    display: flex;
    .input-box {
      flex: 1;
      margin-right: 14px;
    }
  }
  .input-append {
    width: 30px;
    height: 100%;
    display: flex;
    align-items: flex-end;
    justify-content: center;

    &.hasbg {
      background: #eee;
    }
  }
}

.mf-biz-footer-action {
  margin-top: 10px;
  display: flex;
  align-items: center;
}
.submit-tiptext {
  margin-left: auto;
  margin-right: 4px;
  font-size: 14px;
  color: #ccc;
}

.mf-biz-comment__warp {
  position: relative;
}
.mf-biz-comment-main {
  margin-bottom: 30px;
}
.mf-biz-comment-reply-wrap {
  padding: 0 10px;
  transition: .3s;
  border-radius: 5px;
  display: flex;
  a {
    font-size: 12px;
    color: #aaa;
    &.el-icon-close {
      display: inline-block;
      margin-left: 2px;
    }
  }
}
</style>


<template>
  <div class="comment-editor mf-biz-comment__warp" ref="container">

    <main class="mf-biz-comment-main" v-loading="loading.list">

      <template v-for="item in list"> 
        
        <ListItem 
          :key="item.id"
          :item="item"
          @clickAvatar="addReply"
        > 
          <template v-for="childItem in item.children">
            <ListItem 
              slot="children"
              :key="childItem.id"
              :item="childItem"
            />
          </template>
        </ListItem>


      </template>

      
    </main>

    <div class="input-wrapper" :class="{inline}">
      <input-box
        ref="inputBox"
        :type=" inline ? 'text' :'textarea'"
        content-type="rich"
        @focus="onInputFocus"
        @blur="onInputBlur"
        @keyup.enter.ctrl.exact.native="submit"
        v-model="value"
        :placeholder="'按Ctrl + Enter快速提交'"
        :focused="showInlineButton"
        class="input-box"
      >
        <div v-if="inline" :class="['input-append',{hasbg:!showInlineButton}]" slot="append">
          <emoji-picker
            ref="emojiPicker"
            trigger-pick="click"
            @activated="inputBoxFocused=true"
            @selected="handlerEmojiSelected"
            picker-position="left"
            :button-text-visible="false"
          ></emoji-picker>
        </div>
      </input-box>
      <transition name="button" >
        <el-button
          @click.stop="submit"
          :disabled="!value"
          ref="button"
          v-show="showInlineButton && inline"
          size="mini"
          type="primary"
        >
          {{ buttonText }}
        </el-button>
      </transition>
    </div>
    <div class="mf-biz-footer-action" v-if="!inline">
      <emoji-picker
        trigger-pick="click"
        @activated="$refs.inputBox.focus()"
        @selected="handlerEmojiSelected"
      ></emoji-picker>
      <span class="mf-biz-comment-reply-wrap" v-show="reply.id">
        <a href="javascript:;">回复: {{ reply.user }}</a>
        <a href="javascript:;" class="el-icon-close" @click.stop="reply.id = ''"></a>
      </span>
      <span class="submit-tiptext"></span>
        <el-button
          @click.stop="submit"
          :disabled="!value"
          size="mini"
          type="primary"
          :loading="loading.submit"
        >
          {{ buttonText }}
        </el-button>
    </div>
  </div>
</template>
<script>
import InputBox from './components/input-box'
import EmojiPicker from './components/emoji-picker'
export default {
  name: 'MfBizComment',
  components: { 
    InputBox, 
    EmojiPicker,
    ListItem: () => import('./components/list-item.vue'), 
  },

  data() {
    return {
      list: [],
      loading: {
        list: false,
        submit: false
      },
      reply: {
        user: '',
        id: '',
      },
      active: false,
      value: '',
      inputBoxFocused: false
    }
  },

  props: {

    config: {
      type: Object,
      required: true,
      default: () => {}
    },

    buttonText: {
      type: String,
      default: '提交'
    },
    inline: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    showInlineButton() {
      return !!(this.inputBoxFocused || this.value)
    }
  },
  destroyed() {
    document.removeEventListener('click', this.hideButton)
  },
  mounted() {

    document.addEventListener('click', this.hideButton)

    this.init()

  },
  methods: {

    init() {
      this.getList()
    },

    getList() {

      this.loading.list = true

      this.config.request.getList({})
      .then(v => {
        this.list = v || []
      })
      .finally(v => {
        this.loading.list = false
      })
    },

    addReply({ user, id }) {
      this.reply.user = user
      this.reply.id = id
    },

    focus(){
      this.$refs.inputBox.focus()
    },

    hideButton(e) {
      if (this.$refs.container.contains(e.target)) {
        return
      }

      if (!this.$refs.container.contains(e.target)) {
        this.inputBoxFocused = false
      }
    },
    onInputFocus(e) {
      this.inputBoxFocused = true
    },
    onInputBlur(e) {
      if (this.$refs.container.contains(e.target)) {
        return
      }

      this.inputBoxFocused = false
    },
    submit(ev) {

      if (ev.target.hasAttribute('disabled')) return

      this.loading.submit = true

      this.config.request.create({
        value: this.value,
        parentId: this.reply.id || ''
      }).then(v => {
        this.reply.id = ''
        this.value = ''
        this.$refs.inputBox.clear()
        this.getList()
      }).finally(v => {
        this.loading.submit = false
      })

    },

    handlerEmojiSelected(e) {
      this.$refs.inputBox.focus()
      const clonedNode = e.target.cloneNode(true)
      clonedNode.style.verticalAlign = 'text-top'
      document.execCommand('insertHTML', false, clonedNode.outerHTML)
    }
  }
}
</script>