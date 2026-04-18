<template>
  <div class="page-container layout-padding">
    <el-card shadow="hover" class="layout-padding-auto">
      <el-form class="query" :inline="true">
        <el-form-item>
          <el-input v-model="queryData.uid" size="default" placeholder="请输入用户UID"> </el-input>
        </el-form-item>
        <el-form-item>
          <el-select size="default" v-model="queryData.itemId" placeholder="请选择余额类型" clearable>
            <el-option label="余额" :value="1" />
            <el-option label="积分" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button size="default" type="primary" @click="getListData">
            <el-icon>
              <ele-Search />
            </el-icon>
            查询
          </el-button>
        </el-form-item>
      </el-form>
      <el-table :data="list" v-loading="loading" style="width: 100%">
        <el-table-column prop="uid" label="用户UID" width="100" />
        <el-table-column prop="memberNo" label="会员卡号" min-width="100" />
        <el-table-column prop="memberName" label="会员名称" min-width="100" />
        <el-table-column prop="orderNo" label="订单编号" min-width="180" show-overflow-tooltip />
        <el-table-column label="变动金额" width="120">
          <template #default="{ row }">
            <span>{{ parseMoney(row.changeAmount) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="余额" width="120">
          <template #default="{ row }">
            <span>{{ parseMoney(row.leftBalance) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="note" label="备注" show-overflow-tooltip min-width="150" />
        <el-table-column prop="staffName" label="员工" width="100" />
        <el-table-column prop="operatorName" label="操作人" width="100" />
        <el-table-column label="时间" show-overflow-tooltip width="200">
          <template #default="{ row }">
            {{ formatDate(row.createTime, 'YYYY-mm-dd HH:MM:SS') }}
          </template>
        </el-table-column>
      </el-table>
      <div class="page-bottom">
        <el-pagination v-model:currentPage="currentPage" background layout="prev, pager, next, jumper" :page-count="totalPage" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted, toRefs } from 'vue'
import { formatDate } from '@/utils/formatTime'
import { parseMoney } from '@/utils/filters'
import { getBalanceLog } from '@/api/finance/index'

// 定义变量
const state = reactive({
  list: [],
  loading: false,
  currentPage: 1,
  totalPage: 1,
  queryData: {
    itemId: '',
    uid: '',
  },
  submitData: {},
})

const { list, loading, currentPage, totalPage, queryData } = toRefs(state)

// 获取列表
const getListData = () => {
  state.loading = true
  if (JSON.stringify(state.queryData) !== JSON.stringify(state.submitData)) {
    state.currentPage = 1
  }
  const formData = JSON.parse(JSON.stringify(state.queryData))
  getBalanceLog({
    page: state.currentPage,
    ...formData,
  }).then((data: any) => {
    state.loading = false
    state.list = data.list
    if (state.currentPage === 1 && data.pages > 0) {
      state.totalPage = data.pages
    }
    state.submitData = JSON.parse(JSON.stringify(state.queryData))
  })
}

const handleSizeChange = () => {
  getListData()
}

const handleCurrentChange = () => {
  getListData()
}

// 页面加载时
onMounted(() => {
  getListData()
})
</script>

<style scoped lang="scss"></style>
