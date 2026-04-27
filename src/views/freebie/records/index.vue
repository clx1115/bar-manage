<template>
  <div class="page-container layout-padding">
    <el-card shadow="hover" class="layout-padding-auto">
      <el-form class="query" :inline="true">
        <el-form-item label="会员ID">
          <el-input v-model="queryData.memberId" placeholder="0或留空表示全部" clearable />
        </el-form-item>
        <el-form-item label="领取类型">
          <el-select v-model="queryData.type" placeholder="全部" clearable style="width: 160px">
            <el-option label="免费领取" :value="0" />
            <el-option label="积分兑换" :value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="时间范围">
          <el-date-picker
            v-model="timeRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            format="YYYY-MM-DD"
            value-format="x"
          />
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
        <el-table-column prop="id" label="记录ID" width="100" />
        <el-table-column prop="memberId" label="会员ID" width="110" />
        <el-table-column label="头像" width="80">
          <template #default="{ row }">
            <img v-if="row.avatar" :src="row.avatar" class="avatar" />
          </template>
        </el-table-column>
        <el-table-column prop="nickName" label="昵称" min-width="140" show-overflow-tooltip />
        <el-table-column prop="phoneNumber" label="手机号" width="140" />
        <el-table-column label="领取类型" width="120">
          <template #default="{ row }">
            <el-tag :type="row.type === 0 ? 'success' : 'warning'">
              {{ row.type === 0 ? '免费领取' : '积分兑换' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="freebieCount" label="啤酒数量" width="100" />
        <el-table-column prop="pointsSpent" label="消耗积分" width="120" />
        <el-table-column label="是否在线" width="100">
          <template #default="{ row }">
            <el-tag :type="row.seated ? 'success' : 'info'">
              {{ row.seated ? '在线' : '离线' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="领取时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.createTime, 'YYYY-mm-dd HH:MM:SS') }}
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
import { onMounted, reactive, ref, toRefs, watch } from 'vue'
import { formatDate } from '@/utils/formatTime'
import { getFreebieRecordList } from '@/api/freebie/index'

const defaultQuery = {
  memberId: '',
  type: '' as '' | number,
  startTime: 0,
  endTime: 0,
}

const timeRange = ref([] as any[])
const state = reactive({
  list: [] as any[],
  loading: false,
  currentPage: 1,
  totalPage: 1,
  queryData: { ...defaultQuery },
  submitData: {},
})

const { list, loading, currentPage, totalPage, queryData } = toRefs(state)

watch(timeRange, (value: any) => {
  if (value?.[0] && value?.[1]) {
    state.queryData.startTime = Number(value[0])
    state.queryData.endTime = Number(value[1]) + 24 * 60 * 60 * 1000 - 1
  } else {
    state.queryData.startTime = 0
    state.queryData.endTime = 0
  }
})

const getListData = async () => {
  state.loading = true
  try {
    if (JSON.stringify(state.queryData) !== JSON.stringify(state.submitData)) {
      state.currentPage = 1
    }
    const payload: any = {
      page: state.currentPage,
      size: 20,
      memberId: Number(state.queryData.memberId) || 0,
    }
    if (state.queryData.type !== '') {
      payload.type = state.queryData.type
    }
    if (state.queryData.startTime) {
      payload.startTime = state.queryData.startTime
    }
    if (state.queryData.endTime) {
      payload.endTime = state.queryData.endTime
    }
    const data = await getFreebieRecordList(payload)
    state.list = data.list || []
    state.totalPage = data.pages || 1
    state.submitData = JSON.parse(JSON.stringify(state.queryData))
  } finally {
    state.loading = false
  }
}

const resetQuery = () => {
  state.queryData = { ...defaultQuery }
  timeRange.value = []
  getListData()
}

onMounted(() => {
  getListData()
})
</script>

<style scoped lang="scss">
.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
}
</style>
