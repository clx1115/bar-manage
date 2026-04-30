<template>
  <div class="page-container layout-padding">
    <el-card shadow="hover" v-loading="loading" class="layout-padding-auto">
      <el-descriptions class="margin-top" :column="3" size="default" border>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              售后编号
            </div>
          </template>
          {{ detail.returnsNo }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              订单编号
            </div>
          </template>
          <router-link :to="`/order/detail?orderId=${detail.orderId}`">
            {{ detail.orderNo }}
          </router-link>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              售后状态
            </div>
          </template>
          {{ formatAfterSalesStatus(detail.status) }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              申请用户
            </div>
          </template>
          {{ detail.userName }}(UID:{{ detail.uid }})
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              申请时间
            </div>
          </template>
          {{ formatDate(detail.createTime, 'YYYY-mm-dd HH:MM:SS') }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              售后类型
            </div>
          </template>
          {{ detail.state === 1 ? '退款' : '退货退款' }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              申请理由
            </div>
          </template>
          {{ detail.reason }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              补充说明
            </div>
          </template>
          {{ detail.remark }}
        </el-descriptions-item>
      </el-descriptions>
      <el-row type="flex">
        <div class="img-list">
          <div v-for="(item, index) in detail.returnsImageList" :key="index" class="img-item">
            <el-image style="width: 100px; height: 100px" :src="item" :preview-src-list="[item]" />
          </div>
        </div>
      </el-row>
      <div class="detail-box">
        <el-table :data="detailList" style="width: 100%;" class="mt20">
          <el-table-column prop="productName" label="商品名称" min-width="180" show-overflow-tooltip />
          <el-table-column label="商品单价" width="150">
            <template #default="{ row }">
              {{ parseMoney(row.productPrice) }}
            </template>
          </el-table-column>
          <el-table-column prop="returnAmount" label="退货数量" width="200"></el-table-column>
        </el-table>
      </div>
      <el-row justify="end" class="mt20 row-item">
        退款金额：<div class="realPay">{{ parseMoney(detail.returnMoney) }}</div>
      </el-row>
      <div class="bottom">
        <template v-if="detail.status === 10">
          <el-button type="danger" @click="onOpenReject">拒绝</el-button>
          <el-button v-if="detail.state === 2" type="primary" @click="onHandleOrderReturn">同意申请</el-button>
          <el-button v-if="detail.state === 1" type="primary" @click="onHandleOrderRefund">同意退款</el-button>
        </template>
        <template v-if="detail.status === 30">
          <el-button type="danger" @click="onRejectOrderRefund">拒绝退款</el-button>
          <el-button type="primary" @click="onHandleOrderRefund">同意退款</el-button>
        </template>
      </div>
    </el-card>
    <rejectDialog ref="rejectDialogRef" @refresh="getOrderDetailData" />
  </div>
</template>

<script setup lang="ts" name="orderDetail">
import { defineAsyncComponent, reactive, toRefs, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getAfterSalesDetail, handleOrderReturn, handleOrderRefund, rejectOrderRefund } from '@/api/afterSales/index'
import { formatDate } from '@/utils/formatTime'
import { formatAfterSalesStatus, parseMoney } from '@/utils/filters'
import { ElMessageBox, ElMessage } from 'element-plus'


// 引入组件
const rejectDialog = defineAsyncComponent(
  () => import('./component/reject.vue')
)

// 定义变量
const rejectDialogRef = ref()
const state = reactive({
  loading: false,
  detail: {} as any,
  detailList: [] as any,
})

const { loading, detail, detailList } = toRefs(state)
const router = useRouter()

const normalizeDetailList = (res: any) => {
  const source = Array.isArray(res.orderReturnsDetailList) && res.orderReturnsDetailList.length
    ? res.orderReturnsDetailList
    : Array.isArray(res.orderDetailList)
      ? res.orderDetailList
      : []

  return source.map((item: any) => ({
    ...item,
    returnAmount: item.returnAmount ?? item.returnNumber ?? item.number ?? 0,
  }))
}

// 获取订单详情
const getOrderDetailData = () => {
  state.loading = true
  getAfterSalesDetail({
    id: router.currentRoute.value.query.returnId,
  }).then((res) => {
    state.loading = false
    state.detail = res
    state.detailList = normalizeDetailList(res)
  })
}



//处理退货
const onHandleOrderReturn = (e: number) => {
  ElMessageBox.confirm(`是否确认操作?`, '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      handleOrderReturn({
        returnOrderId: state.detail.id,
        returnOrderStatus: 20
      }).then(() => {
        getOrderDetailData()
        ElMessage.success('操作成功')
      })
    })
    .catch(() => { })
}

//同意退款
const onHandleOrderRefund = () => {
  ElMessageBox.confirm(`是否确认操作?`, '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      handleOrderRefund({
        returnOrderId: state.detail.id,
      }).then(() => {
        getOrderDetailData()
        ElMessage.success('操作成功')
      })
    })
    .catch(() => { })
}

//拒绝退款
const onRejectOrderRefund = () => {
  ElMessageBox.confirm(`是否确认拒绝退款?`, '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      rejectOrderRefund({
        returnOrderId: state.detail.id,
      }).then(() => {
        getOrderDetailData()
        ElMessage.success('操作成功')
      })
    })
    .catch(() => { })
}

// 打开拒绝退货退款弹窗
const onOpenReject = () => {
  rejectDialogRef.value.openDialog(state.detail.id)
}

// 页面加载时
onMounted(() => {
  getOrderDetailData()
})
</script>
<style lang="scss" scoped>
.detail-box {
  max-height: 400px;
}

.realPay {
  font-size: 24px;
  font-weight: 700;
}

.row-item {
  display: flex;
  align-items: center;
}

.layout-padding-auto {
  position: relative;

  .bottom {
    position: absolute;
    width: 100%;
    bottom: 0;
    right: 0;
    display: flex;
    justify-content: flex-end;
    padding: 10px;
    background: #fff;
  }
}

.img-list {
  display: flex;

  .img-item {
    margin-right: 10px;
  }
}
</style>
