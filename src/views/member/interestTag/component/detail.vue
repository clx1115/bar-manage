<template>
  <div class="interest-tag-detail-container">
    <el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="640px" :close-on-click-modal="false">
      <el-form ref="interestTagFormRef" class="dialog-form" :model="state.ruleForm" :rules="state.rules" size="default" label-width="90px">
        <el-row :gutter="24">
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item label="标签名称" prop="tagName">
              <el-input v-model="state.ruleForm.tagName" placeholder="请输入标签名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item label="排序" prop="sortOrder">
              <el-input-number v-model="state.ruleForm.sortOrder" controls-position="right" placeholder="请输入排序" class="w100" :min="0" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <el-form-item label="状态" prop="status">
              <el-radio-group v-model="state.ruleForm.status">
                <el-radio :label="1">启用</el-radio>
                <el-radio :label="0">停用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="onCancel" size="default">取消</el-button>
          <el-button type="primary" @click="onSubmit" size="default" :loading="state.dialog.submitLoading">{{ state.dialog.submitBtn }}</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="interestTagDetail">
import { reactive, ref, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { addInterestTag, updateInterestTag, getInterestTag } from '@/api/member/interestTag'

const emit = defineEmits(['refresh'])

const interestTagFormRef = ref()
const state = reactive({
  ruleForm: {
    id: '',
    orgId: '',
    tagName: '',
    sortOrder: 1,
    status: 1,
    createTime: undefined,
    updateTime: undefined,
  },
  rules: {
    tagName: [{ required: true, message: '请输入标签名称', trigger: 'blur' }],
  },
  dialog: {
    isShowDialog: false,
    type: '',
    title: '',
    submitBtn: '',
    submitLoading: false,
  },
})

const openDialog = (row?: any) => {
  resetForm()
  if (row) {
    state.dialog.type = 'edit'
    state.dialog.title = '修改兴趣标签'
    state.dialog.submitBtn = '修改'
    getInterestTag(row.id).then((res: any) => {
      state.ruleForm = {
        id: res.id,
        orgId: res.orgId,
        tagName: res.tagName,
        sortOrder: res.sortOrder,
        status: res.status,
        createTime: res.createTime,
        updateTime: res.updateTime,
      }
    })
  } else {
    state.dialog.type = 'add'
    state.dialog.title = '新增兴趣标签'
    state.dialog.submitBtn = '新增'
  }
  state.dialog.isShowDialog = true
}

const onCancel = () => {
  state.dialog.isShowDialog = false
}

const onSubmit = () => {
  interestTagFormRef.value.validate((valid: boolean) => {
    if (!valid) return
    state.dialog.submitLoading = true
    const formData = JSON.parse(JSON.stringify(state.ruleForm))
    const request = state.dialog.type === 'add'
      ? addInterestTag(formData)
      : updateInterestTag(formData.id, formData)

    request
      .then(() => {
        ElMessage.success(state.dialog.type === 'add' ? '新增成功' : '修改成功')
        state.dialog.isShowDialog = false
        emit('refresh')
      })
      .finally(() => {
        state.dialog.submitLoading = false
      })
  })
}

const resetForm = () => {
  state.ruleForm = {
    id: '',
    orgId: '',
    tagName: '',
    sortOrder: 1,
    status: 1,
    createTime: undefined,
    updateTime: undefined,
  }
  nextTick(() => {
    interestTagFormRef.value?.resetFields()
  })
}

defineExpose({
  openDialog,
})
</script>

<style scoped lang="scss">
.w100 {
  width: 100%;
}

.dialog-form :deep(.el-form-item) {
  margin-bottom: 20px;
}

:deep(.el-dialog__body) {
  padding-top: 12px;
}
</style>
