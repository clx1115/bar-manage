<template>
  <div class="page-container layout-padding">
    <el-card shadow="hover" class="layout-padding-auto">
      <el-form class="query" :inline="true" size="default" label-width="80px">
        <el-row>
          <el-form-item>
            <el-radio-group v-model="queryData.status" size="default" @change="getListData">
              <el-radio-button :label="0">
                全部
              </el-radio-button>
              <el-radio-button :label="30">
                待退款
                <el-badge :value="count.toBeRefundedOrders" v-if="count.toBeRefundedOrders > 0"></el-badge>
              </el-radio-button>
              <el-radio-button :label="50">
                已退款
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="订单编号">
            <el-input v-model="queryData.orderNo" size="default" placeholder="订单编号/售后编号" style="width:200px" clearable>
            </el-input>
          </el-form-item>
          <el-form-item label="日期">
            <el-date-picker size="default" v-model="timeRange" type="daterange" range-separator="至"
              start-placeholder="开始时间" end-placeholder="结束时间" format="YYYY-MM-DD" value-format="x" />
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
        </el-row>
      </el-form>
      <el-table :data="list" v-loading="loading" style="width: 100%" @selection-change="selectedList = $event">
        <el-table-column type="selection" width="30" />
        <el-table-column prop="returnsNo" label="售后编号" min-width="180" show-overflow-tooltip></el-table-column>
        <el-table-column prop="orderNo" label="订单编号" min-width="180" show-overflow-tooltip>
          <template #default="{ row }">
            <router-link :to="`/order/detail?orderId=${row.orderId}`">
              <el-button size="small" text type="primary">{{ row.orderNo }}</el-button>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column label="申请用户" show-overflow-tooltip width="180">
          <template #default="{ row }">
            {{ row.userName }}(UID:{{ row.uid }})
          </template>
        </el-table-column>
        <el-table-column label="售后金额" width="100">
          <template #default="{ row }">
            {{ parseMoney(row.returnMoney) }}
          </template>
        </el-table-column>
        <el-table-column label="售后类型" width="100">
          <template #default="{ row }">
            <el-tag type="success" v-if="row.state === 1">退款</el-tag>
            <el-tag type="success" v-if="row.state === 2">退货退款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="申请时间" width="200">
          <template #default="{ row }">
            {{ formatDate(row.createTime, 'YYYY-mm-dd HH:MM:SS') }}
          </template>
        </el-table-column>
        <el-table-column label="订单状态" width="120">
          <template #default="{ row }">
            {{ formatAfterSalesStatus(row.status) }}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="150">
          <template #default="{ row }">
            <el-form>
              <router-link :to="`/afterSales/detail?returnId=${row.id}`" class="mr10">
                <el-button size="small" text type="primary">详情</el-button>
              </router-link>
              <el-button size="small" text type="primary" @click="onDirectRefund(row)">直接退款</el-button>
            </el-form>
          </template>
        </el-table-column>
      </el-table>
      <div class="page-bottom">
        <el-pagination v-model:currentPage="currentPage" background layout="prev, pager, next, jumper"
          :page-count="totalPage" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      </div>
    </el-card>
    <directRefund ref="directRefundRef" @refresh="getListData" />
  </div>
</template>
<script lang="ts">
export default {
  name: "afterSalesIndex",
  beforeRouteEnter(to, from, next) {
    next((vm: any) => {
      if (from.name === 'afterSalesDetail') {
        vm.getListData()
        vm.getOrderCountData()
      }
    })
  }
}
</script>
<script setup lang="ts">
import {
  reactive,
  onMounted,
  ref,
  toRefs,
  watch,
  defineAsyncComponent,
} from 'vue'
import { formatDate } from '@/utils/formatTime'
import { getAfterSalesList } from '@/api/afterSales/index'
import { formatAfterSalesStatus, parseMoney } from '@/utils/filters'
import { getOrderCount } from '@/api/order/index'

// 引入组件
const directRefund = defineAsyncComponent(
  () => import('./component/directRefund.vue')
)

// 定义变量
const directRefundRef = ref()
const defaultQuery = {
  status: 0,
  orderNo: '',
  beginTime: 0,
  endTime: 0,
}
const timeRange = ref('')
const state = reactive({
  list: [],
  loading: false,
  currentPage: 1,
  totalPage: 1,
  queryData: Object.assign({}, defaultQuery),
  submitData: {},
  exportLoading: false,
  selectedList: [],
  count: {} as any
})

const { list, loading, currentPage, totalPage, queryData, exportLoading, selectedList, count } =
  toRefs(state)

watch(timeRange, (newValue: any) => {
  if (newValue && newValue[0] && newValue[1]) {
    state.queryData.beginTime = newValue[0] / 1000 || 0
    state.queryData.endTime =
      (newValue[1] + 24 * 60 * 60 * 1000 - 1000) / 1000 || 0
  } else {
    state.queryData.beginTime = 0
    state.queryData.endTime = 0
  }
})

// 获取列表
const getListData = () => {
  state.loading = true
  if (JSON.stringify(state.queryData) !== JSON.stringify(state.submitData)) {
    state.currentPage = 1
  }
  const formData = JSON.parse(JSON.stringify(state.queryData))
  getAfterSalesList({
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

// 获取订单状态数量
const getOrderCountData = () => {
  getOrderCount().then((data: any) => {
    state.count = data
  })
}

//重置搜索条件
const refreshQuery = () => {
  state.queryData = Object.assign({}, defaultQuery)
  timeRange.value = ''
  getListData()
}

// 直接退款
const onDirectRefund = (row?: any) => {
  directRefundRef.value.openDialog(row?.orderId)
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
  getOrderCountData()
})

// 暴露变量
defineExpose({
  getListData,
  getOrderCountData
})
</script>

<style scoped lang="scss">
:deep(.el-radio-button__inner) {
  height: 40px;
  display: flex;
  align-items: center;
}
</style>
