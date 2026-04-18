<template>
  <div class="dialog-container">
    <el-dialog title="添加手机号" v-model="dialog.isShowDialog" width="800px" :close-on-click-modal="false"
      :destroy-on-close="true">
      <el-form ref="dialogFormRef" :model="ruleForm" :rules="rules" size="default" label-width="120px">
        <el-row :gutter="35">
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="手机号" prop="phone">
              <el-input type="textarea" :rows="5" placeholder="请输入手机号" v-model="ruleForm.phone">
              </el-input>
              <div class="info" style="margin-top: 10px;">最多支持200个手机号，仅支持本店大陆手机号，多个手机号用逗号分隔，例：18755555667,15566667777
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="onCancel" size="default">取 消</el-button>
          <el-button type="primary" @click="onSubmit" size="default" :loading="loading">下一步</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, toRefs } from 'vue'
import { ElForm } from 'element-plus'
// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh'])
// 定义变量内容
const dialogFormRef = ref(ElForm)
const state = reactive({
  loading: false,
  ruleForm: {} as any,
  rules: {},
  dialog: {
    isShowDialog: false,
  },
  compare: [{
    label: '大于',
    value: 1
  }, {
    label: '小于',
    value: 2
  }, {
    label: '区间',
    value: 3
  }]
})

const { loading, ruleForm, rules, dialog, compare } = toRefs(state)

// 打开弹窗
const openDialog = (row: any) => {
  state.ruleForm = {
    phone: '',
  }
  state.dialog.isShowDialog = true
}
// 关闭弹窗
const closeDialog = () => {
  state.dialog.isShowDialog = false
}
// 取消
const onCancel = () => {
  closeDialog()
}

// 选择商品
const selectProduct = () => { }
// 提交
const onSubmit = () => {
  state.loading = false
  closeDialog()
  emit('refresh')
}
// 暴露变量
defineExpose({
  openDialog,
})
</script>

<style lang="scss" scoped>
.f-ac {
  display: flex;
  align-items: center;
}

.info {
  // margin-left: 22px;
  margin-bottom: 4px;
  line-height: 1;
  font-size: 12px;
  color: #999;
}

:deep(.el-form-item__content) {
  flex-direction: column;
  align-items: flex-start;
}
</style>