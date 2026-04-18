<template>
  <div class="page-container layout-padding">
    <div class="card">
      <publicSearch :search="search" @search="onSearch" :is-toggle="true" />
      <el-button type="primary" style="margin-bottom: 15px;">导出报表</el-button>
      <el-table :data="list" v-loading="loading" style="width: 100%" :header-cell-style="{ background: '#f5f7fa' }">
        <el-table-column prop="uid" label="单据类型" min-width="150" />
        <el-table-column prop="memberNo" label="单据编号" min-width="150" />
        <el-table-column prop="memberName" label="仓库/门店" min-width="200" />
        <el-table-column prop="memberName" label="关联仓库|门店" min-width="200" />
        <el-table-column prop="memberName" label="制单时间" min-width="150" />
        <el-table-column prop="memberName" label="记账时间" min-width="100" />
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
    label: '单据时间',
    prop: 'date',
    type: 'daterange',
    shortcuts: shortcuts,
  },
  {
    label: '单据类型',
    prop: 'type',
    type: 'select',
    options: [

    ],
  },
  {
    label: '单据编号',
    prop: 'type',
    type: 'input',
    placeholder: '请输入单据编号'
  },
  {
    label: '库存单元',
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
