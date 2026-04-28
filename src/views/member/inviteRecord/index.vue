<template>
  <div class="page-container layout-padding">
    <el-card shadow="hover" class="layout-padding-auto">
      <div class="page-intro">
        <div>
          <div class="page-intro__title">邀约记录</div>
          <div class="page-intro__desc">按邀请人、被邀请人和奖励状态查看当前门店全部邀约链路与奖励结果。</div>
        </div>
      </div>
      <el-form class="query" :inline="true">
        <el-form-item label="邀请人ID">
          <el-input v-model="queryData.inviterUserId" placeholder="请输入邀请人ID" clearable />
        </el-form-item>
        <el-form-item label="被邀请人ID">
          <el-input v-model="queryData.inviteeUserId" placeholder="请输入被邀请人ID" clearable />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryData.status" placeholder="全部" clearable style="width: 160px">
            <el-option label="待奖励" :value="10" />
            <el-option label="已奖励" :value="20" />
            <el-option label="已过期" :value="-10" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getListData">
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
      </el-form>

      <el-table :data="list" v-loading="loading">
        <el-table-column prop="id" label="记录ID" width="90" />
        <el-table-column prop="inviterUserId" label="邀请人ID" width="100" />
        <el-table-column prop="inviterNickName" label="邀请人昵称" min-width="120" show-overflow-tooltip />
        <el-table-column prop="inviterPhoneNumber" label="邀请人手机号" width="130" />
        <el-table-column prop="inviteeUserId" label="被邀请人ID" width="110" />
        <el-table-column prop="inviteeNickName" label="被邀请人昵称" min-width="120" show-overflow-tooltip />
        <el-table-column prop="inviteePhoneNumber" label="被邀请人手机号" width="130" />
        <el-table-column prop="inviteTimeText" label="邀约时间" min-width="160" />
        <el-table-column prop="expireTimeText" label="过期时间" min-width="160" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="statusTagType(row.status)">{{ statusText(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="rewardTimeText" label="奖励时间" min-width="160" />
        <el-table-column prop="rewardOrderId" label="奖励订单ID" min-width="120" />
        <el-table-column prop="inviteDays" label="邀约天数" width="100" />
      </el-table>

      <div class="page-bottom">
        <el-pagination
          v-model:currentPage="currentPage"
          background
          layout="prev, pager, next, jumper"
          :page-count="totalPage"
          @current-change="getListData"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, toRefs } from 'vue'
import { getMemberInviteRecordList } from '@/api/member/inviteRecord/index'

const defaultQuery = {
  inviterUserId: '',
  inviteeUserId: '',
  status: '' as '' | number,
}

const state = reactive({
  list: [] as any[],
  loading: false,
  currentPage: 1,
  totalPage: 1,
  queryData: { ...defaultQuery },
  submitData: {} as any,
})

const { list, loading, currentPage, totalPage, queryData } = toRefs(state)

const statusText = (value: number) => ({ 10: '待奖励', 20: '已奖励', [-10]: '已过期' }[value] || '-')
const statusTagType = (value: number) => ({ 10: 'warning', 20: 'success', [-10]: 'info' }[value] || 'info')

const getListData = async () => {
  state.loading = true
  try {
    if (JSON.stringify(state.queryData) !== JSON.stringify(state.submitData)) {
      state.currentPage = 1
    }
    const payload: any = { page: state.currentPage }
    if (state.queryData.inviterUserId) payload.inviterUserId = Number(state.queryData.inviterUserId)
    if (state.queryData.inviteeUserId) payload.inviteeUserId = Number(state.queryData.inviteeUserId)
    if (state.queryData.status !== '') payload.status = state.queryData.status
    const data = await getMemberInviteRecordList(payload)
    state.list = data.list || []
    state.totalPage = data.pages || 1
    state.submitData = JSON.parse(JSON.stringify(state.queryData))
  } finally {
    state.loading = false
  }
}

const resetQuery = () => {
  state.queryData = { ...defaultQuery }
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
</style>
