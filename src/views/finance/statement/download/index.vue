<template>
  <div class="page-container layout-padding">
    <div class="card">
      <el-tabs type="card">
        <el-tab-pane v-for="item in typeList" :key="item.value" :label="item.label">
          <Log :type="item.value" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, ref } from 'vue'

const Log = defineAsyncComponent(
  () => import('./components/log.vue')
)

const typeList = ref([
  { label: '日汇总', value: 'date' },
  { label: '月汇总', value: 'month' },
  { label: '年汇总', value: 'year' },
])

</script>

<style scoped lang="scss">
.card {
  background-color: white;
  padding: 16px;

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
