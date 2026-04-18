<template>
  <div class="page-container layout-padding">
    <el-card shadow="hover" class="layout-padding-auto">
      <el-form class="query" :inline="true" size="default" label-width="80px">
        <el-row>
          <el-form-item>
            <el-input v-model="queryData.orderNo" size="default" placeholder="订单编号" style="width:120px" clearable>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="queryData.uid" size="default" placeholder="用户UID" style="width:100px" clearable>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="queryData.userName" size="default" placeholder="用户名称" style="width:120px" clearable> </el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="queryData.phoneNumber" size="default" placeholder="用户手机号码" style="width:120px" clearable>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-select v-model="queryData.shopId" placeholder="选择店铺" filterable clearable style="width:130px">
              <el-option v-for="item in shopList" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item>
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
          <el-form-item>
            <el-button size="default" :loading="exportLoading" type="primary" @click="onBatchPrint">
              <el-icon>
                <ele-Printer />
              </el-icon>
              批量打印
            </el-button>
          </el-form-item>
        </el-row>
      </el-form>
      <el-table :data="list" v-loading="loading" style="width: 100%">
        <el-table-column type="expand" width="25">
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
        <el-table-column prop="orderNo" label="订单编号" min-width="180" show-overflow-tooltip></el-table-column>
        <el-table-column label="用户信息" show-overflow-tooltip width="180">
          <template #default="{ row }">
            <span v-if="row.uid">{{ row.userName }}(UID:{{ row.uid }})</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column prop="shopName" label="店铺" min-width="180" show-overflow-tooltip></el-table-column>
        <el-table-column label="订单来源" width="120">
          <template #default="{ row }">
            {{ row.source === 1 ? '门店' : '小程序' }}
          </template>
        </el-table-column>
        <el-table-column prop="productCount" label="商品数量" width="100"></el-table-column>
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
        <el-table-column label="下单时间" width="200">
          <template #default="{ row }">
            {{ formatDate(row.createTime, 'YYYY-mm-dd HH:MM:SS') }}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="打印状态" width="120">
          <template #default="{ row }">
            <el-tag type="success" v-if="row.printCount">已打印</el-tag>
            <el-tag type="danger" v-else>未打印</el-tag>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="120">
          <template #default="{ row }">
            <el-form>
              <router-link :to="`/order/detail?orderId=${row.id}`" class="mr10">
                <el-button size="small" text type="primary">详情</el-button>
              </router-link>
              <el-button size="small" text type="primary" @click="onPrintOrder(row)">打印订单</el-button>
            </el-form>
          </template>
        </el-table-column>
      </el-table>
      <div class="page-bottom">
        <el-pagination v-model:currentPage="currentPage" background layout="prev, pager, next, jumper" :page-count="totalPage" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      </div>
    </el-card>
    <printOrder ref="printOrderRef" />
    <printResult ref="printResultRef" />
  </div>
