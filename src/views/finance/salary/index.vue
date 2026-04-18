<template>
  <div class="page-container layout-padding">
    <el-card shadow="hover" class="layout-padding-auto">
      <el-form class="query" :inline="true" size="default" label-width="40px">
        <el-row>
          <el-form-item label="员工">
            <el-select v-model="queryData.userName" placeholder="选择员工" filterable clearable @change="getListData">
              <el-option v-for="item in userList" :key="item.id" :label="item.realName" :value="item.realName" />
            </el-select>
          </el-form-item>
          <el-form-item label="月份">
            <el-date-picker v-model="queryData.month" type="month" clearable value-format="YYYYMM" @change="getListData" />
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
            <el-button size="default" :loading="exportLoading" type="success" @click="onGenerateSalary">
              <el-icon>
                <ele-Plus />
              </el-icon>
              生成上月工资
            </el-button>
          </el-form-item>
        </el-row>
      </el-form>
      <el-table :data="list" v-loading="loading" style="width: 100%">
        <el-table-column label="月份" width="100">
          <template #default="{ row }">
            {{ row.month }}
          </template>
        </el-table-column>
        <el-table-column prop="userName" label="员工" min-width="100" show-overflow-tooltip />
        <el-table-column label="入职时间" width="120">
          <template #default="{ row }">
            <span v-if="row.enrollTime">{{ formatDate(row.enrollTime, 'YYYY-mm-dd') }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="department" label="部门" min-width="100" show-overflow-tooltip />
        <el-table-column label="出勤天数" width="100">
          <template #default="{ row }">
            <span>{{ row.workDays }}</span>
          </template>
        </el-table-column>
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
        <el-table-column label="薪资小计" width="100">
          <template #default="{ row }">
            <span>{{ parseMoney(row.salarySubTotal) }}</span>
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
        <el-table-column label="会员提成" width="100">
          <template #default="{ row }">
            <span>{{ parseMoney(row.memberAward) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="单品提成" width="100">
          <template #default="{ row }">
            <span>{{ parseMoney(row.productAward) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="奖励小计" width="100">
          <template #default="{ row }">
            <span>{{ parseMoney(row.awardSubTotal) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="应付工资" width="100">
          <template #default="{ row }">
            <span>{{ parseMoney(row.payrollSalary) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="社保扣减" width="100">
          <template #default="{ row }">
            <span>{{ parseMoney(row.socialAssuranceDeduction) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="满勤扣减" width="100">
          <template #default="{ row }">
            <span>{{ parseMoney(row.attendanceDeduction) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="其他扣减" width="100">
          <template #default="{ row }">
            <span>{{ parseMoney(row.otherDeduction) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="损坏扣减" width="100">
          <template #default="{ row }">
            <span>{{ parseMoney(row.brokenDeduction) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="扣减小计" width="100">
          <template #default="{ row }">
            <span>{{ parseMoney(row.totalDeduction) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="奖金" width="100">
          <template #default="{ row }">
            <span>{{ parseMoney(row.bonus) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="预支工资" width="100">
          <template #default="{ row }">
            <span>{{ parseMoney(row.payAdvanceSalary) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="实发工资" width="100">
          <template #default="{ row }">
            <span>{{ parseMoney(row.netSalary) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="bankName" label="开户银行" min-width="250" />
        <el-table-column prop="bankNo" label="银行卡号" min-width="200" />
        <el-table-column fixed="right" label="操作" width="100">
          <template #default="{ row }">
            <el-button size="small" text type="primary" @click="onOpenEdit(row)">编辑</el-button>
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
import { getSalaryList, generateSalary, delSalary } from '@/api/finance/salary/index'
import { ElMessageBox, ElMessage } from 'element-plus'
import { getUserList } from '@/api/system/user/index'


// 引入组件
const detailDialog = defineAsyncComponent(
  () => import('./component/detail.vue')
)



const defaultQuery = {
  month: '',
  userName: '',
}

// 定义变量
const detailDialogRef = ref()
const state = reactive({
  list: [],
  userList: [] as any,
  loading: false,
  currentPage: 1,
  totalPage: 1,
  queryData: Object.assign({}, defaultQuery),
  submitData: {},
  exportLoading: false,
})

const {
  list,
  userList,
  loading,
  currentPage,
  totalPage,
  queryData,
  exportLoading,
} = toRefs(state)


// 获取员工列表
const getUserListData = () => {
  getUserList().then((data: any) => {
    state.userList = data.list
  })
}

// 获取列表
const getListData = () => {
  state.loading = true
  if (JSON.stringify(state.queryData) !== JSON.stringify(state.submitData)) {
    state.currentPage = 1
  }
  const formData = JSON.parse(JSON.stringify(state.queryData))
  getSalaryList({
    page: state.currentPage,
    ...formData,
  }).then((data: any) => {
    state.loading = false
    state.list = data.list
    if (state.currentPage === 1 && data.pages > 0) {
      state.totalPage = data.pages
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


// 打开修改弹窗
const onOpenEdit = (row: any) => {
  detailDialogRef.value.openDialog(row)
}


// 生成工资
const onGenerateSalary = (row: any) => {
  ElMessageBox.confirm(
    `此操作将生成上月员工工资，是否继续?`,
    '提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      generateSalary().then(() => {
        getListData()
        ElMessage.success('生成成功')
      })
    })
    .catch(() => { })
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
      delSalary({
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
    getSalaryList({ page: 0, ...state.submitData }).then((data) => {
      data.list.map((item: any) => {
        item.enrollTime = formatDate(item.enrollTime, 'YYYY-mm-dd')
        item.basicSalary = Number(item.basicSalary / 100)
        item.fixSalary = Number(item.fixSalary / 100)
        item.dineAllowance = Number(item.dineAllowance / 100)
        item.socialAssuranceAllowance = Number(item.socialAssuranceAllowance / 100)
        item.trafficAllowance = Number(item.trafficAllowance / 100)
        item.salarySubTotal = Number(item.salarySubTotal / 100)
        item.fullAttendanceAward = Number(item.fullAttendanceAward / 100)
        item.ageAward = Number(item.ageAward / 100)
        item.memberAward = Number(item.memberAward / 100)
        item.productAward = Number(item.productAward / 100)
        item.awardSubTotal = Number(item.awardSubTotal / 100)
        item.payrollSalary = Number(item.payrollSalary / 100)
        item.socialAssuranceDeduction = Number(item.socialAssuranceDeduction / 100)
        item.attendanceDeduction = Number(item.attendanceDeduction / 100)
        item.otherDeduction = Number(item.otherDeduction / 100)
        item.brokenDeduction = Number(item.brokenDeduction / 100)
        item.totalDeduction = Number(item.totalDeduction / 100)
        item.payAdvanceSalary = Number(item.payAdvanceSalary / 100)
        item.netSalary = Number(item.netSalary / 100)
        item.bonus = Number(item.bonus / 100)
        return item
      })
      const exportJsonToExcel = excel.export_json_to_excel
      const tableHead = [
        '月份',
        '员工',
        '入职时间',
        '部门',
        '基础工资',
        '固定薪资',
        '餐补',
        '社保补贴',
        '交通补贴',
        '薪资小计',
        '满勤奖',
        '工龄奖',
        '会员提成',
        '单品提成',
        '奖励小计',
        '应付工资',
        '社保扣减',
        '满勤扣减',
        '其他扣减',
        '损坏扣减',
        '扣减小计',
        '奖金',
        '预支',
        '实发工资',
        '开户银行',
        '银行卡号',
        '签名',
        '备注',
      ]
      const filterVal = [
        'month',
        'userName',
        'enrollTime',
        'department',
        'basicSalary',
        'fixSalary',
        'dineAllowance',
        'socialAssuranceAllowance',
        'trafficAllowance',
        'salarySubTotal',
        'trafficAllowance',
        'fullAttendanceAward',
        'ageAward',
        'memberAward',
        'productAward',
        'awardSubTotal',
        'payrollSalary',
        'socialAssuranceDeduction',
        'attendanceDeduction',
        'otherDeduction',
        'brokenDeduction',
        'totalDeduction',
        'bonus',
        'payAdvanceSalary',
        'netSalary',
        'bankNo',
        'bankName',
      ]
      const tableBody = data.list.map((v: any) => filterVal.map((j) => v[j]))
      state.exportLoading = false
      exportJsonToExcel({
        header: tableHead,
        data: tableBody,
        filename: '员工工资',
        autoWidth: true,
      })
    })
  })
}

// 页面加载时
onMounted(() => {
  getListData()
  getUserListData()
})
</script>

<style scoped lang="scss"></style>
