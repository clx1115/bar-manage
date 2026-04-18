<template>
  <div class="page-container layout-padding">
    <el-card shadow="hover" class="layout-padding-auto">
      <el-form class="query" :inline="true" size="default" label-width="80px">
        <el-form-item>
          <el-button size="default" type="success" class="ml10" @click="onOpenAdd('add')">
            <el-icon>
              <ele-Plus />
            </el-icon>
            新增专区
          </el-button>
        </el-form-item>
      </el-form>
      <el-table :data="list" v-loading="loading" style="width: 100%">
        <el-table-column prop="id" label="ID" width="200" />
        <el-table-column prop="title" label="专区标题" show-overflow-tooltip min-width="200"></el-table-column>
        <el-table-column prop="subTitle" label="副标题" show-overflow-tooltip min-width="200"></el-table-column>
        <el-table-column label="操作" width="250">
          <template #default="{ row }">
            <el-button size="small" text type="primary" @click="onOpenEdit('edit', row)">编辑</el-button>
            <el-button size="small" text type="primary" @click="onRowDel(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <detailDialog ref="detailDialogRef" @refresh="getListData" />
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, reactive, onMounted, ref, toRefs } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import {
  getActivityList,
  delActivity,
} from '@/api/activity/index'

// 引入组件
const detailDialog = defineAsyncComponent(
  () => import('./component/detail.vue')
)

// 定义变量
const detailDialogRef = ref()
const selectDialogRef = ref()
const productManageDialogRef = ref()
const state = reactive({
  list: [],
  loading: false,
  queryData: {
    classifyType: 0,
  },
  currentItem: {} as any,
})

const { list, loading, queryData } = toRefs(state)

// 获取列表
const getListData = () => {
  state.loading = true
  getActivityList(state.queryData).then((data: any) => {
    state.loading = false
    state.list = data.list
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

//打开商品管理弹窗
const onOpenManage = (row: any) => {
  state.currentItem = row
  productManageDialogRef.value.openDialog(row)
}


// 删除
const onRowDel = (row: any) => {
  ElMessageBox.confirm(
    `此操作将永久删除归集名称：“${row.classifyCode}”，是否继续?`,
    '提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      delActivity({
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
.node {
  width: 95%;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .btn {
    padding: 0;
  }
}
</style>
