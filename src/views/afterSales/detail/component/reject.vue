<template>
  <div class="dialog-container">
    <el-dialog title="拒绝退货退款" v-model="isShowDialog" width="500px" :close-on-click-modal="false" :destroy-on-close="true">
      <el-form ref="dialogFormRef" :model="ruleForm" :rules="rules" size="default" label-width="120px">
        <el-form-item label="拒绝原因" prop="auditReason">
          <el-input v-model="ruleForm.auditReason" placeholder="拒绝原因" />
        </el-form-item>
        <el-form-item label="备注" prop="auditRemark">
          <el-input v-model="ruleForm.auditRemark" placeholder="备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="onCancel" size="default">取 消</el-button>
          <el-button type="primary" @click="onSubmit" size="default" :loading="loading">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, toRefs, ref } from 'vue'
import { ElForm, ElMessageBox, ElMessage } from 'element-plus'
import { handleOrderReturn } from '@/api/afterSales/index'

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh'])

// 定义变量内容
const dialogFormRef = ref(ElForm)
const state = reactive({
  loading: false,
  ruleForm: {
    returnOrderId: 0,
    returnOrderStatus: -20,
    auditReason: '',
    auditRemark: ''
  },
  rules: {
    auditReason: [{ required: true, trigger: 'blur', message: '请填写拒绝原因' }],
  },
  isShowDialog: false,
})

const { loading, ruleForm, rules, isShowDialog } = toRefs(state)

// 打开弹窗
const openDialog = (returnId: number) => {
  state.isShowDialog = true
  state.ruleForm.returnOrderId = returnId
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
  dialogFormRef.value.validate((valid: boolean) => {
    if (valid) {
      state.loading = true
      ElMessageBox.confirm(`是否确认操作?`, '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          handleOrderReturn(state.ruleForm)
            .then(() => {
              ElMessage({
                message: '操作成功.',
                type: 'success',
              })
              state.loading = false
              closeDialog()
              emit('refresh')
            })
            .catch(() => {
              state.loading = false
            })
        })
        .catch(() => { })
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
