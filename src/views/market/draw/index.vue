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
          <el-form-item label="活动状态">
            <el-cascader v-model="queryData.categoryId" :options="categoryList" clearable collapse-tags :props="{ value: 'id', label: 'name', multiple: false, emitPath: false }" style="width: 100%" placeholder="商品分类" @change="getListData" />
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
            <el-button size="default" type="success" class="ml10" @click="onOpenAdd('add')">
              <el-icon>
                <ele-Plus />
              </el-icon>
              添加抽奖
            </el-button>
          </el-form-item>
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
        </el-row>
      </el-form>
      <el-table :data="list" v-loading="loading" style="width: 100%" @selection-change="selectedList = $event">
        <el-table-column type="selection" width="30" />
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="unit" label="活动名称" min-width="100" show-overflow-tooltip />
        <el-table-column prop="unit" label="活动类型" min-width="100" show-overflow-tooltip />
        <el-table-column prop="unit" label="参与次数" min-width="100" show-overflow-tooltip />
        <el-table-column prop="unit" label="抽奖人数" min-width="100" show-overflow-tooltip />
        <el-table-column prop="unit" label="中奖人数" min-width="100" show-overflow-tooltip />
        <el-table-column prop="unit" label="活动状态" min-width="100" show-overflow-tooltip />
        <el-table-column prop="unit" label="上架状态" min-width="100" show-overflow-tooltip>
          <template #default="{ row }">
            <el-tag type="success" v-if="row.status === 1">上架</el-tag>
            <el-tag type="danger" v-if="row.status === -1">下架</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="unit" label="活动时间" min-width="100" show-overflow-tooltip />
        <el-table-column fixed="right" label="操作" width="200">
          <template #default="{ row }">
            <el-button size="small" text type="primary" @click="onOpenEdit('edit', row)">编辑</el-button>
            <el-button size="small" text type="primary" @click="onSetStatus(row)">{{ row.status === 1 ? '下架' : '上架' }}</el-button>
            <el-button size="small" text type="primary" @click="onRowDel(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="page-bottom">
        <el-pagination v-model:currentPage="currentPage" background layout="prev, pager, next, jumper" :page-count="totalPage" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      </div>
    </el-card>
    <detailDialog ref="detailDialogRef" @refresh="getListData" />
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
import { reactive, onMounted, toRefs, defineAsyncComponent, ref } from 'vue'

import { ElMessageBox, ElMessage } from 'element-plus'
import {
  getProductList,
  setStatus,
  batchSetStatus,
  deleteProduct,
} from '@/api/product/index'
import { getCategroyList } from '@/api/product/category/index'
const detailDialog = defineAsyncComponent(
  () => import('./component/detail.vue')
)
// 定义变量
const detailDialogRef = ref()
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

// 打开新增弹窗
const onOpenAdd = (type: string) => {
  detailDialogRef.value.openDialog(type)
}
// 打开修改弹窗
const onOpenEdit = (type: string, row: any) => {
  detailDialogRef.value.openDialog(type, row)
}
// 删除
const onRowDel = (row: any) => {
  ElMessageBox.confirm(
    `此操作将永久删除Tab名称：“${row.tabName}”，是否继续?`,
    '提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      // delTab({
      //   id: row.id,
      // }).then(() => {
      //   getListData()
      //   ElMessage.success('删除成功')
      // })
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

const handleSizeChange = () => {
  getListData()
}

const handleCurrentChange = () => {
  getListData()
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
