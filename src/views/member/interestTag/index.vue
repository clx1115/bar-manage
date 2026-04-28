<template>
  <div class="page-container layout-padding">
    <el-card shadow="hover" class="layout-padding-auto">
      <div class="page-intro">
        <div>
          <div class="page-intro__title">兴趣标签</div>
          <div class="page-intro__desc">统一维护用户兴趣标签名称、排序和启停状态，方便前台兴趣体系展示与筛选。</div>
        </div>
      </div>

      <div class="toolbar">
        <el-button size="default" type="success" @click="onOpenAdd">
          <el-icon><ele-Plus /></el-icon>
          新增兴趣标签
        </el-button>
      </div>

      <el-table :data="tableData.data" v-loading="tableData.loading" style="width: 100%">
        <el-table-column prop="id" label="ID" width="100" />
        <el-table-column prop="tagName" label="标签名称" min-width="180" show-overflow-tooltip />
        <el-table-column prop="sortOrder" label="排序" width="100" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 1 ? 'success' : 'info'">
              {{ scope.row.status === 1 ? '启用' : '停用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" min-width="180">
          <template #default="scope">
            {{ formatTime(scope.row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column label="更新时间" min-width="180">
          <template #default="scope">
            {{ formatTime(scope.row.updateTime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="scope">
            <el-button size="small" text type="primary" @click="onOpenEdit(scope.row)">修改</el-button>
            <el-button size="small" text type="danger" @click="onRowDel(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="page-bottom">
        <el-pagination
          v-model:currentPage="tableData.currentPage"
          v-model:page-size="tableData.pageSize"
          background
          layout="total, sizes, prev, pager, next, jumper"
          :page-sizes="[10, 20, 50, 100]"
          :total="tableData.total"
          @current-change="getTableData"
          @size-change="handleSizeChange"
        />
      </div>
    </el-card>
    <InterestTagDetail ref="interestTagDetailRef" @refresh="getTableData" />
  </div>
</template>

<script setup lang="ts" name="interestTagIndex">
import { defineAsyncComponent, reactive, ref, onMounted } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { getInterestTagList, deleteInterestTag } from '@/api/member/interestTag'
import { formatDate } from '@/utils/formatTime'

const InterestTagDetail = defineAsyncComponent(() => import('./component/detail.vue'))

const interestTagDetailRef = ref()
const tableData = reactive({
  data: [] as any[],
  loading: false,
  currentPage: 1,
  pageSize: 10,
  total: 0,
})

const getTableData = () => {
  tableData.loading = true
  getInterestTagList({
    page: tableData.currentPage,
    size: tableData.pageSize,
  })
    .then((res: any) => {
      tableData.data = res.list || []
      tableData.total = (res.pages || 0) * tableData.pageSize
    })
    .finally(() => {
      tableData.loading = false
    })
}

const handleSizeChange = () => {
  tableData.currentPage = 1
  getTableData()
}

const onOpenAdd = () => {
  interestTagDetailRef.value.openDialog()
}

const onOpenEdit = (row: any) => {
  interestTagDetailRef.value.openDialog(row)
}

const onRowDel = (row: any) => {
  ElMessageBox.confirm(`此操作将永久删除兴趣标签“${row.tagName}”，是否继续？`, '提示', {
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

const formatTime = (time: any) => {
  if (!time) return '-'
  return formatDate(new Date(time), 'YYYY-mm-dd HH:MM:SS')
}

onMounted(() => {
  getTableData()
})
</script>

<style scoped lang="scss">
.page-intro {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 18px;
  margin-bottom: 18px;
  border: 1px solid #e7eef7;
  border-radius: 16px;
  background: linear-gradient(135deg, #f7fbff 0%, #fbfaf5 100%);
}

.page-intro__title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2d3d;
}

.page-intro__desc {
  margin-top: 4px;
  font-size: 13px;
  line-height: 1.6;
  color: #667085;
}

.toolbar {
  margin-bottom: 16px;
}

.page-bottom {
  display: flex;
  justify-content: flex-end;
  margin-top: 18px;
}

:deep(.el-card__body) {
  padding: 24px 24px 18px;
}

:deep(.el-table) {
  overflow: hidden;
  border: 1px solid #edf2f7;
  border-radius: 14px;
}

:deep(.el-table th.el-table__cell) {
  background: #f8fafc;
  color: #475467;
}

:deep(.el-table .el-table__cell) {
  padding: 13px 0;
}
</style>
