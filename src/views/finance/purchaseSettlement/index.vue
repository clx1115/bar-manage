<template>
  <div class="page-container layout-padding">
    <div class="card">
      <publicSearch :search="search" @search="onSearch" :is-toggle="true" />
      <el-dropdown @command="toAdd">
        <el-button type="success" style="margin-right: 10px;">
          新建结算单<el-icon class="el-icon--right" style="margin-right: 0;"><arrow-down /></el-icon>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item :command="1">经销结算</el-dropdown-item>
            <el-dropdown-item :command="2">代销结算</el-dropdown-item>
            <el-dropdown-item :command="3">联营结算</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <el-button type="primary" style="margin-bottom: 15px;">导出报表</el-button>
      <el-table :data="list" v-loading="loading" style="width: 100%" :header-cell-style="{ background: '#f5f7fa' }">
        <el-table-column prop="uid" label="单据编号" min-width="150" />
        <el-table-column prop="uid" label="单据状态" min-width="150" />
        <el-table-column prop="memberNo" label="付款状态" min-width="150" />
        <el-table-column prop="memberName" label="单据类型" min-width="150" />
        <el-table-column prop="memberName" label="付款方是否审批" min-width="150" />
        <el-table-column prop="memberName" label="收款方是否审批" min-width="150" />
        <el-table-column prop="memberName" label="应付合计(元)" min-width="150" />
        <el-table-column prop="memberName" label="调整金额(元)" min-width="150" />
        <el-table-column prop="memberName" label="已付金额(元)" min-width="150" />
        <el-table-column prop="memberName" label="预付余额抵扣(元)" min-width="150" />
        <el-table-column prop="memberName" label="退回金额(元)" min-width="150" />
        <el-table-column prop="memberName" label="应结金额(元)" min-width="150" />
        <el-table-column prop="memberName" label="已结金额(元)" min-width="150" />
        <el-table-column prop="memberName" label="本次结算日期" min-width="120" />
        <el-table-column prop="memberName" label="付款方" min-width="100" />
        <el-table-column prop="memberName" label="收款方" min-width="100" />
        <el-table-column prop="memberName" label="操作" min-width="80" />
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowDown } from '@element-plus/icons-vue'
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
    label: '本次结算周期',
    prop: 'date',
    type: 'daterange',
    shortcuts: shortcuts,
  },
  {
    label: '付款方',
    prop: 'type',
    type: 'select',
    options: [

    ],
  },
  {
    label: '收款方',
    prop: 'type',
    type: 'select',
    options: [

    ],
  },
  {
    label: '单据编号',
    prop: 'type',
    type: 'input',
    placeholder: '请输入单据编号',
  },
  {
    label: '单据状态',
    prop: 'type',
    type: 'select',
    options: [

    ],
  },
  {
    label: '单据类型',
    prop: 'type',
    type: 'select',
    options: [

    ],
  },
  {
    label: '付款方审核',
    prop: 'type',
    type: 'select',
    options: [

    ],
  },
  {
    label: '收款方审核',
    prop: 'type',
    type: 'select',
    options: [

    ],
  },
  {
    label: '付款状态',
    prop: 'type',
    type: 'select',
    options: [

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

const { list, loading } = toRefs(state)

const onSearch = (e: any, type: any) => {
  state.queryData = Object.assign({}, e)
  getListData()
}

const getListData = () => {

}

const router = useRouter()
const toAdd = (c: number) => {
  if (c !== 4) {
    router.push(`/finance/addPurchaseSettlement?type=${c}`)
  } else {
    alert('导入逻辑')
  }
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
</style>