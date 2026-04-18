<template>
  <div class="page-container layout-padding">
    <el-card shadow="hover" class="layout-padding-auto">
      <el-form class="query" :inline="true">
        <el-form-item>
          <el-button size="default" type="success" class="ml10" @click="onOpenAdd('add')">
            <el-icon>
              <ele-Plus />
            </el-icon>
            新增类目
          </el-button>
        </el-form-item>
      </el-form>
      <el-table :data="list" v-loading="loading" style="width: 100%" row-key="id">
        <el-table-column label="类目Id" width="100">
          <template #default="{ row }">
            {{ row.id }}
          </template>
        </el-table-column>
        <el-table-column label="类目图片" width="100">
          <template #default="{ row }">
            <img :src="row.imgUrl" style="width: 50px; height: 50px;" v-if="row.imgUrl" />
          </template>
        </el-table-column>
        <el-table-column label="类目名称" show-overflow-tooltip>
          <template #default="{ row }">
            {{ row.name }}
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.show === 1 ? 'success' : 'info'">{{ row.show === 1 ? '显示' : '隐藏' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="{ row }">
            <el-button size="small" text type="primary" @click="onOpenEdit('edit', row)">编辑</el-button>
            <el-button size="small" text type="primary" @click="onRowDel(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="page-bottom" v-if="totalPage > 1">
        <el-pagination v-model:currentPage="currentPage" background layout="prev, pager, next, jumper" :page-count="totalPage" @current-change="getListData" />
      </div>
    </el-card>
    <detailDialog ref="detailDialogRef" @refresh="getListData" />
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, reactive, onMounted, ref, toRefs } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { getItemList, deleteItem } from '@/api/product/item/index'

// 引入组件
const detailDialog = defineAsyncComponent(
  () => import('./component/detail.vue')
)

// 定义变量
const detailDialogRef = ref()
const state = reactive({
  list: [],
  loading: false,
  currentPage: 1,
  totalPage: 1,
})

const { list, loading, currentPage, totalPage } = toRefs(state)

// 获取列表
const getListData = () => {
  state.loading = true
  getItemList({
    page: state.currentPage,
    size: 20
  }).then((data: any) => {
    state.loading = false
    state.list = data.list
    state.totalPage = data.pages || 1
  }).catch(() => {
    state.loading = false
  })
}

// 打开新增弹窗
const onOpenAdd = (type: string) => {
  detailDialogRef.value.openDialog(type)
}

// 打开修改弹窗
const onOpenEdit = (type: string, row: any) => {
  detailDialogRef.value.openDialog(type, row)
}

// 删除
const onRowDel = (row: any) => {
  ElMessageBox.confirm(
    `此操作将永久删除类目名称：“${row.name}”，是否继续?`,
    '提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      deleteItem({
        id: row.id,
      }).then(() => {
        getListData()
        ElMessage.success('删除成功')
      })
    })
    .catch(() => { })
}

// 页面加载时
onMounted(() => {
  getListData()
})
</script>

<style scoped lang="scss">
</style>
