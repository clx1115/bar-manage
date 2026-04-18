<template>
  <div class="dialog-container">
    <el-dialog :title="dialog.title" v-model="dialog.isShowDialog" width="800px" :close-on-click-modal="false" :destroy-on-close="true">
      <el-form ref="dialogFormRef" :model="ruleForm" :rules="rules" size="default" label-width="120px">
        <el-row :gutter="35">
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="所属专区" prop="name">
              <el-select v-model="ruleForm.activityId" placeholder="选择专区" filterable>
                <el-option v-for="item in activityList" :key="item.id" :label="item.title" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="分类名称" prop="name">
              <el-input v-model="ruleForm.name" placeholder="请输入分类名称" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="选中图标" prop="poster">
              <upload-img v-model="ruleForm.poster" :width="80" :height="80" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="未选中图标" prop="imgUrl">
              <upload-img v-model="ruleForm.imgUrl" :width="80" :height="80" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="排列序号" prop="sort">
              <el-input v-model="ruleForm.sort" placeholder="请输入排列序号，值越大越靠前" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="分类状态">
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
import {
  getCategroyDetail,
  addCategroy,
  updateCategroy,
} from '@/api/activity/category/index'
import {
  getActivityList
} from '@/api/activity/index'
import UploadImg from '@/components/upload/uploadImg.vue'


// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh'])

// 定义变量内容
const dialogFormRef = ref(ElForm)
const state = reactive({
  loading: false,
  ruleForm: {} as any,
  rules: {
    activityId: [{ required: true, trigger: 'blur', message: '请选择专区' }],
    name: [{ required: true, trigger: 'blur', message: '请填写分类名称' }],
    sort: [{ required: true, trigger: 'blur', message: '请填写排列序号' }],
  },
  dialog: {
    isShowDialog: false,
    type: '',
    title: '',
    submitTxt: '',
  },
  activityList: [] as any
})

const { loading, ruleForm, rules, dialog, activityList } =
  toRefs(state)

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
    getCategroyDetail({
      id: row.id,
    }).then((res) => {
      state.ruleForm = {
        id: row.id,
        activityId: row.activityId,
        parentId: res.parentId,
        name: res.name,
        poster: res.poster,
        imgUrl: res.imgUrl,
        show: res.show,
        sort: res.sort,
      }
    })
  } else {
    state.ruleForm = {
      parentId: 0,
      activityId: '',
      name: '',
      poster: '',
      imgUrl: '',
      show: 1,
      sort: 1,
    }
  }
  getActivityListData()
}


// 获取列表
const getActivityListData = () => {
  getActivityList({ page: 0 }).then((data: any) => {
    state.activityList = data.list
  })
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
  ruleForm.discountJson = JSON.stringify(ruleForm.discountJson)
  dialogFormRef.value.validate((valid: boolean) => {
    if (valid) {
      state.loading = true
      if (state.dialog.type === 'add') {
        addCategroy(ruleForm)
          .then((res) => {
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
