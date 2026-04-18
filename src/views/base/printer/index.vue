<template>
  <div class="page-container layout-padding">
    <el-card shadow="hover" class="layout-padding-auto">
      <el-form class="query" :inline="true" size="default" label-width="90px">
        <el-row>
          <el-form-item label="关键字">
            <el-input v-model="queryData.filter" size="default" placeholder="请输入关键字" clearable> </el-input>
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
        </el-row>
        <el-row>
          <el-form-item>
            <el-button size="default" type="success" class="ml10" @click="onOpenAdd('add')">
              <el-icon>
                <ele-Plus />
              </el-icon>
              新增打印机
            </el-button>
          </el-form-item>
        </el-row>
      </el-form>
      <el-table :data="list" v-loading="loading" style="width: 100%">
        <el-table-column prop="id" label="ID" width="100" />
        <el-table-column prop="shopName" label="店铺名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="printerSn" label="打印机sn" show-overflow-tooltip></el-table-column>
        <el-table-column prop="printerKey" label="打印机key" show-overflow-tooltip></el-table-column>
        <el-table-column label="打印机类型" width="150">
          <template #default="{ row }">
            <span v-if="row.printerType === 1">线上小票</span>
            <span v-if="row.printerType === 2">线下小票</span>
            <span v-if="row.printerType === 3">线上标签</span>
            <span v-if="row.printerType === 4">线下标签</span>
            <span v-if="row.printerType === 5">要货单小票</span>
            <span v-if="row.printerType === 6">后厨小票</span>
          </template>
        </el-table-column>
        <el-table-column prop="note" label="备注" show-overflow-tooltip></el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag type="success" v-if="row.enable">启用</el-tag>
            <el-tag v-else>禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="350">
          <template #default="{ row }">
            <el-form>
              <el-button size="small" text type="primary" @click="onOpenEdit('edit', row)">编辑</el-button>
              <el-button size="small" text type="primary" @click="onBind(row)">绑定到云端</el-button>
              <el-button size="small" text type="primary" @click="onClear(row)">清空打印队列</el-button>
              <el-button size="small" text type="primary" @click="onOpenBingCategory(row)">绑定分类</el-button>
              <el-button size="small" text type="primary" @click="onRowDel(row)">删除</el-button>
            </el-form>
          </template>
        </el-table-column>
      </el-table>
      <div class="page-bottom">
        <el-pagination v-model:currentPage="currentPage" background layout="prev, pager, next, jumper" :page-count="totalPage" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      </div>
    </el-card>
    <detailDialog ref="detailDialogRef" @refresh="getListData" />
    <categoryDialog ref="categoryDialogRef" @refresh="getListData" />
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, reactive, onMounted, ref, toRefs } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { getPrinterList, delPrinter, bindPrinter, clearPrintOrder } from '@/api/base/printer/index'
import { getShopList } from '@/api/shop/index'


// 引入组件
const detailDialog = defineAsyncComponent(
  () => import('./component/detail.vue')
)

const categoryDialog = defineAsyncComponent(
  () => import('./component/category.vue')
)

// 定义变量
const detailDialogRef = ref()
const categoryDialogRef = ref()
const state = reactive({
  list: [],
  loading: false,
  currentPage: 1,
  totalPage: 1,
  queryData: {
    filter: '',
    shopId: ''
  },
  submitData: {},
  shopList: [] as any
})

const { list, loading, currentPage, totalPage, queryData, shopList } = toRefs(state)

// 获取列表
const getListData = () => {
  state.loading = true
  if (JSON.stringify(state.queryData) !== JSON.stringify(state.submitData)) {
    state.currentPage = 1
  }
  const formData = JSON.parse(JSON.stringify(state.queryData))
  getPrinterList({
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


// 获取店铺列表
const getShopListData = () => {
  getShopList({
    page: 0
  }).then((data: any) => {
    state.shopList = data.list
  })
}


// 打开新增弹窗
const onOpenAdd = (type: string) => {
  detailDialogRef.value.openDialog(type)
}
// 打开修改弹窗
const onOpenEdit = (type: string, row: any) => {
  detailDialogRef.value.openDialog(type, row)
}

// 打开修改弹窗
const onOpenBingCategory = (row: any) => {
  categoryDialogRef.value.openDialog(row)
}

const handleSizeChange = () => {
  getListData()
}

const handleCurrentChange = () => {
  getListData()
}

// 删除
const onRowDel = (row: any) => {
  ElMessageBox.confirm(`您确定要删除此打印机吗?`, '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      delPrinter({
        id: row.id,
      }).then(() => {
        getListData()
        ElMessage.success('删除成功')
      })
    })
    .catch(() => { })
}

// 绑定到云端
const onBind = (row: any) => {
  ElMessageBox.confirm(`您确定要绑定此打印机到云端吗?`, '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      bindPrinter({
        printerId: row.id,
      }).then(() => {
        ElMessage.success('绑定成功')
      })
    })
    .catch(() => { })
}

// 清单打印机订单
const onClear = (row: any) => {
  ElMessageBox.confirm(`您确定要清除此打印机订单吗?`, '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      clearPrintOrder({
        id: row.id,
      }).then(() => {
        ElMessage.success('清除成功')
      })
    })
    .catch(() => { })
}


// 页面加载时
onMounted(() => {
  getListData()
  getShopListData()
})
</script>

<style scoped lang="scss"></style>
