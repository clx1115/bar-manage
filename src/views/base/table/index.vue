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
              生成餐桌
            </el-button>
          </el-form-item>
        </el-row>
      </el-form>
      <el-table :data="list" v-loading="loading" style="width: 100%">
        <el-table-column prop="id" label="ID" width="100" />
        <el-table-column prop="shopName" label="店铺名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="tableNo" label="桌号" show-overflow-tooltip></el-table-column>
        <el-table-column label="状态" width="150">
          <template #default="{ row }">
            <el-tag type="success" v-if="row.status === 1">正常</el-tag>
            <el-tag v-if="row.status === 2">停用</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250">
          <template #default="{ row }">
            <el-form>
              <el-button size="small" text type="primary" @click="onModStatus(row)">{{ row.status === 1 ? '停用' : '启用' }}</el-button>
              <el-button size="small" text type="primary" @click="onDownload(row)">下载</el-button>
              <el-button size="small" text type="primary" @click="onRefresh(row)">刷新</el-button>
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
    <generate ref="generateRef" />
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, reactive, onMounted, ref, toRefs } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { getTableList, modStatus, delTable, refreshTable } from '@/api/base/table/index'
import { getShopList } from '@/api/shop/index'


// 引入组件
const detailDialog = defineAsyncComponent(
  () => import('./component/detail.vue')
)

const generate = defineAsyncComponent(
  () => import('./component/generate.vue')
)

// 定义变量
const detailDialogRef = ref()
const generateRef = ref()
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
  getTableList({
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



const handleSizeChange = () => {
  getListData()
}

const handleCurrentChange = () => {
  getListData()
}

//更新桌码状态
const onModStatus = (row: any) => {
  modStatus({
    id: row.id,
    status: row.status === 1 ? 2 : 1
  }).then(() => {
    getListData()
    ElMessage.success('操作成功')
  })
}


//刷新桌码
const onRefresh = (row: any) => {
  refreshTable({
    id: row.id,
  }).then(() => {
    ElMessage.success('刷新成功')
  })
}

// 删除
const onRowDel = (row: any) => {
  ElMessageBox.confirm(`您确定要删除此桌码吗?`, '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      delTable({
        id: row.id,
      }).then(() => {
        getListData()
        ElMessage.success('删除成功')
      })
    })
    .catch(() => { })
}

const onDownload = (row: any) => {
  generateRef.value.generateImg(row)
}

// 页面加载时
onMounted(() => {
  getListData()
  getShopListData()
})
</script>

<style scoped lang="scss"></style>
