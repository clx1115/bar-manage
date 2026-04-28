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
              <el-radio-button :label="10">
                待付款
                <el-badge :value="count.unpayOrders"></el-badge>
              </el-radio-button>
              <el-radio-button :label="20">
                待发货
                <el-badge :value="count.paidOrders"></el-badge>
              </el-radio-button>
              <el-radio-button :label="30">
                待收货
                <el-badge :value="count.delieveredOrders"></el-badge>
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item>
            <el-input v-model="queryData.orderNo" size="default" placeholder="订单编号" style="width: 140px" clearable />
          </el-form-item>
          <el-form-item>
            <el-input v-model="queryData.uid" size="default" placeholder="用户UID" style="width: 120px" clearable />
          </el-form-item>
          <el-form-item>
            <el-input v-model="queryData.userName" size="default" placeholder="用户名称" style="width: 140px" clearable />
          </el-form-item>
          <el-form-item>
            <el-input v-model="queryData.phoneNumber" size="default" placeholder="收货手机号" style="width: 140px" clearable />
          </el-form-item>
          <el-form-item>
            <el-input v-model="queryData.pickupCode" size="default" placeholder="取餐码" style="width: 120px" clearable />
          </el-form-item>
          <el-form-item>
            <el-input v-model="queryData.filter" size="default" placeholder="综合搜索" style="width: 160px" clearable />
          </el-form-item>
          <el-form-item>
            <el-date-picker
              v-model="timeRange"
              size="default"
              type="daterange"
              range-separator="至"
              start-placeholder="下单开始时间"
              end-placeholder="下单结束时间"
              format="YYYY-MM-DD"
              value-format="x"
            />
          </el-form-item>
          <el-form-item>
            <el-date-picker
              v-model="scheduleTimeRange"
              size="default"
              type="daterange"
              range-separator="至"
              start-placeholder="预约开始时间"
              end-placeholder="预约结束时间"
              format="YYYY-MM-DD"
              value-format="x"
            />
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
          <el-form-item v-if="userInfos.roles[0] === 'admin' || userInfos.roles[0] === 'director' || userInfos.roles[0] === 'finance' || userInfos.roles[0] === 'cashier'">
            <el-button type="success" :disabled="!selectedList.length" @click="onBatchOrderDelievered()">
              <el-icon>
                <ele-Plus />
              </el-icon>
              批量发货
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
      <el-table :data="list" v-loading="loading" style="width: 100%" @selection-change="selectedList = $event">
        <el-table-column type="selection" width="30" />
        <el-table-column v-if="userInfos.roles[0] === 'admin' || userInfos.roles[0] === 'director' || userInfos.roles[0] === 'finance'" type="expand" width="25">
          <template #default="{ row }">
            <el-table :data="row.detailList">
              <el-table-column align="center" label="商品ID">
                <template #default="scope2">
                  {{ scope2.row.productId }}
                </template>
              </el-table-column>
              <el-table-column align="center" label="商品名称">
                <template #default="scope2">
                  {{ scope2.row.productName }} {{ scope2.row.skuName }}
                </template>
              </el-table-column>
              <el-table-column align="center" label="商品单价">
                <template #default="scope2">
                  {{ parseMoney(scope2.row.productPrice) }}
                </template>
              </el-table-column>
              <el-table-column align="center" label="结算价">
                <template #default="scope2">
                  {{ parseMoney(scope2.row.resultPrice) }}
                </template>
              </el-table-column>
              <el-table-column align="center" label="商品数量">
                <template #default="scope2">
                  {{ scope2.row.number }}
                </template>
              </el-table-column>
              <el-table-column align="center" label="商品总价">
                <template #default="scope2">
                  {{ parseMoney(scope2.row.subTotal) }}
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column prop="orderNo" label="订单编号" min-width="180" show-overflow-tooltip />
        <el-table-column prop="orgName" label="店铺名称" min-width="160" show-overflow-tooltip />
        <el-table-column label="用户信息" show-overflow-tooltip width="180">
          <template #default="{ row }">
            <span v-if="row.uid">{{ row.userName }}(UID:{{ row.uid }})</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column prop="pickupCode" label="取餐码" width="120" show-overflow-tooltip />
        <el-table-column prop="productCount" label="商品数量" width="100" />
        <el-table-column label="订单总额" width="100">
          <template #default="{ row }">
            {{ parseMoney(row.totalMoney) }}
          </template>
        </el-table-column>
        <el-table-column label="实付金额" width="100">
          <template #default="{ row }">
            {{ parseMoney(row.realPay) }}
          </template>
        </el-table-column>
        <el-table-column label="配送方式" width="120">
          <template #default="{ row }">
            {{ formatDeliveryType(row.deliveryType) }}
          </template>
        </el-table-column>
        <el-table-column label="订单状态" width="120">
          <template #default="{ row }">
            {{ formatOrderStatus(row.status) }}
          </template>
        </el-table-column>
        <el-table-column label="售后状态" width="120">
          <template #default="{ row }">
            {{ formatAfterSalesStatus(row.postServiceStatus) }}
          </template>
        </el-table-column>
        <el-table-column prop="payMethodName" label="支付方式" width="120" />
        <el-table-column label="下单时间" width="200">
          <template #default="{ row }">
            {{ formatDate(row.createTime, 'YYYY-mm-dd HH:MM:SS') }}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="180">
          <template #default="{ row }">
            <el-form>
              <router-link :to="`/order/detail?orderId=${row.id}`" class="mr10">
                <el-button size="small" text type="primary">详情</el-button>
              </router-link>
              <el-button v-if="userInfos.roles[0] === 'admin' || userInfos.roles[0] === 'director' || userInfos.roles[0] === 'finance' || userInfos.roles[0] === 'cashier'" size="small" text type="primary" @click="onPrintOrder(row)">打印订单</el-button>
              <el-button v-if="row.status >= 10 && (userInfos.roles[0] === 'admin' || userInfos.roles[0] === 'director' || userInfos.roles[0] === 'finance' || userInfos.roles[0] === 'cashier')" size="small" text type="primary" @click="onCancelOrder(row)">取消订单</el-button>
            </el-form>
          </template>
        </el-table-column>
      </el-table>
      <div class="page-bottom">
        <el-pagination v-model:currentPage="currentPage" background layout="prev, pager, next, jumper" :page-count="totalPage" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      </div>
    </el-card>
    <printOrder ref="printOrderRef" />
  </div>
