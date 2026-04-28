<template>
  <div class="page-container layout-padding">
    <el-card shadow="hover" class="layout-padding-auto">
      <div class="page-intro">
        <div>
          <div class="page-intro__title">管理人员</div>
          <div class="page-intro__desc">
            统一查看门店成员账号信息、最近登录情况和账号状态，支持详情编辑、锁定解锁与删除操作。
          </div>
        </div>
        <div class="page-intro__stat">
          <div class="page-intro__stat-label">当前成员数</div>
          <div class="page-intro__stat-value">{{ list.length }}</div>
        </div>
      </div>

      <div class="toolbar-panel">
        <div class="toolbar-panel__meta">
          <div class="toolbar-panel__label">成员维护</div>
          <div class="toolbar-panel__desc">支持快速刷新列表、查看状态并进入成员详情。</div>
        </div>
        <el-form class="query" :inline="true">
          <el-form-item>
            <el-button type="primary" @click="getListData">
              <el-icon><ele-Refresh /></el-icon>
              刷新列表
            </el-button>
          </el-form-item>
        </el-form>
      </div>

      <el-table :data="list" v-loading="loading" class="member-table">
        <el-table-column prop="id" label="ID" width="90" />
        <el-table-column label="头像" width="92" align="center">
          <template #default="{ row }">
            <el-avatar :size="46" :src="getAvatar(row.avatar)" class="member-avatar">
              {{ (row.realName || row.userName || '?').slice(0, 1) }}
            </el-avatar>
          </template>
        </el-table-column>
        <el-table-column prop="userName" label="用户名" min-width="150" show-overflow-tooltip />
        <el-table-column prop="realName" label="姓名" min-width="120" show-overflow-tooltip />
        <el-table-column prop="phoneNumber" label="手机号" width="150" />
        <el-table-column label="管理员" width="100">
          <template #default="{ row }">
            <el-tag :type="row.isAdmin ? 'success' : 'info'" effect="light">
              {{ row.isAdmin ? '是' : '否' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="shopName" label="归属店铺" min-width="150" show-overflow-tooltip />
        <el-table-column prop="orgName" label="机构名称" min-width="150" show-overflow-tooltip />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'" effect="light">
              {{ row.status === 1 ? '正常' : '锁定' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="lastLoginTime" label="最后登录时间" min-width="180" show-overflow-tooltip />
        <el-table-column prop="lastLoginIP" label="最后登录 IP" min-width="150" show-overflow-tooltip />
        <el-table-column label="操作" width="228" fixed="right">
          <template #default="{ row }">
            <div class="action-links">
              <el-button text type="primary" @click="openDetail('view', row)">详情</el-button>
              <el-button text type="primary" @click="openDetail('edit', row)">编辑</el-button>
              <el-button
                text
                :type="row.status === 1 ? 'warning' : 'success'"
                @click="toggleStatus(row)"
              >
                {{ row.status === 1 ? '锁定' : '解锁' }}
              </el-button>
              <el-button text type="danger" @click="removeRow(row)">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <ShopAdminDetail ref="detailRef" @refresh="getListData" />
  </div>
</template>

<script setup lang="ts" name="memberShopAdmin">
import { defineAsyncComponent, onMounted, reactive, ref, toRefs } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { deleteShopAdmin, getShopAdminList, updateShopAdminStatus } from '@/api/member/shopAdmin'
import defaultAvatar from '@/assets/avatar.png'

const ShopAdminDetail = defineAsyncComponent(() => import('./component/detail.vue'))

const detailRef = ref()
const state = reactive({
  list: [] as any[],
  loading: false,
})

const { list, loading } = toRefs(state)

const getAvatar = (avatar?: string) => {
  if (!avatar || typeof avatar !== 'string') return defaultAvatar
  if (avatar.startsWith('http') || avatar.startsWith('/') || avatar.startsWith('data:image')) return avatar
  return defaultAvatar
}

const getListData = async () => {
  state.loading = true
  try {
    const data = await getShopAdminList()
    state.list = data.list || []
  } finally {
    state.loading = false
  }
}

const openDetail = (type: 'view' | 'edit', row: any) => {
  detailRef.value.openDialog(type, row)
}

const toggleStatus = (row: any) => {
  const nextStatus = row.status === 1 ? 2 : 1
  const actionText = nextStatus === 2 ? '锁定' : '解锁'
  ElMessageBox.confirm(`确认${actionText}成员“${row.realName || row.userName}”吗？`, '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      await updateShopAdminStatus({
        memberId: row.id,
        status: nextStatus,
      })
      ElMessage.success(`${actionText}成功`)
      getListData()
    })
    .catch(() => {})
}

const removeRow = (row: any) => {
  ElMessageBox.confirm(`此操作将永久删除成员“${row.realName || row.userName}”，是否继续？`, '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      await deleteShopAdmin({ id: row.id })
      ElMessage.success('删除成功')
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
  align-items: stretch;
  justify-content: space-between;
  gap: 16px;
  padding: 22px 24px;
  margin-bottom: 20px;
  border: 1px solid #dde7f2;
  border-radius: 18px;
  background:
    radial-gradient(circle at top right, rgba(34, 197, 94, 0.08), transparent 22%),
    linear-gradient(135deg, #f7fbff 0%, #f8fcf7 100%);
}

.page-intro__title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2d3d;
}

.page-intro__desc {
  max-width: 760px;
  margin-top: 6px;
  font-size: 13px;
  line-height: 1.6;
  color: #667085;
}

.page-intro__stat {
  min-width: 128px;
  padding: 16px 18px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.92);
  box-shadow:
    inset 0 0 0 1px #edf2f7,
    0 10px 24px rgba(15, 23, 42, 0.05);
  text-align: right;
}

.page-intro__stat-label {
  font-size: 12px;
  color: #667085;
}

.page-intro__stat-value {
  margin-top: 6px;
  font-size: 24px;
  font-weight: 700;
  line-height: 1;
  color: #1570ef;
}

.toolbar-panel {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 16px;
  margin-bottom: 16px;
  border: 1px solid #edf2f7;
  border-radius: 14px;
  background: #fbfdff;
}

.toolbar-panel__label {
  font-size: 14px;
  font-weight: 600;
  color: #344054;
}

.toolbar-panel__desc {
  margin-top: 4px;
  font-size: 12px;
  color: #667085;
}

.query {
  flex-shrink: 0;
}

.query :deep(.el-form-item) {
  margin-right: 0;
  margin-bottom: 0;
}

:deep(.el-card__body) {
  padding: 24px;
}

:deep(.el-table) {
  overflow: hidden;
  border: 1px solid #edf2f7;
  border-radius: 14px;
  background: #fff;
}

:deep(.el-table th.el-table__cell) {
  background: #f8fafc;
  color: #475467;
}

:deep(.el-table .el-table__cell) {
  padding: 15px 0;
}

:deep(.el-table__row:hover > td.el-table__cell) {
  background: #fcfdff;
}

.member-avatar {
  box-shadow: 0 6px 16px rgba(15, 23, 42, 0.08);
}

.action-links {
  display: flex;
  align-items: center;
  gap: 2px;
}

@media (max-width: 768px) {
  .page-intro {
    flex-direction: column;
  }

  .page-intro__stat {
    text-align: left;
  }

  .toolbar-panel {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
