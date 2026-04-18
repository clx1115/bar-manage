<template>
  <div class="page-container layout-padding">
    <el-card shadow="hover" class="layout-padding-auto">
      <el-form class="query" :inline="true" size="default" label-width="90px">
        <el-row>
          <el-form-item label="用户UID">
            <el-input v-model="queryData.uid" size="default" placeholder="用户UID" style="width:120px" clearable>
            </el-input>
          </el-form-item>
          <el-form-item label="手机号码">
            <el-input v-model="queryData.phoneNumber" size="default" placeholder="用户手机号码" style="width:120px" clearable>
            </el-input>
          </el-form-item>
          <el-form-item label="订单编号">
            <el-input v-model="queryData.orderNo" size="default" placeholder="订单编号" clearable> </el-input>
          </el-form-item>
          <el-form-item label="流水号">
            <el-input v-model="queryData.tradeNo" size="default" placeholder="流水号" clearable> </el-input>
          </el-form-item>
          <el-form-item label="充值日期">
            <el-date-picker size="default" v-model="timeRange" type="daterange" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" format="YYYY-MM-DD" value-format="x" />
          </el-form-item>
          <el-form-item>
            <el-button size="default" type="primary" @click="getListData">
              <el-icon>
                <ele-Search />
              </el-icon>
              查询
            </el-button>
          </el-form-item>
          <el-form-item>
            <el-button size="default" @click="refreshQuery">
              <el-icon>
                <ele-Refresh />
              </el-icon>
              重置
            </el-button>
          </el-form-item>
          <el-form-item>
            <el-button size="default" :loading="exportLoading" type="primary" @click="downloadFile">
              <el-icon>
                <ele-Download />
              </el-icon>
              导出
            </el-button>
          </el-form-item>
        </el-row>
      </el-form>
      <el-table :data="list" v-loading="loading" style="width: 100%">
        <el-table-column prop="id" label="记录ID" width="100"></el-table-column>
        <el-table-column prop="orderNo" label="订单编号" min-width="150" show-overflow-tooltip />
        <el-table-column prop="uid" label="会员ID" width="100" show-overflow-tooltip />
        <el-table-column prop="userName" label="会员名称" min-width="100" />
        <el-table-column label="充值金额" width="150">
          <template #default="{ row }">
            <span>{{ parseMoney(row.realPay) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="到账金额" width="150">
          <template #default="{ row }">
            <span>{{ parseMoney(row.amount) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="好友代充" width="200">
          <template #default="{ row }">
            <span v-if="row.friendId">好友UID:{{ row.friendId }}</span>
          </template>
        </el-table-column>
        <el-table-column label="充值时间" width="200">
          <template #default="{ row }">
            {{ formatDate(row.createTime, 'YYYY-mm-dd HH:MM:SS') }}
          </template>
        </el-table-column>
        <el-table-column prop="staffName" label="员工" width="120" />
        <el-table-column prop="operatorName" label="操作人" width="120" />
      </el-table>
      <div class="page-bottom">
        <el-pagination v-model:currentPage="currentPage" background layout="prev, pager, next, jumper" :page-count="totalPage" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted, toRefs, ref, watch } from 'vue'
import { parseMoney } from '@/utils/filters'
import { formatDate } from '@/utils/formatTime'
import { getChargeLog } from '@/api/finance/index'

const defaultQuery = {
  uid: '',
  phoneNumber: '',
  orderNo: '',
  tradeNo: '',
  beginDate: 0,
  endDate: 0,
}

// 定义变量
const timeRange = ref('')
const state = reactive({
  list: [],
  loading: false,
  currentPage: 1,
  totalPage: 1,
  queryData: Object.assign({}, defaultQuery),
  submitData: {},
  exportLoading: false,
})

const {
  list,
  loading,
  currentPage,
  totalPage,
  queryData,
  exportLoading,
} = toRefs(state)

watch(timeRange, (newValue: any) => {
  if (newValue && newValue[0] && newValue[1]) {
    state.queryData.beginDate = newValue[0] / 1000 || 0
    state.queryData.endDate =
      (newValue[1] + 24 * 60 * 60 * 1000 - 1000) / 1000 || 0
  } else {
    state.queryData.beginDate = 0
    state.queryData.endDate = 0
  }
})

// 获取列表
const getListData = () => {
  state.loading = true
  if (JSON.stringify(state.queryData) !== JSON.stringify(state.submitData)) {
    state.currentPage = 1
  }
  const formData = JSON.parse(JSON.stringify(state.queryData))
  getChargeLog({
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

//重置搜索条件
const refreshQuery = () => {
  state.queryData = Object.assign({}, defaultQuery)
  timeRange.value = ''
  getListData()
}

//导出表格
const downloadFile = () => {
  import('@/utils/export.js').then((excel) => {
    state.exportLoading = true
    getChargeLog({ page: 0, ...state.submitData }).then((data) => {
      data.list.map((item: any) => {
        item.amount = Number(item.amount / 100)
        item.realPay = Number(item.realPay / 100)
        item.createTime = formatDate(item.createTime, 'YYYY-mm-dd HH:MM:SS')
        return item
      })
      const exportJsonToExcel = excel.export_json_to_excel
      const tableHead = [
        '记录ID',
        '订单编号',
        '用户UID',
        '充值金额',
        '到账金额',
        '充值时间',
      ]
      const filterVal = [
        'id',
        'orderNo',
        'uid',
        'realPay',
        'amount',
        'createTime',
      ]
      const tableBody = data.list.map((v: any) => filterVal.map((j) => v[j]))
      state.exportLoading = false
      exportJsonToExcel({
        header: tableHead,
        data: tableBody,
        filename: '充值记录',
        autoWidth: true,
      })
    })
  })
}

// 页面加载时
onMounted(() => {
  getListData()
})
</script>

<style scoped lang="scss"></style>
