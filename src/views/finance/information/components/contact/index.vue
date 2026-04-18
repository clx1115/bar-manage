<template>
  <el-tabs>
    <el-tab-pane label="合作伙伴">
      <Partner />
    </el-tab-pane>
    <el-tab-pane label="供应商">
      <Vendor />
    </el-tab-pane>
    <el-tab-pane label="加盟商">
      <Franchisee />
    </el-tab-pane>
    <el-tab-pane label="员工">
      <Employee />
    </el-tab-pane>
    <el-tab-pane label="组织机构">
      <Organization />
    </el-tab-pane>
    <el-tab-pane label="熟客">
      <Customer />
    </el-tab-pane>
  </el-tabs>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue'

const Partner = defineAsyncComponent(
  () => import('./partner.vue')
)
const Vendor = defineAsyncComponent(
  () => import('./vendor.vue')
)
const Franchisee = defineAsyncComponent(
  () => import('./franchisee.vue')
)
const Employee = defineAsyncComponent(
  () => import('./employee.vue')
)
const Organization = defineAsyncComponent(
  () => import('./organization.vue')
)
const Customer = defineAsyncComponent(
  () => import('./customer.vue')
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