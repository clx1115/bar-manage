<template>
  <div>
    <publicSearch :search="search" @search="onSearch" :is-toggle="true" />
    <el-button type="primary" style="margin-bottom: 15px;">导出报表</el-button>
    <el-table :data="list" v-loading="loading" style="width: 100%" :header-cell-style="{ background: '#f5f7fa' }">
      <el-table-column prop="uid" label="付款方财务组织" min-width="150" />
      <el-table-column prop="uid" label="供应商" min-width="150" />
      <el-table-column prop="memberNo" label="存入(元)" min-width="150" />
      <el-table-column prop="memberName" label="冻结(元)" min-width="150" />
      <el-table-column prop="memberName" label="转实付(元)" min-width="150" />
      <el-table-column prop="memberName" label="退款(元)" min-width="150" />
      <el-table-column prop="memberName" label="余额(元)" min-width="150" />
      <el-table-column prop="memberName" label="操作" min-width="100">
        <template #default="scope">
          <el-link type="primary" size="small" :underline="false">存入</el-link>
          <span> | </span>
          <el-link type="primary" size="small" :underline="false">明细</el-link>
        </template>
      </el-table-column>
    </el-table>
    <div class="page-bottom">
      <el-pagination v-model:currentPage="currentPage" background layout="prev, pager, next, jumper" :page-count="totalPage" @size-change="getListData" @current-change="getListData" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { toRefs, reactive, defineAsyncComponent, ref } from 'vue'
import { useRouter } from 'vue-router'

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
    label: '付款财务组织',
    prop: 'date',
    type: 'select',
    options: [

    ],
  },
  {
    label: '供应商',
    prop: 'type',
    type: 'select',
    options: [

    ],
  },
])

// 定义变量
const state = reactive({
  list: [1],
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

const getListData = () => {

}

const router = useRouter()
const toAdd = () => {
  router.push(`/finance/addSaleSettlement?type=4`)
}

</script>

<style scoped lang="scss">
.card {
  background-color: white;
  padding: 16px;
}

.flex {
  display: flex;
}

.page-bottom {
  margin-top: 20px;
}
</style>