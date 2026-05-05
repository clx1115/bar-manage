<template>
  <div class="page-container layout-padding">
    <el-card shadow="hover" class="layout-padding-auto">
      <div class="page-intro">
        <div>
          <div class="page-intro__title">礼物管理</div>
          <div class="page-intro__desc">
            维护礼物名称、图标、类型、价格与上下架状态，支持新增、编辑和批量删除。
          </div>
        </div>
      </div>

      <el-form class="query" :inline="true">
        <el-form-item>
          <el-button type="primary" @click="getListData">
            <el-icon><ele-Refresh /></el-icon>
            刷新列表
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="openDialog('add')">
            <el-icon><ele-Plus /></el-icon>
            新增礼物
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" plain :disabled="multipleSelection.length === 0" @click="onBatchDelete">
            批量删除
          </el-button>
        </el-form-item>
      </el-form>

      <el-table :data="list" v-loading="loading" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="giftId" label="ID" width="90" />
        <el-table-column label="图标" width="90">
          <template #default="{ row }">
            <img v-if="row.giftIcon" :src="row.giftIcon" class="icon-preview" />
            <div v-else class="icon-placeholder">无</div>
          </template>
        </el-table-column>
        <el-table-column prop="giftName" label="礼物名称" min-width="140" show-overflow-tooltip />
        <el-table-column prop="giftDesc" label="礼物描述" min-width="180" show-overflow-tooltip />
        <el-table-column label="礼物类型" width="120">
          <template #default="{ row }">{{ giftTypeText(row.giftType) }}</template>
        </el-table-column>
        <el-table-column label="价格" width="120">
          <template #default="{ row }">{{ formatPrice(row.price) }}</template>
        </el-table-column>
        <el-table-column prop="heroValue" label="豪气值" width="100" />
        <el-table-column prop="charmValue" label="魅力值" width="100" />
        <el-table-column prop="orgId" label="机构ID" width="100" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'info'">{{ statusText(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button text type="primary" @click="openDialog('edit', row)">编辑</el-button>
            <el-button text type="danger" @click="onDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="page-bottom">
        <el-pagination
          v-model:currentPage="currentPage"
          v-model:page-size="pageSize"
          background
          layout="total, sizes, prev, pager, next, jumper"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          @current-change="getListData"
          @size-change="onSizeChange"
        />
      </div>
    </el-card>

    <el-dialog
      :title="dialogType === 'edit' ? '编辑礼物' : '新增礼物'"
      v-model="dialogVisible"
      width="760px"
      class="pretty-dialog"
      :close-on-click-modal="false"
    >
      <el-form ref="formRef" class="dialog-form" :model="formData" :rules="rules" label-width="110px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="礼物名称" prop="giftName">
              <el-input v-model="formData.giftName" placeholder="请输入礼物名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="礼物图标" prop="giftIcon">
              <upload-img v-model="formData.giftIcon" :width="100" :height="100" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="礼物类型" prop="giftType">
              <el-select v-model="formData.giftType" class="w100">
                <el-option label="虚拟礼物" :value="1" />
                <el-option label="实物小吃" :value="2" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-select v-model="formData.status" class="w100">
                <el-option label="下架" :value="0" />
                <el-option label="上架" :value="1" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="价格(分)" prop="price">
              <el-input-number v-model="formData.price" class="w100" :min="1" :precision="0" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="豪气值" prop="heroValue">
              <el-input-number v-model="formData.heroValue" class="w100" :min="0" :precision="0" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="魅力值" prop="charmValue">
              <el-input-number v-model="formData.charmValue" class="w100" :min="0" :precision="0" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="礼物描述" prop="giftDesc">
              <el-input v-model="formData.giftDesc" type="textarea" :rows="4" placeholder="请输入礼物描述" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button class="dialog-footer__button" @click="dialogVisible = false">取消</el-button>
          <el-button class="dialog-footer__button dialog-footer__button--primary" type="primary" :loading="submitLoading" @click="onSubmit">
            保存
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, toRefs } from 'vue'
import { ElForm, ElMessage, ElMessageBox } from 'element-plus'
import UploadImg from '@/components/upload/uploadImg.vue'
import { createGift, deleteGift, getGiftDetail, getGiftList, updateGift } from '@/api/freebie/gift'

