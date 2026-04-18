<template>
  <div class="page-container layout-pd">
    <div class="card">
      <el-tabs>
        <el-tab-pane label="财务组织">
          <Organization />
        </el-tab-pane>
        <el-tab-pane label="往来单位">
          <Contact />
        </el-tab-pane>
        <el-tab-pane label="费用项">
          <Expense />
        </el-tab-pane>
        <el-tab-pane label="成本日历">
          <Calendar />
        </el-tab-pane>
        <el-tab-pane label="熟客管理">
          <Customer />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue'

const Organization = defineAsyncComponent(
  () => import('./components/organization/index.vue')
)
const Contact = defineAsyncComponent(
  () => import('./components/contact/index.vue')
)
const Expense = defineAsyncComponent(
  () => import('./components/expense/index.vue')
)
const Calendar = defineAsyncComponent(
  () => import('./components/calendar/index.vue')
)
const Customer = defineAsyncComponent(
  () => import('./components/customer/index.vue')
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