<template>
   <div 
      v-show="typeof visible === 'boolean'"
      :class="[
        'global__senior-search__wrap',
        visible ? 'senior-search-active__wrap' : ''
      ]"
    >
      <header class="s-head">
        <h1 class="tit">
          <span>{{ layout.title }}</span>
          <a href="javascript:;" class="clear-btn" @click="handleSearchReset">清除筛选</a>
        </h1>

        <a href="javascript:;" @click="cancelSearch" class="el-icon-close close-btn"></a>
      </header>
      <main class="s-main">

        <div v-if="Array.isArray(form)">
          <template v-for="(item, index) in form">
            <article :key="index">
              <h2 style="font-weight: bold;">{{ item.label }}</h2>
              <el-form :inline="false" :model="form[ index ].data" ref="searchForm" class="demo-form-inline">
                <template v-for="(key, childIndex) in Object.keys(form[ index ].data)">
                  <el-form-item 
                    :key="childIndex + 0.1"
                    :prop="key"
                    :label="config[ index ].data[ key ].label" 
                    class="query-form-row"
                  > 
                    <component
                      :is="config[ index ].data[ key ].meta.type"
                      :value.sync="form[ index ].data[ key ]"
                      v-bind="config[ index ].data[ key ].meta"
                    />
                  </el-form-item>
                </template>
                
              </el-form>

            </article>
          </template>
        </div>
        <div v-else>
          
          <el-form 
            :inline="false" 
            ref="searchForm" 
            :model="form"
            class="demo-form-inline"
          >

            <template v-for="(key, index) in Object.keys(form)">
              <el-form-item 
                v-if="config.form[ key ].meta.visible || false"
                :key="index"
                :prop="key"
                :label="config.form[ key ].label" 
                class="query-form-row"
              > 
                <component
                  :is="config.form[ key ].meta.type"
                  :value.sync="form[ key ]"
                  v-bind="config.form[ key ].meta"
                />
              </el-form-item>
            </template>
            
          </el-form>

        </div>
        
      </main> 
      <footer class="s-foot">
        <el-button type="primary" style="width:100%;" @click="handleSearchQuery">筛选</el-button>
      </footer>
    </div>
</template>
<script>


import mixins from './mixin'

export default {

  name: 'MfBizSearch',
  
  props: {
    visible: {
      type: Boolean,
      default: () => ''
    },
    layout: [ Object ],
    config: [ Object, Array ],
  },

  components: {
  },

  mixins: [ mixins ],

  watch: {
  },
  
  created() {
    this.init()
  }
}
</script>