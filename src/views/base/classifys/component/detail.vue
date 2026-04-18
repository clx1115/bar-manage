<template>
  <div class="dialog-container">
    <el-dialog :title="dialog.title" v-model="dialog.isShowDialog" width="800px" :close-on-click-modal="false" :destroy-on-close="true">
      <el-form ref="dialogFormRef" :model="ruleForm" :rules="rules" size="default" label-width="120px">
        <el-row :gutter="35">
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="归集类型" prop="classifyType">
              <el-select v-model="ruleForm.classifyType" style="width: 100%">
                <el-option :value="1" label="新品上市" />
                <el-option :value="2" label="热门推荐" />
                <el-option :value="3" label="热门类型" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="主标题" prop="classifyCode">
              <el-input v-model="ruleForm.classifyCode" placeholder="请输入归集编号" clearable></el-input>
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
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="文字颜色" prop="fontColor">
              <el-color-picker v-model="ruleForm.fontColor" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="展示类型" prop="activityType">
              <el-select v-model="ruleForm.activityType" style="width: 100%">
                <el-option :value="1" label="默认" />
                <el-option :value="2" label="新品" />
                <el-option :value="3" label="热销" />
                <el-option :value="4" label="招牌" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="商品显示数量" prop="itemSize">
              <el-input v-model="ruleForm.itemSize" placeholder="请输入商品显示数量" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="跳转路径" prop="linkUrl">
              <el-input v-model="ruleForm.linkUrl" placeholder="请输入跳转路径" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="图片高度" prop="height">
              <el-input v-model="ruleForm.height" placeholder="请输入图片高度" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="封面图或图标" prop="icon">
              <upload-img v-model="ruleForm.icon" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="背景图片" prop="headPic">
              <upload-img v-model="ruleForm.headPic" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="排列序号" prop="sort">
              <el-input v-model="ruleForm.sort" placeholder="请输入排列序号，值越大越靠前" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="状态">
              <el-switch v-model="ruleForm.status" inline-prompt :active-value="1" :inactive-value="2" active-text="显示" inactive-text="隐藏"></el-switch>
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
  getClassifysDetail,
  addClassifys,
  updateClassifys,
} from '@/api/base/classifys/index'

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh'])

// 定义变量内容
const dialogFormRef = ref(ElForm)
const state = reactive({
  loading: false,
  ruleForm: {} as any,
  rules: {
    classifyCode: [
      { required: true, trigger: 'blur', message: '请填写归集编号' },
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
    getClassifysDetail({
      id: row.id,
    }).then((res) => {
      state.ruleForm = {
        id: row.id,
        classifyCode: res.classifyCode,
        subTitle: res.subTitle,
        classifyType: res.classifyType,
        activityType: res.activityType,
        status: res.status,
        sort: res.sort,
        bgColor: res.bgColor,
        fontColor: res.fontColor,
        height: res.height,
        headPic: res.headPic,
        icon: res.icon,
        linkUrl: res.linkUrl,
        itemSize: res.itemSize,
      }
    })
  } else {
    state.dialog.title = '新增归集'
    state.dialog.submitTxt = '新 增'
    state.ruleForm = {
      classifyCode: '',
      subTitle: '',
      classifyType: 1,
      activityType: 1,
      status: 1,
      sort: 1,
      bgColor: '',
      fontColor: '',
      height: '',
      headPic: '',
      icon: '',
      linkUrl: '',
      itemSize: 5,
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
  console.log(ruleForm)
  dialogFormRef.value.validate((valid: boolean) => {
    if (valid) {
      state.loading = true
      if (state.dialog.type === 'add') {
        addClassifys(ruleForm)
          .then(() => {
            state.loading = false
            closeDialog()
            emit('refresh')
          })
          .catch(() => {
            state.loading = false
          })
      } else {
        updateClassifys(ruleForm)
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
