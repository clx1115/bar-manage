<template>
  <div class="page-container layout-padding">
    <el-card shadow="hover" class="layout-padding-auto">
      <el-form class="query" :inline="true">
        <el-form-item label="会员ID">
          <el-input v-model="memberId" placeholder="输入会员ID后可查状态或操作" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="checkStatus" :loading="statusLoading">
            查询封禁状态
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="loadBannedList" :loading="bannedLoading">查询封禁列表</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="loadRecordList" :loading="recordLoading">查询操作记录</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" @click="openActionDialog('ban')">封禁用户</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="warning" @click="openActionDialog('unban')">解封用户</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="resetAll">
            <el-icon><ele-Refresh /></el-icon>
            重置
          </el-button>
        </el-form-item>
      </el-form>

      <el-descriptions border :column="3" class="mb20" v-loading="statusLoading">
        <el-descriptions-item label="查询会员ID">
          {{ statusInfo?.memberId || memberId || '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="封禁状态">
          <el-tag :type="statusInfo?.isBanned ? 'danger' : 'success'">
            {{ statusInfo?.isBanned ? '已封禁' : '未封禁' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="到期时间">
          {{ statusInfo?.banExpireTime ? formatDate(statusInfo.banExpireTime, 'YYYY-mm-dd HH:MM:SS') : '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="封禁原因" :span="3">
          {{ statusInfo?.reason || '-' }}
        </el-descriptions-item>
      </el-descriptions>

      <div class="section-title">当前被封禁用户</div>
      <el-table :data="bannedList" v-loading="bannedLoading" style="width: 100%">
        <el-table-column prop="id" label="风险ID" width="100" />
        <el-table-column prop="memberId" label="会员ID" width="110" />
        <el-table-column prop="nickName" label="昵称" min-width="140" show-overflow-tooltip />
        <el-table-column prop="phoneNumber" label="手机号" width="140" />
        <el-table-column label="头像" width="80">
          <template #default="{ row }">
            <img v-if="row.avatar" :src="row.avatar" class="avatar" />
          </template>
        </el-table-column>
        <el-table-column label="封禁到期时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.banExpireTime, 'YYYY-mm-dd HH:MM:SS') }}
          </template>
        </el-table-column>
        <el-table-column prop="banReason" label="封禁原因" min-width="180" show-overflow-tooltip />
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button text type="primary" size="small" @click="checkStatus(row.memberId)">
              查状态
            </el-button>
            <el-button text type="primary" size="small" @click="focusRecords(row.memberId)">
              查记录
            </el-button>
            <el-button text type="danger" size="small" @click="openActionDialog('unban', row)">
              解封
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="page-bottom">
        <el-pagination
          v-model:currentPage="bannedPage"
          background
          layout="prev, pager, next, jumper"
          :page-count="bannedTotalPage"
          @current-change="loadBannedList"
        />
      </div>

      <div class="section-title">封禁操作记录</div>
      <el-table :data="recordList" v-loading="recordLoading" style="width: 100%">
        <el-table-column prop="id" label="记录ID" width="100" />
        <el-table-column prop="memberId" label="会员ID" width="110" />
        <el-table-column label="操作类型" width="120">
          <template #default="{ row }">
            <el-tag :type="actionTagType(row.action)">
              {{ actionText(row.action) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="reason" label="原因" min-width="180" show-overflow-tooltip />
        <el-table-column prop="operatorId" label="操作人ID" width="120" />
        <el-table-column label="修改时长" width="140">
          <template #default="{ row }">
            {{ formatDuration(row.banDuration) }}
          </template>
        </el-table-column>
        <el-table-column label="操作时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.createTime, 'YYYY-mm-dd HH:MM:SS') }}
          </template>
        </el-table-column>
      </el-table>
      <div class="page-bottom">
        <el-pagination
          v-model:currentPage="recordPage"
          background
          layout="prev, pager, next, jumper"
          :page-count="recordTotalPage"
          @current-change="loadRecordList"
        />
      </div>
    </el-card>

    <el-dialog
      v-model="dialog.visible"
      :title="dialog.mode === 'ban' ? '封禁用户' : '解封用户'"
      width="520px"
      :close-on-click-modal="false"
    >
      <el-form label-width="100px">
        <el-form-item label="会员ID" required>
          <el-input v-model="dialog.form.memberId" placeholder="请输入会员ID" />
        </el-form-item>
        <el-form-item label="原因" required>
          <el-input
            v-model="dialog.form.reason"
            type="textarea"
            :rows="3"
            placeholder="请输入原因"
          />
        </el-form-item>
        <el-form-item v-if="dialog.mode === 'ban'" label="到期时间" required>
          <el-date-picker
            v-model="dialog.form.banExpireTime"
            type="datetime"
            placeholder="请选择封禁到期时间"
            value-format="x"
            class="w100"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialog.visible = false">取消</el-button>
        <el-button type="primary" @click="submitAction" :loading="dialog.loading">
          确认
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, toRefs } from 'vue'
import { ElMessage } from 'element-plus'
import { formatDate } from '@/utils/formatTime'
import {
  banFreebieUser,
  checkFreebieUserBan,
  getBannedFreebieUsers,
  getFreebieUserBanRecords,
  unbanFreebieUser,
} from '@/api/freebie/index'

const state = reactive({
  memberId: '',
  statusLoading: false,
  statusInfo: null as any,
  bannedLoading: false,
  bannedList: [] as any[],
  bannedPage: 1,
  bannedTotalPage: 1,
  recordLoading: false,
  recordList: [] as any[],
  recordPage: 1,
  recordTotalPage: 1,
  dialog: {
    visible: false,
    mode: 'ban' as 'ban' | 'unban',
    loading: false,
    form: {
      memberId: '',
      reason: '',
      banExpireTime: '',
    },
  },
})

const {
  memberId,
  statusLoading,
  statusInfo,
  bannedLoading,
  bannedList,
  bannedPage,
  bannedTotalPage,
  recordLoading,
  recordList,
  recordPage,
  recordTotalPage,
  dialog,
} = toRefs(state)

const currentMemberId = computed(() => Number(state.memberId) || 0)

const actionText = (action: number) => {
  if (action === 1) return '封禁'
  if (action === 2) return '解封'
  if (action === 3) return '修改时长'
  return '未知'
}

const actionTagType = (action: number) => {
  if (action === 1) return 'danger'
  if (action === 2) return 'success'
  return 'warning'
}

const formatDuration = (duration: number) => {
  if (!duration) return '-'
  const totalHours = Math.floor(duration / (60 * 60 * 1000))
  const days = Math.floor(totalHours / 24)
  const hours = totalHours % 24
  if (days > 0) return `${days}天${hours}小时`
  if (totalHours > 0) return `${totalHours}小时`
  return `${Math.floor(duration / 60000)}分钟`
}

const checkStatus = async (targetMemberId?: number | Event) => {
  const memberValue = typeof targetMemberId === 'number' ? targetMemberId : currentMemberId.value
  if (!memberValue) {
    ElMessage.warning('请输入会员ID')
    return
  }
  state.statusLoading = true
  try {
    const data = await checkFreebieUserBan({
      memberId: memberValue,
    })
    state.statusInfo = {
      memberId: memberValue,
      isBanned: typeof data.banned === 'boolean' ? data.banned : !!data.isBanned,
      banExpireTime: data.banExpireTime,
      reason: data.reason,
    }
    state.memberId = String(memberValue)
  } finally {
    state.statusLoading = false
  }
}

const loadBannedList = async () => {
  state.bannedLoading = true
  try {
    const data = await getBannedFreebieUsers({
      page: state.bannedPage,
      size: 20,
      memberId: currentMemberId.value,
    })
    state.bannedList = data.list || []
    state.bannedTotalPage = data.pages || 1
  } finally {
    state.bannedLoading = false
  }
}

const loadRecordList = async () => {
  state.recordLoading = true
  try {
    const data = await getFreebieUserBanRecords({
      page: state.recordPage,
      size: 20,
      memberId: currentMemberId.value,
    })
    state.recordList = data.list || []
    state.recordTotalPage = data.pages || 1
  } finally {
    state.recordLoading = false
  }
}

const focusRecords = async (targetMemberId: number) => {
  state.memberId = String(targetMemberId)
  state.recordPage = 1
  await loadRecordList()
}

const openActionDialog = (mode: 'ban' | 'unban', row?: any) => {
  const targetMemberId = row?.memberId || state.memberId
  state.dialog = {
    visible: true,
    mode,
    loading: false,
    form: {
      memberId: targetMemberId ? String(targetMemberId) : '',
      reason: '',
      banExpireTime: '',
    },
  }
}

const submitAction = async () => {
  const targetMemberId = Number(state.dialog.form.memberId)
  if (!targetMemberId) {
    ElMessage.warning('请输入正确的会员ID')
    return
  }
  if (!state.dialog.form.reason.trim()) {
    ElMessage.warning('请输入操作原因')
    return
  }
  if (state.dialog.mode === 'ban' && !state.dialog.form.banExpireTime) {
    ElMessage.warning('请选择封禁到期时间')
    return
  }
  state.dialog.loading = true
  try {
    if (state.dialog.mode === 'ban') {
      await banFreebieUser({
        memberId: targetMemberId,
        reason: state.dialog.form.reason,
        banExpireTime: Number(state.dialog.form.banExpireTime),
      })
      ElMessage.success('封禁成功')
    } else {
      await unbanFreebieUser({
        memberId: targetMemberId,
        reason: state.dialog.form.reason,
      })
      ElMessage.success('解封成功')
    }
    state.dialog.visible = false
    state.memberId = String(targetMemberId)
    await Promise.all([checkStatus(targetMemberId), loadBannedList(), loadRecordList()])
  } finally {
    state.dialog.loading = false
  }
}

const resetAll = () => {
  state.memberId = ''
  state.statusInfo = null
  state.bannedPage = 1
  state.recordPage = 1
  loadBannedList()
  loadRecordList()
}

onMounted(() => {
  loadBannedList()
  loadRecordList()
})
</script>

<style scoped lang="scss">
.section-title {
  margin: 24px 0 12px;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
}

.w100 {
  width: 100%;
}
</style>
