<template>
  <div class="page-container layout-padding">
    <div class="card">
      <publicSearch :search="search" @search="onSearch" :is-toggle="true" />
      <el-dropdown @command="toAdd">
        <el-button type="success" style="margin-right: 10px;">
          新建存货调整<el-icon class="el-icon--right" style="margin-right: 0;"><arrow-down /></el-icon>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item :command="1">转供应商(当前库存)</el-dropdown-item>
            <el-dropdown-item :command="2">转供应商(发生单据)</el-dropdown-item>
            <el-dropdown-item :command="3">采购进价调整</el-dropdown-item>
            <el-dropdown-item :command="4">采购进价调整(批量)</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <el-button type="primary" style="margin-bottom: 15px;">导出报表</el-button>
      <el-table :data="list" v-loading="loading" style="width: 100%" :header-cell-style="{ background: '#f5f7fa' }">
        <el-table-column prop="uid" label="单据号" min-width="150" />
        <el-table-column prop="uid" label="单据类型" min-width="150" />
        <el-table-column prop="memberNo" label="制单人" min-width="150" />
        <el-table-column prop="memberName" label="制单时间" min-width="150" />
        <el-table-column prop="memberName" label="备注" min-width="100" />
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
    label: '制单时间',
    prop: 'date',
    type: 'daterange',
    shortcuts: shortcuts,
  },
  {
    label: '单据号',
    prop: 'type',
    type: 'input',
    placeholder: '存货调整申请单'
  },
  {
    label: '单据类型',
    prop: 'type',
    type: 'select',
    options: [

    ],
  },
  {
    label: '制单人',
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
    router.push(`/finance/addInventoryAdjust?type=${c}`)
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