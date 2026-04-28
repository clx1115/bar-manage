<template>
  <div class="page-container layout-padding">
    <el-card shadow="hover" class="layout-padding-auto">
      <div class="page-intro">
        <div>
          <div class="page-intro__title">拼桌记录</div>
          <div class="page-intro__desc">查看拼桌邀请流转状态，核对处理结果，并在已接受场景下执行分离操作。</div>
        </div>
      </div>
      <el-form class="query" :inline="true">
        <el-form-item>
          <el-button type="primary" @click="getListData">
            <el-icon><ele-Refresh /></el-icon>
            刷新列表
          </el-button>
        </el-form-item>
      </el-form>

      <el-table :data="list" v-loading="loading">
        <el-table-column prop="id" label="ID" width="90" />
        <el-table-column prop="initiatorUserId" label="邀请方用户" width="110" />
        <el-table-column prop="initiatorTableId" label="邀请方桌位" width="110" />
        <el-table-column prop="inviteeUserId" label="接受方用户" width="110" />
        <el-table-column prop="inviteeTableId" label="接受方桌位" width="110" />
        <el-table-column label="拼桌模式" width="120">
          <template #default="{ row }">{{ mergeModeText(row.mergeMode) }}</template>
        </el-table-column>
        <el-table-column label="状态" width="120">
          <template #default="{ row }">
            <el-tag :type="statusTagType(row.status)">{{ statusText(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="expireTime" label="过期时间" min-width="180">
          <template #default="{ row }">{{ formatTime(row.expireTime) }}</template>
        </el-table-column>
        <el-table-column prop="acceptTime" label="处理时间" min-width="180">
          <template #default="{ row }">{{ formatTime(row.acceptTime) }}</template>
        </el-table-column>
        <el-table-column prop="message" label="邀请信息" min-width="180" show-overflow-tooltip />
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button text type="primary" @click="openDetail(row.id)">详情</el-button>
            <el-button text type="warning" :disabled="row.status !== 20" @click="onSeparate(row.id)">分离</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="page-bottom">
        <el-pagination
          v-model:currentPage="currentPage"
          v-model:page-size="pageSize"
          background
          layout="total, sizes, prev, pager, next, jumper"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          @current-change="getListData"
          @size-change="onSizeChange"
        />
      </div>
    </el-card>

    <el-dialog title="拼桌详情" v-model="detailVisible" width="680px">
      <el-descriptions :column="2" border v-if="detailData.id">
        <el-descriptions-item label="ID">{{ detailData.id }}</el-descriptions-item>
        <el-descriptions-item label="组织ID">{{ detailData.orgId }}</el-descriptions-item>
        <el-descriptions-item label="邀请方用户">{{ detailData.initiatorUserId }}</el-descriptions-item>
        <el-descriptions-item label="邀请方桌位">{{ detailData.initiatorTableId }}</el-descriptions-item>
        <el-descriptions-item label="接受方用户">{{ detailData.inviteeUserId }}</el-descriptions-item>
        <el-descriptions-item label="接受方桌位">{{ detailData.inviteeTableId }}</el-descriptions-item>
        <el-descriptions-item label="拼桌模式">{{ mergeModeText(detailData.mergeMode) }}</el-descriptions-item>
        <el-descriptions-item label="状态">{{ statusText(detailData.status) }}</el-descriptions-item>
        <el-descriptions-item label="过期时间">{{ formatTime(detailData.expireTime) }}</el-descriptions-item>
        <el-descriptions-item label="处理时间">{{ formatTime(detailData.acceptTime) }}</el-descriptions-item>
        <el-descriptions-item label="拒绝原因" :span="2">{{ detailData.rejectReason || '-' }}</el-descriptions-item>
        <el-descriptions-item label="邀请信息" :span="2">{{ detailData.message || '-' }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, toRefs } from 'vue'
import dayjs from 'dayjs'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getTableMergeDetail, getTableMergeList, separateTableMerge } from '@/api/base/tableMerge/index'

const state = reactive({
  list: [] as any[],
  loading: false,
  currentPage: 1,
  pageSize: 10,
  total: 0,
  detailVisible: false,
  detailData: {} as any,
})

const { list, loading, currentPage, pageSize, total, detailVisible, detailData } = toRefs(state)

const mergeModeText = (value: number) => ({ 10: '消费分离', 20: '消费合并' }[value] || '-')
const statusText = (value: number) => ({ 10: '待处理', 20: '已接受', 30: '已拒绝', 40: '已取消', 50: '已过期' }[value] || '-')
const statusTagType = (value: number) => ({ 10: 'warning', 20: 'success', 30: 'danger', 40: 'info', 50: 'info' }[value] || 'info')
const formatTime = (time?: number) => time ? dayjs(time).format('YYYY-MM-DD HH:mm:ss') : '-'

const getListData = async () => {
  state.loading = true
  try {
    const data = await getTableMergeList({ page: state.currentPage, size: state.pageSize })
    state.list = data.list || []
    state.total = (data.pages || 0) * state.pageSize
  } finally {
    state.loading = false
  }
}

const onSizeChange = () => {
  state.currentPage = 1
  getListData()
}

const openDetail = async (id: number) => {
  const data = await getTableMergeDetail(id)
  state.detailData = data
  state.detailVisible = true
}

const onSeparate = (id: number) => {
  ElMessageBox.confirm('确认对该拼桌记录执行分离吗？', '提示', { type: 'warning' })
    .then(async () => {
      const data = await getTableMergeDetail(id)
      await separateTableMerge(id, data)
      ElMessage.success('分离成功')
      getListData()
    })
    .catch(() => {})
}

onMounted(() => {
  getListData()
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
  background: linear-gradient(135deg, #f6fbff 0%, #f8fdf6 100%);
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

.query {
  padding-top: 4px;
}

.query :deep(.el-form-item) {
  margin-right: 12px;
  margin-bottom: 12px;
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

:deep(.el-descriptions) {
  overflow: hidden;
  border-radius: 14px;
}

:deep(.el-dialog__body) {
  padding-top: 12px;
}
</style>
