<template>
  <div class="page-container layout-padding">
    <div class="card">
      <div class="title">
        <div class="flex">
          <div class="block"></div>
          <div>店铺余额</div>
        </div>
      </div>
      <Balance></Balance>
      <div class="title">
        <div class="flex">
          <div class="block"></div>
          <div>最近交易记录</div>
        </div>
        <div class="navi-item">
          全部交易记录
        </div>
      </div>
      <el-tabs type="card">
        <el-tab-pane v-for="item in tabList" :key="item.label" :label="item.label">
          <Log :status="item.status"></Log>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toRefs, reactive, defineAsyncComponent } from 'vue'

const Balance = defineAsyncComponent(() => import('./components/balance.vue'))
const Log = defineAsyncComponent(() => import('./components/log.vue'))

// 定义变量
const state = reactive({
  tabList: [] as any,
})

const { tabList } = toRefs(state)

state.tabList = [
  { label: '全部', status: 0 },
  { label: '进行中', status: 10 },
  { label: '待结算', status: 20 },
  { label: '退款', status: 30 },
  { label: '交易成功', status: 40 },
  { label: '交易关闭', status: 50 },
]

</script>

<style scoped lang="scss">
.card {
  background-color: white;
  padding: 16px;

  .title {
    background-color: #f7f7f7;
    padding: 10px;
    margin-bottom: 16px;
    display: flex;
    justify-content: space-between;

    .block {
      width: 4px;
      background-color: var(--el-color-primary);
      background-clip: content-box;
      padding: 1px 0;
      margin-right: 10px;
    }

    .navi-item {
      color: var(--el-color-primary);
      cursor: pointer;
    }

  }

  :deep(.el-tabs__item) {
    background-color: #f7f7f7;

    &.is-active {
      background-color: #fff;
    }
  }
}

.flex {
  display: flex;
}
</style>
