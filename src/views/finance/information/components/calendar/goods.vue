<template>
  <div class="tip">
    <p>说明：</p>
    <p>1.当一个商品同时存在条码维度和货号维度的维护成本时,以条码维度的成本为主；</p>
    <p>2.成本日历的成本获取优先级：人工录入 > 最近一次采购入库价格 > 配销协议计算成本 > 供应商商品维护成本；</p>
  </div>
  <publicSearch :search="search" @search="onSearch" :is-toggle="true" />
  <div class="button-container">
    <el-button type="success" @click="onOpenAdd('add')" :disabled="true">添加商品</el-button>
    <el-button type="primary" :disabled="true">批量导入</el-button>
    <el-button>导出</el-button>
    <el-link type="primary" :underline="false" style="margin-left: 10px;">查看导入记录</el-link>
    <el-link type="primary" :underline="false" style="margin-left: 10px;">查看导出报表</el-link>
  </div>
  <el-table :data="list" v-loading="loading" style="width: 100%" :header-cell-style="{ background: '#f5f7fa' }">
    <el-table-column prop="code" label="商品名称" min-width="150" show-overflow-tooltip />
    <el-table-column prop="name" label="销售渠道" min-width="150" show-overflow-tooltip />
    <el-table-column prop="itemTypeName" label="销售单元" min-width="150" show-overflow-tooltip />
    <el-table-column label="操作" min-width="80" show-overflow-tooltip>
      <template #default="scope">
        <el-link type="primary" :underline="false"></el-link>
      </template>
    </el-table-column>
  </el-table>
  <!-- <detailDialog ref="detailDialogRef" @refresh="getListData" /> -->
  <div class="page-bottom">
    <el-pagination v-model:currentPage="currentPage" background layout="prev, pager, next, jumper" :page-count="totalPage" @size-change="getListData" @current-change="getListData" />
  </div>
</template>

<script setup lang="ts">
import { toRefs, reactive, defineAsyncComponent, ref } from 'vue'

const publicSearch = defineAsyncComponent(
  () => import('@/components/publicSearch/index.vue')
)
// const detailDialog = defineAsyncComponent(
//   () => import('./detail.vue')
// )

const detailDialogRef = ref()

//搜索条件
const search = ref([
  {
    label: '销售单元',
    prop: 'union',
    type: 'select',
    options: [

    ],
  },
  {
    label: '名称',
    prop: 'name',
    type: 'input',
  },
])

// 定义变量
const state = reactive({
  list: [],
  loading: false,
  queryData: {},
  submitData: {},
  currentPage: 1,
  totalPage: 1,
})

const { list, loading, currentPage, totalPage } = toRefs(state)

const onSearch = (e: any, type: any) => {
  state.queryData = Object.assign({}, e)
  getListData()
}

// 获取列表
const getListData = () => {
  // state.loading = true
  if (JSON.stringify(state.queryData) !== JSON.stringify(state.submitData)) {
    state.currentPage = 1
  }
  const formData = JSON.parse(JSON.stringify(state.queryData))
}

// 打开新增弹窗
const onOpenAdd = (type: string) => {
  // detailDialogRef.value.openDialog(type)
}


</script>

<style scoped lang="scss">
.tip {
  background-color: #f8f8f8;
  padding: 16px;
  margin-bottom: 16px;
}

.page-bottom {
  margin-top: 20px;
}

.button-container {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}
</style>
