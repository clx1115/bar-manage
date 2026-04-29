<template>
  <div class="page-container layout-padding">
    <el-card shadow="hover" v-loading="loading" class="layout-padding-auto">
      <el-tabs type="border-card">
        <el-tab-pane label="订单信息">
          <el-descriptions class="margin-top" :column="3" size="default" border>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  订单编号
                </div>
              </template>
              {{ detail.orderNo }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  订单状态
                </div>
              </template>
              {{ formatOrderStatus(detail.status) }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  售后状态
                </div>
              </template>
              {{ formatAfterSalesStatus(detail.postServiceStatus) }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  配送方式
                </div>
              </template>
              <span>{{ formatDeliveryType(detail.deliveryType) }}</span>
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  支付方式
                </div>
              </template>
              <span>{{ detail.payMethodName }}</span>
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  用户姓名
                </div>
              </template>
              <span v-if="detail.uid">{{ detail.userName }}(UID:{{ detail.uid }})</span>
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  用户卡号
                </div>
              </template>
              {{ detail.memberNo }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  手机号码
                </div>
              </template>
              {{ detail.phoneNumber }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  订单类型
                </div>
              </template>
              {{ detail.orderType === 3 ? "充值" : "消费" }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  订单来源
                </div>
              </template>
              {{ formatOrderSource(detail.source) }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  店铺
                </div>
              </template>
              {{ detail.shopName }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  包厢(桌号)
                </div>
              </template>
              {{ detail.tableNo }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  订单总额
                </div>
              </template>
              {{ parseMoney(detail.totalMoney) }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  实付金额
                </div>
              </template>
              {{ parseMoney(detail.realPay) }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  下单时间
                </div>
              </template>
              {{ formatDate(detail.createTime, 'YYYY-mm-dd HH:MM:SS') }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  结算时间
                </div>
              </template>
              <span v-if="detail.payTime">{{ formatDate(detail.payTime, 'YYYY-mm-dd HH:MM:SS') }}</span>
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  下单备注
                </div>
              </template>
              <span v-if="detail.description">{{ detail.description }}</span>
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  订单备注
                </div>
              </template>
              <span v-if="detail.note">{{ detail.note }}</span>
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  操作人
                </div>
              </template>
              {{ detail.operatorName }}
            </el-descriptions-item>
            <template v-if="detail.deliveryType === 2 || detail.deliveryType === 4">
              <el-descriptions-item>
                <template #label>
                  <div class="cell-item">
                    收货人
                  </div>
                </template>
                {{ address.name }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template #label>
                  <div class="cell-item">
                    收货电话
                  </div>
                </template>
                {{ address.telephone }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template #label>
                  <div class="cell-item">
                    收货地址
                  </div>
                </template>
                {{ address.details }}{{ address.address }}
              </el-descriptions-item>
            </template>
          </el-descriptions>
        </el-tab-pane>
        <el-tab-pane label="商品信息" v-if="userInfos.roles[0] === 'admin' || userInfos.roles[0] === 'director' || userInfos.roles[0] === 'finance' || userInfos.roles[0] === 'cashier'">
          <el-row v-if="detail.status >= 20 && detail.status < 30" justify="end" style="margin-top: 20px;">
            <el-button size="default" type="primary" @click="onOpenDelivery">
              发货
            </el-button>
          </el-row>
          <el-table :data="detailList" style="width: 100%; ">
            <el-table-column prop="productId" label="商品ID" width="100" />
            <el-table-column prop="productName" label="商品名称" min-width="180" show-overflow-tooltip>
              <template #default="{ row }">
                {{ row.productName }} {{ row.skuName }}
              </template>
            </el-table-column>
            <el-table-column label="商品单价" width="150">
              <template #default="{ row }">
                {{ parseMoney(row.productPrice) }}
              </template>
            </el-table-column>
            <el-table-column label="结算价" width="150">
              <template #default="{ row }">
                {{ parseMoney(row.resultPrice) }}
              </template>
            </el-table-column>
            <el-table-column prop="number" label="商品总数量" width="120"></el-table-column>
            <el-table-column label="商品总价" width="100">
              <template #default="{ row }">
                {{ parseMoney(row.subTotal) }}
              </template>
            </el-table-column>
            <el-table-column prop="number" label="已发货数量" width="120"></el-table-column>
            <el-table-column label="待发货数量" width="150">
              <template #default="{ row }">
                {{ row.shippedNumber }}
              </template>
            </el-table-column>
            <el-table-column prop="returnNumber" label="退货数量" width="100"></el-table-column>
          </el-table>
          <el-row justify="end" class="mt20 row-item">
            订单总额：{{ parseMoney(detail.totalMoney) }} <span v-if="detail.discountMoney">优惠券：-{{ parseMoney(detail.discountMoney) }}</span> 实付金额：<div class="realPay">{{ parseMoney(detail.realPay) }}</div>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="订单记录" v-if="userInfos.roles[0] === 'admin' || userInfos.roles[0] === 'director' || userInfos.roles[0] === 'finance' || userInfos.roles[0] === 'cashier'">
          <el-table :data="detail.orderLogs" style="width: 100%; margin-bottom: 10px;">
            <el-table-column prop="note" label="描述" min-width="100" />
            <el-table-column label="时间" width="200">
              <template #default="{ row }">
                {{ formatDate(row.createTime, 'YYYY-mm-dd HH:MM:SS') }}
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <deliveryDialog ref="deliveryDialogRef" @refresh="getOrderDetailData" />
  </div>
</template>

<script setup lang="ts" name="orderDetail">
import { defineAsyncComponent, reactive, toRefs, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getOrderDetail } from '@/api/order/index'
import { formatDate } from '@/utils/formatTime'
import { formatOrderStatus, formatAfterSalesStatus, parseMoney } from '@/utils/filters'
import { formatDeliveryType, formatOrderSource } from '@/dict/order'
import { storeToRefs } from 'pinia'
import { useUserInfo } from '@/stores/userInfo'

const stores = useUserInfo()
const { userInfos } = storeToRefs(stores) as any

// 引入组件
const deliveryDialog = defineAsyncComponent(
  () => import('./component/delivery.vue')
)

// 定义变量
const deliveryDialogRef = ref()
const state = reactive({
  loading: false,
  detail: {} as any,
  savePrice: false,
  detailList: [] as any,
  address: {} as any,
})

const { loading, detail, detailList, address } = toRefs(state)
const router = useRouter()

const normalizeAddress = (source: any) => {
  if (!source) return {}
  if (source.address) {
    try {
      return JSON.parse(source.address)
    } catch (error) {
      return source
    }
  }
  return {
    name: source.userName ?? '',
    telephone: source.telephone ?? '',
    details: `${source.province ?? ''}${source.city ?? ''}${source.details ?? ''}`,
    address: '',
    postcode: source.postcode ?? '',
  }
}

const normalizeDetailList = (source: any[] = []) => source.map((item: any) => ({
  ...item,
  productName: item.productName ?? item.merchantName ?? '',
  skuName: item.skuName ?? item.attributeName ?? item.attributeDetails ?? item.attributes ?? '',
  productPrice: item.productPrice ?? item.price ?? 0,
  resultPrice: item.resultPrice ?? item.price ?? 0,
  subTotal: item.subTotal ?? item.eachTotalMoney ?? 0,
  number: item.number ?? item.amount ?? 0,
  shippedNumber: item.shippedNumber ?? item.number ?? item.amount ?? 0,
}))

const normalizeLogList = (source: any[] = []) => source.map((item: any) => ({
  ...item,
  createTime: item.createTime ?? item.createdTime ?? item.updateTime ?? item.updatedTime ?? 0,
}))

const normalizeOrderDetail = (source: any) => ({
  ...source,
  detailList: normalizeDetailList(source.detailList ?? source.merchantList ?? []),
  orderLogs: normalizeLogList(Array.isArray(source.orderLogs) ? source.orderLogs : []),
  phoneNumber: source.phoneNumber ?? source.addressDetail?.telephone ?? '',
  userName: source.userName ?? source.addressDetail?.userName ?? '',
  createTime: source.createTime ?? source.createdTime ?? 0,
  updateTime: source.updateTime ?? source.updatedTime ?? 0,
  payTime: source.payTime ?? source.paidTime ?? 0,
})

// 获取订单详情
const getOrderDetailData = () => {
  state.loading = true
  getOrderDetail({
    id: router.currentRoute.value.query.orderId,
  }).then((res) => {
    const detailData = normalizeOrderDetail(res)
    state.detailList = detailData.detailList
    state.address = normalizeAddress(res.orderReceiveDetail ?? res.addressDetail)
    state.detail = detailData
  }).finally(() => {
    state.loading = false
  })
}


// 打开发货弹窗
const onOpenDelivery = () => {
  deliveryDialogRef.value.openDialog(state.detail.id, state.detailList)
}

// 页面加载时
onMounted(() => {
  getOrderDetailData()
})
</script>
<style lang="scss" scoped>
.realPay {
  font-size: 24px;
  font-weight: 700;
}

.row-item {
  display: flex;
  align-items: center;
}
</style>
