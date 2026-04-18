<template>
  <div class="dialog-container">
    <el-dialog :title="dialog.title" v-model="dialog.isShowDialog" width="600px" :close-on-click-modal="false" :destroy-on-close="true">
      <el-form ref="dialogFormRef" :model="ruleForm" :rules="rules" size="default" label-width="80px">
        <el-row :gutter="35">
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="专区标题" prop="title">
              <el-input v-model="ruleForm.title" placeholder="请输入专区标题" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="副标题" prop="subTitle">
              <el-input v-model="ruleForm.subTitle" placeholder="请输入副标题" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="背景颜色" prop="bgColor">
              <el-color-picker v-model="ruleForm.bgColor" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="跳转路径" prop="pageUrl">
              <el-input v-model="ruleForm.pageUrl" placeholder="请输入跳转路径" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="封面图" prop="headPic">
              <upload-img v-model="ruleForm.headPic" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="活动日期">
              <el-space>
                <el-date-picker v-model="ruleForm.beginTime" type="datetime" value-format="x" placeholder="请选择活动开始日期" />~
                <el-date-picker v-model="ruleForm.endTime" type="datetime" value-format="x" placeholder="请选择活动结束日期" />
              </el-space>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="活动时间">
              <el-space>
                <el-input v-model="ruleForm.beginHour" style="width: 100px;" clearable></el-input>点~
                <el-input v-model="ruleForm.endHour" style="width: 100px;" clearable></el-input>点
              </el-space>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="状态">
              <el-radio-group v-model="ruleForm.status">
                <el-radio :label="1">未上线</el-radio>
                <el-radio :label="2">未开始</el-radio>
                <el-radio :label="3">进行中</el-radio>
                <el-radio :label="4">已结束</el-radio>
                <el-radio :label="5">已关闭</el-radio>
              </el-radio-group>
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
import UploadImg from '@/components/upload/uploadImg.vue'
import {
  getActivityDetail,
  addActivity,
  updateActivity,
} from '@/api/activity/index'

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh'])

// 定义变量内容
const dialogFormRef = ref(ElForm)
const state = reactive({
  loading: false,
  ruleForm: {} as any,
  rules: {
    title: [
      { required: true, trigger: 'blur', message: '请填写专区标题' },
    ],
    sort: [{ required: true, trigger: 'blur', message: '请填写排列序号' }],
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
const openDialog = (type: string, row: any) => {
  if (type === 'edit') {
    state.dialog.title = '修改归集'
    state.dialog.submitTxt = '修 改'
    getActivityDetail({
      id: row.id,
    }).then((res) => {
      state.ruleForm = {
        id: row.id,
        title: res.title,
        subTitle: res.subTitle,
        headPic: res.headPic,
        pageUrl: res.pageUrl,
        status: res.status,
        rulesUrl: res.rulesUrl,
        bgColor: res.bgColor,
        beginTime: res.beginTime * 1000,
        endTime: res.endTime * 1000,
        beginHour: res.beginHour,
        endHour: res.endHour
      }
    })
  } else {
    state.dialog.title = '新增归集'
    state.dialog.submitTxt = '新 增'
    state.ruleForm = {
      title: '',
      subTitle: '',
      headPic: '',
      pageUrl: '',
      status: 1,
      rulesUrl: '',
      bgColor: '',
      beginTime: '',
      endTime: '',
      beginHour: '',
      endHour: ''
    }
  }
  state.dialog.type = type
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

// 提交
const onSubmit = () => {
  const ruleForm = JSON.parse(JSON.stringify(state.ruleForm))
  ruleForm.beginTime = ruleForm.beginTime / 1000
  ruleForm.endTime = ruleForm.endTime / 1000
  dialogFormRef.value.validate((valid: boolean) => {
    if (valid) {
      state.loading = true
      if (state.dialog.type === 'add') {
        addActivity(ruleForm)
          .then(() => {
            state.loading = false
            closeDialog()
            emit('refresh')
          })
          .catch(() => {
            state.loading = false
          })
      } else {
        updateActivity(ruleForm)
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
