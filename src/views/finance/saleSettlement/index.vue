<template>
  <div class="page-container layout-padding">
    <div class="card">
      <el-tabs>
        <el-tab-pane label="加盟结算">
          <Franchise />
        </el-tab-pane>
        <el-tab-pane label="挂账结算">
          <PutOn />
        </el-tab-pane>
        <el-tab-pane label="销售结算">
          <el-tabs>
            <el-tab-pane label="对账">
              <Reconciliation />
            </el-tab-pane>
            <el-tab-pane label="结算">
              <Settlement />
            </el-tab-pane>
          </el-tabs>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue'

const Franchise = defineAsyncComponent(
  () => import('./components/franchise.vue')
)
const PutOn = defineAsyncComponent(
  () => import('./components/puton.vue')
)
const Reconciliation = defineAsyncComponent(
  () => import('./components/reconciliation.vue')
)
const Settlement = defineAsyncComponent(
  () => import('./components/settlement.vue')
)

</script>

<style scoped lang="scss">
.card {
  background-color: white;
  padding: 16px 20px;

}

.flex {
  display: flex;
}
</style>