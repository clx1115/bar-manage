<template>
  <publicSearch :search="search" @search="onSearch" :is-toggle="true" />
  <div class="total">
    <span>合计数据</span>
    <el-switch v-model="showTotal" style="margin: 0 4px" />
    <div v-show="showTotal">
      <span>成交金额合计：<span class="money">0.00元</span></span>
      <span>优惠明细合计：<span class="money">0.00元</span></span>
      <span>收款金额合计：<span class="money">0.00元</span></span>
    </div>
  </div>
  <el-table :data="list" v-loading="loading" style="width: 100%" :header-cell-style="{ background: '#f5f7fa' }">
    <el-table-column prop="code" label="订单编号|退换货单号" width="160" show-overflow-tooltip />
    <el-table-column prop="name" label="交易发生日期" width="150" show-overflow-tooltip />
    <el-table-column prop="itemTypeName" label="交易类型" min-width="150" show-overflow-tooltip />
    <el-table-column prop="itemTypeName" label="销售单元" min-width="150" show-overflow-tooltip />
    <el-table-column prop="itemTypeName" label="成交金额(元)" min-width="150" show-overflow-tooltip />
    <el-table-column prop="itemTypeName" label="代收(元)" min-width="150" show-overflow-tooltip />
    <el-table-column prop="itemTypeName" label="入账前退款(元)" min-width="150" show-overflow-tooltip />
    <el-table-column prop="itemTypeName" label="入账状态" min-width="150" show-overflow-tooltip />
    <el-table-column prop="itemTypeName" label="入账账户" min-width="150" show-overflow-tooltip />
    <el-table-column prop="itemTypeName" label="入账金额(元)" min-width="150" show-overflow-tooltip />
    <el-table-column prop="itemTypeName" label="入账流水号" min-width="150" show-overflow-tooltip />
    <el-table-column prop="itemTypeName" label="入账时间" min-width="150" show-overflow-tooltip />
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
    label: '交易发生时间',
    prop: 'date',
    type: 'daterange',
    shortcuts: shortcuts,
  },
  {
    label: '入账时间',
    prop: 'date',
    type: 'daterange',
    shortcuts: shortcuts,
  },
  {
    label: '单据号',
    prop: 'date',
    type: 'input',
    placeholder: '订单编号、退换货编号',
  },
  {
    label: '交易类型',
    prop: 'date',
    type: 'select',
    options: [
      { label: '全部', value: 1 },
    ],
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
    label: '入账账户',
    prop: 'date',
    type: 'select',
    options: [
    ],
  },
  {
    label: '入账状态',
    prop: 'date',
    type: 'select',
    options: [
      { label: '全部', value: 1 },
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
  showTotal: false,
})

const { list, loading, currentPage, totalPage, showTotal } = toRefs(state)

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

.total {
  display: flex;
  align-items: center;

  div {
    span {
      margin-right: 6px;
      color: gray;
    }

    .money {
      color: black;
    }
  }
}
</style>
