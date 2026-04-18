<template>
  <div class="page-container layout-padding">
    <div class="card">
      <publicSearch :search="search" @search="onSearch" />
      <el-button type="primary" style="margin-bottom: 15px;">导出报表</el-button>
      <el-table :data="list" v-loading="loading" style="width: 100%" :header-cell-style="{ background: '#f5f7fa' }">
        <el-table-column prop="uid" label="类型" min-width="150" />
        <el-table-column prop="memberNo" label="入账时间" min-width="150" />
        <el-table-column prop="memberName" label="名称" min-width="200" />
        <el-table-column prop="memberName" label="业务单号|支付流水号" min-width="200" />
        <el-table-column prop="memberName" label="账户" min-width="150" />
        <el-table-column prop="memberName" label="收支类型" min-width="100" />
        <el-table-column prop="memberName" label="金额（元）" min-width="100" />
        <el-table-column prop="memberName" label="余额（元）" min-width="100" />
        <el-table-column prop="memberName" label="支付方式" min-width="100" />
        <el-table-column prop="memberName" label="来源" min-width="100" />
        <el-table-column prop="memberName" label="操作" min-width="100" />
      </el-table>
    </div>
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
    label: '店铺',
    prop: 'shop',
    type: 'select',
    options: [

    ],
  },
  {
    label: '账单时间',
    prop: 'date',
    type: 'daterange',
    shortcuts: shortcuts,
  },
  {
    label: '账户',
    prop: 'type',
    type: 'select',
    options: [

    ],
  },
  {
    label: '支付方式',
    prop: 'type',
    type: 'select',
    options: [

    ],
  },
  {
    label: '渠道',
    prop: 'type',
    type: 'select',
    options: [

    ],
  },
  {
    label: '单号',
    prop: 'type',
    type: 'input',
    placeholder: '订单编号/支付流水号'
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

const { list, loading } = toRefs(state)

const onSearch = (e: any, type: any) => {
  state.queryData = Object.assign({}, e)
  getListData()
}

const getListData = () => {

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
</style>
