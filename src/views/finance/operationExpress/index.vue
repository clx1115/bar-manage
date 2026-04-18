<template>
  <div class="page-container layout-padding">
    <div class="card">
      <publicSearch :search="search" @search="onSearch" :is-toggle="true" />
      <el-button type="success" style="margin-bottom: 15px;" @click="toAdd">登记费用</el-button>
      <el-button type="primary" style="margin-bottom: 15px;">批量导入</el-button>
      <el-button :disabled="!selectionList.length" style="margin-bottom: 15px;">批量通过</el-button>
      <el-table :data="list" v-loading="loading" style="width: 100%" :header-cell-style="{ background: '#f5f7fa' }" @selection-change="selectionList = $event">
        <el-table-column type="selection" width="55" />
        <el-table-column fixed="left" prop="uid" label="费用单号" min-width="150" />
        <el-table-column prop="memberNo" label="费用项目" min-width="150" />
        <el-table-column prop="memberName" label="费用归属" min-width="200" />
        <el-table-column prop="memberName" label="往来单位" min-width="200" />
        <el-table-column prop="memberName" label="收付类型" min-width="150" />
        <el-table-column prop="memberName" label="单据状态" min-width="100" />
        <el-table-column prop="memberName" label="收付方式" min-width="100" />
        <el-table-column prop="memberName" label="收付状态" min-width="100" />
        <el-table-column prop="memberName" label="费用金额(元)" min-width="120" />
        <el-table-column prop="memberName" label="费用发生日期" min-width="120" />
        <el-table-column prop="memberName" label="制单时间" min-width="100" />
        <el-table-column prop="memberName" label="登记来源" min-width="100" />
        <el-table-column prop="memberName" label="关联单号" min-width="100" />
        <el-table-column prop="memberName" label="备注" min-width="100" />
        <el-table-column fixed="right" prop="memberName" label="操作" min-width="100" />
      </el-table>
      <div class="page-bottom">
        <el-pagination v-model:currentPage="currentPage" background layout="prev, pager, next, jumper" :page-count="totalPage" @size-change="getListData" @current-change="getListData" />
      </div>
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
    label: '制单日期',
    prop: 'date',
    type: 'daterange',
    shortcuts: shortcuts,
  },
  {
    label: '往来单位',
    prop: 'type',
    type: 'select',
    options: [

    ],
  },
  {
    label: '费用单号',
    prop: 'type',
    type: 'input',
    placeholder: '请输入单据编号'
  },
  {
    label: '费用项目',
    prop: 'type',
    type: 'select',
    options: [

    ],
  },
  {
    label: '费用归属',
    prop: 'type',
    type: 'select',
    options: [

    ],
  },
  {
    label: '单据状态',
    prop: 'type',
    type: 'select',
    options: [

    ],
  },
  {
    label: '收付类型',
    prop: 'type',
    type: 'select',
    options: [

    ],
  },
  {
    label: '关联单号',
    prop: 'type',
    type: 'input',
    placeholder: '请输入关联单号'
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
  selectionList: [],
})

const { list, loading, currentPage, totalPage, selectionList } = toRefs(state)

const onSearch = (e: any, type: any) => {
  state.queryData = Object.assign({}, e)
  getListData()
}

const getListData = () => {

}

const router = useRouter()
const toAdd = () => {
  router.push('/finance/operationExpress/add')
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
  margin-top: 10px;
}
</style>
