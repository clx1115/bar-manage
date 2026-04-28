<template>
  <el-dialog
    v-model="state.dialog.visible"
    :title="state.dialog.title"
    width="820px"
    :close-on-click-modal="false"
    class="shop-admin-dialog"
  >
    <div class="member-detail" v-loading="state.loading">
      <div class="member-summary" v-if="state.ruleForm.id">
        <div class="member-summary__main">
          <el-avatar :size="64" :src="getAvatar(state.ruleForm.avatar)" class="member-summary__avatar">
            {{ (state.ruleForm.realName || state.ruleForm.userName || '?').slice(0, 1) }}
          </el-avatar>
          <div>
            <div class="member-summary__name">
              {{ state.ruleForm.realName || state.ruleForm.userName || '-' }}
            </div>
            <div class="member-summary__sub">
              用户名：{{ state.ruleForm.userName || '-' }}
            </div>
          </div>
        </div>
        <div class="member-summary__tags">
          <el-tag :type="state.ruleForm.isAdmin ? 'success' : 'info'">
            {{ state.ruleForm.isAdmin ? '管理员' : '普通成员' }}
          </el-tag>
          <el-tag :type="state.ruleForm.status === 1 ? 'success' : 'danger'">
            {{ state.ruleForm.status === 1 ? '正常' : '锁定' }}
          </el-tag>
        </div>
      </div>

      <el-descriptions :column="2" border class="member-descriptions" v-if="state.ruleForm.id">
        <el-descriptions-item label="归属店铺">{{ state.ruleForm.shopName || '-' }}</el-descriptions-item>
        <el-descriptions-item label="机构名称">{{ state.ruleForm.orgName || '-' }}</el-descriptions-item>
        <el-descriptions-item label="最后登录时间">{{ state.ruleForm.lastLoginTime || '-' }}</el-descriptions-item>
        <el-descriptions-item label="最后登录 IP">{{ state.ruleForm.lastLoginIP || '-' }}</el-descriptions-item>
      </el-descriptions>

      <el-form
        ref="formRef"
        class="dialog-form"
        :model="state.ruleForm"
        :rules="state.rules"
        label-width="96px"
      >
        <div class="form-panel">
          <div class="form-panel__title">基础信息</div>
          <el-row :gutter="28">
            <el-col :xs="24" :sm="24">
              <el-form-item label="头像" class="avatar-form-item">
                <div class="avatar-editor">
                  <div class="avatar-editor__preview">
                    <el-avatar :size="84" :src="getAvatar(state.ruleForm.avatar)" class="avatar-editor__image">
                      {{ (state.ruleForm.realName || state.ruleForm.userName || '?').slice(0, 1) }}
                    </el-avatar>
                    <span class="avatar-editor__hint">未上传时显示默认头像</span>
                  </div>
                  <upload-img
                    v-if="!isViewMode"
                    v-model="state.ruleForm.avatar"
                    :width="84"
                    :height="84"
                  />
                </div>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12">
              <el-form-item label="用户名" prop="userName">
                <el-input
                  v-model="state.ruleForm.userName"
                  placeholder="请输入用户名"
                  clearable
                  :disabled="isViewMode"
                />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12">
              <el-form-item label="姓名" prop="realName">
                <el-input
                  v-model="state.ruleForm.realName"
                  placeholder="请输入姓名"
                  clearable
                  :disabled="isViewMode"
                />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12">
              <el-form-item label="手机号" prop="phoneNumber">
                <el-input
                  v-model="state.ruleForm.phoneNumber"
                  placeholder="请输入手机号"
                  clearable
                  :disabled="isViewMode"
                />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" v-if="!isViewMode">
              <el-form-item label="新密码" prop="password">
                <el-input
                  v-model="state.ruleForm.password"
                  type="password"
                  show-password
                  placeholder="留空则不修改密码"
                  clearable
                />
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
    </div>

    <template #footer>
      <el-button @click="state.dialog.visible = false">取消</el-button>
      <el-button
        v-if="!isViewMode"
        type="primary"
        :loading="state.submitLoading"
        @click="submitForm"
      >
        保存
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="shopAdminDetail">
import { computed, nextTick, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance } from 'element-plus'
import UploadImg from '@/components/upload/uploadImg.vue'
import { getShopAdminDetail, updateShopAdmin } from '@/api/member/shopAdmin'
import defaultAvatar from '@/assets/avatar.png'

const emit = defineEmits(['refresh'])

const formRef = ref<FormInstance>()
const state = reactive({
  loading: false,
  submitLoading: false,
  rules: {
    userName: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
    realName: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
    phoneNumber: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
  },
  ruleForm: getDefaultForm(),
  dialog: {
    visible: false,
    type: 'view' as 'view' | 'edit',
    title: '成员详情',
  },
})

const isViewMode = computed(() => state.dialog.type === 'view')

const isValidAvatar = (avatar?: string) => {
  if (!avatar || typeof avatar !== 'string') return false
  return avatar.startsWith('http') || avatar.startsWith('/') || avatar.startsWith('data:image')
}

const getAvatar = (avatar?: string) => {
  if (isValidAvatar(avatar)) return avatar as string
  return defaultAvatar
}

