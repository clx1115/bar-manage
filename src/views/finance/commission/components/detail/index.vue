<template>
  <div class="card">
    <publicSearch :search="search" @search="onSearch" :is-toggle="true" />
    <el-table :data="list" v-loading="loading" style="width: 100%">
      <el-table-column prop="code" label="申请时间" width="150" show-overflow-tooltip />
      <el-table-column prop="name" label="金额(元)" width="150" show-overflow-tooltip />
      <el-table-column prop="itemTypeName" label="提现手续费(元)" min-width="150" show-overflow-tooltip />
      <el-table-column prop="itemTypeName" label="状态" min-width="150" show-overflow-tooltip />
      <el-table-column prop="itemTypeName" label="到账方式" min-width="150" show-overflow-tooltip />
      <el-table-column prop="itemTypeName" label="到账银行卡" min-width="150" show-overflow-tooltip />
      <el-table-column prop="itemTypeName" label="附加信息" min-width="150" show-overflow-tooltip />
      <el-table-column prop="itemTypeName" label="备注" min-width="150" show-overflow-tooltip />
      <el-table-column fixed="right" prop="itemTypeName" label="订单编号|流水号" min-width="150" show-overflow-tooltip />
      <el-table-column fixed="right" prop="itemTypeName" label="操作" min-width="150" show-overflow-tooltip />
    </el-table>
    <div class="page-bottom">
      <el-pagination v-model:currentPage="currentPage" background layout="prev, pager, next, jumper" :page-count="totalPage" @size-change="getListData" @current-change="getListData" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, reactive, ref, toRefs } from 'vue'

const publicSearch = defineAsyncComponent(
  () => import('@/components/publicSearch/index.vue')
)

const shortcuts = [
  {
    text: '近7天',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    },
  },
  {
    text: '近30天',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    },
  },
]

//搜索条件
const search = ref([
  {
    label: '时间选择',
    prop: 'date',
    type: 'select',
    options: [
      { label: '业务发生日期', value: 1 },
      { label: '下单时间', value: 2 },
    ],
  },
  {
    label: ' ',
    prop: 'datee',
    type: 'daterange',
    shortcuts: shortcuts,
    labelWidth: '0px',
  },
  {
    label: '商品筛选',
    prop: 'date',
    type: 'select',
    options: [
      { label: '商品名称', value: 1 },
      { label: '规格条码', value: 2 },
      { label: '商品编码', value: 2 },
      { label: '商品条码', value: 2 },
    ],
  },
  {
    label: ' ',
    prop: 'date',
    type: 'input',
    labelWidth: '0px',
    placeholder: '请输入名称',
  },
  {
    label: '上级分佣对象',
    prop: 'date',
    type: 'select',
    options: [
      { label: '全部', value: 1 },
      { label: 'xxx', value: 2 },
    ],
  },
  {
    label: '分佣层级',
    prop: 'date',
    type: 'select',
    options: [
      { label: '全部', value: 1 },
      { label: '1级', value: 2 },
      { label: '2级', value: 2 },
    ],
  },
  {
    label: '场景类型',
    prop: 'date',
    type: 'select',
    options: [
      { label: '全部', value: 1 },
      { label: '销售业绩归属-总部统管资金', value: 2 },
      { label: '销售业绩归属-销售单元自管资金', value: 2 },
      { label: '销售分佣（供货关系）-总部统管资金', value: 2 },
      { label: '销售分佣（供货关系）-销售单元自管资金', value: 2 },
      { label: '销售分佣（自定义角色）-总部统管资金', value: 2 },
      { label: '销售分佣（自定义角色）-销售单元自管资金', value: 2 },
      { label: '储值充值奖励', value: 2 },
    ],
  },
  {
    label: '分佣节点',
    prop: 'date',
    type: 'select',
    options: [
      { label: '全部', value: 1 },
      { label: '销售', value: 2 },
      { label: '发货', value: 2 },
      { label: '供货', value: 2 },
    ],
  },
  {
    label: '分佣模式',
    prop: 'date',
    type: 'select',
    options: [
      { label: '全部', value: 1 },
      { label: '销售节点按比率优先', value: 2 },
      { label: '供货节点按成本优先', value: 2 },
      { label: '自定义角色分佣', value: 2 },
    ],
  },
  {
    label: '业务单号',
    prop: 'date',
    type: 'input',
    placeholder: '请输入单据号或关联单号',
  },
  {
    label: '订单编号',
    prop: 'date',
    type: 'input',
    placeholder: '输入订单编号',
  },
  {
    label: '政策编号',
    prop: 'date',
    type: 'input',
    placeholder: '输入关联政策编号',
  },
  {
    label: '关联单号',
    prop: 'date',
    type: 'input',
    placeholder: '输入关联单号',
  },
  {
    label: '销售单元',
    prop: 'date',
    type: 'select',
    options: [
      { label: '全部', value: 1 },
      { label: 'xxx', value: 2 },
    ],
  },
  {
    label: '往来主体',
    prop: 'date',
    type: 'select',
    options: [
      { label: '全部', value: 1 },
      { label: 'xxx', value: 2 },
    ],
  },
  {
    label: '往来对象',
    prop: 'date',
    type: 'select',
    options: [
      { label: '全部', value: 1 },
      { label: 'xxx', value: 2 },
    ],
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


</script>

<style scoped lang="scss">
.card {
  background-color: white;
  padding: 20px;

  .page-bottom {
    margin-top: 20px;
  }
}
</style>