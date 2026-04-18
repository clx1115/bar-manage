<template>
  <div class="page-container layout-padding">
    <el-card shadow="hover" class="layout-padding-auto">
      <el-form class="query" :inline="true" size="default" label-width="90px">
        <el-row>
          <el-form-item label="商品ID">
            <el-input v-model="queryData.productId" size="default" placeholder="商品ID" style="width:120px" clearable>
            </el-input>
          </el-form-item>
          <el-form-item label="商品名称">
            <el-input v-model="queryData.productName" size="default" placeholder="商品名称" clearable>
            </el-input>
          </el-form-item>
          <el-form-item label="规格ID">
            <el-input v-model="queryData.skuId" size="default" placeholder="规格ID" style="width:120px" clearable>
            </el-input>
          </el-form-item>
          <el-form-item label="规格名称">
            <el-input v-model="queryData.skuName" size="default" placeholder="规格名称" clearable>
            </el-input>
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
        </el-row>
        <el-row>
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
        <el-table-column prop="productId" label="商品ID" width="100"></el-table-column>
        <el-table-column prop="productName" label="商品名称" show-overflow-tooltip />
        <el-table-column prop="skuId" label="规格ID" />
        <el-table-column prop="skuName" label="规格名称" show-overflow-tooltip />
        <el-table-column prop="skuId" label="仓库名称" width="150" />
        <el-table-column prop="stock" label="库存数量" width="150" />
        <el-table-column fixed="right" label="操作" width="100">
          <template #default="{ row }">
            <router-link :to="`/stock/log?skuId=${row.skuId}`" class="mr10">
              <el-button size="small" text type="primary">库存日志</el-button>
            </router-link>
          </template>
        </el-table-column>
      </el-table>
      <div class="page-bottom">
        <el-pagination v-model:currentPage="currentPage" background layout="prev, pager, next, jumper" :page-count="totalPage" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted, toRefs } from 'vue'
import { getStockList } from '@/api/stock/index'

const defaultQuery = {
  productId: '',
  skuId: '',
  stockId: '',
  productName: '',
  skuName: '',
}

// 定义变量
const state = reactive({
  list: [],
  loading: false,
  currentPage: 1,
  totalPage: 1,
  queryData: Object.assign({}, defaultQuery),
  submitData: {},
  exportLoading: false,
})

const {
  list,
  loading,
  currentPage,
  totalPage,
  queryData,
  exportLoading,
} = toRefs(state)


// 获取列表
const getListData = () => {
  state.loading = true
  if (JSON.stringify(state.queryData) !== JSON.stringify(state.submitData)) {
    state.currentPage = 1
  }
  const formData = JSON.parse(JSON.stringify(state.queryData))
  getStockList({
    page: state.currentPage,
    ...formData,
  }).then((data: any) => {
    state.loading = false
    state.list = data.list
    if (state.currentPage === 1 && data.pages > 0) {
      state.totalPage = data.pages
    }
    state.submitData = JSON.parse(JSON.stringify(state.queryData))
  })
}

const handleSizeChange = () => {
  getListData()
}

const handleCurrentChange = () => {
  getListData()
}

//重置搜索条件
const refreshQuery = () => {
  state.queryData = Object.assign({}, defaultQuery)
  getListData()
}

//导出表格
const downloadFile = () => {
  import('@/utils/export.js').then((excel) => {
    state.exportLoading = true
    getStockList({ page: 0, ...state.submitData }).then((data) => {
      const exportJsonToExcel = excel.export_json_to_excel
      const tableHead = [
        '商品ID',
        '商品名称',
        '规格ID',
        '规格名称',
        '仓库名称',
        '库存数量',
      ]
      const filterVal = [
        'productId',
        'productName',
        'skuId',
        'skuName',
        'stockNo',
        'stock',
      ]
      const tableBody = data.chargeList.map((v: any) => filterVal.map((j) => v[j]))
      state.exportLoading = false
      exportJsonToExcel({
        header: tableHead,
        data: tableBody,
        filename: '商品库存记录',
        autoWidth: true,
      })
    })
  })
}

// 页面加载时
onMounted(() => {
  getListData()
})
</script>

<style scoped lang="scss"></style>