</template>
<script lang="ts">
export default {
  name: "orderDeliveryIndex",
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
import { getOrderList, getPrintTemplate } from '@/api/order/index'
import { getShopList } from '@/api/shop/index'
import { formatOrderStatus, parseMoney, formatAfterSalesStatus } from '@/utils/filters'
import { ElMessageBox, ElMessage } from 'element-plus'

// 引入组件
const printOrder = defineAsyncComponent(
  () => import('../component/print.vue')
)

const printResult = defineAsyncComponent(
  () => import('./component/printResult.vue')
)

// 定义变量
const defaultQuery = {
  status: 20,
  orderNo: '',
  uid: '',
  userName: '',
  phoneNumber: '',
  orderType: '',
  scheduleBeginTime: 0,
  scheduleEndTime: 0,
  dealerUid: '',
  payMethod: 0,
  shopId: '',
  source: 0,
  deliveryType: 2
}
const beginTime = new Date(new Date().toLocaleDateString()).getTime()
const timeRange = ref([beginTime, beginTime])
const printOrderRef = ref()
const printResultRef = ref()
const state = reactive({
  list: [],
  loading: false,
  currentPage: 1,
  totalPage: 1,
  queryData: Object.assign({}, defaultQuery),
  submitData: {},
  exportLoading: false,
  shopList: [] as any,
  printTemplate: ''
})

const { list, loading, currentPage, totalPage, queryData, exportLoading, shopList } =
  toRefs(state)

watch(timeRange, (newValue: any) => {
  if (newValue && newValue[0] && newValue[1]) {
    state.queryData.scheduleBeginTime = newValue[0] / 1000 || 0
    state.queryData.scheduleEndTime =
      (newValue[1] + 24 * 60 * 60 * 1000 - 1000) / 1000 || 0
  } else {
    state.queryData.scheduleBeginTime = 0
    state.queryData.scheduleEndTime = 0
  }
},
  {
    immediate: true,
  })

// 获取列表
const getListData = () => {
  state.loading = true
  if (JSON.stringify(state.queryData) !== JSON.stringify(state.submitData)) {
    state.currentPage = 1
  }
  const formData = JSON.parse(JSON.stringify(state.queryData))
  getOrderList({
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


// 获取打印模板ID
const getPrintTemplateData = () => {
  getPrintTemplate({ page: 1 }).then((data: any) => {
    const printTemplateData = data.list.find((item: any) => item.title === '销售出库单')
    if (printTemplateData) {
      state.printTemplate = printTemplateData.template
    }
  })
}

// 获取店铺列表
const getShopListData = () => {
  getShopList({
    page: 0
  }).then((data: any) => {
    state.shopList = data.list
  })
}

//订单打印
const onPrintOrder = (row: any) => {
  if (!state.printTemplate) {
    return ElMessage.warning('暂无打印模板')
  }
  printOrderRef.value.printOrder(state.printTemplate, row.id)
}


const onBatchPrint = () => {
  const formData = JSON.parse(JSON.stringify(state.queryData))
  printResultRef.value.openDialog(formData)
}

//重置搜索条件
const refreshQuery = () => {
  state.queryData = Object.assign({}, defaultQuery)
  const beginTime = new Date(new Date().toLocaleDateString()).getTime()
  timeRange.value = [beginTime, beginTime]
  getListData()
}


const handleSizeChange = () => {
  getListData()
}

const handleCurrentChange = () => {
  getListData()
}

//导出表格
const downloadFile = () => {
  import('@/utils/export.js').then((excel) => {
    state.exportLoading = true
    getOrderList({ page: 0, ...state.submitData }).then((data) => {
      const tableData = data.list.map((item: any) => {
        item.totalMoney = Number(item.totalMoney / 100)
        item.realPay = Number(item.realPay / 100)
        item.profit = Number(item.profit / 100)
        item.scheduleTime = formatDate(item.scheduleTime, 'YYYY-mm-dd')
        item.createTime = formatDate(item.createTime, 'YYYY-mm-dd HH:MM:SS')
        item.status = formatOrderStatus(item.status)
        return item
      })
      let t = tableData.length
      for (let i = 0;i < t;i++) {
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
              productId: detailItem.productId,
              productName: detailItem.productName,
              productPrice: parseMoney(detailItem.productPrice),
              number: detailItem.number,
              resultPrice: parseMoney(detailItem.resultPrice),
              subTotal: parseMoney(detailItem.subTotal),
            })
            t = arr.length
          }
        })
      }
      const exportJsonToExcel = excel.export_json_to_excel
      const tableHead = [
        '订单号',
        '客户UID',
        '客户名称',
        '订单总额',
        '实付总额',
        '配送时间',
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
        'uid',
        'userName',
        'totalMoney',
        'realPay',
        'scheduleTime',
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
      state.exportLoading = false
      exportJsonToExcel({
        header: tableHead,
        data: tableBody,
        filename: '配送单',
        autoWidth: true,
      })
    })
  })
}

// 页面加载时
onMounted(() => {
  getListData()
  getShopListData()
  getPrintTemplateData()
})

// 暴露变量
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
</style>
