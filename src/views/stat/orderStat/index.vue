<template>
  <div class="page-container layout-padding">
    <el-card shadow="hover" class="layout-padding-auto">
      <el-form class="query" :inline="true" size="default" label-width="80px">
        <el-row>
          <el-form-item label="商品名称">
            <el-input v-model="queryData.productName" size="default" placeholder="商品名称" clearable>
            </el-input>
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
          <el-form-item>
            <el-button size="default" @click="refreshQuery">
              <el-icon>
                <ele-Refresh />
              </el-icon>
              重置
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
      <el-table :data="list" v-loading="loading" style="width: 100%">
        <el-table-column prop="productName" label="商品名称"></el-table-column>
        <el-table-column prop="skuName" label="规格名称"></el-table-column>
        <el-table-column prop="number" label="销售数量" width="200"></el-table-column>
        <el-table-column label="销售金额" width="200">
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
      <div class="page-bottom">
        <span>销售总额：{{ parseMoney(totalMoney) }}</span>
        <span class="ml20">总利润：{{ parseMoney(totalProfit) }}</span>
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
import { orderListAgg } from '@/api/stat/index'

// 定义变量
const defaultQuery = {
  productName: '',
  beginTime: 0,
  endTime: 0,
}
const beginTime = new Date(new Date().toLocaleDateString()).getTime()
const timeRange = ref([beginTime, beginTime])
const state = reactive({
  list: [],
  loading: false,
  totalMoney: 0,
  totalProfit: 0,
  queryData: Object.assign({}, defaultQuery),
  exportLoading: false,
})

const { list, loading, totalMoney, totalProfit, queryData, exportLoading } =
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
  const formData = JSON.parse(JSON.stringify(state.queryData))
  orderListAgg({
    ...formData,
  }).then((data: any) => {
    state.loading = false
    state.list = data.list
    state.totalMoney = data.total
    state.totalProfit = data.totalProfit
  })
}


//导出表格
const downloadFile = () => {
  import('@/utils/export.js').then((excel) => {
    state.exportLoading = true
    const tableData = state.list.map((item: any) => {
      item.subTotal = Number(item.subTotal / 100)
      item.subProfit = Number(item.subProfit / 100)
      return item
    })
    const exportJsonToExcel = excel.export_json_to_excel
    const tableHead = [
      '商品名称',
      '规格名称',
      '销售数量',
      '销售金额',
      '利润',
    ]
    const filterVal = [
      'productName',
      'skuName',
      'number',
      'subTotal',
      'subProfit',
    ]
    const tableBody = tableData.map((v: any) => filterVal.map((j) => v[j]))
    state.exportLoading = false
    exportJsonToExcel({
      header: tableHead,
      data: tableBody,
      filename: '商品销售统计',
      autoWidth: true,
    })
  })
}

//重置搜索条件
const refreshQuery = () => {
  getListData()
}

// 页面加载时
onMounted(() => {
  getListData()
})
</script>

<style scoped lang="scss"></style>
