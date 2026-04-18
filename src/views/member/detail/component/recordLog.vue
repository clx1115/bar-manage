<template>
  <div>
    <el-table :data="list" v-loading="loading" height="400" style="width: 100%">
      <el-table-column prop="productName" label="商品名称"></el-table-column>
      <el-table-column prop="skuName" label="规格名称"></el-table-column>
      <el-table-column prop="number" label="消费数量" width="200"></el-table-column>
      <el-table-column label="消费金额" width="200">
        <template #default="{ row }">
          {{ parseMoney(row.subTotal) }}
        </template>
      </el-table-column>
      <el-table-column label="利润" width="200">
        <template #default="{ row }">
          {{ parseMoney(row.subProfit) }}
        </template>
      </el-table-column>
    </el-table>
    <div class="mt20">
      <span>消费总额：{{ parseMoney(totalMoney) }}</span>
      <span class="ml20">总利润：{{ parseMoney(totalProfit) }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, toRefs, onMounted } from 'vue'
import { parseMoney } from '@/utils/filters'
import { orderListAgg } from '@/api/stat/index'

const props = defineProps({
  uid: {
    type: Number,
    default: 0,
  }
})

// 定义变量内容
const state = reactive({
  list: [],
  loading: false,
  totalMoney: 1,
  totalProfit: 0,
})

const { list, loading, totalMoney, totalProfit } = toRefs(state)

// 获取列表
const getListData = () => {
  state.loading = true
  orderListAgg({
    uid: props.uid
  }).then((data: any) => {
    state.loading = false
    state.list = data.list
    state.totalMoney = data.total
    state.totalProfit = data.totalProfit
  })
}


// 页面加载时
onMounted(() => {
  getListData()
})
</script>
<style lang="scss" scoped></style>