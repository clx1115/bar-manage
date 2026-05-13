<template>
  <div class="page-container layout-padding">
    <el-card shadow="hover" class="layout-padding-auto">
      <div class="page-intro">
        <div>
          <div class="page-intro__title">团长申请审核</div>
          <div class="page-intro__desc">查看团长申请信息、审核状态和申请原因，支持快速通过或驳回。</div>
        </div>
      </div>

      <el-table :data="list" v-loading="loading" style="width: 100%">
        <el-table-column prop="id" label="申请ID" width="100" />
        <el-table-column prop="userId" label="用户ID" width="100" />
        <el-table-column prop="realName" label="姓名" width="120" />
        <el-table-column prop="phone" label="手机号" width="140" />
        <el-table-column label="状态" width="120">
          <template #default="{ row }">
            <el-tag :type="statusTagType(row.status)">
              {{ row.statusDesc || statusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="申请时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.applyTime, 'YYYY-mm-dd HH:MM:SS') }}
          </template>
        </el-table-column>
        <el-table-column prop="applyReason" label="申请原因" min-width="220" show-overflow-tooltip />
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{ row }">
            <el-button v-if="row.status === 0" size="small" text type="primary" @click="openAuditDialog(row)">
              审核
            </el-button>
            <span v-else>-</span>
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

    <el-dialog v-model="dialog.visible" title="审核团长申请" width="520px" :close-on-click-modal="false">
      <el-form label-width="100px">
        <el-form-item label="审核结果">
          <el-radio-group v-model="dialog.form.status">
            <el-radio :label="1">通过</el-radio>
            <el-radio :label="2">驳回</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="审核备注">
          <el-input v-model="dialog.form.auditRemark" type="textarea" :rows="4" placeholder="请输入审核备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialog.visible = false">取消</el-button>
        <el-button type="primary" :loading="dialog.loading" @click="submitAudit">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, toRefs } from 'vue'
import { ElMessage } from 'element-plus'
import { formatDate } from '@/utils/formatTime'
import { auditCaptain, getCaptainAuditList } from '@/api/captain/index'

const state = reactive({
  list: [] as any[],
  loading: false,
  currentPage: 1,
  pageSize: 20,
  total: 0,
  dialog: {
    visible: false,
    loading: false,
    form: {
      id: 0,
      status: 1,
      auditRemark: '',
    },
  },
})

const { list, loading, currentPage, pageSize, total, dialog } = toRefs(state)

const statusText = (status: number) => {
  if (status === 0) return '待审核'
  if (status === 1) return '审核成功'
  if (status === 2) return '审核失败'
  if (status === 3) return '已撤职/失效'
  return '未知'
}

const statusTagType = (status: number) => {
  if (status === 0) return 'warning'
  if (status === 1) return 'success'
  if (status === 2) return 'danger'
  return 'info'
}

const getListData = async () => {
  state.loading = true
  try {
    const data = await getCaptainAuditList({
      page: state.currentPage,
      size: state.pageSize,
    })
    state.list = data.list || []
    state.total = data.total || (data.pages || 0) * state.pageSize
    if (!state.total && state.currentPage === 1 && state.list.length < state.pageSize) {
      state.total = state.list.length
    }
  } finally {
    state.loading = false
  }
}

const onSizeChange = () => {
  state.currentPage = 1
  getListData()
}

const openAuditDialog = (row: any) => {
  state.dialog = {
    visible: true,
    loading: false,
    form: {
      id: row.id,
      status: 1,
      auditRemark: '',
    },
  }
}

const submitAudit = async () => {
  state.dialog.loading = true
  try {
    await auditCaptain({
      id: state.dialog.form.id,
      status: state.dialog.form.status,
      auditRemark: state.dialog.form.auditRemark,
    })
    ElMessage.success('审核成功')
    state.dialog.visible = false
    await getListData()
  } finally {
    state.dialog.loading = false
  }
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
  background: linear-gradient(135deg, #f8fbff 0%, #fff8ef 100%);
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

.page-bottom {
  display: flex;
  justify-content: flex-end;
  margin-top: 18px;
}
</style>