function getDefaultForm() {
  return {
    id: undefined as number | undefined,
    userName: '',
    realName: '',
    phoneNumber: '',
    avatar: '',
    isAdmin: false,
    shopName: '',
    orgName: '',
    status: 1,
    lastLoginTime: '',
    lastLoginIP: '',
    password: '',
  }
}

const openDialog = async (type: 'view' | 'edit', row: any) => {
  resetForm()
  state.dialog.type = type
  state.dialog.title = type === 'view' ? '成员详情' : '修改成员'
  state.dialog.visible = true
  state.loading = true
  try {
    const res = await getShopAdminDetail(row.id)
    state.ruleForm = {
      id: res.id,
      userName: res.userName || '',
      realName: res.realName || '',
      phoneNumber: res.phoneNumber || '',
      avatar: isValidAvatar(res.avatar) ? res.avatar : '',
      isAdmin: !!res.isAdmin,
      shopName: res.shopName || row.shopName || '',
      orgName: res.orgName || row.orgName || '',
      status: res.status ?? row.status ?? 1,
      lastLoginTime: res.lastLoginTime || '',
      lastLoginIP: res.lastLoginIP || '',
      password: '',
    }
  } finally {
    state.loading = false
  }
}

const resetForm = () => {
  state.ruleForm = getDefaultForm()
  nextTick(() => {
    formRef.value?.clearValidate()
  })
}

const submitForm = async () => {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return

  state.submitLoading = true
  try {
    const payload: any = {
      id: state.ruleForm.id,
      memberId: state.ruleForm.id,
      userName: state.ruleForm.userName,
      realName: state.ruleForm.realName,
      phoneNumber: state.ruleForm.phoneNumber,
      avatar: state.ruleForm.avatar,
    }

    if (state.ruleForm.password) {
      payload.password = state.ruleForm.password
    }

    await updateShopAdmin(payload)
    ElMessage.success('保存成功')
    state.dialog.visible = false
    emit('refresh')
  } finally {
    state.submitLoading = false
  }
}

defineExpose({
  openDialog,
})
</script>

<style scoped lang="scss">
.member-detail {
  min-height: 180px;
}

.member-summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 18px 20px;
  margin-bottom: 20px;
  border: 1px solid #e1eaf5;
  border-radius: 18px;
  background:
    radial-gradient(circle at top right, rgba(34, 197, 94, 0.08), transparent 20%),
    linear-gradient(135deg, #f8fbff 0%, #fafcf7 100%);
}

.member-summary__main {
  display: flex;
  align-items: center;
  gap: 14px;
}

.member-summary__avatar {
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.1);
}

.member-summary__name {
  font-size: 16px;
  font-weight: 600;
  color: #1f2d3d;
}

.member-summary__sub {
  margin-top: 4px;
  font-size: 13px;
  color: #667085;
}

.member-summary__tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.member-descriptions {
  margin-bottom: 22px;
}

.form-panel {
  padding: 18px 18px 6px;
  border: 1px solid #edf2f7;
  border-radius: 16px;
  background: #fcfdff;
}

.form-panel__title {
  margin-bottom: 18px;
  font-size: 14px;
  font-weight: 600;
  color: #344054;
}

.form-panel :deep(.el-row) {
  row-gap: 18px;
}

.avatar-editor {
  display: flex;
  align-items: center;
  gap: 18px;
  flex-wrap: wrap;
}

.avatar-editor__preview {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 14px;
  border: 1px dashed #d9e2ec;
  border-radius: 14px;
  background: #fff;
}

.avatar-editor__image {
  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.08);
}

.avatar-editor__hint {
  font-size: 12px;
  color: #667085;
}

.avatar-form-item :deep(.el-form-item__content) {
  align-items: center;
}

.dialog-form :deep(.el-form-item) {
  margin-bottom: 0;
}

.dialog-form :deep(.el-form-item__label) {
  color: #344054;
}

.dialog-form :deep(.el-input__wrapper) {
  min-height: 42px;
  border-radius: 12px;
  box-shadow: 0 0 0 1px #d0d5dd inset;
}

.dialog-form :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px var(--el-color-primary) inset;
}

:deep(.el-descriptions) {
  overflow: hidden;
  border-radius: 14px;
}

:deep(.el-descriptions__label) {
  color: #475467;
  background: #f8fafc;
}

:deep(.el-dialog) {
  border-radius: 22px;
  overflow: hidden;
}

:deep(.el-dialog__header) {
  padding: 20px 22px 16px;
  border-bottom: 1px solid #eef2f6;
  margin-right: 0;
}

:deep(.el-dialog__title) {
  font-size: 18px;
  font-weight: 600;
  color: #1f2d3d;
}

:deep(.el-dialog__body) {
  padding: 18px 22px 12px;
}

:deep(.el-dialog__footer) {
  padding: 12px 22px 22px;
}

:deep(.el-button) {
  border-radius: 12px;
}

@media (max-width: 768px) {
  .member-summary {
    flex-direction: column;
    align-items: flex-start;
  }

  .avatar-editor__preview {
    width: 100%;
  }

  :deep(.el-dialog) {
    width: calc(100vw - 24px) !important;
  }
}
</style>
