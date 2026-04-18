<template>
  <publicSearch :search="search" @search="onSearch" :is-toggle="true" />
  <el-button class="mb20" type="primary" @click="onOpenAdd('add')">新建费用项目</el-button>
  <el-table :data="list" v-loading="loading" style="width: 100%" :header-cell-style="{ background: '#f5f7fa' }">
    <el-table-column prop="code" label="项目编号" min-width="150" show-overflow-tooltip />
    <el-table-column prop="name" label="项目名称" min-width="150" show-overflow-tooltip />
    <el-table-column prop="itemTypeName" label="费用分类" min-width="150" show-overflow-tooltip />
    <el-table-column prop="itemTypeName" label="状态" min-width="150" show-overflow-tooltip />
    <el-table-column prop="itemTypeName" label="备注" min-width="150" show-overflow-tooltip />
    <el-table-column label="操作" min-width="80" show-overflow-tooltip>
      <template #default="scope">
        <el-link type="primary" :underline="false">禁用</el-link>
      </template>
    </el-table-column>
  </el-table>
  <detailDialog ref="detailDialogRef" @refresh="getListData" />
  <div class="page-bottom">
    <el-pagination v-model:currentPage="currentPage" background layout="prev, pager, next, jumper" :page-count="totalPage" @size-change="getListData" @current-change="getListData" />
  </div>
</template>

<script setup lang="ts">
import { toRefs, reactive, defineAsyncComponent, ref } from 'vue'

const publicSearch = defineAsyncComponent(
  () => import('@/components/publicSearch/index.vue')
)
const detailDialog = defineAsyncComponent(
  () => import('./detail.vue')
)

const detailDialogRef = ref()

//搜索条件
const search = ref([
  {
    label: '分类',
    prop: 'category',
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

// 打开新增弹窗
const onOpenAdd = (type: string) => {
  detailDialogRef.value.openDialog(type)
}


</script>

<style scoped lang="scss">
.page-bottom {
  margin-top: 20px;
}
</style>
