<template>
  <div class="page-container layout-padding">
    <el-card shadow="hover" class="layout-padding-auto">
      <el-form class="query" :inline="true" size="default" label-width="90px">
        <el-row>
          <el-form-item>
            <el-radio-group v-model="queryData.status" size="default" @change="getListData">
              <el-radio-button :label="0">全部</el-radio-button>
              <el-radio-button :label="1">已上架</el-radio-button>
              <el-radio-button :label="-1">已下架</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="关键字">
            <el-input v-model="queryData.filter" size="default" placeholder="关键字" clearable> </el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <el-cascader v-model="queryData.categoryId" :options="categoryList" clearable collapse-tags :props="{ value: 'id', label: 'name', multiple: false, emitPath: false }" style="width: 100%" placeholder="商品分类" @change="getListData" />
          </el-form-item>
          <el-form-item label="店铺">
            <el-select v-model="queryData.shopId" placeholder="选择店铺" filterable clearable>
              <el-option v-for="item in shopList" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
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
            <el-button :disabled="!selectedList.length" type="success" @click="batchStatus(1)">
              <el-icon>
                <ele-Upload />
              </el-icon>
              上架
            </el-button>
          </el-form-item>
          <el-form-item>
            <el-button :disabled="!selectedList.length" type="danger" @click="batchStatus(-1)">
              <el-icon>
                <ele-Download />
              </el-icon>
              下架
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
      <el-table :data="list" v-loading="loading" style="width: 100%" @selection-change="selectedList = $event">
        <el-table-column type="selection" width="30" />
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="名称" min-width="100" show-overflow-tooltip />
        <el-table-column prop="shopName" label="店铺名称" min-width="100" show-overflow-tooltip />
        <el-table-column fixed="right" width="100px" label="状态" align="center">
          <template #default="{ row }">
            <el-tag type="success" v-if="row.status === 1">上架</el-tag>
            <el-tag type="danger" v-if="row.status === -1">下架</el-tag>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="200">
          <template #default="{ row }">
            <el-button size="small" text type="primary" @click="onSetStatus(row)">{{ row.status === 1 ? '下架' : '上架'
            }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="page-bottom">
        <el-pagination v-model:currentPage="currentPage" background layout="prev, pager, next, jumper" :page-count="totalPage" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      </div>
    </el-card>
  </div>
</template>
<script lang="ts">
export default {
  name: 'productIndex',
  beforeRouteEnter(to, from, next) {
    next((vm: any) => {
      if (from.name === 'productAdd' || from.name === 'productEdit') {
        vm.getListData()
      }
    })
  },
}
</script>
<script setup lang="ts">
import { reactive, onMounted, toRefs } from 'vue'
import { ElMessage } from 'element-plus'
import { getProductList, setStatus, batchSetStatus } from '@/api/shop/product/index'
import { getCategroyList } from '@/api/product/category/index'
import { getShopList } from '@/api/shop/index'

// 定义变量
const defaultQuery = {
  status: 0,
  filter: '',
  categoryId: '',
  shopId: ''
}
const state = reactive({
  list: [],
  categoryList: [] as any,
  loading: false,
  currentPage: 1,
  totalPage: 1,
  queryData: Object.assign({}, defaultQuery),
  submitData: {},
  selectedList: [],
  exportLoading: false,
  shopList: [] as any
})

const {
  list,
  categoryList,
  loading,
  currentPage,
  totalPage,
  queryData,
  selectedList,
  exportLoading,
  shopList,
} = toRefs(state)

// 获取分类列表
const getCategoryListData = () => {
  getCategroyList().then((data: any) => {
    state.categoryList = data.list
  })
}

// 获取店铺列表
const getShopListData = () => {
  getShopList({
    page: 0
  }).then((data: any) => {
    state.shopList = data.list
  })
}

// 获取列表
const getListData = () => {
  state.loading = true
  if (JSON.stringify(state.queryData) !== JSON.stringify(state.submitData)) {
    state.currentPage = 1
  }
  const formData = JSON.parse(JSON.stringify(state.queryData))

  getProductList({
    page: state.currentPage,
    ...formData,
  }).then((data: any) => {
    console.log(data)
    state.loading = false
    state.list = data.list
    if (state.currentPage === 1 && data.pages > 0) {
      state.totalPage = data.pages
    }

    state.submitData = JSON.parse(JSON.stringify(state.queryData))
  })
}

//重置搜索条件
const refreshQuery = () => {
  state.queryData = Object.assign({}, defaultQuery)
  getListData()
}

const handleSizeChange = () => {
  getListData()
}

const handleCurrentChange = () => {
  getListData()
}

//导出表格
const downloadFile = () => {
  import('@/utils/export.js').then((excel) => {
    state.exportLoading = true
    getProductList({ page: 0, ...state.submitData }).then((data) => {
      data.list.map((item: any) => {
        item.price =
          item.minPrice === item.maxPrice
            ? item.minPrice / 100
            : item.minPrice / 100 + ' - ' + item.maxPrice / 100
        item.oldPrice = item.oldPrice / 100
        item.status = item.status ? '上架' : '下架'
        return item
      })
      const exportJsonToExcel = excel.export_json_to_excel
      const tableHead = [
        'ID',
        '名称',
        '店铺名称',
        '单位',
        '价格',
        '原价',
        '排列序号',
        '状态',
      ]
      const filterVal = [
        'id',
        'name',
        'shopName',
        'unit',
        'price',
        'oldPrice',
        'sort',
        'status',
      ]
      const tableBody = data.list.map((v: any) => filterVal.map((j) => v[j]))
      state.exportLoading = false
      exportJsonToExcel({
        header: tableHead,
        data: tableBody,
        filename: '商品列表',
        autoWidth: true,
      })
    })
  })
}


// 上下架
const onSetStatus = (row: any) => {
  setStatus({
    id: row.id,
    status: row.status === 1 ? -1 : 1,
  }).then(() => {
    getListData()
  })
}

// 批量上下架
const batchStatus = (status: number) => {
  batchSetStatus({
    list: state.selectedList.map((item: any) => item.id),
    status: status,
  }).then(() => {
    getListData()
    ElMessage.success(status === 1 ? '上架成功' : '下架成功')
  })
}

// 页面加载时
onMounted(() => {
  getListData()
  getCategoryListData()
  getShopListData()
})

</script>
<style scoped ></style>
