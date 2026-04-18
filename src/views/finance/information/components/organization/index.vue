<template>
  <el-table :data="list" v-loading="loading" style="width: 100%" :header-cell-style="{ background: '#f5f7fa' }">
    <el-table-column prop="code" label="组织编码" width="150" show-overflow-tooltip />
    <el-table-column prop="name" label="组织类型" width="150" show-overflow-tooltip />
    <el-table-column prop="itemTypeName" label="名称" min-width="150" show-overflow-tooltip />
    <el-table-column prop="itemTypeName" label="结算方式" min-width="150" show-overflow-tooltip />
    <el-table-column prop="itemTypeName" label="公司全称" min-width="150" show-overflow-tooltip />
    <el-table-column prop="itemTypeName" label="开户银行" min-width="150" show-overflow-tooltip />
    <el-table-column prop="itemTypeName" label="银行账号" min-width="150" show-overflow-tooltip />
    <el-table-column prop="itemTypeName" label="支行名称" min-width="150" show-overflow-tooltip />
    <el-table-column prop="itemTypeName" label="公司税号" min-width="150" show-overflow-tooltip />
    <el-table-column prop="itemTypeName" label="公司地址" min-width="150" show-overflow-tooltip />
    <el-table-column prop="itemTypeName" label="公司电话" min-width="150" show-overflow-tooltip />
    <el-table-column prop="itemTypeName" label="是否小规模纳税人" min-width="150" show-overflow-tooltip />
    <el-table-column label="操作" min-width="80" show-overflow-tooltip>
      <template #default="scope">
        <el-link type="primary" :underline="false" @click="openEdit(scope.row)">编辑</el-link>
      </template>
    </el-table-column>
  </el-table>
  <div class="page-bottom">
    <el-pagination v-model:currentPage="currentPage" background layout="prev, pager, next, jumper" :page-count="totalPage" @size-change="getListData" @current-change="getListData" />
  </div>
</template>

<script setup lang="ts">
import { toRefs, reactive } from 'vue'
import { useRouter } from 'vue-router'

// 定义变量
const state = reactive({
  list: [1],
  loading: false,
  queryData: {},
  submitData: {},
  currentPage: 1,
  totalPage: 1,
})

const { list, loading, currentPage, totalPage } = toRefs(state)

// 获取列表
const getListData = () => {
  // state.loading = true
  if (JSON.stringify(state.queryData) !== JSON.stringify(state.submitData)) {
    state.currentPage = 1
  }
  const formData = JSON.parse(JSON.stringify(state.queryData))
}

const router = useRouter()
const openEdit = (row: any) => {
  router.push({ path: '/finance/editInformation', query: { id: row.id } })
}


</script>

<style scoped lang="scss">
.page-bottom {
  margin-top: 20px;
}
</style>
