<template>
  <el-dialog v-model="visible" title="平台直接退款" width="500px" @close="onClose">
    <el-form :model="formData" label-width="100px" status-icon>
      <el-form-item label="订单ID" prop="orderId" required>
        <el-input v-model.number="formData.orderId" placeholder="请输入订单ID" />
      </el-form-item>
      <el-form-item label="退款金额" prop="amount" required>
        <el-input v-model.number="formData.amount" placeholder="请输入金额（单位：元）">
          <template #append>元</template>
        </el-input>
      </el-form-item>
      <div class="tip" style="margin-left: 100px; color: #999; font-size: 12px; margin-bottom: 20px;">
        提示：金额将直接退还给用户，请核对订单ID。
      </div>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" :loading="loading" @click="onSubmit">确定退款</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { directRefundOrder } from '@/api/afterSales/index'

const visible = ref(false)
const loading = ref(false)
const formData = reactive({
  orderId: undefined as number | undefined,
  amount: undefined as number | undefined,
})

const emit = defineEmits(['refresh'])

const openDialog = (orderId?: number) => {
  if (orderId) {
    formData.orderId = orderId
  }
  visible.value = true
}

const onClose = () => {
  formData.orderId = undefined
  formData.amount = undefined
}

const onSubmit = () => {
  if (!formData.orderId) {
    return ElMessage.warning('请输入订单ID')
  }
  if (!formData.amount || formData.amount <= 0) {
    return ElMessage.warning('请输入正确的退款金额')
  }

  ElMessageBox.confirm('是否确认直接退款？此操作不可撤销。', '警告', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    loading.value = true
    const amount = formData.amount || 0
    directRefundOrder({
      orderId: formData.orderId,
      amount: Math.round(amount * 100), // 转换为分
    }).then(() => {
      ElMessage.success('退款成功')
      visible.value = false
      emit('refresh')
    }).finally(() => {
      loading.value = false
    })
  }).catch(() => {})
}

defineExpose({
  openDialog,
})
</script>
