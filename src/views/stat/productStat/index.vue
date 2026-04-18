<template>
  <div class="page-container layout-padding">
    <el-card shadow="hover" class="layout-padding-auto">
      <el-form class="query" :inline="true" size="default" label-width="80px">
        <el-row>
          <el-form-item label="月份">
            <el-date-picker v-model="queryData.month" type="month" value-format="YYYYMM" @change="getListData" />
          </el-form-item>
        </el-row>
      </el-form>
      <el-table :data="salesStatList" v-loading="loading" border style="width: 100%">
        <el-table-column prop="categoryName" label="分类名字" min-width="150"></el-table-column>
        <el-table-column label="会员消费数量" min-width="200">
          <template #default="{ row }">
            {{ row.memberConsumeAmount }}
          </template>
        </el-table-column>
        <el-table-column label="非会员消费数量" min-width="200">
          <template #default="{ row }">
            {{ row.notMemberConsumeAmount }}
          </template>
        </el-table-column>
        <el-table-column label="会员消费金额" min-width="200">
          <template #default="{ row }">
            {{ parseMoney(row.memberConsumeMoney) }}
          </template>
        </el-table-column>
        <el-table-column label="非会员消费金额" min-width="200">
          <template #default="{ row }">
            {{ parseMoney(row.notMemberConsumeMoney) }}
          </template>
        </el-table-column>
        <el-table-column label="会员利润" min-width="200">
          <template #default="{ row }">
            {{ parseMoney(row.memberProfit) }}
          </template>
        </el-table-column>
        <el-table-column label="非会员利润" min-width="200">
          <template #default="{ row }">
            {{ parseMoney(row.notMemberProfit) }}
          </template>
        </el-table-column>
        <el-table-column label="消费数量小计" min-width="200">
          <template #default="{ row }">
            {{ row.consumeAmountSubtotal }}
          </template>
        </el-table-column>
        <el-table-column label="消费金额小计" min-width="200">
          <template #default="{ row }">
            {{ parseMoney(row.consumeMoneySubtotal) }}
          </template>
        </el-table-column>
        <el-table-column label="利润小计" min-width="200">
          <template #default="{ row }">
            {{ parseMoney(row.profitSubtotal) }}
          </template>
        </el-table-column>
      </el-table>
      <div class="page-bottom">
        <span>总利润：{{ parseMoney(totalProfit) }}</span>
        <span class="ml20">消费总数量：{{ totalConsumeAmount }}</span>
        <span class="ml20">消费总额：{{ parseMoney(totalConsumeMoney) }}</span>
      </div>
    </el-card>
  </div>
</template>
<script setup lang="ts">
import {
  reactive,
  onMounted,
  toRefs,
} from 'vue'
import { parseMoney } from '@/utils/filters'
import { getProductSalesStatList } from '@/api/stat/index'


const now = new Date();
const year = now.getFullYear();
let month: any = now.getMonth() + 1;
month = (month < 10) ? '0' + month : month;
// 定义变量
const defaultQuery = {
  month: year.toString() + month.toString(),
}
const state = reactive({
  loading: false,
  totalProfit: 0,
  totalConsumeAmount: 0,
  totalConsumeMoney: 0,
  salesStatList: [] as any,
  queryData: Object.assign({}, defaultQuery),
})

const { loading, totalProfit, totalConsumeAmount, totalConsumeMoney, salesStatList, queryData } =
  toRefs(state)


// 获取列表
const getListData = () => {
  state.loading = true
  const formData = JSON.parse(JSON.stringify(state.queryData))
  getProductSalesStatList({
    ...formData,
  }).then((data: any) => {
    state.loading = false
    state.salesStatList = data.salesStatList
    state.totalProfit = data.totalProfit
    state.totalConsumeAmount = data.totalConsumeAmount
    state.totalConsumeMoney = data.totalConsumeMoney
  })
}


// 页面加载时
onMounted(() => {
  getListData()
})
</script>

<style scoped lang="scss"></style>
