<template>
  <div class="dialog-container">
    <el-dialog :title="dialogTitle" v-model="isShowDialog" width="620px" :close-on-click-modal="false" :destroy-on-close="true">
      <el-form ref="detailFormRef" class="dialog-form" :model="ruleForm" :rules="rules" size="default" label-width="120px">
        <el-row :gutter="35">
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="桌号" prop="tableNum">
              <el-input v-model="ruleForm.tableNum" placeholder="请输入桌号" clearable />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="区域名称" prop="name">
              <el-input v-model="ruleForm.name" placeholder="请输入区域名称，如 VIP区" clearable />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="X坐标" prop="xPos">
              <el-input-number v-model="ruleForm.xPos" class="w100" :precision="2" :step="1" controls-position="right" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="Y坐标" prop="yPos">
              <el-input-number v-model="ruleForm.yPos" class="w100" :precision="2" :step="1" controls-position="right" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="onCancel" size="default">取消</el-button>
          <el-button type="primary" @click="onSubmit" size="default" :loading="loading">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, toRefs } from 'vue'
import { ElForm } from 'element-plus'
import { addAreaTable, getAreaTableDetail, updateAreaTable } from '@/api/base/table/index'

const emit = defineEmits(['refresh'])
const detailFormRef = ref(ElForm)

const state = reactive({
  type: 'add',
  loading: false,
  ruleForm: {} as any,
  rules: {
    tableNum: [{ required: true, trigger: 'blur', message: '请输入桌号' }],
    name: [{ required: true, trigger: 'blur', message: '请输入区域名称' }],
    xPos: [{ required: true, trigger: 'change', message: '请输入X坐标' }],
    yPos: [{ required: true, trigger: 'change', message: '请输入Y坐标' }],
  },
  isShowDialog: false,
})

const { loading, ruleForm, rules, isShowDialog } = toRefs(state)

const dialogTitle = computed(() => (state.type === 'edit' ? '编辑桌位' : '新增桌位'))

const createDefaultForm = () => ({
  id: undefined,
  orgId: undefined,
  tableNum: '',
  gameId: undefined,
  gameName: '',
  orderIds: '',
  name: '',
  xPos: 0,
  yPos: 0,
  status: 10,
  createdTime: undefined,
  updateTime: undefined,
})

const openDialog = async (type: string, row?: any) => {
  state.type = type
  state.loading = false
  state.ruleForm = createDefaultForm()
  state.isShowDialog = true
  detailFormRef.value?.clearValidate()

  if (type === 'edit' && row?.id) {
    state.loading = true
    try {
      const data: any = await getAreaTableDetail(row.id)
      state.ruleForm = {
        ...createDefaultForm(),
        ...data,
      }
    } finally {
      state.loading = false
    }
  }
}

const closeDialog = () => {
  state.isShowDialog = false
}

const onCancel = () => {
  closeDialog()
}

const onSubmit = () => {
  state.ruleForm = {
    ...state.ruleForm,
    tableNum: state.ruleForm.tableNum?.trim(),
    name: state.ruleForm.name?.trim(),
  }

  detailFormRef.value.validate((valid: boolean) => {
    if (!valid) return false

    state.loading = true
    const formData = JSON.parse(JSON.stringify(state.ruleForm))
    const request = state.type === 'edit'
      ? updateAreaTable(formData.id, formData)
      : addAreaTable({
        tableNum: formData.tableNum,
        name: formData.name,
        xPos: formData.xPos,
        yPos: formData.yPos,
      })

    request
      .then(() => {
        closeDialog()
        emit('refresh')
      })
      .finally(() => {
        state.loading = false
      })
  })
}

defineExpose({
  openDialog,
})
</script>

<style scoped lang="scss">
.w100 {
  width: 100%;
}

.dialog-form :deep(.el-form-item) {
  margin-bottom: 20px;
}

:deep(.el-dialog__body) {
  padding-top: 12px;
}
</style>
