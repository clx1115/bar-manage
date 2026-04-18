<template>
  <div class="dialog-container">
    <el-dialog :title="dialog.title" v-model="dialog.isShowDialog" width="500px" :close-on-click-modal="false"
      :destroy-on-close="true">
      <el-form ref="dialogFormRef" :model="ruleForm" :rules="rules" size="default" label-width="90px">
        <el-row :gutter="35">
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="分类名称" prop="name">
              <el-input v-model="ruleForm.name" placeholder="请输入分类名称" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="分类封面" prop="poster">
              <upload-img v-model="ruleForm.poster" :width="80" :height="80" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="排列序号" prop="sort">
              <el-input v-model="ruleForm.sort" placeholder="请输入排列序号，值越大越靠前" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="分类状态">
              <el-switch v-model="ruleForm.show" inline-prompt :active-value="1" :inactive-value="2" active-text="启"
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
  getCategoryList,
  getCategoryDetail,
  addCategory,
  updateCategory,
} from '@/api/integral/category/index'

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
  selectCateValue: [] as any,
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
  if (type === 'edit') {
    state.dialog.title = '修改分类'
    state.dialog.submitTxt = '修 改'
  } else {
    state.dialog.title = '新增分类'
    state.dialog.submitTxt = '新 增'
  }
  if (type === 'edit') {
    getCategoryDetail({
      id: row.id,
    }).then((res) => {
      state.ruleForm = {
        id: row.id,
        parentId: res.parentId,
        name: res.name,
        poster: res.poster,
        show: res.show,
        sort: res.sort,
      }
      const pathArray = res.path.split('/')
      const arr = [] as any
      pathArray.map((val: any) => {
        if (val !== '' && val !== undefined) {
          arr.push(parseInt(val))
        }
      })
      if (arr.length === 0) {
        state.selectCateValue = [0]
      } else {
        state.selectCateValue = arr
      }
    })
  } else {
    state.ruleForm = {
      parentId: '',
      name: '',
      poster: '',
      show: 1,
      sort: 1
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
        addCategory(ruleForm)
          .then((res) => {
            state.loading = false
            closeDialog()
            emit('refresh')
          })
          .catch(() => {
            state.loading = false
          })
      } else {
        updateCategory(ruleForm)
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
