<template>
  <el-table :data="list" v-loading="loading" style="width: 100%" :header-cell-style="{ background: '#f5f7fa' }">
    <el-table-column prop="uid" label="时间" min-width="150" />
    <el-table-column prop="memberNo" label="名称" min-width="150" />
    <el-table-column prop="memberName" label="订单编号 | 支付单号" min-width="200" />
    <el-table-column prop="memberName" label="对方" min-width="200" />
    <el-table-column prop="memberName" label="金额（元） | 明细" min-width="150" />
    <el-table-column prop="memberName" label="状态" min-width="100" />
    <el-table-column prop="memberName" label="操作" min-width="100" />
  </el-table>
</template>

<script setup lang="ts">
import { toRefs, reactive } from 'vue'

const props = defineProps({
  status: {
    type: Number,
    default: 0,
  },
})

// 定义变量
const state = reactive({
  list: [],
  loading: false,
})

const { list, loading } = toRefs(state)


</script>

<style scoped lang="scss"></style>
