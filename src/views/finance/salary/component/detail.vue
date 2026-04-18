<template>
  <div class="dialog-container">
    <el-dialog title="修改工资" v-model="isShowDialog" width="800px" :close-on-click-modal="false" :destroy-on-close="true">
      <el-form ref="dialogFormRef" :model="ruleForm" :rules="rules" size="default" label-width="100px">
        <el-row :gutter="35">
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="员工">
              {{ ruleForm.userName }}
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="出勤天数" prop="workDays">
              <el-input v-model="ruleForm.workDays" placeholder="出勤天数" clearable></el-input>
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
            <el-form-item label="会员提成" prop="memberAward">
              <el-input v-model="ruleForm.memberAward" placeholder="会员提成" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="单品提成" prop="productAward">
              <el-input v-model="ruleForm.productAward" placeholder="单品提成" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="社保扣减" prop="socialAssuranceDeduction">
              <el-input v-model="ruleForm.socialAssuranceDeduction" placeholder="社保扣减" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="满勤扣减" prop="attendanceDeduction">
              <el-input v-model="ruleForm.attendanceDeduction" placeholder="满勤扣减" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="损坏扣减" prop="brokenDeduction">
              <el-input v-model="ruleForm.brokenDeduction" placeholder="损坏扣减" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="其他扣减" prop="otherDeduction">
              <el-input v-model="ruleForm.otherDeduction" placeholder="其他扣减" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="奖金" prop="bonus">
              <el-input v-model="ruleForm.bonus" placeholder="奖金" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="预支" prop="payAdvanceSalary">
              <el-input v-model="ruleForm.payAdvanceSalary" placeholder="预支" clearable></el-input>
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
          <el-button type="primary" @click="onSubmit" size="default" :loading="loading">修改</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, toRefs } from 'vue'
import { ElForm } from 'element-plus'
import {
  getSalaryDetail,
  updateSalary,
} from '@/api/finance/salary/index'


// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh'])

// 定义变量内容
const dialogFormRef = ref(ElForm)
const state = reactive({
  loading: false,
  ruleForm: {} as any,
  rules: {
  },
  isShowDialog: false,
})

const { loading, ruleForm, rules, isShowDialog } =
  toRefs(state)


// 打开弹窗
const openDialog = (row: any) => {
  state.isShowDialog = true
  getSalaryDetail({
    id: row.id,
  }).then((res) => {
    state.ruleForm = {
      id: row.id,
      userName: res.userName,
      basicSalary: res.basicSalary / 100,
      fixSalary: res.fixSalary / 100,
      dineAllowance: res.dineAllowance / 100,
      socialAssuranceAllowance: res.socialAssuranceAllowance / 100,
      trafficAllowance: res.trafficAllowance / 100,
      fullAttendanceAward: res.fullAttendanceAward / 100,
      ageAward: res.ageAward / 100,
      memberAward: res.memberAward / 100,
      productAward: res.productAward / 100,
      socialAssuranceDeduction: res.socialAssuranceDeduction / 100,
      attendanceDeduction: res.attendanceDeduction / 100,
      otherDeduction: res.otherDeduction / 100,
      brokenDeduction: res.brokenDeduction / 100,
      payAdvanceSalary: res.payAdvanceSalary / 100,
      bankNo: res.bankNo,
      bankName: res.bankName,
      workDays: res.workDays,
      bonus: res.bonus / 100
    }
  })
}
// 关闭弹窗
const closeDialog = () => {
  state.isShowDialog = false
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
  ruleForm.memberAward = Math.round(ruleForm.memberAward * 100)
  ruleForm.productAward = Math.round(ruleForm.productAward * 100)
  ruleForm.socialAssuranceDeduction = Math.round(ruleForm.socialAssuranceDeduction * 100)
  ruleForm.attendanceDeduction = Math.round(ruleForm.attendanceDeduction * 100)
  ruleForm.otherDeduction = Math.round(ruleForm.otherDeduction * 100)
  ruleForm.brokenDeduction = Math.round(ruleForm.brokenDeduction * 100)
  ruleForm.payAdvanceSalary = Math.round(ruleForm.payAdvanceSalary * 100)
  ruleForm.bonus = Math.round(ruleForm.bonus * 100)
  dialogFormRef.value.validate((valid: boolean) => {
    if (valid) {
      state.loading = true
      updateSalary(ruleForm)
        .then(() => {
          state.loading = false
          closeDialog()
          emit('refresh')
        })
        .catch(() => {
          state.loading = false
        })
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
