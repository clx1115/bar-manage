<template>
  <el-tabs>
    <el-tab-pane label="商品成本日历">
      <Goods />
    </el-tab-pane>
    <el-tab-pane label="分类毛利率设置">
      <Category />
    </el-tab-pane>
  </el-tabs>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue'

const Goods = defineAsyncComponent(
  () => import('./goods.vue')
)
const Category = defineAsyncComponent(
  () => import('./category.vue')
)

</script>

<style scoped lang="scss">
.card {
  background-color: white;
  padding: 16px;
}

.flex {
  display: flex;
}

.page-bottom {
  margin-top: 20px;
}
</style>