</template>
<script lang="ts">
export default {
  name: 'orderIndex',
  beforeRouteEnter(to, from, next) {
    next((vm: any) => {
      if (from.name === 'orderDetail') {
        vm.getListData()
        vm.getOrderCountData()
      }
    })
  }
}
</script>
<script setup lang="ts">
import {
  defineAsyncComponent,
  reactive,
  onMounted,
  ref,
  toRefs,
  watch,
} from 'vue'
import { formatDate } from '@/utils/formatTime'
import { listOrders, cancelOrder, batchOrderDelievered, getOrderCount, getPrintTemplate } from '@/api/order/index'
import { formatDeliveryType } from '@/dict/order'
import { formatOrderStatus, parseMoney, formatAfterSalesStatus } from '@/utils/filters'
import { ElMessageBox, ElMessage } from 'element-plus'
import { storeToRefs } from 'pinia'
import { useUserInfo } from '@/stores/userInfo'

const stores = useUserInfo()
const { userInfos } = storeToRefs(stores) as any

const printOrder = defineAsyncComponent(
  () => import('./component/print.vue')
)

const defaultQuery = {
  status: 0,
  orderNo: '',
  uid: '',
  userName: '',
  phoneNumber: '',
  pickupCode: '',
  beginTime: 0,
  endTime: 0,
  scheduleBeginTime: 0,
  scheduleEndTime: 0,
  filter: '',
}

