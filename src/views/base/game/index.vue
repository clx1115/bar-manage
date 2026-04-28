<template>
  <div class="page-container layout-padding">
    <el-card shadow="hover" class="layout-padding-auto">
      <div class="page-intro">
        <div>
          <div class="page-intro__title">游戏管理</div>
          <div class="page-intro__desc">集中维护桌面游戏资料、图标、建议人数和启停状态，方便前台快速引用。</div>
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
            新增游戏
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" plain :disabled="multipleSelection.length === 0" @click="onBatchDelete">
            批量删除
          </el-button>
        </el-form-item>
      </el-form>

      <el-table :data="list" v-loading="loading" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="gameId" label="ID" width="90" />
        <el-table-column label="图标" width="90">
          <template #default="{ row }">
            <img v-if="row.gameIcon" :src="row.gameIcon" class="icon-preview" />
          </template>
        </el-table-column>
        <el-table-column prop="gameName" label="游戏名称" min-width="140" show-overflow-tooltip />
        <el-table-column prop="gameDesc" label="游戏描述" min-width="180" show-overflow-tooltip />
        <el-table-column label="游戏类型" width="120">
          <template #default="{ row }">{{ gameTypeText(row.gameType) }}</template>
        </el-table-column>
        <el-table-column label="建议人数" min-width="120">
          <template #default="{ row }">{{ row.minPlayers }} - {{ row.maxPlayers }}</template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'info'">{{ row.status === 1 ? '启用' : '禁用' }}</el-tag>
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

    <el-dialog :title="dialogType === 'edit' ? '编辑游戏' : '新增游戏'" v-model="dialogVisible" width="720px" :close-on-click-modal="false">
      <el-form ref="formRef" class="dialog-form" :model="formData" :rules="rules" label-width="110px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="游戏名称" prop="gameName">
              <el-input v-model="formData.gameName" placeholder="请输入游戏名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="游戏图标" prop="gameIcon">
              <upload-img v-model="formData.gameIcon" :width="100" :height="100" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="游戏类型" prop="gameType">
              <el-select v-model="formData.gameType" class="w100">
                <el-option label="猜拳" :value="1" />
                <el-option label="摇骰子" :value="2" />
                <el-option label="其他" :value="3" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-select v-model="formData.status" class="w100">
                <el-option label="启用" :value="1" />
                <el-option label="禁用" :value="0" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最小人数" prop="minPlayers">
              <el-input-number v-model="formData.minPlayers" class="w100" :min="1" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最大人数" prop="maxPlayers">
              <el-input-number v-model="formData.maxPlayers" class="w100" :min="1" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="游戏描述" prop="gameDesc">
              <el-input v-model="formData.gameDesc" type="textarea" :rows="4" placeholder="请输入游戏描述" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="onSubmit">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, toRefs, onMounted } from 'vue'
import { ElForm, ElMessage, ElMessageBox } from 'element-plus'
import UploadImg from '@/components/upload/uploadImg.vue'
import { createGame, deleteGame, getGameDetail, getGameList, updateGame } from '@/api/base/game/index'

const formRef = ref<InstanceType<typeof ElForm>>()
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
  formData: {} as any,
  rules: {
    gameName: [{ required: true, message: '请输入游戏名称', trigger: 'blur' }],
    gameIcon: [{ required: true, message: '请上传游戏图标', trigger: 'change' }],
    gameType: [{ required: true, message: '请选择游戏类型', trigger: 'change' }],
    minPlayers: [{ required: true, message: '请输入最小人数', trigger: 'change' }],
    maxPlayers: [{ required: true, message: '请输入最大人数', trigger: 'change' }],
    status: [{ required: true, message: '请选择状态', trigger: 'change' }],
  },
})

const { list, loading, currentPage, pageSize, total, multipleSelection, dialogVisible, dialogType, submitLoading, formData, rules } = toRefs(state)

const createDefaultForm = () => ({
  gameId: undefined,
  gameName: '',
  gameDesc: '',
  gameIcon: '',
  gameType: 1,
  minPlayers: 2,
  maxPlayers: 6,
  status: 1,
})

const gameTypeText = (value: number) => ({ 1: '猜拳', 2: '摇骰子', 3: '其他' }[value] || '-')

const getListData = async () => {
  state.loading = true
  try {
    const data = await getGameList({ page: state.currentPage, size: state.pageSize })
    state.list = data.list || []
    state.total = (data.pages || 0) * state.pageSize
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
  if (type === 'edit' && row?.gameId) {
    const data = await getGameDetail(row.gameId)
    state.formData = { ...createDefaultForm(), ...data }
  }
}

const doDelete = async (ids: number[]) => {
  await deleteGame({ ids })
  ElMessage.success('删除成功')
  getListData()
}

const onDelete = (row: any) => {
  ElMessageBox.confirm(`确认删除游戏「${row.gameName}」吗？`, '提示', { type: 'warning' })
    .then(() => doDelete([row.gameId]))
    .catch(() => {})
}

const onBatchDelete = () => {
  const ids = state.multipleSelection.map((item) => item.gameId)
  ElMessageBox.confirm(`确认删除选中的 ${ids.length} 个游戏吗？`, '提示', { type: 'warning' })
    .then(() => doDelete(ids))
    .catch(() => {})
}

const onSubmit = () => {
  formRef.value?.validate(async (valid) => {
    if (!valid) return
    state.submitLoading = true
    try {
      const payload = JSON.parse(JSON.stringify(state.formData))
      if (state.dialogType === 'edit') {
        await updateGame(payload)
      } else {
        await createGame(payload)
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
  background: linear-gradient(135deg, #f5fbff 0%, #f8fff8 100%);
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

.dialog-form :deep(.el-form-item) {
  margin-bottom: 20px;
}

:deep(.el-dialog__body) {
  padding-top: 12px;
}
</style>
