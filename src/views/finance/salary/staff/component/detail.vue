<template>
  <div class="dialog-container">
    <el-dialog :title="dialog.title" v-model="dialog.isShowDialog" width="800px" :close-on-click-modal="false" :destroy-on-close="true">
      <el-form ref="dialogFormRef" :model="ruleForm" :rules="rules" size="default" label-width="100px">
        <el-row :gutter="35">
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="员工" prop="uid">
              <el-select v-model="ruleForm.uid" placeholder="选择员工" filterable>
                <el-option v-for="item in userList" :key="item.id" :label="item.realName" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="入职时间" prop="enrollTime">
              <el-date-picker v-model="ruleForm.enrollTime" type="date" value-format="x" placeholder="请选择入职时间" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="部门" prop="department">
              <el-input v-model="ruleForm.department" placeholder="部门" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="基础工资" prop="basicSalary">
              <el-input v-model="ruleForm.basicSalary" placeholder="基础工资" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="固定薪资" prop="fixSalary">
              <el-input v-model="ruleForm.fixSalary" placeholder="固定薪资" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="满勤奖" prop="fullAttendanceAward">
              <el-input v-model="ruleForm.fullAttendanceAward" placeholder="满勤奖" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="工龄奖" prop="ageAward">
              <el-input v-model="ruleForm.ageAward" placeholder="工龄奖" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="餐补" prop="dineAllowance">
              <el-input v-model="ruleForm.dineAllowance" placeholder="餐补" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="社保补贴" prop="socialAssuranceAllowance">
              <el-input v-model="ruleForm.socialAssuranceAllowance" placeholder="社保补贴" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="交通补贴" prop="trafficAllowance">
              <el-input v-model="ruleForm.trafficAllowance" placeholder="交通补贴" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="开户银行" prop="bankName">
              <el-input v-model="ruleForm.bankName" placeholder="开户银行" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="银行卡号" prop="bankNo">
              <el-input v-model="ruleForm.bankNo" placeholder="银行卡号" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="onCancel" size="default">取 消</el-button>
          <el-button type="primary" @click="onSubmit" size="default" :loading="loading">{{ dialog.submitTxt }}</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, toRefs, watch } from 'vue'
import { ElForm } from 'element-plus'
import {
  getStaffSalaryDetail,
  addStaffSalary,
  updateStaffSalary,
} from '@/api/finance/salary/index'
import { getUserList } from '@/api/system/user/index'


// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh'])

// 定义变量内容
const dialogFormRef = ref(ElForm)
const state = reactive({
  loading: false,
  ruleForm: {} as any,
  rules: {
    uid: [{ required: true, trigger: 'blur', message: '请选择员工' }],
    enrollTime: [{ required: true, trigger: 'blur', message: '请填写入职时间' }],
  },
  userList: [] as any,
  dialog: {
    isShowDialog: false,
    type: '',
    title: '',
    submitTxt: '',
  },
})

const { loading, ruleForm, rules, userList, dialog } =
  toRefs(state)


// 获取员工列表
const getUserListData = () => {
  getUserList().then((data: any) => {
    state.userList = data.list
  })
}

// 打开弹窗
const openDialog = (type: string, row: any) => {
  getUserListData()
  state.dialog.type = type
  state.dialog.isShowDialog = true
  if (type === 'edit') {
    state.dialog.title = '修改工资配置'
    state.dialog.submitTxt = '修 改'
  } else {
    state.dialog.title = '新增工资配置'
    state.dialog.submitTxt = '新 增'
  }
  if (type === 'edit') {
    getStaffSalaryDetail({
      id: row.id,
    }).then((res) => {
      state.ruleForm = {
        id: row.id,
        uid: row.uid,
        enrollTime: row.enrollTime,
        department: res.department,
        basicSalary: res.basicSalary / 100,
        fixSalary: res.fixSalary / 100,
        dineAllowance: res.dineAllowance / 100,
        socialAssuranceAllowance: res.socialAssuranceAllowance / 100,
        trafficAllowance: res.trafficAllowance / 100,
        bankNo: res.bankNo,
        bankName: res.bankName,
        fullAttendanceAward: res.fullAttendanceAward / 100,
        ageAward: res.ageAward / 100,
      }
    })
  } else {
    state.ruleForm = {
      uid: '',
      enrollTime: '',
      department: '',
      basicSalary: '',
      fixSalary: '',
      dineAllowance: '',
      socialAssuranceAllowance: '',
      trafficAllowance: '',
      bankNo: '',
      bankName: '',
      fullAttendanceAward: '',
      ageAward: ''
    }
  }
}
// 关闭弹窗
const closeDialog = () => {
  state.dialog.isShowDialog = false
}
// 取消
const onCancel = () => {
  closeDialog()
}

// 提交
const onSubmit = () => {
  const ruleForm = JSON.parse(JSON.stringify(state.ruleForm))
  ruleForm.basicSalary = Math.round(ruleForm.basicSalary * 100)
  ruleForm.fixSalary = Math.round(ruleForm.fixSalary * 100)
  ruleForm.dineAllowance = Math.round(ruleForm.dineAllowance * 100)
  ruleForm.socialAssuranceAllowance = Math.round(ruleForm.socialAssuranceAllowance * 100)
  ruleForm.trafficAllowance = Math.round(ruleForm.trafficAllowance * 100)
  ruleForm.fullAttendanceAward = Math.round(ruleForm.fullAttendanceAward * 100)
  ruleForm.ageAward = Math.round(ruleForm.ageAward * 100)
  dialogFormRef.value.validate((valid: boolean) => {
    if (valid) {
      state.loading = true
      if (state.dialog.type === 'add') {
        addStaffSalary(ruleForm)
          .then((res) => {
            state.loading = false
            closeDialog()
            emit('refresh')
          })
          .catch(() => {
            state.loading = false
          })
      } else {
        updateStaffSalary(ruleForm)
          .then(() => {
            state.loading = false
            closeDialog()
            emit('refresh')
          })
          .catch(() => {
            state.loading = false
          })
      }
    } else {
      return false
    }
  })
}

// 暴露变量
defineExpose({
  openDialog,
})
</script>
