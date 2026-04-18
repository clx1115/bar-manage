<template>
  <div class="tip">
    <p>说明：</p>
    <p>1.在商品成本日历匹配不到成本的情况下，系统会选择从毛利估算成本中获取成本。</p>
    <p>2.成本价 = 售价 * ( 1 - 毛利率 )</p>
  </div>
  <div class="button-container">
    <el-button type="primary" @click="onOpenAdd('add')">设置毛利率</el-button>
  </div>
  <el-table :data="list" v-loading="loading" style="width: 100%" :header-cell-style="{ background: '#f5f7fa' }">
    <el-table-column prop="code" label="分类" min-width="150" show-overflow-tooltip />
    <el-table-column prop="name" label="毛利率" min-width="150" show-overflow-tooltip />
    <el-table-column label="操作" min-width="80" show-overflow-tooltip>
      <template #default="scope">
        <el-link type="primary" :underline="false"></el-link>
      </template>
    </el-table-column>
  </el-table>
  <detailDialog ref="detailDialogRef" @refresh="getListData" />
  <div class="page-bottom">
    <el-pagination v-model:currentPage="currentPage" background layout="prev, pager, next, jumper" :page-count="totalPage" @size-change="getListData" @current-change="getListData" />
  </div>
</template>

<script setup lang="ts">
import { toRefs, reactive, defineAsyncComponent, ref } from 'vue'

const detailDialog = defineAsyncComponent(
  () => import('./categoryDetail.vue')
)

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
  detailDialogRef.value.openDialog(type)
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
