<template>
  <div class="page-container layout-padding">
    <el-card shadow="hover" class="layout-padding-auto">
      <div class="page-intro">
        <div>
          <div class="page-intro__title">团长管理</div>
          <div class="page-intro__desc">查看团长状态、成员规模和收益情况，支持批量配置佣金比例及封禁解封操作。</div>
        </div>
      </div>

      <el-form class="query" :inline="true">
        <el-form-item label="关键词">
          <el-input v-model="queryData.keyword" placeholder="搜索手机号或姓名" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="loading" @click="getListData">
            <el-icon><ele-Search /></el-icon>
            查询
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="resetQuery">
            <el-icon><ele-Refresh /></el-icon>
            重置
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="openCommissionDialog('selected')">批量设置佣金</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="warning" @click="openCommissionDialog('all')">统一设置全店佣金</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="list" v-loading="loading" style="width: 100%" @selection-change="onSelectionChange">
        <el-table-column type="selection" width="50" />
        <el-table-column prop="id" label="团长ID" width="100" />
        <el-table-column prop="userId" label="用户ID" width="100" />
        <el-table-column prop="realName" label="姓名" width="120" />
        <el-table-column prop="phone" label="手机号" width="140" />
        <el-table-column prop="invitationCode" label="邀请码" width="120" />
        <el-table-column prop="totalMembers" label="团员人数" width="100" />
        <el-table-column prop="totalOrders" label="订单总数" width="100" />
        <el-table-column prop="availableBalance" label="可用余额" width="120" />
        <el-table-column prop="totalGmv" label="总GMV" width="120" />
        <el-table-column label="佣金比例" width="120">
          <template #default="{ row }">
            {{ formatCommissionRate(row) }}
          </template>
        </el-table-column>
        <el-table-column label="状态" width="140">
          <template #default="{ row }">
            <el-tag :type="statusTagType(row.status)">
              {{ row.statusDesc || statusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="{ row }">
            <el-button text type="primary" size="small" @click="openCommissionDialog('selected', row)">设置佣金</el-button>
            <el-button
              v-if="canToggleBan(row.status)"
              text
              :type="row.status === 3 ? 'warning' : 'danger'"
              size="small"
              @click="toggleBan(row)"
            >
              {{ row.status === 3 ? '解封' : '封禁' }}
            </el-button>
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

    <el-dialog
      v-model="dialog.visible"
      :title="dialog.mode === 'all' ? '统一配置全店佣金' : '设置选中团长佣金'"
      width="480px"
      :close-on-click-modal="false"
    >
      <el-form label-width="110px">
        <el-form-item v-if="dialog.mode === 'selected'" label="团长数量">
          <span>{{ dialog.ids.length }} 人</span>
        </el-form-item>
        <el-form-item label="佣金比例(%)">
          <el-input-number
            v-model="dialog.commissionRate"
            :min="0"
            :max="30"
            :precision="2"
            :step="0.1"
            class="w100"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialog.visible = false">取消</el-button>
        <el-button type="primary" :loading="dialog.loading" @click="submitCommission">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, toRefs } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  changeCaptainBanStatus,
  getCaptainList,
  setCaptainCommissionAll,
  setCaptainCommissionSelected,
} from '@/api/captain/index'

const defaultQuery = {
  keyword: '',
}

const state = reactive({
  list: [] as any[],
  loading: false,
  currentPage: 1,
  pageSize: 20,
  total: 0,
  queryData: { ...defaultQuery },
  submitData: {},
  selectedIds: [] as number[],
  dialog: {
    visible: false,
    mode: 'selected' as 'selected' | 'all',
    ids: [] as number[],
    commissionRate: 0,
    loading: false,
  },
})

const { list, loading, currentPage, pageSize, total, queryData, dialog } = toRefs(state)

const statusText = (status: number) => {
  if (status === 0) return '待审核'
  if (status === 1) return '审核成功'
  if (status === 2) return '审核失败'
  if (status === 3) return '已撤职/失效'
  return '未知'
}

