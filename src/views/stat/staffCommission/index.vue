<template>
  <div class="page-container layout-padding">
    <el-card shadow="hover" class="layout-padding-auto">
      <el-form class="query" :inline="true" size="default" label-width="80px">
        <el-row>
          <el-form-item label="员工">
            <el-select v-model="queryData.uid" placeholder="选择员工" filterable clearable @change="getListData">
              <el-option v-for="item in userList" :key="item.id" :label="item.realName" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="日期">
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
        </el-row>
      </el-form>
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="section-title">充值提成</div>
          <el-table :data="depositSaleList" v-loading="loading" border style="width: 100%">
            <el-table-column label="序号" width="80">
              <template #default="scope">
                {{ scope.$index + 1 }}
              </template>
            </el-table-column>
            <el-table-column prop="levelName" label="目标产品"></el-table-column>
            <el-table-column label="金额" width="100">
              <template #default="{ row }">
                {{ parseMoney(row.depositAmount) }}
              </template>
            </el-table-column>
            <el-table-column label="产品提成" width="100">
              <template #default="{ row }">
                {{ row.awardRatio }}
              </template>
            </el-table-column>
            <el-table-column label="提成金额" width="100">
              <template #default="{ row }">
                {{ parseMoney(row.commission) }}
              </template>
            </el-table-column>
          </el-table>
        </el-col>
        <el-col :span="12">
          <div class="section-title">销售提成</div>
          <el-table :data="productSaleList" v-loading="loading" border style="width: 100%">
            <el-table-column label="序号" width="80">
              <template #default="scope">
                {{ scope.$index + 1 }}
              </template>
            </el-table-column>
            <el-table-column prop="productName" label="目标产品"></el-table-column>
            <el-table-column label="金额" width="100">
              <template #default="{ row }">
                {{ parseMoney(row.subTotal) }}
              </template>
            </el-table-column>
            <el-table-column label="产品提成" width="100">
              <template #default="{ row }">
                {{ row.ratio }}
              </template>
            </el-table-column>
            <el-table-column label="提成金额" width="100">
              <template #default="{ row }">
                {{ parseMoney(row.commission) }}
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <div class="page-bottom">
        <span>提成总额：{{ parseMoney(totalAward) }}</span>
        <span class="ml20">充值提成：{{ parseMoney(totalMemberAward) }}</span>
        <span class="ml20">销售提成：{{ parseMoney(productAward) }}</span>
      </div>
    </el-card>
  </div>
</template>
<script setup lang="ts">
import {
  reactive,
  onMounted,
  ref,
  toRefs,
  watch,
} from 'vue'
import { parseMoney } from '@/utils/filters'
import { getStaffCommissionList } from '@/api/stat/index'
import { getUserList } from '@/api/system/user/index'
import getPeriod from '@/utils/getPeriod'

const period = new getPeriod();

// 定义变量
const defaultQuery = {
  uid: 0,
  beginTime: 0,
  endTime: 0,
}
const timeRange = ref([period.getMonthStartDateTimestamp(), period.getMonthEndDateTimestamp()])
const state = reactive({
  userList: [] as any,
  loading: false,
  totalMemberAward: 0,
  productAward: 0,
  totalAward: 0,
  depositSaleList: [] as any,
  productSaleList: [] as any,
  queryData: Object.assign({}, defaultQuery),
})

const { userList, loading, totalMemberAward, totalAward, productAward, depositSaleList, productSaleList, queryData } =
  toRefs(state)

watch(timeRange, (newValue: any) => {
  console.log(newValue)
  if (newValue && newValue[0] && newValue[1]) {
    state.queryData.beginTime = newValue[0] || 0
    state.queryData.endTime =
      (newValue[1] + 24 * 60 * 60 * 1000 - 1000) || 0
  } else {
    state.queryData.beginTime = 0
    state.queryData.endTime = 0
  }
},
  {
    immediate: true,
  })

// 获取员工列表
const getUserListData = () => {
  getUserList().then((data: any) => {
    state.userList = data.list
    state.queryData.uid = data.list[0].id
    getListData()
  })
}


// 获取列表
const getListData = () => {
  state.loading = true
  const formData = JSON.parse(JSON.stringify(state.queryData))
  getStaffCommissionList({
    ...formData,
  }).then((data: any) => {
    state.loading = false
    state.depositSaleList = data.depositSaleList
    state.productSaleList = data.productSaleList
    state.totalMemberAward = data.totalMemberAward
    state.productAward = data.productAward
    state.totalAward = data.totalAward
  })
}


// 页面加载时
onMounted(() => {
  getUserListData()
})
</script>

<style scoped lang="scss">
.section-title {
  margin: 10px 0;
  font-weight: 700;
  text-align: center;
  font-size: 16px;
}
</style>
