<template>
  <publicSearch :search="search" @search="onSearch" :is-toggle="true" />
  <el-button type="primary" style="margin-bottom: 15px;" :disabled="!selectionList.length">批量对账</el-button>
  <el-table :data="list" v-loading="loading" style="width: 100%" @selection-change="handleSelectionChange" :header-cell-style="{ background: '#f5f7fa' }">
    <el-table-column type="selection" width="55" />
    <el-table-column prop="code" label="交易发生日期" width="150" show-overflow-tooltip />
    <el-table-column prop="name" label="销售单元" width="150" show-overflow-tooltip />
    <el-table-column prop="itemTypeName" label="代收(元)" min-width="150" show-overflow-tooltip />
    <el-table-column prop="itemTypeName" label="已入账金额(元)" min-width="150" show-overflow-tooltip />
    <el-table-column prop="itemTypeName" label="入账前退款(元)" min-width="150" show-overflow-tooltip />
    <el-table-column prop="itemTypeName" label="未入账金额(元)" min-width="150" show-overflow-tooltip />
    <el-table-column prop="itemTypeName" label="对账状态" min-width="150" show-overflow-tooltip />
    <el-table-column prop="itemTypeName" label="操作人" min-width="150" show-overflow-tooltip />
    <el-table-column prop="itemTypeName" label="对账时间" min-width="150" show-overflow-tooltip />
    <el-table-column prop="itemTypeName" label="操作" min-width="80" show-overflow-tooltip />
  </el-table>
  <div class="page-bottom">
    <el-pagination v-model:currentPage="currentPage" background layout="prev, pager, next, jumper" :page-count="totalPage" @size-change="getListData" @current-change="getListData" />
  </div>
</template>

<script setup lang="ts">
import { toRefs, reactive, defineAsyncComponent, ref } from 'vue'

const publicSearch = defineAsyncComponent(
  () => import('@/components/publicSearch/index.vue')
)

const shortcuts = [
  {
    text: '近7天',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    },
  },
  {
    text: '近30天',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    },
  },
]

//搜索条件
const search = ref([
  {
    label: '申请时间',
    prop: 'date',
    type: 'daterange',
    shortcuts: shortcuts,
  },
  {
    label: '销售单元',
    prop: 'date',
    type: 'select',
    options: [
      { label: '全部', value: 1 },
    ],
  },
  {
    label: '对账状态',
    prop: 'date',
    type: 'select',
    options: [
      { label: '全部', value: 1 },
      { label: '未对账', value: 2 },
      { label: '已对账', value: 3 },
    ],
  },
])

// 定义变量
const state = reactive({
  list: [],
  loading: false,
  queryData: {},
  submitData: {},
  currentPage: 1,
  totalPage: 1,
  selectionList: [],
})

const { list, loading, currentPage, totalPage, selectionList } = toRefs(state)

const onSearch = (e: any, type: any) => {
  state.queryData = Object.assign({}, e)
  getListData()
}

// 获取列表
const getListData = () => {
  // state.loading = true
  if (JSON.stringify(state.queryData) !== JSON.stringify(state.submitData)) {
    state.currentPage = 1
  }
  const formData = JSON.parse(JSON.stringify(state.queryData))
}

const handleSelectionChange = (e: any) => {
  state.selectionList = e
}


</script>

<style scoped lang="scss">
.page-bottom {
  margin-top: 20px;
}
</style>
