<template>
  <div class="page-container layout-padding">
    <el-card shadow="hover" class="layout-padding-auto">
      <el-form class="query" :inline="true" size="default" label-width="80px">
        <el-row>
          <el-form-item label="年度">
            <el-date-picker v-model="queryData.year" type="year" clearable value-format="YYYY" @change="getListData" />
          </el-form-item>
        </el-row>
      </el-form>
      <el-tabs v-model="activeName">
        <el-tab-pane v-for="(item, index) in monthNodes" :key="index" :label="item.date" :name="item.date">
          <div class="mt10 mb10">
            <span>总收入：{{ parseMoney(item.totalIncome) }}</span>
            <span class="ml20">总支出：{{ parseMoney(item.totalOutCome) }}</span>
            <span class="ml20">利润总额：{{ parseMoney(item.totalProfit) }}</span>
          </div>
          <el-row :gutter="20">
            <el-col :span="12">
              <div class="section-title">收入</div>
              <el-table :data="item.incomeNodes" v-loading="loading" border style="width: 100%">
                <el-table-column label="序号" width="100">
                  <template #default="scope">
                    {{ scope.$index + 1 }}
                  </template>
                </el-table-column>
                <el-table-column prop="categoryName" label="类目"></el-table-column>
                <el-table-column label="金额" width="200">
                  <template #default="{ row }">
                    {{ parseMoney(row.amount) }}
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
            <el-col :span="12">
              <div class="section-title">支出</div>
              <el-table :data="item.outcomeNodes" v-loading="loading" border style="width: 100%">
                <el-table-column label="序号" width="100">
                  <template #default="scope">
                    {{ scope.$index + 1 }}
                  </template>
                </el-table-column>
                <el-table-column prop="categoryName" label="类目"></el-table-column>
                <el-table-column label="金额" width="200">
                  <template #default="{ row }">
                    {{ parseMoney(row.amount) }}
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>
<script setup lang="ts">
import {
  reactive,
  onMounted,
  toRefs,
  ref
} from 'vue'
import { parseMoney } from '@/utils/filters'
import { getYearStat } from '@/api/stat/index'


const now = new Date();
const year = now.getFullYear()
const monthIndex = now.getMonth()
const monthNames = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"]
// 定义变量
const defaultQuery = {
  year: year.toString()
}

const activeName = ref(monthNames[monthIndex])
const state = reactive({
  loading: false,
  monthNodes: [] as any,
  queryData: Object.assign({}, defaultQuery),
})

const { loading, monthNodes, queryData } = toRefs(state)


// 获取列表
const getListData = () => {
  state.loading = true
  const formData = JSON.parse(JSON.stringify(state.queryData))
  getYearStat({
    ...formData,
  }).then((data: any) => {
    state.loading = false
    state.monthNodes = data.monthNodes
  })
}


// 页面加载时
onMounted(() => {
  getListData()
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
