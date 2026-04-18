<template>
  <div class="dialog-container">
    <el-dialog :title="dialog.title" v-model="dialog.isShowDialog" width="800px" :close-on-click-modal="false" :destroy-on-close="true">
      <el-descriptions class="margin-top" :column="2" size="default" border>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              用户姓名
            </div>
          </template>
          {{ detail.realName }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              用户手机
            </div>
          </template>
          {{ detail.phoneNumber }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              提现金额
            </div>
          </template>
          {{ parseMoney(detail.amount) }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              手续费
            </div>
          </template>
          {{ parseMoney(detail.feeAmount) }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              实提金额
            </div>
          </template>
          {{ parseMoney(detail.realAmount) }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              申请时间
            </div>
          </template>
          {{ formatDate(detail.createTime, 'YYYY-mm-dd HH:MM:SS') }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              提现状态
            </div>
          </template>
          {{ formatWithdrawStatus(detail.status) }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              操作人
            </div>
          </template>
          <span v-if="detail.operatorId > 0">{{ detail.operatorName }}({{ detail.operatorId }})</span>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              备注
            </div>
          </template>
          {{ detail.note }}
        </el-descriptions-item>
      </el-descriptions>
      <div v-if="detail.status === 0 || detail.status === 1" class="setcion-wrap">
        <el-form ref="detailFormRef" :model="ruleForm" :rules="rules" size="default" label-width="90px">
          <el-row :gutter="35">
            <el-col v-if="detail.status === 0" :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
              <el-form-item label="处理结果">
                <el-select v-model="ruleForm.status" placeholder="请选择处理结果" class="w100">
                  <el-option label="同意申请" :value="1" />
                  <el-option label="审核不通过" :value="-1" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col v-if="detail.status === 1" :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
              <el-form-item label="处理结果">
                <el-select v-model="ruleForm.status" placeholder="请选择处理结果" class="w100">
                  <el-option label="完成转账" :value="2" />
                  <el-option label="审核不通过" :value="-1" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
              <el-form-item label="处理意见" prop="note">
                <el-input v-model="ruleForm.note" type="textarea" placeholder="请输入处理意见"></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
              <el-form-item>
                <el-button type="primary" @click="onSubmit" size="default" :loading="loading">提交</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="onCancel" size="default">关 闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, toRefs, ref } from 'vue'
import { ElForm } from 'element-plus'
import { handleWithdraw } from '@/api/finance/withdraw/index'
import { formatDate } from '@/utils/formatTime'
import { parseMoney, formatWithdrawStatus } from '@/utils/filters'

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh'])

// 定义变量内容
const detailFormRef = ref(ElForm)

function validateNote(rule: any, value: any, callback: any) {
  if (state.ruleForm.status === -1 && !value) {
    callback(new Error('请填写审核拒绝理由'))
  } else {
    callback()
  }
}

const state = reactive({
  detail: {} as any,
  ruleForm: {
    id: '',
    status: 0,
    note: '',
  },
  rules: {
    note: [{ required: true, trigger: 'blur', validator: validateNote }],
  },
  loading: false,
  dialog: {
    isShowDialog: false,
    type: '',
    title: '',
  },
})

const { detail, ruleForm, rules, loading, dialog } = toRefs(state)

// 打开弹窗
const openDialog = (type: string, row: any) => {
  state.dialog.type = type
  state.dialog.isShowDialog = true
  state.dialog.title = '提现详情'
  state.detail = row
  state.ruleForm.id = row.id
  if (row.status === 0) {
    state.ruleForm.status = 1
  }
  if (row.status === 1) {
    state.ruleForm.status = 2
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
  detailFormRef.value.validate((valid: boolean) => {
    if (valid) {
      state.loading = true
      handleWithdraw(state.ruleForm)
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
<style lang="scss" scoped>
.setcion-wrap {
  margin-top: 20px;
}
</style>