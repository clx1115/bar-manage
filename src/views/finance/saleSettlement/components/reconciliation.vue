<template>
  <publicSearch :search="search" @search="onSearch" :is-toggle="true" />
  <el-button type="primary" style="margin-bottom: 15px;">导出报表</el-button>
  <el-table :data="list" v-loading="loading" style="width: 100%" :header-cell-style="{ background: '#f5f7fa' }">
    <el-table-column prop="uid" label="X单据编号" min-width="150" />
    <el-table-column prop="uid" label="单据状态" min-width="150" />
    <el-table-column prop="memberNo" label="收款状态" min-width="150" />
    <el-table-column prop="memberName" label="付款方是否对账" min-width="150" />
    <el-table-column prop="memberName" label="收款方是否对账" min-width="150" />
    <el-table-column prop="memberName" label="应付合计(元)" min-width="150" />
    <el-table-column prop="memberName" label="调整金额(元)" min-width="150" />
    <el-table-column prop="memberName" label="应结金额(元)" min-width="150" />
    <el-table-column prop="memberName" label="已收金额(元)" min-width="150" />
    <el-table-column prop="memberName" label="本次结算日期" min-width="120" />
    <el-table-column prop="memberName" label="付款方" min-width="100" />
    <el-table-column prop="memberName" label="收款方" min-width="100" />
    <el-table-column prop="memberName" label="操作" min-width="80" />
  </el-table>
  <div class="page-bottom">
    <el-pagination v-model:currentPage="currentPage" background layout="prev, pager, next, jumper" :page-count="totalPage" @size-change="getListData" @current-change="getListData" />
  </div>
</template>

<script setup lang="ts">
import { toRefs, reactive, defineAsyncComponent, ref } from 'vue'
import { useRouter } from 'vue-router'

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
    label: '账单日期',
    prop: 'date',
    type: 'daterange',
    shortcuts: shortcuts,
  },
  {
    label: '代扣状态',
    prop: 'type',
    type: 'select',
    options: [
      {
        label: '全部',
        value: '1',
      },
      {
        label: '未代扣',
        value: '2',
      },
      {
        label: '代扣失败',
        value: '3',
      },
      {
        label: '已代扣',
        value: '4',
      },
    ],
  },
  {
    label: '往来主体',
    prop: 'type',
    type: 'select',
    options: [

    ],
  },
  {
    label: '往来对象',
    prop: 'type',
    type: 'select',
    options: [

    ],
  },
  {
    label: '销售单元',
    prop: 'type',
    type: 'select',
    options: [

    ],
  },
  {
    label: '场景类型',
    prop: 'type',
    type: 'select',
    options: [

    ],
  },
  {
    label: '结算方式',
    prop: 'type',
    type: 'select',
    options: [

    ],
  },
  {
    label: '政策编号',
    prop: 'type',
    type: 'input',
    placeholder: '请输入单据编号',
  },
  {
    label: '单据号',
    prop: 'type',
    type: 'input',
    placeholder: '请输入订单号或退款单号',
  },
  {
    label: '对账单号',
    prop: 'type',
    type: 'input',
    placeholder: '请输入对账单号',
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

const getListData = () => {

}

const router = useRouter()
const toAdd = () => {
  router.push(`/finance/addSaleSettlement?type=4`)
}

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