<template>
  <div class="page-container layout-padding">
    <el-card shadow="hover" class="layout-padding-auto">
      <div class="page-intro">
        <div>
          <div class="page-intro__title">车辆认证</div>
          <div class="page-intro__desc">审核门店用户提交的车辆资料，快速查看证件、拒绝原因和最新认证状态。</div>
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
        <el-table-column prop="userId" label="用户ID" width="100" />
        <el-table-column prop="carBrand" label="车辆品牌" min-width="120" show-overflow-tooltip />
        <el-table-column prop="carModel" label="车辆型号" min-width="120" show-overflow-tooltip />
        <el-table-column prop="plateNumber" label="车牌号" width="120" />
        <el-table-column prop="ownerName" label="车主姓名" width="120" />
        <el-table-column label="认证状态" width="100">
          <template #default="{ row }">
            <el-tag :type="statusTagType(row.status)">{{ statusText(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="rejectReason" label="拒绝原因" min-width="160" show-overflow-tooltip />
        <el-table-column label="更新时间" min-width="180">
          <template #default="{ row }">{{ formatTime(row.updateTime) }}</template>
        </el-table-column>
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="{ row }">
            <el-button text type="primary" @click="openDetail(row.id)">详情</el-button>
            <el-button text type="success" :disabled="row.status !== 0" @click="openAudit(row.id, 1)">通过</el-button>
            <el-button text type="danger" :disabled="row.status !== 0" @click="openAudit(row.id, 2)">拒绝</el-button>
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

    <el-dialog title="车辆认证详情" v-model="detailVisible" width="760px">
      <el-descriptions :column="2" border v-if="detailData.id">
        <el-descriptions-item label="ID">{{ detailData.id }}</el-descriptions-item>
        <el-descriptions-item label="用户ID">{{ detailData.userId }}</el-descriptions-item>
        <el-descriptions-item label="车辆品牌">{{ detailData.carBrand }}</el-descriptions-item>
        <el-descriptions-item label="车辆型号">{{ detailData.carModel }}</el-descriptions-item>
        <el-descriptions-item label="车牌号">{{ detailData.plateNumber }}</el-descriptions-item>
        <el-descriptions-item label="车主姓名">{{ detailData.ownerName }}</el-descriptions-item>
        <el-descriptions-item label="认证状态">{{ statusText(detailData.status) }}</el-descriptions-item>
        <el-descriptions-item label="认证时间">{{ formatTime(detailData.auditTime) }}</el-descriptions-item>
        <el-descriptions-item label="备注" :span="2">{{ detailData.remark || '-' }}</el-descriptions-item>
        <el-descriptions-item label="拒绝原因" :span="2">{{ detailData.rejectReason || '-' }}</el-descriptions-item>
        <el-descriptions-item label="证件图片" :span="2">
          <img v-if="detailData.certificateImage" :src="detailData.certificateImage" class="certificate-preview" />
          <span v-else>-</span>
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>

    <el-dialog :title="auditForm.status === 1 ? '通过认证' : '拒绝认证'" v-model="auditVisible" width="520px">
      <el-form label-width="100px">
        <el-form-item label="拒绝原因" v-if="auditForm.status === 2">
          <el-input v-model="auditForm.rejectReason" type="textarea" :rows="4" placeholder="请输入拒绝原因" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="auditVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="submitAudit">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, toRefs } from 'vue'
import dayjs from 'dayjs'
import { ElMessage } from 'element-plus'
import { authenticateCar, getCarDetail, getCarList } from '@/api/member/car/index'

const state = reactive({
  list: [] as any[],
  loading: false,
  currentPage: 1,
  pageSize: 10,
  total: 0,
  detailVisible: false,
  detailData: {} as any,
  auditVisible: false,
  submitLoading: false,
  auditForm: {
    id: undefined as number | undefined,
    status: 1,
    rejectReason: '',
  },
})

const { list, loading, currentPage, pageSize, total, detailVisible, detailData, auditVisible, submitLoading, auditForm } = toRefs(state)

const statusText = (value: number) => ({ 0: '待审核', 1: '已通过', 2: '已拒绝', 3: '已撤销' }[value] || '-')
const statusTagType = (value: number) => ({ 0: 'warning', 1: 'success', 2: 'danger', 3: 'info' }[value] || 'info')
const formatTime = (time?: number) => time ? dayjs(time).format('YYYY-MM-DD HH:mm:ss') : '-'

const getListData = async () => {
  state.loading = true
  try {
    const data = await getCarList({ page: state.currentPage, size: state.pageSize })
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
  const data = await getCarDetail(id)
  state.detailData = data
  state.detailVisible = true
}

const openAudit = (id: number, status: number) => {
  state.auditForm = {
    id,
    status,
    rejectReason: '',
  }
  state.auditVisible = true
}

const submitAudit = async () => {
  state.submitLoading = true
  try {
    await authenticateCar(state.auditForm)
    ElMessage.success('操作成功')
    state.auditVisible = false
    getListData()
  } finally {
    state.submitLoading = false
  }
}

onMounted(() => {
  getListData()
})
</script>

<style scoped lang="scss">
.certificate-preview {
  width: 220px;
  max-width: 100%;
  border: 1px solid #e7ecf3;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);
}

.page-intro {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 18px;
  margin-bottom: 18px;
  border: 1px solid #e7eef7;
  border-radius: 16px;
  background: linear-gradient(135deg, #f7fbff 0%, #f9fdf5 100%);
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