const formRef = ref<InstanceType<typeof ElForm>>()

const createDefaultForm = () => ({
  giftId: undefined as number | undefined,
  giftName: '',
  giftDesc: '',
  giftIcon: '1',
  giftType: 1,
  price: 1,
  status: 0,
  heroValue: 0,
  charmValue: 0,
})

const state = reactive({
  list: [] as any[],
  loading: false,
  currentPage: 1,
  pageSize: 10,
  total: 0,
  multipleSelection: [] as any[],
  dialogVisible: false,
  dialogType: 'add',
  submitLoading: false,
  formData: createDefaultForm(),
  rules: {
    giftName: [{ required: true, message: '请输入礼物名称', trigger: 'blur' }],
    giftType: [{ required: true, message: '请选择礼物类型', trigger: 'change' }],
    price: [
      { required: true, message: '请输入价格', trigger: 'change' },
      {
        validator: (_rule: any, value: number, callback: (error?: Error) => void) => {
          if (value > 0) callback()
          else callback(new Error('价格必须大于 0'))
        },
        trigger: 'change',
      },
    ],
  },
})

const { list, loading, currentPage, pageSize, total, multipleSelection, dialogVisible, dialogType, submitLoading, formData, rules } = toRefs(state)

const giftTypeText = (value: number) => ({ 1: '虚拟礼物', 2: '实物小吃' }[value] || '-')
const statusText = (value: number) => ({ 0: '下架', 1: '上架' }[value] || '-')
const formatPrice = (value?: number) => (typeof value === 'number' ? `¥${(value / 100).toFixed(2)}` : '-')

const getListData = async () => {
  state.loading = true
  try {
    const data = await getGiftList({ page: state.currentPage, size: state.pageSize })
    state.list = data.list || []
    state.total = data.total || (data.pages || 0) * state.pageSize
    if (!state.total && state.currentPage === 1 && state.pageSize > 0 && state.list.length < state.pageSize) {
      state.total = state.list.length
    }
  } finally {
    state.loading = false
  }
}

const onSizeChange = () => {
  state.currentPage = 1
  getListData()
}

const handleSelectionChange = (rows: any[]) => {
  state.multipleSelection = rows
}

const openDialog = async (type: string, row?: any) => {
  state.dialogType = type
  state.dialogVisible = true
  state.formData = createDefaultForm()
  formRef.value?.clearValidate()
  if (type === 'edit' && row?.giftId) {
    const data = await getGiftDetail(row.giftId)
    state.formData = { ...createDefaultForm(), ...data }
  }
}

const doDelete = async (ids: number[]) => {
  await deleteGift({ operation: 'del', ids })
  ElMessage.success('删除成功')
  if (state.list.length === ids.length && state.currentPage > 1) {
    state.currentPage -= 1
  }
  getListData()
}

