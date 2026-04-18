<template>
  <div>
    <publicSearch :search="search" @search="onSearch" :is-toggle="true" />
    <el-button type="primary" style="margin-bottom: 15px;">导出报表</el-button>
    <el-table :data="list" v-loading="loading" style="width: 100%" :header-cell-style="{ background: '#f5f7fa' }">
      <el-table-column prop="uid" label="单据编号" min-width="150" />
      <el-table-column prop="uid" label="单据状态" min-width="150" />
      <el-table-column prop="memberNo" label="单据类型" min-width="150" />
      <el-table-column prop="memberName" label="款项用途" min-width="150" />
      <el-table-column prop="memberName" label="申请金额(元)" min-width="150" />
      <el-table-column prop="memberName" label="付款金额(元)" min-width="150" />
      <el-table-column prop="memberName" label="制单日期" min-width="150" />
      <el-table-column prop="memberName" label="付款方" min-width="150" />
      <el-table-column prop="memberName" label="收款方" min-width="150" />
      <el-table-column prop="memberName" label="来源单据类型" min-width="150" />
      <el-table-column prop="memberName" label="来源单据单号" min-width="120" />
      <el-table-column prop="memberName" label="付款方式" min-width="100" />
      <el-table-column prop="memberName" label="付款日期" min-width="150" />
      <el-table-column prop="memberName" label="操作" min-width="80" />
    </el-table>
    <div class="page-bottom">
      <el-pagination v-model:currentPage="currentPage" background layout="prev, pager, next, jumper" :page-count="totalPage" @size-change="getListData" @current-change="getListData" />
    </div>
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
    label: '制单日期',
    prop: 'date',
    type: 'daterange',
    shortcuts: shortcuts,
  },
  {
    label: '付款财务组织',
    prop: 'type',
    type: 'select',
    options: [

    ],
  },
  {
    label: '收款财务组织',
    prop: 'type',
    type: 'select',
    options: [

    ],
  },
  {
    label: '单据编号',
    prop: 'type',
    type: 'input',
    placeholder: '请输入单据编号',
  },
  {
    label: '单据状态',
    prop: 'type',
    type: 'select',
    options: [

    ],
  },
  {
    label: '款项用途',
    prop: 'type',
    type: 'select',
    options: [

    ],
  },
  {
    label: '付款方式',
    prop: 'type',
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