const statusTagType = (status: number) => {
  if (status === 1) return 'success'
  if (status === 0) return 'warning'
  if (status === 2) return 'danger'
  return 'info'
}

const canToggleBan = (status: number) => status === 1 || status === 3

const formatCommissionRate = (row: any) => {
  const rawValue = row.commissionRate ?? row.commission_ratio ?? row.ratio ?? row.commission
  if (rawValue === undefined || rawValue === null || rawValue === '') return '-'

  const value = Number(rawValue)
  if (Number.isNaN(value)) return rawValue
  if (value <= 1) return `${(value * 100).toFixed(2).replace(/\.00$/, '').replace(/(\.\d)0$/, '$1')}%`
  return `${value.toFixed(2).replace(/\.00$/, '').replace(/(\.\d)0$/, '$1')}%`
}

const extractCommissionRate = (row?: any) => {
  if (!row) return 0
  const rawValue = row.commissionRate ?? row.commission_ratio ?? row.ratio ?? row.commission
  if (rawValue === undefined || rawValue === null || rawValue === '') return 0
  const value = Number(rawValue)
  if (Number.isNaN(value)) return 0
  return value <= 1 ? Number((value * 100).toFixed(2)) : value
}

const getListData = async () => {
  state.loading = true
  try {
    if (JSON.stringify(state.queryData) !== JSON.stringify(state.submitData)) {
      state.currentPage = 1
    }
    const data = await getCaptainList({
      page: state.currentPage,
      size: state.pageSize,
      keyword: state.queryData.keyword,
    })
    state.list = data.list || []
    state.total = data.total || (data.pages || 0) * state.pageSize
    if (!state.total && state.currentPage === 1 && state.list.length < state.pageSize) {
      state.total = state.list.length
    }
    state.submitData = JSON.parse(JSON.stringify(state.queryData))
  } finally {
    state.loading = false
  }
}

const onSizeChange = () => {
  state.currentPage = 1
  getListData()
}

const resetQuery = () => {
  state.queryData = { ...defaultQuery }
  getListData()
}

const onSelectionChange = (rows: any[]) => {
  state.selectedIds = rows.map((item) => item.id)
}

const openCommissionDialog = (mode: 'selected' | 'all', row?: any) => {
  const ids = row ? [row.id] : state.selectedIds
  if (mode === 'selected' && ids.length === 0) {
    ElMessage.warning('请先选择团长')
    return
  }
  state.dialog = {
    visible: true,
    mode,
    ids,
    commissionRate: extractCommissionRate(row),
    loading: false,
  }
}

const submitCommission = async () => {
  state.dialog.loading = true
  try {
    if (state.dialog.mode === 'all') {
      await setCaptainCommissionAll({
        commissionRate: state.dialog.commissionRate,
      })
    } else {
      await setCaptainCommissionSelected({
        ids: state.dialog.ids,
        commissionRate: state.dialog.commissionRate,
      })
    }
    ElMessage.success('佣金比例已更新')
    state.dialog.visible = false
    await getListData()
  } finally {
    state.dialog.loading = false
  }
}

const toggleBan = async (row: any) => {
  const action = row.status === 3 ? 2 : 1
  await ElMessageBox.confirm(
    `${action === 1 ? '确认封禁' : '确认解封'}团长“${row.realName || row.phone || row.id}”吗？`,
    '提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
  await changeCaptainBanStatus({
    id: row.id,
    action,
  })
  ElMessage.success(action === 1 ? '封禁成功' : '解封成功')
  getListData()
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
  background: linear-gradient(135deg, #f8fbff 0%, #fff8f1 100%);
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

.query :deep(.el-form-item) {
  margin-right: 12px;
  margin-bottom: 12px;
}

.page-bottom {
  display: flex;
  justify-content: flex-end;
  margin-top: 18px;
}

.w100 {
  width: 100%;
}
</style>
