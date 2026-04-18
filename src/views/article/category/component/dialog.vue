<template>
  <div class="dialog-container">
    <el-dialog :title="dialog.title" v-model="dialog.isShowDialog" width="500px" :close-on-click-modal="false"
      :destroy-on-close="true">
      <el-form ref="dialogFormRef" :model="ruleForm" :rules="rules" size="default" label-width="90px">
        <el-row :gutter="35">
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="分类图片" prop="headPic">
              <upload-img v-model="ruleForm.headPic" :width="80" :height="80" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="分类名称" prop="name">
              <el-input v-model="ruleForm.name" placeholder="请输入分类名称" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="分类描述" prop="note">
              <el-input v-model="ruleForm.note" type="textarea" placeholder="请输入分类描述" maxlength="150"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="排列序号" prop="sort">
              <el-input v-model="ruleForm.sort" placeholder="请输入排列序号，值越大越靠前" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="分类状态">
              <el-switch v-model="ruleForm.status" inline-prompt :active-value="1" :inactive-value="2" active-text="启"
                inactive-text="禁"></el-switch>
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
  getCategroyList,
  getCategroyDetail,
  addCategroy,
  updateCategroy,
} from '@/api/article/category/index'
import UploadImg from '@/components/upload/uploadImg.vue'

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh'])

// 定义变量内容
const dialogFormRef = ref(ElForm)
const state = reactive({
  loading: false,
  ruleForm: {} as any,
  rules: {
    name: [{ required: true, trigger: 'blur', message: '请填写分类名称' }],
    sort: [{ required: true, trigger: 'blur', message: '请填写排列序号' }],
  },
  cateList: [] as any,
  selectCateValue: [],
  dialog: {
    isShowDialog: false,
    type: '',
    title: '',
    submitTxt: '',
  },
})

const { loading, ruleForm, rules, cateList, selectCateValue, dialog } =
  toRefs(state)

watch(selectCateValue, (newValue: any) => {
  state.ruleForm.parentId = newValue[newValue.length - 1]
})

// 打开弹窗
const openDialog = (type: string, row: any) => {
  state.dialog.type = type
  state.dialog.isShowDialog = true
  state.selectCateValue = []
  if (type === 'edit') {
    state.dialog.title = '修改分类'
    state.dialog.submitTxt = '修 改'
    getCategroyDetail({
      id: row.id,
    }).then((res) => {
      console.log(11, res)
      state.ruleForm = {
        id: res.articleCategory.id,
        parentId: res.articleCategory.parentId,
        headPic: res.articleCategory.headPic,
        name: res.articleCategory.name,
        description: res.articleCategory.description,
        status: res.articleCategory.status,
        categoryType: res.articleCategory.categoryType,
        sort: res.articleCategory.sort,
        displayMode: res.articleCategory.displayMode,
        note: res.articleCategory.note,
      }
      const arr = [] as any
      if (arr.length === 0) {
        state.selectCateValue = []
      } else {
        state.selectCateValue = arr
      }
    })
  } else {
    state.dialog.title = '新增分类'
    state.dialog.submitTxt = '新 增'
    state.ruleForm = {
      parentId: '',
      headPic: '',
      name: '',
      description: '',
      status: 1,
      categoryType: 10,
      sort: 1,
      displayMode: '1',
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
  dialogFormRef.value.validate((valid: boolean) => {
    if (valid) {
      state.loading = true
      if (state.dialog.type === 'add') {
        addCategroy(ruleForm)
          .then(() => {
            state.loading = false
            closeDialog()
            emit('refresh')
          })
          .catch(() => {
            state.loading = false
          })
      } else {
        updateCategroy(ruleForm)
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
