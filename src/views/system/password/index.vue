<template>
  <div class="page-container layout-padding">
    <el-card shadow="hover" class="layout-padding-auto">
      <div class="form-wrap">
        <el-form ref="formRef" :model="ruleForm" :rules="rules" size="default" label-width="90px">
          <el-row :gutter="35">
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
              <el-form-item label="当前密码" prop="oldPassword">
                <el-input v-model="ruleForm.oldPassword" type="password" placeholder="请输入当前密码" clearable />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
              <el-form-item label="新密码" prop="password">
                <el-input v-model="ruleForm.password" type="password" placeholder="请输入新密码" clearable />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
              <el-form-item label="确认密码" prop="checkPassword">
                <el-input v-model="ruleForm.checkPassword" type="password" placeholder="请再次输入新密码" clearable />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20 form-actions">
              <el-button type="primary" size="default" :loading="loading" @click="onSubmit">修改</el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { ElForm, ElMessage } from 'element-plus'
import { getUserInfo, updatePassword } from '@/api/login/index'
import { useUserInfo } from '@/stores/userInfo'
import mittBus from '@/utils/mitt'

function validatePassword(rule: any, value: string, callback: any) {
  if (!value.trim()) {
    callback(new Error('请填写新密码'))
  } else if (value.length < 6) {
    callback(new Error('请填写至少 6 位的新密码'))
  } else {
    callback()
  }
}

function validateCheckPassword(rule: any, value: string, callback: any) {
  if (!value.trim()) {
    callback(new Error('请再次输入新密码'))
  } else if (value !== state.ruleForm.password) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const router = useRouter()
const formRef = ref<InstanceType<typeof ElForm>>()
const userInfoStore = useUserInfo()
const { userInfos } = storeToRefs(userInfoStore) as any

const state = reactive({
  ruleForm: {
    oldPassword: '',
    password: '',
    checkPassword: '',
  },
  rules: {
    oldPassword: [{ required: true, trigger: 'blur', message: '请填写当前密码' }],
    password: [{ required: true, trigger: 'blur', validator: validatePassword }],
    checkPassword: [{ required: true, trigger: 'blur', validator: validateCheckPassword }],
  },
  loading: false,
})

const { ruleForm, rules, loading } = toRefs(state)

const getCurrentUid = async () => {
  const cachedUid = Number(userInfos.value?.id || 0)
  if (cachedUid) return cachedUid

  const data: any = await getUserInfo()
  const uid = Number(data?.id || data?.uid || 0)
  if (uid) {
    userInfoStore.userInfos = {
      ...userInfoStore.userInfos,
      id: uid,
      name: data?.realName || userInfoStore.userInfos.name,
      avatar: data?.avatar || userInfoStore.userInfos.avatar,
      roles: userInfoStore.userInfos.roles,
      authBtnList: userInfoStore.userInfos.authBtnList,
    }
  }
  return uid
}

const onSubmit = () => {
  formRef.value?.validate((valid: boolean) => {
    if (!valid) return false

    state.loading = true
    getCurrentUid()
      .then((uid) => {
        if (!uid) {
          ElMessage({
            message: '未获取到当前用户ID，请重新登录后再试。',
            type: 'error',
          })
          return Promise.reject(new Error('missing uid'))
        }

        return updatePassword({
          oldPassword: state.ruleForm.oldPassword,
          password: state.ruleForm.password,
          uid,
        })
      })
      .then(() => {
        ElMessage({
          message: '修改成功',
          type: 'success',
        })
        router.push('/')
        closeCurrentTagsView()
      })
      .catch(() => {})
      .finally(() => {
        state.loading = false
      })
  })
}

const closeCurrentTagsView = () => {
  const params = { contextMenuClickId: 1, ...router }
  mittBus.emit('onCurrentContextmenuClick', Object.assign({}, params))
}
</script>

<style scoped lang="scss">
.form-wrap {
  width: 300px;
  margin: 20px auto;
}

.form-actions {
  text-align: center;
}
</style>
