<template>
  <publicSearch :search="search" @search="onSearch" />
  <el-table :data="list" v-loading="loading" style="width: 100%" :header-cell-style="{ background: '#f5f7fa' }">
    <el-table-column prop="code" label="充值时间" width="150" show-overflow-tooltip />
    <el-table-column prop="name" label="名称" width="150" show-overflow-tooltip />
    <el-table-column prop="itemTypeName" label="业务单号|支付流水号" min-width="150" show-overflow-tooltip />
    <el-table-column prop="itemTypeName" label="金额（元）" min-width="150" show-overflow-tooltip />
    <el-table-column prop="itemTypeName" label="充值状态" min-width="150" show-overflow-tooltip />
    <el-table-column prop="itemTypeName" label="操作人" min-width="150" show-overflow-tooltip />
    <el-table-column prop="itemTypeName" label="支付方式" min-width="150" show-overflow-tooltip />
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
    label: '充值时间',
    prop: 'date',
    type: 'daterange',
    shortcuts: shortcuts,
  },
  {
    label: '充值状态',
    prop: 'date',
    type: 'select',
    options: [
      { label: '已支付', value: 1 },
      { label: '未支付', value: 2 },
    ],
  },
  {
    label: '支付方式',
    prop: 'date',
    type: 'select',
    options: [
      { label: '微信', value: 1 },
      { label: '支付宝', value: 2 },
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
})

const { list, loading, currentPage, totalPage } = toRefs(state)

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


</script>

<style scoped lang="scss">
.page-bottom {
  margin-top: 20px;
}
</style>
