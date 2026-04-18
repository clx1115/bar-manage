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
    <el-table-column prop="itemTypeName" label="订单来源" min-width="150" show-overflow-tooltip />
    <el-table-column prop="itemTypeName" label="操作收银员" min-width="150" show-overflow-tooltip />
    <el-table-column prop="itemTypeName" label="下单收银员" min-width="150" show-overflow-tooltip />
    <el-table-column prop="itemTypeName" label="成交金额(元)" min-width="150" show-overflow-tooltip />
    <el-table-column prop="itemTypeName" label="优惠明细(元)" min-width="150" show-overflow-tooltip />
    <el-table-column prop="itemTypeName" label="收款方式" min-width="150" show-overflow-tooltip />
    <el-table-column prop="itemTypeName" label="收款金额(元)" min-width="150" show-overflow-tooltip />
    <el-table-column prop="itemTypeName" label="支付流水号" min-width="150" show-overflow-tooltip />
    <el-table-column prop="itemTypeName" label="收款日期" min-width="150" show-overflow-tooltip />
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
    label: '时间选择',
    prop: 'date',
    type: 'select',
    options: [
      { label: '收款时间', value: 1 },
    ],
  },
  {
    label: ' ',
    prop: 'date',
    type: 'daterange',
    shortcuts: shortcuts,
    labelWidth: '0px',
  },
  {
    label: '单据号',
    prop: 'date',
    type: 'input',
    placeholder: '订单编号、退换货编号',
  },
  {
    label: '操作收银员',
    prop: 'date',
    type: 'select',
    options: [
      { label: '全部', value: 1 },
    ],
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
    label: '收款方式',
    prop: 'date',
    type: 'select',
    options: [
      { label: '全部', value: 1 },
    ],
  },
  {
    label: '销售渠道',
    prop: 'date',
    type: 'select',
    options: [
    ],
  },
  {
    label: '订单来源',
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
