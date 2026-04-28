<template>
  <div class="page-container layout-padding">
    <el-card shadow="hover" class="layout-padding-auto">
      <div class="page-intro">
        <div>
          <div class="page-intro__title">徽章管理</div>
          <div class="page-intro__desc">配置徽章等级、分值区间和授予条件，统一维护展示图标与有效期策略。</div>
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
            新增徽章
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
        <el-table-column prop="badgeId" label="ID" width="90" />
        <el-table-column label="图标" width="90">
          <template #default="{ row }">
            <img v-if="row.badgeIcon" :src="row.badgeIcon" class="icon-preview" />
          </template>
        </el-table-column>
        <el-table-column prop="badgeName" label="徽章名称" min-width="140" show-overflow-tooltip />
        <el-table-column prop="level" label="等级" width="80" />
        <el-table-column label="分数区间" min-width="140">
          <template #default="{ row }">
            {{ row.minScore }} - {{ row.maxScore }}
          </template>
        </el-table-column>
        <el-table-column label="分数类型" min-width="120">
          <template #default="{ row }">{{ scoreTypeText(row.scoreType) }}</template>
        </el-table-column>
        <el-table-column label="徽章类型" min-width="160">
          <template #default="{ row }">{{ badgeTypeText(row.badgeType) }}</template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'info'">
              {{ row.status === 1 ? '正常' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="priority" label="优先级" width="90" />
        <el-table-column prop="expireDays" label="过期天数" width="100" />
        <el-table-column prop="description" label="描述" min-width="160" show-overflow-tooltip />
        <el-table-column label="更新时间" min-width="180">
          <template #default="{ row }">{{ formatTime(row.updateTime) }}</template>
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

    <el-dialog :title="dialogType === 'edit' ? '编辑徽章' : '新增徽章'" v-model="dialogVisible" width="720px" :close-on-click-modal="false">
      <el-form ref="formRef" class="dialog-form" :model="formData" :rules="rules" label-width="110px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="徽章名称" prop="badgeName">
              <el-input v-model="formData.badgeName" placeholder="请输入徽章名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="徽章图标" prop="badgeIcon">
              <upload-img v-model="formData.badgeIcon" :width="100" :height="100" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最小分数" prop="minScore">
              <el-input-number v-model="formData.minScore" class="w100" :min="0" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最大分数" prop="maxScore">
              <el-input-number v-model="formData.maxScore" class="w100" :min="0" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="等级" prop="level">
              <el-input-number v-model="formData.level" class="w100" :min="1" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="优先级" prop="priority">
              <el-input-number v-model="formData.priority" class="w100" :min="0" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-select v-model="formData.status" class="w100">
                <el-option label="正常" :value="1" />
                <el-option label="禁用" :value="2" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="分数类型" prop="scoreType">
              <el-select v-model="formData.scoreType" class="w100">
                <el-option label="消费积分" :value="1" />
                <el-option label="魅力值" :value="2" />
                <el-option label="游戏积分" :value="3" />
                <el-option label="其他" :value="4" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="徽章类型" prop="badgeType">
              <el-select v-model="formData.badgeType" class="w100">
                <el-option label="基础徽章" :value="1" />
                <el-option label="特殊徽章" :value="2" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="过期天数" prop="expireDays">
              <el-input-number v-model="formData.expireDays" class="w100" :min="0" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="获取条件" prop="obtainCondition">
              <el-input v-model="formData.obtainCondition" placeholder="请输入获取条件" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="描述" prop="description">
              <el-input v-model="formData.description" type="textarea" :rows="3" placeholder="请输入描述" />
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
import dayjs from 'dayjs'
import { ElForm, ElMessage, ElMessageBox } from 'element-plus'
import UploadImg from '@/components/upload/uploadImg.vue'
import { createBeautyBadge, deleteBeautyBadge, getBeautyBadgeDetail, getBeautyBadgeList, updateBeautyBadge } from '@/api/base/beautyBadge/index'

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
    badgeName: [{ required: true, message: '请输入徽章名称', trigger: 'blur' }],
    badgeIcon: [{ required: true, message: '请上传徽章图标', trigger: 'change' }],
    minScore: [{ required: true, message: '请输入最小分数', trigger: 'change' }],
    maxScore: [{ required: true, message: '请输入最大分数', trigger: 'change' }],
    level: [{ required: true, message: '请输入等级', trigger: 'change' }],
    status: [{ required: true, message: '请选择状态', trigger: 'change' }],
    scoreType: [{ required: true, message: '请选择分数类型', trigger: 'change' }],
    badgeType: [{ required: true, message: '请选择徽章类型', trigger: 'change' }],
  },
})

const { list, loading, currentPage, pageSize, total, multipleSelection, dialogVisible, dialogType, submitLoading, formData, rules } = toRefs(state)

const createDefaultForm = () => ({
  badgeId: undefined,
  badgeName: '',
  badgeIcon: '',
  minScore: 0,
  maxScore: 0,
  level: 1,
  description: '',
  status: 1,
  scoreType: 1,
  badgeType: 1,
  expireDays: 0,
  obtainCondition: '',
  priority: 0,
  orgId: undefined,
})

const formatTime = (time?: number) => time ? dayjs(time).format('YYYY-MM-DD HH:mm:ss') : '-'
const scoreTypeText = (value: number) => ({ 1: '消费积分', 2: '魅力值', 3: '游戏积分', 4: '其他' }[value] || '-')
const badgeTypeText = (value: number) => ({ 1: '基础徽章', 2: '特殊徽章' }[value] || '-')

const getListData = async () => {
  state.loading = true
  try {
    const data = await getBeautyBadgeList({ page: state.currentPage, size: state.pageSize })
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
  if (type === 'edit' && row?.badgeId) {
    const data = await getBeautyBadgeDetail(row.badgeId)
    state.formData = { ...createDefaultForm(), ...data }
  }
}

const doDelete = async (ids: number[]) => {
  await deleteBeautyBadge({ ids })
  ElMessage.success('删除成功')
  getListData()
}

const onDelete = (row: any) => {
  ElMessageBox.confirm(`确认删除徽章「${row.badgeName}」吗？`, '提示', { type: 'warning' })
    .then(() => doDelete([row.badgeId]))
    .catch(() => {})
}

const onBatchDelete = () => {
  const ids = state.multipleSelection.map((item) => item.badgeId)
  ElMessageBox.confirm(`确认删除选中的 ${ids.length} 个徽章吗？`, '提示', { type: 'warning' })
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
        await updateBeautyBadge(payload.badgeId, payload)
      } else {
        await createBeautyBadge(payload)
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
  background: linear-gradient(135deg, #fffaf6 0%, #f6fbff 100%);
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
