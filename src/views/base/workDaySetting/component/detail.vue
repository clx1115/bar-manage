<template>
  <div class="dialog-container">
    <el-dialog :title="dialog.title" v-model="dialog.isShowDialog" width="500px" :close-on-click-modal="false" :destroy-on-close="true">
      <el-form ref="dialogFormRef" :model="ruleForm" :rules="rules" size="default" label-width="100px">
        <el-row :gutter="35">
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="月份" prop="month">
              <el-date-picker v-model="ruleForm.month" type="month" clearable value-format="YYYYMM" placeholder="请选择时间" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="考勤天数" prop="workDay">
              <el-input v-model="ruleForm.workDay" placeholder="请输入考勤天数" clearable></el-input>
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
import { reactive, ref, toRefs } from 'vue'
import { ElForm } from 'element-plus'
import {
  getWorkDaySettingDetail,
  addWorkDaySetting,
  updateWorkDaySetting,
} from '@/api/base/workDaySetting/index'


// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh'])

// 定义变量内容
const dialogFormRef = ref(ElForm)
const state = reactive({
  loading: false,
  ruleForm: {} as any,
  rules: {
    month: [{ required: true, trigger: 'blur', message: '请选择考勤月份' }],
    workDay: [{ required: true, trigger: 'blur', message: '请填写考勤天数' }],
  },
  dialog: {
    isShowDialog: false,
    type: '',
    title: '',
    submitTxt: '',
  },
})

const { loading, ruleForm, rules, dialog } =
  toRefs(state)



// 打开弹窗
const openDialog = (type: string, row: any) => {
  state.dialog.type = type
  state.dialog.isShowDialog = true
  if (type === 'edit') {
    state.dialog.title = '修改考勤天数'
    state.dialog.submitTxt = '修 改'
  } else {
    state.dialog.title = '新增考勤天数'
    state.dialog.submitTxt = '新 增'
  }
  if (type === 'edit') {
    getWorkDaySettingDetail({
      id: row.id,
    }).then((res) => {
      state.ruleForm = {
        id: res.id,
        month: row.month,
        workDay: res.workDay
      }
    })
  } else {
    state.ruleForm = {
      month: '',
      workDay: '',
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
  dialogFormRef.value.validate((valid: boolean) => {
    if (valid) {
      state.loading = true
      if (state.dialog.type === 'add') {
        addWorkDaySetting(state.ruleForm)
          .then((res) => {
            state.loading = false
            closeDialog()
            emit('refresh')
          })
          .catch(() => {
            state.loading = false
          })
      } else {
        updateWorkDaySetting(state.ruleForm)
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
