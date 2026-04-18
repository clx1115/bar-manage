<template>
  <div class="page-container layout-padding">
    <div class="card">
      <el-tabs>
        <el-tab-pane label="店铺收款对账">
          <ShopPayment />
        </el-tab-pane>
        <el-tab-pane label="收款对账明细">
          <PaymentState />
        </el-tab-pane>
        <el-tab-pane label="收银员收款对账">
          <CashierPayment />
        </el-tab-pane>
        <el-tab-pane label="店铺回款对账">
          <ShopCollection />
        </el-tab-pane>
        <el-tab-pane label="回款对账明细">
          <CollectionState />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toRefs, reactive, defineAsyncComponent } from 'vue'

const ShopPayment = defineAsyncComponent(
  () => import('./components/shopPayment/index.vue')
)

const PaymentState = defineAsyncComponent(
  () => import('./components/paymentState/index.vue')
)

const CashierPayment = defineAsyncComponent(
  () => import('./components/cashierPayment/index.vue')
)

const ShopCollection = defineAsyncComponent(
  () => import('./components/shopCollection/index.vue')
)

const CollectionState = defineAsyncComponent(
  () => import('./components/collectionState/index.vue')
)


// 定义变量
const state = reactive({

})

</script>

<style scoped lang="scss">
.card {
  background-color: white;
  padding: 16px 20px;

}

.flex {
  display: flex;
}
</style>
