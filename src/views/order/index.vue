<template>
  <div class="page-container layout-padding">
    <el-card shadow="hover" class="layout-padding-auto">
      <el-form class="query" :inline="true" size="default" label-width="80px">
        <el-row>
          <el-form-item>
            <el-radio-group v-model="queryData.status" size="default" @change="getListData">
              <el-radio-button v-for="item in orderStatusTabs" :key="item.value" :label="item.value">
                {{ item.label }}
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
        <el-table-column fixed="right" label="操作" width="220" align="center">
          <template #default="{ row }">
            <div class="order-actions">
              <router-link :to="`/order/detail?orderId=${row.id}`">
                <el-button size="small" text type="primary">{{ orderActionText.detail }}</el-button>
              </router-link>
              <el-button
                v-if="canMakeOrder(row)"
                size="small"
                text
                type="primary"
                @click="onMakeOrder(row)"
              >
                {{ orderActionText.make }}
              </el-button>
              <el-button
                v-if="canFinishOrder(row)"
                size="small"
                text
                type="primary"
                @click="onFinishOrder(row)"
              >
                {{ orderActionText.finish }}
              </el-button>
            </div>
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
import { listOrders, makeOrder, finishOrder, batchOrderDelievered, getPrintTemplate } from '@/api/order/index'
import { formatDeliveryType } from '@/dict/order'
import { formatOrderStatus, parseMoney, formatAfterSalesStatus } from '@/utils/filters'
import { ElMessageBox, ElMessage } from 'element-plus'
import { storeToRefs } from 'pinia'
import { useUserInfo } from '@/stores/userInfo'

const stores = useUserInfo()
const { userInfos } = storeToRefs(stores) as any

const orderActionText = {
  detail: '\u8be6\u60c5',
  make: '\u63a5\u5355',
  finish: '\u5236\u4f5c\u5b8c\u6210',
  printWarning: '\u6682\u65e0\u6253\u5370\u6a21\u677f',
  makeConfirm: '\u786e\u5b9a\u63a5\u5355\u5e76\u6d41\u8f6c\u5230\u5f85\u5236\u4f5c\u5417\uff1f',
  finishConfirm: '\u786e\u5b9a\u5c06\u8ba2\u5355\u8bbe\u4e3a\u5f85\u914d\u9001\u5417\uff1f',
  confirmButton: '\u786e\u8ba4',
  cancelButton: '\u53d6\u6d88',
  dialogTitle: '\u63d0\u793a',
  makeSuccess: '\u63a5\u5355\u6210\u529f',
  finishSuccess: '\u5236\u4f5c\u5b8c\u6210',
}

const orderStatusTabs = [
  { label: '全部', value: 0 },
  { label: '待付款', value: 10 },
  { label: '已付款', value: 11 },
  { label: '待制作', value: 20 },
  { label: '已完成', value: 50 },
  { label: '已取消', value: -10 },
]

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

const getDefaultOrderTimeRange = () => {
  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime()
  const todayStart = new Date(now.toLocaleDateString()).getTime()
  return [monthStart, todayStart]
}

const timeRange = ref(getDefaultOrderTimeRange())
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
  printTemplate: ''
})

const { list, loading, currentPage, totalPage, queryData, exportLoading, selectedList } =
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
    return ElMessage.warning(orderActionText.printWarning)
  }
  printOrderRef.value.printOrder(state.printTemplate, row.id)
}

const canMakeOrder = (row: any) => row.status === 11
const canFinishOrder = (row: any) => row.status === 20

const onMakeOrder = (row: any) => {
  ElMessageBox.confirm(orderActionText.makeConfirm, orderActionText.dialogTitle, {
    confirmButtonText: orderActionText.confirmButton,
    cancelButtonText: orderActionText.cancelButton,
    type: 'warning',
  })
    .then(() => {
      makeOrder({ orderId: row.id }).then(() => {
        getListData()
        ElMessage.success(orderActionText.makeSuccess)
      })
    })
    .catch(() => { })
}

const onFinishOrder = (row: any) => {
  ElMessageBox.confirm(orderActionText.finishConfirm, orderActionText.dialogTitle, {
    confirmButtonText: orderActionText.confirmButton,
    cancelButtonText: orderActionText.cancelButton,
    type: 'warning',
  })
    .then(() => {
      finishOrder({ orderId: row.id }).then(() => {
        getListData()
        ElMessage.success(orderActionText.finishSuccess)
      })
    })
    .catch(() => { })
}

const refreshQuery = () => {
  state.queryData = Object.assign({}, defaultQuery)
  timeRange.value = getDefaultOrderTimeRange()
  scheduleTimeRange.value = []
  getListData()
}

const handleSizeChange = () => {
  getListData()
}

const handleCurrentChange = () => {
  getListData()
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
  getPrintTemplateData()
})

defineExpose({
  getListData,
})
</script>

<style scoped lang="scss">
:deep(.el-radio-button__inner) {
  height: 40px;
  display: flex;
  align-items: center;
}

.order-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
}

.order-actions :deep(.el-button) {
  margin: 0;
}
</style>
