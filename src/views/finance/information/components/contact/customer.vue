<template>
  <publicSearch :search="search" @search="onSearch" :is-toggle="true" />
  <el-table :data="list" v-loading="loading" style="width: 100%" :header-cell-style="{ background: '#f5f7fa' }">
    <el-table-column prop="code" label="熟客编号" width="150" show-overflow-tooltip />
    <el-table-column prop="name" label="类型" width="150" show-overflow-tooltip />
    <el-table-column prop="itemTypeName" label="企业名称" min-width="150" show-overflow-tooltip />
    <el-table-column prop="itemTypeName" label="联系人" min-width="150" show-overflow-tooltip />
    <el-table-column prop="itemTypeName" label="联系电话" min-width="150" show-overflow-tooltip />
    <el-table-column prop="itemTypeName" label="状态" min-width="150" show-overflow-tooltip />
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

//搜索条件
const search = ref([
  {
    label: '类型',
    prop: 'type',
    type: 'select',
    options: [

    ],
  },
  {
    label: '名称',
    prop: 'name',
    type: 'input',
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

const router = useRouter()
const openAdd = () => {
  router.push({ path: '/finance/addPartner' })
}


</script>

<style scoped lang="scss">
.page-bottom {
  margin-top: 20px;
}
</style>
