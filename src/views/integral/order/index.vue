<template>
  <div class="page-container layout-padding">
    <el-card shadow="hover" class="layout-padding-auto">
      <el-form class="query" :inline="true" size="default" label-width="90px">
        <el-row>
          <el-form-item label="订单状态">
            <el-radio-group v-model="queryData.status" size="default" @change="getListData">
              <el-radio-button :label="0">全部</el-radio-button>
              <el-radio-button :label="1">未发货</el-radio-button>
              <el-radio-button :label="-1">待收货</el-radio-button>
              <el-radio-button :label="-1">已完成</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="关键字">
            <el-input v-model="queryData.filter" size="default" placeholder="关键字" clearable> </el-input>
          </el-form-item>
          <!-- <el-form-item label="创建时间" prop="activeTime">
            <el-date-picker v-model="value2" type="datetime" :shortcuts="shortcuts" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" />
          </el-form-item> -->
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
      </el-form>
      <el-table :data="list" v-loading="loading" style="width: 100%" @selection-change="selectedList = $event">
        <el-table-column type="selection" width="30" />
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="coverImgUrl" label="图片" width="100">
          <template #default="{ row }"><img :src="row.coverImgUrl" class="smallImage"></template>
        </el-table-column>
        <el-table-column prop="name" label="订单号" width="130" show-overflow-tooltip />
        <el-table-column prop="unit" label="用户信息" width="100" show-overflow-tooltip />
        <el-table-column prop="unit" label="商品信息" width="100" show-overflow-tooltip />
        <el-table-column prop="unit" label="兑换积分" width="100" show-overflow-tooltip />
        <!-- <el-table-column prop="sort" label="下单时间" min-width="100">
          <template #default="{ row }">
            200000
          </template>
        </el-table-column> -->
        <el-table-column fixed="right" width="100" label="订单状态" align="center">
          <template #default="{ row }">
            <el-tag type="success" v-if="row.status === 1">待收货</el-tag>
            <el-tag type="danger" v-if="row.status === -1">已发货</el-tag>
            <el-tag type="danger" v-if="row.status === 2">已完成</el-tag>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="200">
          <template #default="{ row }">
            <router-link :to="`/product/edit?productId=${row.id}`" class="mr10">
              <el-button size="small" text type="primary">修改</el-button>
            </router-link>
            <el-button size="small" text type="primary" @click="onSetStatus(row)">{{ row.status === 1 ? '下架' : '上架' }}</el-button>
            <el-button size="small" text type="primary" @click="delProduct(row)">删除</el-button>
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
import { parseMoney } from '@/utils/filters'
import { ElMessageBox, ElMessage } from 'element-plus'
import {
  getProductList,
  setStatus,
  batchSetStatus,
  deleteProduct,
} from '@/api/product/index'
import { getCategroyList } from '@/api/product/category/index'

// 定义变量
const defaultQuery = {
  status: 0,
  filter: '',
  categoryId: '',
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
} = toRefs(state)

// 获取分类列表
const getCategoryListData = () => {
  getCategroyList().then((data: any) => {
    state.categoryList = data.list
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

//删除
const delProduct = (row: any) => {
  ElMessageBox.confirm(
    `此操作将永久删除商品名称：“${row.name}”，是否继续?`,
    '提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      deleteProduct({
        id: [row.id],
      }).then(() => {
        getListData()
        ElMessage.success('删除成功')
      })
    })
    .catch(() => { })
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
    ElMessage.success(status === 1 ? '下架成功' : '上架成功')
  })
}

// 页面加载时
onMounted(() => {
  getListData()
  getCategoryListData()
})

// 暴露变量
defineExpose({
  getListData,
})
</script>
<style scoped ></style>
