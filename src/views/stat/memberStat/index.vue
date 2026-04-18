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
      <el-table :data="memberStatList" v-loading="loading" border style="width: 100%">
        <el-table-column prop="levelName" label="等级名称" width="150"></el-table-column>
        <el-table-column label="会员数量" min-width="200">
          <template #default="{ row }">
            {{ row.memberCards }}
          </template>
        </el-table-column>
        <el-table-column label="充值金额" min-width="200">
          <template #default="{ row }">
            {{ parseMoney(row.depositAmount) }}
          </template>
        </el-table-column>
        <el-table-column label="会员余额" min-width="200">
          <template #default="{ row }">
            {{ parseMoney(row.leftBalanceAmount) }}
          </template>
        </el-table-column>
        <el-table-column label="消费金额" min-width="200">
          <template #default="{ row }">
            {{ parseMoney(row.consumeAmount) }}
          </template>
        </el-table-column>
        <el-table-column label="员工抽成金额" min-width="200">
          <template #default="{ row }">
            {{ parseMoney(row.staffAwardAmount) }}
          </template>
        </el-table-column>
        <el-table-column label="利润" min-width="200">
          <template #default="{ row }">
            {{ parseMoney(row.profit) }}
          </template>
        </el-table-column>
      </el-table>
      <div class="page-bottom">
        <span>开卡会员总数：{{ totalMemberCards }}</span>
        <span class="ml20">充值总额：{{ parseMoney(totalDepositAmount) }}</span>
        <span class="ml20">消费总额：{{ parseMoney(totalConsumeAmount) }}</span>
        <span class="ml20">会员余额总额：{{ parseMoney(totalLeftBalanceAmount) }}</span>
        <span class="ml20">总利润：{{ parseMoney(totalProfit) }}</span>
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
import { getMemberStatList } from '@/api/stat/index'

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
  totalMemberCards: 0,
  totalDepositAmount: 0,
  totalConsumeAmount: 0,
  totalLeftBalanceAmount: 0,
  totalProfit: 0,
  memberStatList: [] as any,
  queryData: Object.assign({}, defaultQuery),
})

const { loading, totalMemberCards, totalDepositAmount, totalConsumeAmount, totalLeftBalanceAmount, totalProfit, memberStatList, queryData } =
  toRefs(state)


// 获取列表
const getListData = () => {
  state.loading = true
  const formData = JSON.parse(JSON.stringify(state.queryData))
  getMemberStatList({
    ...formData,
  }).then((data: any) => {
    state.loading = false
    state.memberStatList = data.memberStatList
    state.totalMemberCards = data.totalMemberCards
    state.totalDepositAmount = data.totalDepositAmount
    state.totalConsumeAmount = data.totalConsumeAmount
    state.totalLeftBalanceAmount = data.totalLeftBalanceAmount
    state.totalProfit = data.totalProfit
  })
}


// 页面加载时
onMounted(() => {
  getListData()
})
</script>

<style scoped lang="scss"></style>
