<template>
  <div class="page-container layout-padding">
    <el-card shadow="hover" class="layout-padding-auto">
      <el-form class="query" :inline="true" size="default" label-width="90px">
        <el-row>
          <el-form-item>
            <el-button size="default" :loading="exportLoading" type="success" @click="onOpenAdd('add')">
              <el-icon>
                <ele-Plus />
              </el-icon>
              新增工资配置
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
        </el-row>
      </el-form>
      <el-table :data="list" v-loading="loading" style="width: 100%">
        <el-table-column prop="userName" label="员工" min-width="150" show-overflow-tooltip />
        <el-table-column label="入职时间" width="120">
          <template #default="{ row }">
            <span v-if="row.enrollTime">{{ formatDate(row.enrollTime, 'YYYY-mm-dd') }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="department" label="部门" min-width="150" show-overflow-tooltip />
        <el-table-column label="基础工资" width="100">
          <template #default="{ row }">
            <span>{{ parseMoney(row.basicSalary) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="固定薪资" width="100">
          <template #default="{ row }">
            <span>{{ parseMoney(row.fixSalary) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="满勤奖" width="100">
          <template #default="{ row }">
            <span>{{ parseMoney(row.fullAttendanceAward) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="工龄奖" width="100">
          <template #default="{ row }">
            <span>{{ parseMoney(row.ageAward) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="餐补" width="100">
          <template #default="{ row }">
            <span>{{ parseMoney(row.dineAllowance) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="社保补贴" width="100">
          <template #default="{ row }">
            <span>{{ parseMoney(row.socialAssuranceAllowance) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="交通补贴" width="100">
          <template #default="{ row }">
            <span>{{ parseMoney(row.trafficAllowance) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="bankName" label="开户银行" min-width="150" />
        <el-table-column prop="bankNo" label="银行卡号" min-width="200" />
        <el-table-column label="操作" width="100">
          <template #default="{ row }">
            <el-button size="small" text type="primary" @click="onOpenEdit('edit', row)">编辑</el-button>
            <el-button size="small" text type="primary" @click="onRowDel(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="page-bottom">
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
import { getStaffSalaryList, delStaffSalary } from '@/api/finance/salary/index'
import { ElMessageBox, ElMessage } from 'element-plus'
// 引入组件
const detailDialog = defineAsyncComponent(
  () => import('./component/detail.vue')
)

// 定义变量
const detailDialogRef = ref()
const state = reactive({
  list: [],
  loading: false,
  currentPage: 1,
  totalPage: 1,
  exportLoading: false,
})

const {
  list,
  loading,
  currentPage,
  totalPage,
  exportLoading,
} = toRefs(state)


// 获取列表
const getListData = () => {
  state.loading = true
  getStaffSalaryList({
    page: state.currentPage,
  }).then((data: any) => {
    state.loading = false
    state.list = data.list
    if (state.currentPage === 1 && data.pages > 0) {
      state.totalPage = data.pages
    }
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
      delStaffSalary({
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
    getStaffSalaryList({ page: 0 }).then((data) => {
      data.list.map((item: any) => {
        item.enrollTime = formatDate(item.enrollTime, 'YYYY-mm-dd')
        item.basicSalary = Number(item.basicSalary / 100)
        item.fixSalary = Number(item.fixSalary / 100)
        item.dineAllowance = Number(item.dineAllowance / 100)
        item.socialAssuranceAllowance = Number(item.socialAssuranceAllowance / 100)
        item.trafficAllowance = Number(item.trafficAllowance / 100)
        item.trafficAllowance = Number(item.trafficAllowance / 100)
        item.fullAttendanceAward = Number(item.fullAttendanceAward / 100)
        item.ageAward = Number(item.ageAward / 100)
        return item
      })
      const exportJsonToExcel = excel.export_json_to_excel
      const tableHead = [
        '员工',
        '入职时间',
        '部门',
        '基础工资',
        '固定薪资',
        '固定薪资',
        '工龄奖',
        '餐补',
        '社保补贴',
        '交通补贴',
        '开户银行',
        '银行卡号',
      ]
      const filterVal = [
        'userName',
        'enrollTime',
        'department',
        'basicSalary',
        'fixSalary',
        'fullAttendanceAward',
        'ageAward',
        'dineAllowance',
        'socialAssuranceAllowance',
        'trafficAllowance',
        'bankNo',
        'bankName',
      ]
      const tableBody = data.list.map((v: any) => filterVal.map((j) => v[j]))
      state.exportLoading = false
      exportJsonToExcel({
        header: tableHead,
        data: tableBody,
        filename: '工资基础配置记录',
        autoWidth: true,
      })
    })
  })
}

// 页面加载时
onMounted(() => {
  getListData()
})
</script>

<style scoped lang="scss"></style>
