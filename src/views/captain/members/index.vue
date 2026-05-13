<template>
  <div class="page-container layout-padding">
    <el-card shadow="hover" class="layout-padding-auto">
      <div class="page-intro">
        <div>
          <div class="page-intro__title">团员关系</div>
          <div class="page-intro__desc">查看团长与团员绑定关系，支持按团长、状态和关键词筛选，并可调整绑定状态。</div>
        </div>
      </div>

      <el-form class="query" :inline="true">
        <el-form-item label="团长ID">
          <el-input v-model="queryData.captainId" placeholder="0 或留空表示全部" clearable />
        </el-form-item>
        <el-form-item label="绑定状态">
          <el-select v-model="queryData.status" placeholder="全部" class="w160">
            <el-option label="全部" :value="0" />
            <el-option label="已绑定" :value="1" />
            <el-option label="已解绑" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="关键词">
          <el-input v-model="queryData.keyword" placeholder="搜索团员姓名或电话" clearable />
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
      </el-form>

      <el-table :data="list" v-loading="loading" style="width: 100%">
        <el-table-column prop="id" label="关系ID" width="100" />
        <el-table-column prop="captainId" label="团长ID" width="100" />
        <el-table-column prop="captainName" label="团长姓名" width="120" />
        <el-table-column prop="captainPhone" label="团长手机号" width="140" />
        <el-table-column prop="newUserId" label="团员ID" width="100" />
        <el-table-column prop="newUserName" label="团员姓名" width="120" />
        <el-table-column prop="newUserPhone" label="团员手机号" width="140" />
        <el-table-column label="绑定时间" width="180">
          <template #default="{ row }">
            {{ row.bindTime ? formatDate(row.bindTime, 'YYYY-mm-dd HH:MM:SS') : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="解绑时间" width="180">
          <template #default="{ row }">
            {{ row.unbindTime ? formatDate(row.unbindTime, 'YYYY-mm-dd HH:MM:SS') : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'info'">
              {{ row.status === 1 ? '已绑定' : '已解绑' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{ row }">
            <el-button text type="primary" size="small" @click="toggleStatus(row)">
              {{ row.status === 1 ? '解除绑定' : '恢复绑定' }}
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
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, toRefs } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { formatDate } from '@/utils/formatTime'
import { changeReferralStatus, getCaptainMemberList } from '@/api/captain/index'

const defaultQuery = {
  captainId: '',
  status: 0,
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
})

const { list, loading, currentPage, pageSize, total, queryData } = toRefs(state)

const getListData = async () => {
  state.loading = true
  try {
    if (JSON.stringify(state.queryData) !== JSON.stringify(state.submitData)) {
      state.currentPage = 1
    }
    const data = await getCaptainMemberList({
      page: state.currentPage,
      size: state.pageSize,
      captainId: Number(state.queryData.captainId) || 0,
      status: state.queryData.status,
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

const toggleStatus = async (row: any) => {
  const nextStatus = row.status === 1 ? 2 : 1
  await ElMessageBox.confirm(
    `确认将关系ID ${row.id} ${nextStatus === 2 ? '解除绑定' : '恢复绑定'}吗？`,
    '提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
  await changeReferralStatus({
    id: row.id,
    status: nextStatus,
  })
  ElMessage.success(nextStatus === 2 ? '已解除绑定' : '已恢复绑定')
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
  background: linear-gradient(135deg, #f8fbff 0%, #f7fff8 100%);
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

.w160 {
  width: 160px;
}
</style>
