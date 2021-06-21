<style lang="less">
.mfbiz-detail-box {
  padding: 20px;
  margin: 20px;
  background: #fff;
  height: calc(100vh - 90px);
  .mfbiz-descriptions-title {
    margin-bottom: 20px;
    color: rgba(0, 0, 0, 0.85);
    font-weight: 700;
    font-size: 16px;
    line-height: 1.5;
  }
  .mfbiz-descriptions {
    margin-bottom: 24px;
    padding-bottom: 24px;
    border-bottom: 1px solid var(--light);
    &:last-of-type {
      border-bottom-width: 0;
    }
  }
  .mfbiz-form-main {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
  }
  .mfbiz-form-item {
    margin-bottom: 25px;
  }
  .mfbiz-form-item-label {
    color: rgba(0, 0, 0, 0.85);
    font-weight: 400;
    font-size: 14px;
  }
}
</style>
<template>
  <div class="mfbiz-detail-box">
    <article class="mfbiz-descriptions">
      <div class="mfbiz-descriptions-title">表单标题1</div>
      <main class="mfbiz-form-main">
        <div class="mfbiz-form-item">
          <span class="mfbiz-form-item-label">表单1：</span>1
        </div>
        <div class="mfbiz-form-item">
          <span class="mfbiz-form-item-label">表单1：</span>1
        </div>
        <div class="mfbiz-form-item">
          <span class="mfbiz-form-item-label">表单1：</span>1
        </div>
        <div class="mfbiz-form-item">
          <span class="mfbiz-form-item-label">表单1：</span>1
        </div>
      </main>
    </article>

    <article class="mfbiz-descriptions">
      <div class="mfbiz-descriptions-title">日志</div>
      <MfBizTable
        style="margin-bottom: 20px;"
        :columns="table.columns"
        :config="table.config"
        :layout="table.layout"
      />
    </article>
  </div>
</template>
<script>

export default {
  data: () => ({
    table: {
      layout: {
        table: {
          attribute: {
            border: true,
            height: "500px",
          },
          pagination: {
            visible: true,
          },
        },
      },
      config: {
        request: {
          getList: function () {
            return Promise.resolve({
              total: 1,
              list: [
                {
                  id: "2",
                  priority: "",
                  title: "站撒",
                },
              ],
            });
          },
        },

        params: {
          getList: {},
        },
      },
      columns: [
        {
          prop: "id",
          label: "ID",
        },
        {
          prop: "title",
          label: "名称",
        },
        {
          prop: "priority",
          label: "优先级",
        },
      ],
    },
  }),
};
</script>