const onDelete = (row: any) => {
  ElMessageBox.confirm(`确认删除礼物“${row.giftName}”吗？`, '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => doDelete([row.giftId]))
    .catch(() => {})
}

const onBatchDelete = () => {
  const ids = state.multipleSelection.map((item: any) => item.giftId)
  ElMessageBox.confirm(`确认删除选中的 ${ids.length} 个礼物吗？`, '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => doDelete(ids))
    .catch(() => {})
}

const buildPayload = () => ({
  giftName: state.formData.giftName,
  giftDesc: state.formData.giftDesc,
  giftIcon: state.formData.giftIcon,
  giftType: state.formData.giftType,
  price: state.formData.price,
  status: state.formData.status,
  heroValue: state.formData.heroValue,
  charmValue: state.formData.charmValue,
})

const onSubmit = () => {
  formRef.value?.validate(async (valid) => {
    if (!valid) return
    state.submitLoading = true
    try {
      const payload = buildPayload()
      if (state.dialogType === 'edit' && state.formData.giftId) {
        await updateGift(state.formData.giftId, payload)
      } else {
        await createGift(payload)
      }
      ElMessage.success('保存成功')
      state.dialogVisible = false
      getListData()
    } finally {
      state.submitLoading = false
    }
  })
}

onMounted(() => {
  getListData()
})
</script>

<style scoped lang="scss">
.icon-preview {
  width: 44px;
  height: 44px;
  padding: 4px;
  background: #fff;
  border: 1px solid #e7ecf3;
  border-radius: 8px;
  object-fit: cover;
  box-shadow: 0 6px 18px rgba(15, 23, 42, 0.06);
}

.icon-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  color: #98a2b3;
  border: 1px dashed #d0d5dd;
  border-radius: 8px;
  background: #f8fafc;
  font-size: 12px;
}

.w100 {
  width: 100%;
}

.page-intro {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 18px;
  margin-bottom: 18px;
  border: 1px solid #e7eef7;
  border-radius: 16px;
  background: linear-gradient(135deg, #fff7ed 0%, #fffdf7 100%);
}

.page-intro__title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2d3d;
}

.page-intro__desc {
  margin-top: 4px;
  font-size: 13px;
  line-height: 1.6;
  color: #667085;
}

.query {
  padding-top: 4px;
}

.query :deep(.el-form-item) {
  margin-right: 12px;
  margin-bottom: 12px;
}

.page-bottom {
  display: flex;
  justify-content: flex-end;
  margin-top: 18px;
}

:deep(.el-card__body) {
  padding: 24px 24px 18px;
}

:deep(.el-table) {
  overflow: hidden;
  border: 1px solid #edf2f7;
  border-radius: 14px;
}

:deep(.el-table th.el-table__cell) {
  background: #f8fafc;
  color: #475467;
}

:deep(.el-table .el-table__cell) {
  padding: 13px 0;
}

.dialog-form {
  padding-top: 2px;
}

.dialog-form :deep(.el-row) {
  row-gap: 22px;
}

.dialog-form :deep(.el-form-item) {
  margin-bottom: 0;
}

.dialog-form :deep(.el-form-item__label) {
  padding-right: 14px;
  color: #344054;
  font-weight: 500;
}

.dialog-form :deep(.el-input__wrapper),
.dialog-form :deep(.el-textarea__inner),
.dialog-form :deep(.el-select__wrapper) {
  border-radius: 12px;
  box-shadow: 0 0 0 1px #d7deea inset;
}

.dialog-form :deep(.el-input__wrapper),
.dialog-form :deep(.el-select__wrapper),
.dialog-form :deep(.el-input-number) {
  min-height: 42px;
}

.dialog-form :deep(.el-input-number) {
  width: 100%;
}

.dialog-form :deep(.el-textarea__inner) {
  min-height: 120px;
  line-height: 1.7;
}

.dialog-form :deep(.upload-img) {
  display: flex;
  align-items: center;
  min-height: 112px;
}

.dialog-form :deep(.upload-img .el-upload),
.dialog-form :deep(.upload-img .el-upload-list__item) {
  overflow: hidden;
  border-radius: 18px;
}

:deep(.pretty-dialog .el-dialog) {
  overflow: hidden;
  border: 1px solid #eef2f7;
  border-radius: 24px;
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.18);
}

:deep(.pretty-dialog .el-dialog__header) {
  padding: 26px 28px 12px;
  border-bottom: 1px solid #f2f4f7;
}

:deep(.pretty-dialog .el-dialog__title) {
  font-size: 22px;
  font-weight: 600;
  color: #101828;
}

:deep(.pretty-dialog .el-dialog__headerbtn) {
  top: 24px;
  right: 24px;
}

:deep(.pretty-dialog .el-dialog__body) {
  padding: 24px 28px 8px;
  background: linear-gradient(180deg, #fcfdff 0%, #f8fbff 100%);
}

:deep(.pretty-dialog .el-dialog__footer) {
  padding: 18px 28px 26px;
  background: linear-gradient(180deg, rgba(248, 251, 255, 0) 0%, #f8fbff 100%);
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.dialog-footer__button {
  min-width: 86px;
  height: 40px;
  border-radius: 12px;
}

.dialog-footer__button--primary {
  box-shadow: 0 10px 24px rgba(64, 158, 255, 0.25);
}
</style>
