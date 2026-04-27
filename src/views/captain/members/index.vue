<template>
  <div class="page-container layout-padding">
    <el-card shadow="hover" class="layout-padding-auto">
      <el-form class="query" :inline="true">
        <el-form-item label="团长ID">
          <el-input v-model="queryData.captainId" placeholder="0或留空表示全部" clearable />
        </el-form-item>
        <el-form-item label="绑定状态">
          <el-select v-model="queryData.status" placeholder="全部" style="width: 160px">
            <el-option label="全部" :value="0" />
            <el-option label="已绑定" :value="1" />
            <el-option label="已解绑" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="关键词">
          <el-input v-model="queryData.keyword" placeholder="搜索团员姓名/电话" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getListData" :loading="loading">
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
  totalPage: 1,
  queryData: { ...defaultQuery },
  submitData: {},
})

const { list, loading, currentPage, totalPage, queryData } = toRefs(state)

const getListData = async () => {
  state.loading = true
  try {
    if (JSON.stringify(state.queryData) !== JSON.stringify(state.submitData)) {
      state.currentPage = 1
    }
    const data = await getCaptainMemberList({
      page: state.currentPage,
      size: 20,
      captainId: Number(state.queryData.captainId) || 0,
      status: state.queryData.status,
      keyword: state.queryData.keyword,
    })
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
