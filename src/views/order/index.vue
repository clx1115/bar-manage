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
            <el-select v-model="queryData.source" size="default" placeholder="订单来源" clearable style="width:100px">
              <el-option label="全部" :value="0" />
              <el-option label="门店" :value="1" />
              <el-option label="小程序" :value="2" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="queryData.shopId" placeholder="选择店铺" filterable clearable style="width:130px">
              <el-option v-for="item in shopList" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="queryData.payMethod" size="default" placeholder="支付方式" clearable style="width:130px">
              <el-option label="全部" :value="0" />
              <el-option v-for="item in payMethodList" :key="item.id" :label="item.name" :value="item.attrValue" />
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
        <el-table-column prop="orderNo" label="订单编号" min-width="180" show-overflow-tooltip></el-table-column>
        <el-table-column label="用户信息" show-overflow-tooltip width="180">
          <template #default="{ row }">
            <span v-if="row.uid">{{ row.userName }}(UID:{{ row.uid }})</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column label="订单来源" width="120">
          <template #default="{ row }">
            {{ formatOrderSource(row.source) }}
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
        <el-table-column prop="payMethodName" label="支付方式" width="100"></el-table-column>
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
  name: "orderIndex",
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
import { getOrderList, cancelOrder, batchOrderDelievered, getOrderCount, getPrintTemplate } from '@/api/order/index'
import { getShopList } from '@/api/shop/index'
import { getPayMethodList } from '@/api/system/payMethod/index'
import { formatDeliveryType, formatOrderSource } from '@/dict/order'
import { formatOrderStatus, parseMoney, formatAfterSalesStatus } from '@/utils/filters'
import { ElMessageBox, ElMessage } from 'element-plus'
import { storeToRefs } from 'pinia'
import { useUserInfo } from '@/stores/userInfo'

const stores = useUserInfo()
const { userInfos } = storeToRefs(stores) as any

// 引入组件
const printOrder = defineAsyncComponent(
  () => import('./component/print.vue')
)

// 定义变量
const defaultQuery = {
  status: 0,
  orderNo: '',
  uid: '',
  userName: '',
  phoneNumber: '',
  orderType: '',
  beginTime: 0,
  endTime: 0,
  dealerUid: '',
  payMethod: 0,
  shopId: '',
  source: 0
}
const beginTime = new Date(new Date().toLocaleDateString()).getTime()
const timeRange = ref([beginTime, beginTime])
const printOrderRef = ref()
const state = reactive({
  list: [],
  loading: false,
  currentPage: 1,
  totalPage: 1,
  queryData: Object.assign({}, defaultQuery),
  submitData: {},
  exportLoading: false,
  selectedList: [],
  count: {} as any,
  shopList: [] as any,
  payMethodList: [] as any,
  printTemplate: ''
})

const { list, loading, currentPage, totalPage, queryData, exportLoading, selectedList, count, shopList, payMethodList } =
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

// 获取订单状态数量
const getOrderCountData = () => {
  getOrderCount().then((data: any) => {
    state.count = data
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

// 获取支付方式列表
const getPayMethodListData = () => {
  state.loading = true
  getPayMethodList().then((data: any) => {
    state.payMethodList = data.list
  })
}

//订单打印
const onPrintOrder = (row: any) => {
  if (!state.printTemplate) {
    return ElMessage.warning('暂无打印模板')
  }
  printOrderRef.value.printOrder(state.printTemplate, row.id)
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

//取消订单
const onCancelOrder = (row: any) => {
  ElMessageBox.confirm(
    `您正在取消订单，是否继续?`,
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

// 批量发货
const onBatchOrderDelievered = () => {
  ElMessageBox.confirm(
    `您正在操作批量发货订单，是否继续?`,
    '提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      const list = [] as any
      state.selectedList.forEach((item: any) => {
        list.push({
          orderId: item.id,
          expressNo: '自营配送',
          expressCompany: '自营'
        })
      })
      batchOrderDelievered({
        list: list,
      }).then(() => {
        getListData()
        getOrderCountData()
        ElMessage.success('批量发货成功')
      })
    })
    .catch(() => { })

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
        'uid',
        'userName',
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
      console.log(tableData)
      const tableBody = tableData.map((v: any) => filterVal.map((j) => v[j]))
      state.exportLoading = false
      exportJsonToExcel({
        header: tableHead,
        data: tableBody,
        filename: '订单记录',
        autoWidth: true,
      })
    })
  })
}

// 页面加载时
onMounted(() => {
  getListData()
  getOrderCountData()
  getShopListData()
  getPayMethodListData()
  getPrintTemplateData()
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
