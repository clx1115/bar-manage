<template>
  <div class="dialog-container">
    <el-dialog title="修改用户资料" v-model="isShowDialog" width="500px" :close-on-click-modal="false" :destroy-on-close="true">
      <el-form ref="dialogFormRef" :model="ruleForm" :rules="rules" size="default" label-width="120px">
        <el-row :gutter="35">
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="用户昵称" prop="nickName">
              <el-input v-model="ruleForm.nickName" placeholder="请输入用户昵称" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="用户姓名" prop="realName">
              <el-input v-model="ruleForm.realName" placeholder="请输入用户姓名" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="备注名" prop="userNote">
              <el-input v-model="ruleForm.userNote" placeholder="请输入备注名" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="用户手机号" prop="phoneNumber">
              <el-input v-model="ruleForm.phoneNumber" placeholder="请输入用户手机号" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="用户等级" prop="level">
              <el-select v-model="ruleForm.level" placeholder="选择用户等级" clearable>
                <el-option v-for="item in levelList" :key="item.id" :label="item.levelName" :value="item.level" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="用户角色" prop="userType">
              <el-select v-model="ruleForm.userType" placeholder="选择用户角色" clearable>
                <el-option v-for="item in userType" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="用户状态" prop="status">
              <el-switch v-model="ruleForm.status" inline-prompt :active-value="1" :inactive-value="2" active-text="正常" inactive-text="锁定"></el-switch>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="onCancel" size="default">取 消</el-button>
          <el-button type="primary" @click="onSubmit" size="default" :loading="loading">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, toRefs, ref } from 'vue'
import { ElForm, ElMessage } from 'element-plus'
import { updateMember, getLevelList } from '@/api/member/index'
import { userType } from '@/dict/member'

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh'])

// 定义变量内容
const dialogFormRef = ref(ElForm)
const state = reactive({
  loading: false,
  ruleForm: {} as any,
  rules: {
  },
  isShowDialog: false,
  levelList: [] as any,
})

const { loading, ruleForm, rules, isShowDialog, levelList } = toRefs(state)

const getLevelListData = () => {
  getLevelList({
    page: 0
  }).then((data: any) => {
    state.levelList = data.list
  })
}

// 打开弹窗
const openDialog = (row: any) => {
  getLevelListData()
  state.isShowDialog = true
  state.ruleForm = {
    id: row.id,
    realName: row.realName,
    status: row.status,
    nickName: row.nickName,
    phoneNumber: row.phoneNumber,
    userType: row.userType,
    userNote: row.userNote,
    level: row.level
  }
}
// 关闭弹窗
const closeDialog = () => {
  state.isShowDialog = false
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
      updateMember(state.ruleForm)
        .then(() => {
          ElMessage({
            message: '更新成功.',
            type: 'success',
          })
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
