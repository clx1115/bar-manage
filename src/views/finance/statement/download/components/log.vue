<template>
  <publicSearch :search="search" @search="onSearch" />
  <el-button type="primary" style="margin-bottom: 15px;">批量下载报表</el-button>
  <el-table :data="list" v-loading="loading" style="width: 100%" :header-cell-style="{ background: '#f5f7fa' }">
    <el-table-column prop="uid" label="时间" min-width="150" />
    <el-table-column prop="memberNo" label="名称" min-width="150" />
    <el-table-column prop="memberName" label="订单编号 | 支付单号" min-width="200" />
    <el-table-column prop="memberName" label="对方" min-width="200" />
    <el-table-column prop="memberName" label="金额（元） | 明细" min-width="150" />
    <el-table-column prop="memberName" label="状态" min-width="100" />
    <el-table-column prop="memberName" label="操作" min-width="100" />
  </el-table>
</template>

<script setup lang="ts">
import { toRefs, reactive, defineAsyncComponent, ref } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: '',
  },
})

const publicSearch = defineAsyncComponent(
  () => import('@/components/publicSearch/index.vue')
)

//搜索条件
const search = ref([
  {
    label: '店铺',
    prop: 'shop',
    type: 'select',
    options: [

    ],
  },
  {
    label: '日期',
    prop: 'time',
    type: 'dataPicker',
    dataType: props.type,
  },
  {
    label: '账户类型',
    prop: 'type',
    type: 'select',
    options: [

    ],
  }
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

const { list, loading } = toRefs(state)

const onSearch = (e: any, type: any) => {
  state.queryData = Object.assign({}, e)
  getListData()
}

const handleClick = (e: any) => {
  console.log('handleClick', e.props.label)
}

const getListData = () => {

}

</script>

<style scoped lang="scss">
.card {
  background-color: white;
  padding: 16px;

  :deep(.el-tabs__item) {
    background-color: #f7f7f7;

    &.is-active {
      background-color: #fff;
    }
  }
}

.flex {
  display: flex;
}
</style>