const beginTime = new Date(new Date().toLocaleDateString()).getTime()
const timeRange = ref([beginTime, beginTime])
const scheduleTimeRange = ref([] as number[])
const printOrderRef = ref()
const state = reactive({
  list: [] as any[],
  loading: false,
  currentPage: 1,
  totalPage: 1,
  queryData: Object.assign({}, defaultQuery),
  submitData: Object.assign({}, defaultQuery),
  exportLoading: false,
  selectedList: [] as any[],
  count: {} as any,
  printTemplate: ''
})

const { list, loading, currentPage, totalPage, queryData, exportLoading, selectedList, count } =
  toRefs(state)

watch(timeRange, (newValue: any) => {
  if (newValue && newValue[0] && newValue[1]) {
    state.queryData.beginTime = newValue[0] || 0
    state.queryData.endTime = newValue[1] + 24 * 60 * 60 * 1000 - 1000 || 0
  } else {
    state.queryData.beginTime = 0
    state.queryData.endTime = 0
  }
}, {
  immediate: true,
})

watch(scheduleTimeRange, (newValue: any) => {
  if (newValue && newValue[0] && newValue[1]) {
    state.queryData.scheduleBeginTime = newValue[0] || 0
    state.queryData.scheduleEndTime = newValue[1] + 24 * 60 * 60 * 1000 - 1000 || 0
  } else {
    state.queryData.scheduleBeginTime = 0
    state.queryData.scheduleEndTime = 0
  }
}, {
  immediate: true,
})

const normalizeOrderItem = (item: any) => ({
  ...item,
  orgName: item.orgName ?? item.shopName ?? '',
  createTime: item.createTime ?? item.createdTime ?? 0,
  updateTime: item.updateTime ?? item.updatedTime ?? 0,
  detailList: Array.isArray(item.detailList) ? item.detailList : [],
  pickupCode: item.pickupCode ?? '',
})

const buildOrderQuery = (page: number, source = state.queryData) => {
  const payload = {
    page,
  } as any

  if (source.orderNo) payload.orderNo = source.orderNo
  if (source.userName) payload.userName = source.userName
  if (source.phoneNumber) payload.phoneNumber = source.phoneNumber
  if (source.uid !== '') payload.uid = source.uid
  if (source.status) payload.status = source.status
  if (source.pickupCode) payload.pickupCode = source.pickupCode
  if (source.beginTime > 0) payload.beginTime = source.beginTime
  if (source.endTime > 0) payload.endTime = source.endTime
  if (source.scheduleBeginTime > 0) payload.scheduleBeginTime = source.scheduleBeginTime
  if (source.scheduleEndTime > 0) payload.scheduleEndTime = source.scheduleEndTime
  if (source.filter) payload.filter = source.filter

  return payload
}

const getListData = () => {
  state.loading = true
  if (JSON.stringify(state.queryData) !== JSON.stringify(state.submitData)) {
    state.currentPage = 1
  }

  listOrders(buildOrderQuery(state.currentPage))
    .then((data: any) => {
      state.list = (data.list || []).map((item: any) => normalizeOrderItem(item))
      state.totalPage = state.currentPage === 1 ? (data.pages || 1) : state.totalPage
      state.submitData = JSON.parse(JSON.stringify(state.queryData))
    })
    .finally(() => {
      state.loading = false
    })
}

const getOrderCountData = () => {
  getOrderCount().then((data: any) => {
    state.count = data
  })
}

const getPrintTemplateData = () => {
  getPrintTemplate({ page: 1 }).then((data: any) => {
    const printTemplateData = data.list.find((item: any) => item.title === '销售出库单')
    if (printTemplateData) {
      state.printTemplate = printTemplateData.template
    }
  })
}

const onPrintOrder = (row: any) => {
  if (!state.printTemplate) {
    return ElMessage.warning('暂无打印模板')
  }
  printOrderRef.value.printOrder(state.printTemplate, row.id)
}

const refreshQuery = () => {
  state.queryData = Object.assign({}, defaultQuery)
  timeRange.value = [beginTime, beginTime]
  scheduleTimeRange.value = []
  getListData()
}

