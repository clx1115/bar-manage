<template>
  <div class="page-container layout-padding">
    <el-card shadow="hover" class="layout-padding-auto">
      <el-form class="query" :inline="true" size="default" label-width="80px">
        <el-row>
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
        <el-col :span="6">
          <el-table :data="staffSaleList" v-loading="loading" border style="width: 100%">
            <el-table-column prop="staffName" label="员工" width="100"></el-table-column>
            <el-table-column label="提成金额" min-width="200">
              <template #default="{ row }">
                {{ parseMoney(row.commission) }}
              </template>
            </el-table-column>
          </el-table>
          <div class="mt20">
            <span>提成总额：{{ parseMoney(totalAward) }}</span>
          </div>
        </el-col>
        <el-col :span="18">
          <el-table :data="productSaleList" v-loading="loading" border style="width: 100%">
            <el-table-column label="销售日期" width="200">
              <template #default="{ row }">
                {{ row.date }}
              </template>
            </el-table-column>
            <el-table-column label="商品名字" min-width="200">
              <template #default="{ row }">
                {{ row.productName }}
              </template>
            </el-table-column>
            <el-table-column label="销售额" width="100">
              <template #default="{ row }">
                {{ parseMoney(row.subTotal) }}
              </template>
            </el-table-column>
            <el-table-column label="提成比例" width="100">
              <template #default="{ row }">
                {{ row.ratio }}
              </template>
            </el-table-column>
            <el-table-column label="提成金额" width="100">
              <template #default="{ row }">
                {{ parseMoney(row.commission) }}
              </template>
            </el-table-column>
            <el-table-column label="员工" width="150">
              <template #default="{ row }">
                {{ row.staffName }}
              </template>
            </el-table-column>
            <el-table-column label="客户" width="150">
              <template #default="{ row }">
                {{ row.userName }}
              </template>
            </el-table-column>
            <el-table-column label="数量" width="100">
              <template #default="{ row }">
                {{ row.number }}
              </template>
            </el-table-column>
            <el-table-column label="结算价" width="100">
              <template #default="{ row }">
                {{ parseMoney(row.resultPrice) }}
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>

    </el-card>
  </div>
</template>
<script setup lang="ts">
import {
  reactive,
  onMounted,
  toRefs,
  ref,
  watch
} from 'vue'
import { parseMoney } from '@/utils/filters'
import { getStaffCommissionStatList } from '@/api/stat/index'


// 定义变量
const defaultQuery = {
  beginTime: 0,
  endTime: 0,
}
const beginTime = new Date(new Date().toLocaleDateString()).getTime()
const timeRange = ref([beginTime, beginTime])
const state = reactive({
  loading: false,
  totalAward: 0,
  staffSaleList: [] as any,
  queryData: Object.assign({}, defaultQuery),
  productSaleList: [] as any,
})

const { loading, totalAward, staffSaleList, queryData, productSaleList } =
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
  getStaffCommissionStatList(state.queryData).then((data: any) => {
    state.loading = false
    state.staffSaleList = data.staffSaleList
    state.productSaleList = data.productSaleList
    state.totalAward = data.totalAward
  })
}


// 页面加载时
onMounted(() => {
  getListData()
})
</script>

<style scoped lang="scss"></style>
