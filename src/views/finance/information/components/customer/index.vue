<template>
  <publicSearch :search="search" @search="onSearch" :is-toggle="true" />
  <el-table :data="list" v-loading="loading" style="width: 100%" :header-cell-style="{ background: '#f5f7fa' }">
    <el-table-column prop="code" label="熟客编号" min-width="150" show-overflow-tooltip />
    <el-table-column prop="name" label="归属门店" min-width="150" show-overflow-tooltip />
    <el-table-column prop="itemTypeName" label="类型" min-width="100" show-overflow-tooltip />
    <el-table-column prop="itemTypeName" label="企业名称" min-width="150" show-overflow-tooltip />
    <el-table-column prop="itemTypeName" label="联系人" min-width="150" show-overflow-tooltip />
    <el-table-column prop="itemTypeName" label="手机号码" min-width="150" show-overflow-tooltip />
    <el-table-column prop="itemTypeName" label="状态" min-width="80" show-overflow-tooltip />
    <el-table-column prop="itemTypeName" label="创建人" min-width="150" show-overflow-tooltip />
    <el-table-column prop="itemTypeName" label="创建时间" min-width="150" show-overflow-tooltip />
    <el-table-column label="操作" min-width="80" show-overflow-tooltip>
      <template #default="scope">
        <el-link type="primary" :underline="false">禁用</el-link>
      </template>
    </el-table-column>
  </el-table>
  <!-- <detailDialog ref="detailDialogRef" @refresh="getListData" /> -->
  <div class="page-bottom">
    <el-pagination v-model:currentPage="currentPage" background layout="prev, pager, next, jumper" :page-count="totalPage" @size-change="getListData" @current-change="getListData" />
  </div>
</template>

<script setup lang="ts">
import { toRefs, reactive, defineAsyncComponent, ref } from 'vue'

const publicSearch = defineAsyncComponent(
  () => import('@/components/publicSearch/index.vue')
)
// const detailDialog = defineAsyncComponent(
//   () => import('./detail.vue')
// )

// const detailDialogRef = ref()

//搜索条件
const search = ref([
  {
    label: '熟客名称',
    prop: 'name',
    type: 'input',
  },
  {
    label: '熟客编码',
    prop: 'code',
    type: 'input',
  },
  {
    label: '手机号码',
    prop: 'phone',
    type: 'input',
  },
  {
    label: '归属门店',
    prop: 'shop',
    type: 'select',
    options: [

    ],
  },
  {
    label: '状态',
    prop: 'status',
    type: 'select',
    options: [

    ],
  },
  {
    label: '类型',
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

// 获取列表
const getListData = () => {
  // state.loading = true
  if (JSON.stringify(state.queryData) !== JSON.stringify(state.submitData)) {
    state.currentPage = 1
  }
  const formData = JSON.parse(JSON.stringify(state.queryData))
}

// 打开新增弹窗
// const onOpenAdd = (type: string) => {
//   detailDialogRef.value.openDialog(type)
// }


</script>

<style scoped lang="scss">
.page-bottom {
  margin-top: 20px;
}
</style>