const handleSizeChange = () => {
  getListData()
}

const handleCurrentChange = () => {
  getListData()
}

const onCancelOrder = (row: any) => {
  ElMessageBox.confirm(
    '您正在取消订单，是否继续?',
    '提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      cancelOrder(row).then(() => {
        getListData()
        getOrderCountData()
        ElMessage.success('取消成功')
      })
    })
    .catch(() => { })
}

const onBatchOrderDelievered = () => {
  ElMessageBox.confirm(
    '您正在操作批量发货订单，是否继续?',
    '提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      const list = [] as any[]
      state.selectedList.forEach((item: any) => {
        list.push({
          orderId: item.id,
          expressNo: '自营配送',
          expressCompany: '自营'
        })
      })
      batchOrderDelievered({
        list,
      }).then(() => {
        getListData()
        getOrderCountData()
        ElMessage.success('批量发货成功')
      })
    })
    .catch(() => { })
}

const downloadFile = () => {
  import('@/utils/export.js').then((excel) => {
    state.exportLoading = true
    listOrders(buildOrderQuery(0, state.submitData))
      .then((data: any) => {
        const tableData = (data.list || []).map((rawItem: any) => {
          const item = normalizeOrderItem(rawItem)
          item.totalMoney = Number(item.totalMoney / 100)
          item.realPay = Number(item.realPay / 100)
          item.createTime = formatDate(item.createTime, 'YYYY-mm-dd HH:MM:SS')
          item.status = formatOrderStatus(item.status)
          return item
        })

        let length = tableData.length
        for (let i = 0; i < length; i++) {
          const arr = tableData
          const item = arr[i]
          if (!item.id) continue
          item.detailList.forEach((detailItem: any, detailIndex: number) => {
            if (!detailIndex) {
              item.productId = detailItem.productId
              item.productName = detailItem.productName
              item.productPrice = parseMoney(detailItem.productPrice)
              item.number = detailItem.number
              item.resultPrice = parseMoney(detailItem.resultPrice)
              item.subTotal = parseMoney(detailItem.subTotal)
            } else {
              arr.splice(i + 1, 0, {
                orgName: item.orgName,
                orderNo: item.orderNo,
                uid: item.uid,
                userName: item.userName,
                pickupCode: item.pickupCode,
                totalMoney: item.totalMoney,
                realPay: item.realPay,
                payMethodName: item.payMethodName,
                createTime: item.createTime,
                status: item.status,
                productId: detailItem.productId,
                productName: detailItem.productName,
                productPrice: parseMoney(detailItem.productPrice),
                number: detailItem.number,
                resultPrice: parseMoney(detailItem.resultPrice),
                subTotal: parseMoney(detailItem.subTotal),
              })
              length = arr.length
            }
          })
        }

        const exportJsonToExcel = excel.export_json_to_excel
        const tableHead = [
          '订单号',
          '店铺名称',
          '客户UID',
          '客户名称',
          '取餐码',
          '订单总额',
          '实付总额',
          '支付方式',
          '下单时间',
          '订单状态',
          '商品ID',
          '商品名称',
          '数量',
          '单价',
          '结算价',
          '小计',
        ]
        const filterVal = [
          'orderNo',
          'orgName',
          'uid',
          'userName',
          'pickupCode',
          'totalMoney',
          'realPay',
          'payMethodName',
          'createTime',
          'status',
          'productId',
          'productName',
          'number',
          'productPrice',
          'resultPrice',
          'subTotal',
        ]
        const tableBody = tableData.map((v: any) => filterVal.map((j) => v[j]))
        exportJsonToExcel({
          header: tableHead,
          data: tableBody,
          filename: '订单记录',
          autoWidth: true,
        })
      })
      .finally(() => {
        state.exportLoading = false
      })
  })
}

onMounted(() => {
  getListData()
  getOrderCountData()
  getPrintTemplateData()
})

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
