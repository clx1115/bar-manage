<template>
  <div class="page-container layout-padding">
    <el-card shadow="hover" class="layout-padding-auto">
      <el-form class="query" :inline="true" size="default" label-width="80px">
        <el-row>
          <el-form-item>
            <el-radio-group v-model="queryData.classifyType" size="default" @change="getListData">
              <el-radio-button :label="0">全部</el-radio-button>
              <el-radio-button :label="1">新品上市</el-radio-button>
              <el-radio-button :label="2">热门推荐</el-radio-button>
              <el-radio-button :label="3">热门类型</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-row>
        <el-form-item>
          <el-button size="default" type="success" class="ml10" @click="onOpenAdd('add')">
            <el-icon>
              <ele-Plus />
            </el-icon>
            新增归集
          </el-button>
        </el-form-item>
      </el-form>
      <el-table :data="list" v-loading="loading" style="width: 100%">
        <el-table-column prop="id" label="ID" width="200" />
        <el-table-column prop="classifyType" label="归集分类" show-overflow-tooltip width="200">
          <template #default="{ row }">
            <el-tag type="success" v-if="row.classifyType === 1">新品上市</el-tag>
            <el-tag type="warning" v-if="row.classifyType === 2">热门推荐</el-tag>
            <el-tag type="primary" v-if="row.classifyType === 3">热门类型</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="classifyCode" label="归集标题" show-overflow-tooltip width="200"></el-table-column>
        <el-table-column prop="subTitle" label="副标题" show-overflow-tooltip width="200"></el-table-column>
        <el-table-column prop="itemSize" label="显示数量" show-overflow-tooltip></el-table-column>
        <el-table-column prop="sort" label="排列序号" show-overflow-tooltip width="100"></el-table-column>
        <el-table-column label="操作" width="250">
          <template #default="{ row }">
            <el-button size="small" text type="primary" @click="onOpenBind(row)">绑定商品</el-button>
            <el-button size="small" text type="primary" @click="onOpenManage(row)">商品管理</el-button>
            <el-button size="small" text type="primary" @click="onOpenEdit('edit', row)">编辑</el-button>
            <el-button size="small" text type="primary" @click="onRowDel(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <detailDialog ref="detailDialogRef" @refresh="getListData" />
    <selectDialog ref="selectDialogRef" @select="bindProduct" />
    <productManageDialog @getListData="getListData" ref="productManageDialogRef" />
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, reactive, onMounted, ref, toRefs } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import {
  getClassifysList,
  delClassifys,
  updateClassifys,
  getClassifysDetail,
} from '@/api/base/classifys/index'
// 引入组件
const detailDialog = defineAsyncComponent(
  () => import('./component/detail.vue')
)

const selectDialog = defineAsyncComponent(
  () => import('@/views/product/component/select.vue')
)

const productManageDialog = defineAsyncComponent(
  () => import('./component/product.vue')
)

// 定义变量
const detailDialogRef = ref()
const selectDialogRef = ref()
const productManageDialogRef = ref()
const state = reactive({
  list: [],
  loading: false,
  queryData: {
    classifyType: 0,
  },
  currentItem: {} as any,
})

const { list, loading, queryData } = toRefs(state)

// 获取列表
const getListData = () => {
  state.loading = true
  getClassifysList(state.queryData).then((data: any) => {
    state.loading = false
    state.list = data.list
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

//打开商品管理弹窗
const onOpenManage = (row: any) => {
  state.currentItem = row
  productManageDialogRef.value.openDialog(row)
}

//打开绑定商品弹窗
const onOpenBind = (row: any) => {
  state.currentItem = row
  getClassifysDetail({
    id: row.id,
  }).then((res) => {
    const productList = res.productIdList ? JSON.parse(res.productIdList) : []
    selectDialogRef.value.openDialog('checkbox', productList)
  })
}

const bindProduct = (val: any) => {
  const productList = state.currentItem.productIdList
    ? JSON.parse(state.currentItem.productIdList)
    : []
  val.forEach((item: any) => {
    productList.push({
      id: item.id,
      name: item.name,
      maxPrice: item.maxPrice,
      minPrice: item.minPrice,
      oldPrice: item.oldPrice,
      coverImgUrl: item.coverImgUrl
    })
  })
  updateClassifys({
    id: state.currentItem.id,
    productIdList: JSON.stringify(productList),
  })
    .then(() => {
      state.currentItem = {}
      getListData()
      ElMessage.success('绑定成功')
    })
    .catch(() => {
      state.loading = false
    })
}

// 删除
const onRowDel = (row: any) => {
  ElMessageBox.confirm(
    `此操作将永久删除归集名称：“${row.classifyCode}”，是否继续?`,
    '提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      delClassifys({
        id: row.id,
      }).then(() => {
        getListData()
        ElMessage.success('删除成功')
      })
    })
    .catch(() => { })
}
// 页面加载时
onMounted(() => {
  getListData()
})
</script>

<style scoped lang="scss">
.node {
  width: 95%;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .btn {
    padding: 0;
  }
}
</style>
