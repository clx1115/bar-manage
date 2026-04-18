<template>
  <div class="dialog-container">
    <el-dialog :title="dialog.title" v-model="dialog.isShowDialog" width="600px" :close-on-click-modal="false" :destroy-on-close="true">
      <el-form ref="dialogFormRef" :model="ruleForm" :rules="rules" size="default" label-width="120px">
        <el-row :gutter="35">
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="类目名称" prop="name">
              <el-input v-model="ruleForm.name" placeholder="请输入类目名称" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="类目图片" prop="imgUrl">
              <upload-img v-model="ruleForm.imgUrl" :width="100" :height="100" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="显示状态">
              <el-switch v-model="ruleForm.show" inline-prompt :active-value="1" :inactive-value="2" active-text="启" inactive-text="禁"></el-switch>
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
import { addItem, updateItem, getItemDetail } from '@/api/product/item/index'
import UploadImg from '@/components/upload/uploadImg.vue'

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh'])

// 定义变量内容
const dialogFormRef = ref(ElForm)
const state = reactive({
  loading: false,
  ruleForm: {
    name: '',
    imgUrl: '',
    show: 1,
  } as any,
  rules: {
    name: [{ required: true, trigger: 'blur', message: '请填写类目名称' }],
  },
  dialog: {
    isShowDialog: false,
    type: '',
    title: '',
    submitTxt: '',
  },
})

const { loading, ruleForm, rules, dialog } = toRefs(state)

// 打开弹窗
const openDialog = (type: string, row?: any) => {
  state.dialog.type = type
  state.dialog.isShowDialog = true
  if (type === 'edit') {
    state.dialog.title = '修改平台类目'
    state.dialog.submitTxt = '修 改'
    getItemDetail({ id: row.id }).then((res: any) => {
      state.ruleForm = {
        id: res.id,
        name: res.name,
        imgUrl: res.imgUrl,
        show: res.show,
      }
    })
  } else {
    state.dialog.title = '新增平台类目'
    state.dialog.submitTxt = '新 增'
    state.ruleForm = {
      name: '',
      imgUrl: '',
      show: 1,
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
      const apiCall = state.dialog.type === 'add' ? addItem(state.ruleForm) : updateItem(state.ruleForm)
      
      apiCall.then(() => {
        state.loading = false
        closeDialog()
        emit('refresh')
      }).catch(() => {
        state.loading = false
      })
    }
  })
}

// 暴露变量
defineExpose({
  openDialog,
})
</script>
