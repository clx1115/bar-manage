<template>
  <div>
    <el-table :data="list" v-loading="loading" height="400" style="width: 100%">
      <el-table-column prop="orderNo" label="订单编号" min-width="200" show-overflow-tooltip />
      <el-table-column label="变动金额" width="100">
        <template #default="{ row }">
          <span>{{ parseMoney(row.changeAmount) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="余额" width="100">
        <template #default="{ row }">
          <span>{{ parseMoney(row.leftBalance) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="note" label="备注" show-overflow-tooltip min-width="150" />
      <el-table-column prop="staffName" label="员工" min-width="120"></el-table-column>
      <el-table-column prop="operatorName" label="操作人" width="120" />
      <el-table-column label="时间" show-overflow-tooltip width="180">
        <template #default="{ row }">
          {{ formatDate(row.createTime, 'YY-mm-dd HH:MM:SS') }}
        </template>
      </el-table-column>
    </el-table>
    <div class="mt20">
      <el-pagination v-model:currentPage="currentPage" background layout="prev, pager, next, jumper" :page-count="totalPage" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, toRefs, onMounted } from 'vue'
import { formatDate } from '@/utils/formatTime'
import { parseMoney } from '@/utils/filters'
import { getBalanceLog } from '@/api/finance/index'

const props = defineProps({
  uid: {
    type: Number,
    default: 0,
  }
})

// 定义变量内容
const state = reactive({
  list: [],
  loading: false,
  currentPage: 1,
  totalPage: 1,
})

const { list, loading, currentPage, totalPage } = toRefs(state)

// 获取列表
const getListData = () => {
  state.loading = true
  getBalanceLog({
    uid: props.uid,
    page: state.currentPage,
  }).then((data: any) => {
    state.loading = false
    state.list = data.list
    if (state.currentPage === 1 && data.pages > 0) {
      state.totalPage = data.pages
    }
  })
}

const handleSizeChange = () => {
  getListData()
}

const handleCurrentChange = () => {
  getListData()
}

// 页面加载时
onMounted(() => {
  getListData()
})
</script>
<style lang="scss" scoped></style>