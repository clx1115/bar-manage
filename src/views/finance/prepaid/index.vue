<template>
  <div class="page-container layout-padding">
    <div class="card">
      <el-tabs>
        <el-tab-pane label="采购预付款">
          <Purchase />
        </el-tab-pane>
        <el-tab-pane label="加盟预付款">
          <Joint />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue'

const Purchase = defineAsyncComponent(
  () => import('./components/purchase.vue')
)
const Joint = defineAsyncComponent(
  () => import('./components/joint.vue')
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