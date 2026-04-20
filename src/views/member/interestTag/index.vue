<template>
  <div class="page-container layout-padding">
    <el-card shadow="never" class="layout-padding-auto">
      <div class="mb15">
        <el-button size="default" type="success" @click="onOpenAdd">
          <el-icon>
            <ele-Plus />
          </el-icon>
          新增兴趣标签
        </el-button>
      </div>
      <el-table :data="tableData.data" v-loading="tableData.loading" style="width: 100%">
        <el-table-column prop="id" label="ID" width="100" />
        <el-table-column prop="tagName" label="标签名称" show-overflow-tooltip />
        <el-table-column prop="sortOrder" label="排序" width="100" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag type="success" v-if="scope.row.status === 1">启用</el-tag>
            <el-tag type="info" v-else>停用</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" show-overflow-tooltip>
          <template #default="scope">
            {{ formatTime(scope.row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button size="small" text type="primary" @click="onOpenEdit(scope.row)">修改</el-button>
            <el-button size="small" text type="primary" @click="onRowDel(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <InterestTagDetail ref="interestTagDetailRef" @refresh="getTableData" />
  </div>
</template>

<script setup lang="ts" name="interestTagIndex">
import { defineAsyncComponent, reactive, ref, onMounted } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { getInterestTagList, deleteInterestTag } from '@/api/member/interestTag'
import { formatDate } from '@/utils/formatTime'

// 引入组件
const InterestTagDetail = defineAsyncComponent(() => import('./component/detail.vue'))

// 定义变量
const interestTagDetailRef = ref()
const tableData = reactive({
  data: [],
  loading: false,
})

// 初始化表格数据
const getTableData = () => {
  tableData.loading = true
  getInterestTagList({})
    .then((res: any) => {
      tableData.data = res.list || []
      tableData.loading = false
    })
    .catch(() => {
      tableData.loading = false
    })
}

// 打开新增弹窗
const onOpenAdd = () => {
  interestTagDetailRef.value.openDialog()
}

// 打开修改弹窗
const onOpenEdit = (row: any) => {
  interestTagDetailRef.value.openDialog(row)
}

// 删除
const onRowDel = (row: any) => {
  ElMessageBox.confirm(`此操作将永久删除兴趣标签：“${row.tagName}”，是否继续?`, '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      deleteInterestTag({ id: row.id, operation: 'del' }).then(() => {
        getTableData()
        ElMessage.success('删除成功')
      })
    })
    .catch(() => {})
}

// 格式化时间
const formatTime = (time: any) => {
  if (!time) return '-'
  return formatDate(new Date(time), 'YYYY-mm-dd HH:MM:SS')
}

// 页面加载时
onMounted(() => {
  getTableData()
})
</script>

<style scoped lang="scss">
</style>
