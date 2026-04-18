<template>
  <div class="card">
    <publicSearch :search="search" @search="onSearch" :is-toggle="true" />
    <el-button type="primary" @click="onOpenDetail('add')">添加销售单元</el-button>
    <el-button>批量导入</el-button>
    <el-table :data="list" v-loading="loading" style="width: 100%">
      <el-table-column prop="code" label="申请时间" width="150" show-overflow-tooltip />
      <el-table-column prop="name" label="金额(元)" width="150" show-overflow-tooltip />
      <el-table-column prop="itemTypeName" label="提现手续费(元)" min-width="150" show-overflow-tooltip />
      <el-table-column prop="itemTypeName" label="状态" min-width="150" show-overflow-tooltip />
      <el-table-column prop="itemTypeName" label="到账方式" min-width="150" show-overflow-tooltip />
      <el-table-column prop="itemTypeName" label="到账银行卡" min-width="150" show-overflow-tooltip />
      <el-table-column prop="itemTypeName" label="附加信息" min-width="150" show-overflow-tooltip />
      <el-table-column prop="itemTypeName" label="备注" min-width="150" show-overflow-tooltip />
      <el-table-column fixed="right" prop="itemTypeName" label="订单编号|流水号" min-width="150" show-overflow-tooltip />
      <el-table-column fixed="right" prop="itemTypeName" label="操作" min-width="150" show-overflow-tooltip />
    </el-table>
    <div class="page-bottom">
      <el-pagination v-model:currentPage="currentPage" background layout="prev, pager, next, jumper" :page-count="totalPage" @size-change="getListData" @current-change="getListData" />
    </div>
    <Detail ref="relationDetailRef" />
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, reactive, ref, toRefs } from 'vue'

const publicSearch = defineAsyncComponent(
  () => import('@/components/publicSearch/index.vue')
)
const Detail = defineAsyncComponent(
  () => import('./detail.vue')
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


const relationDetailRef = ref()
//搜索条件
const search = ref([
  {
    label: '更新时间',
    prop: 'datee',
    type: 'daterange',
    shortcuts: shortcuts,
  },
  {
    label: '销售单元',
    prop: 'date',
    type: 'select',
    options: [
      { label: '总部', value: 1 },
      { label: 'xxx', value: 1 },
    ],
  },
  {
    label: '上级邀请单元',
    prop: 'date',
    type: 'select',
    options: [
      { label: '全部', value: 1 },
      { label: 'xxx', value: 2 },
    ],
  },
  {
    label: '关系状态',
    prop: 'date',
    type: 'select',
    options: [
      { label: '全部', value: 1 },
      { label: 'xxx', value: 2 },
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

const onOpenDetail = (type: string) => {
  relationDetailRef.value.openDialog(type)
}


</script>

<style scoped lang="scss">
.card {
  background-color: white;
  padding: 20px;

  .page-bottom {
    margin-top: 20px;
  }
}
</style>