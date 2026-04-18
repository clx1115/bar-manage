<template>
  <div class="page-container layout-padding">
    <el-card shadow="hover" class="layout-padding-auto">
      <el-form class="query" :inline="true" size="default" label-width="90px">
        <el-row>
          <el-form-item label="收支类目">
            <el-cascader v-model="queryData.categoryId" :options="categoryList" clearable collapse-tags :props="{ value: 'id', label: 'name', checkStrictly: true, multiple: false, emitPath: false }" style="width: 100%" placeholder="收支类目" @change="getListData" />
          </el-form-item>
          <el-form-item label="日期">
            <el-date-picker size="default" v-model="timeRange" type="daterange" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" format="YYYY-MM-DD" value-format="x" />
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
          <el-form-item>
            <el-button size="default" :loading="exportLoading" type="primary" @click="downloadFile">
              <el-icon>
                <ele-Download />
              </el-icon>
              导出
            </el-button>
          </el-form-item>
          <el-form-item>
            <el-button size="default" :loading="exportLoading" type="success" @click="onOpenAdd('add')">
              <el-icon>
                <ele-Plus />
              </el-icon>
              新增收支
            </el-button>
          </el-form-item>
        </el-row>
      </el-form>
      <el-table :data="list" v-loading="loading" style="width: 100%">
        <el-table-column label="日期" width="120">
          <template #default="{ row }">
            {{ formatDate(row.date, 'YYYY-mm-dd') }}
          </template>
        </el-table-column>
        <el-table-column prop="categoryName" label="类目" min-width="150" show-overflow-tooltip />
        <el-table-column label="金额" width="150">
          <template #default="{ row }">
            <span>{{ parseMoney(row.amount) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="digest" label="备注" min-width="200" />
        <el-table-column prop="participantsName" label="经手人" width="120" />
        <el-table-column label="添加时间" width="200">
          <template #default="{ row }">
            {{ formatDate(row.createTime, 'YYYY-mm-dd HH:MM:SS') }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250">
          <template #default="{ row }">
            <el-button size="small" text type="primary" @click="onOpenEdit('edit', row)">编辑</el-button>
            <el-button size="small" text type="primary" @click="onRowDel(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="page-bottom">
        <span class="mr20">消费总额：{{ parseMoney(totalIncome - totalOutcome) }}</span>
        <span class="mr20">收入：{{ parseMoney(totalIncome) }}</span>
        <span class="mr20">支出：{{ parseMoney(totalOutcome) }}</span>
        <el-pagination v-model:currentPage="currentPage" background layout="prev, pager, next, jumper" :page-count="totalPage" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      </div>
    </el-card>
    <detailDialog ref="detailDialogRef" @refresh="getListData" />
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, reactive, onMounted, toRefs, ref, watch } from 'vue'
import { parseMoney } from '@/utils/filters'
import { formatDate } from '@/utils/formatTime'
import { getVoucherList, delVoucher } from '@/api/finance/voucher/index'
import { getCategroyList } from '@/api/finance/voucher/category/index'
import { ElMessageBox, ElMessage } from 'element-plus'

// 引入组件
const detailDialog = defineAsyncComponent(
  () => import('./component/detail.vue')
)



const defaultQuery = {
  categoryId: '',
  beginTime: 0,
  endTime: 0,
}

// 定义变量
const detailDialogRef = ref()
const timeRange = ref('')
const state = reactive({
  list: [],
  categoryList: [] as any,
  loading: false,
  currentPage: 1,
  totalPage: 1,
  queryData: Object.assign({}, defaultQuery),
  submitData: {},
  exportLoading: false,
  totalIncome: 0,
  totalOutcome: 0
})

const {
  list,
  categoryList,
  loading,
  currentPage,
  totalPage,
  queryData,
  exportLoading,
  totalIncome,
  totalOutcome
} = toRefs(state)

watch(timeRange, (newValue: any) => {
  if (newValue && newValue[0] && newValue[1]) {
    state.queryData.beginTime = newValue[0] || 0
    state.queryData.endTime =
      (newValue[1] + 24 * 60 * 60 * 1000 - 1000) || 0
  } else {
    state.queryData.beginTime = 0
    state.queryData.endTime = 0
  }
})

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
  getVoucherList({
    page: state.currentPage,
    ...formData,
  }).then((data: any) => {
    state.loading = false
    state.list = data.list
    if (state.currentPage === 1 && data.pages > 0) {
      state.totalPage = data.pages
      state.totalIncome = data.totalIncome
      state.totalOutcome = data.totalOutcome
    }
    state.submitData = JSON.parse(JSON.stringify(state.queryData))
  })
}

const handleSizeChange = () => {
  getListData()
}

const handleCurrentChange = () => {
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


//重置搜索条件
const refreshQuery = () => {
  state.queryData = Object.assign({}, defaultQuery)
  timeRange.value = ''
  getListData()
}

// 删除
const onRowDel = (row: any) => {
  ElMessageBox.confirm(
    `此操作将永久删除该记录，是否继续?`,
    '提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      delVoucher({
        id: row.id,
      }).then(() => {
        getListData()
        ElMessage.success('删除成功')
      })
    })
    .catch(() => { })
}

//导出表格
const downloadFile = () => {
  import('@/utils/export.js').then((excel) => {
    state.exportLoading = true
    getVoucherList({ page: 0, ...state.submitData }).then((data) => {
      data.list.map((item: any) => {
        item.date = formatDate(item.date, 'YYYY-mm-dd')
        item.amount = Number(item.amount/100)
        item.createTime = formatDate(item.createTime, 'YYYY-mm-dd HH:MM:SS')
        return item
      })
      const exportJsonToExcel = excel.export_json_to_excel
      const tableHead = [
        '日期',
        '类目',
        '金额',
        '备注',
        '经手人',
        '添加时间',
      ]
      const filterVal = [
        'date',
        'categoryName',
        'amount',
        'digest',
        'participantsName',
        'createTime',
      ]
      const tableBody = data.list.map((v: any) => filterVal.map((j) => v[j]))
      state.exportLoading = false
      exportJsonToExcel({
        header: tableHead,
        data: tableBody,
        filename: '日常收支记录',
        autoWidth: true,
      })
    })
  })
}

// 页面加载时
onMounted(() => {
  getListData()
  getCategoryListData()
})
</script>

<style scoped lang="scss"></style>
