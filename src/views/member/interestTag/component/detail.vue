<template>
  <div class="interest-tag-detail-container">
    <el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="769px">
      <el-form ref="interestTagFormRef" :model="state.ruleForm" :rules="state.rules" size="default" label-width="90px">
        <el-row :gutter="35">
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="标签名称" prop="tagName">
              <el-input v-model="state.ruleForm.tagName" placeholder="请输入标签名称" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="排序" prop="sortOrder">
              <el-input-number v-model="state.ruleForm.sortOrder" controls-position="right" placeholder="请输入排序" class="w100" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
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
          <el-button @click="onCancel" size="default">取 消</el-button>
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

// 定义子组件向父组件传值的方法
const emit = defineEmits(['refresh'])

// 定义变量
const interestTagFormRef = ref()
const state = reactive({
  ruleForm: {
    id: '',
    tagName: '',
    sortOrder: 1,
    status: 1,
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

// 打开弹窗
const openDialog = (row?: any) => {
  resetForm()
  if (row) {
    state.dialog.type = 'edit'
    state.dialog.title = '修改兴趣标签'
    state.dialog.submitBtn = '修 改'
    // 获取详情信息
    getInterestTag(row.id).then((res: any) => {
      state.ruleForm = res
    })
  } else {
    state.dialog.type = 'add'
    state.dialog.title = '新增兴趣标签'
    state.dialog.submitBtn = '新 增'
  }
  state.dialog.isShowDialog = true
}

// 取消
const onCancel = () => {
  state.dialog.isShowDialog = false
}

// 提交
const onSubmit = () => {
  interestTagFormRef.value.validate((valid: boolean) => {
    if (valid) {
      state.dialog.submitLoading = true
      if (state.dialog.type === 'add') {
        addInterestTag(state.ruleForm)
          .then(() => {
            ElMessage.success('新增成功')
            state.dialog.isShowDialog = false
            emit('refresh')
          })
          .finally(() => {
            state.dialog.submitLoading = false
          })
      } else {
        updateInterestTag(state.ruleForm.id, state.ruleForm)
          .then(() => {
            ElMessage.success('修改成功')
            state.dialog.isShowDialog = false
            emit('refresh')
          })
          .finally(() => {
            state.dialog.submitLoading = false
          })
      }
    }
  })
}

// 重置表单
const resetForm = () => {
  state.ruleForm = {
    id: '',
    tagName: '',
    sortOrder: 1,
    status: 1,
  }
  nextTick(() => {
    if (interestTagFormRef.value) {
      interestTagFormRef.value.resetFields()
    }
  })
}

// 暴露变量
defineExpose({
  openDialog,
})
</script>

<style scoped lang="scss">
</style>
