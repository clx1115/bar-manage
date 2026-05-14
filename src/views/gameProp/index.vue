<template>
  <div class="page-container layout-padding">
    <el-card shadow="hover" class="layout-padding-auto">
      <div class="page-intro">
        <div>
          <div class="page-intro__title">游戏道具管理</div>
          <div class="page-intro__desc">
            维护游戏道具、关联商品和效果配置，支持快速新增、编辑、删除和销售统计。
          </div>
        </div>
      </div>

      <el-form class="query" :inline="true">
        <el-form-item>
          <el-input
            v-model="query.keyword"
            placeholder="搜索商品名称或效果名称"
            clearable
            @keyup.enter="getListData"
          />
        </el-form-item>
        <el-form-item>
          <el-select v-model="query.status" placeholder="状态" clearable class="w160">
            <el-option label="上架" :value="1" />
            <el-option label="下架" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="query.payType" placeholder="支付方式" clearable class="w160">
            <el-option label="微信支付" :value="10" />
            <el-option label="豪气值支付" :value="30" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getListData">
            <el-icon><ele-Search /></el-icon>
            查询
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="resetQuery">
            <el-icon><ele-Refresh /></el-icon>
            重置
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="openDialog('add')">
            <el-icon><ele-Plus /></el-icon>
            新增道具
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="warning" plain @click="openStatisticsDialog">
            <el-icon><ele-Histogram /></el-icon>
            销售统计
          </el-button>
        </el-form-item>
      </el-form>

      <el-table :data="list" v-loading="loading" style="width: 100%">
        <el-table-column prop="id" label="ID" width="90" />
        <el-table-column label="商品图片" width="90">
          <template #default="{ row }">
            <img v-if="row.productImage" :src="row.productImage" class="product-image" />
            <div v-else class="image-placeholder">暂无</div>
          </template>
        </el-table-column>
        <el-table-column prop="productName" label="商品名称" min-width="180" show-overflow-tooltip />
        <el-table-column label="商品价格" width="120">
          <template #default="{ row }">{{ formatPrice(row.productPrice) }}</template>
        </el-table-column>
        <el-table-column prop="effectCode" label="效果代码" min-width="120" show-overflow-tooltip />
        <el-table-column prop="effectName" label="效果名称" min-width="140" show-overflow-tooltip />
        <el-table-column label="支付方式" width="100">
          <template #default="{ row }">{{ payTypeText(row.payType) }}</template>
        </el-table-column>
        <el-table-column prop="consumePoints" label="消耗积分" width="100" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'info'">{{ statusText(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250" fixed="right">
          <template #default="{ row }">
            <el-button text type="primary" @click="openDialog('edit', row)">编辑</el-button>
            <el-button text type="danger" @click="openDeleteDialog(row)">删除</el-button>
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
      v-model="dialogVisible"
      :title="dialogType === 'edit' ? '编辑游戏道具' : '新增游戏道具'"
      width="760px"
      :close-on-click-modal="false"
    >
      <el-form ref="formRef" :model="formData" :rules="rules" label-width="110px" class="dialog-form">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="关联商品" prop="productId">
              <div class="selector-row">
                <el-input :model-value="formData.productName" readonly placeholder="请选择商品" />
                <el-button type="primary" plain @click="openProductSelect">选择商品</el-button>
                <el-button v-if="formData.productId" @click="clearProduct">清空</el-button>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="效果配置" prop="effectId">
              <el-select
                v-model="formData.effectId"
                filterable
                class="w100"
                placeholder="请选择效果配置"
                @change="onEffectChange"
              >
                <el-option
                  v-for="item in effectOptions"
                  :key="item.id"
                  :label="`${item.effectName} (${item.effectCode})`"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="支付方式" prop="payType">
              <el-select v-model="formData.payType" class="w100">
                <el-option label="微信支付" :value="10" />
                <el-option label="豪气值支付" :value="30" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="消耗积分" prop="consumePoints">
              <el-input-number v-model="formData.consumePoints" class="w100" :min="0" :precision="0" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-select v-model="formData.status" class="w100">
                <el-option label="上架" :value="1" />
                <el-option label="下架" :value="2" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-if="dialogType === 'edit'" :span="24">
            <el-form-item label="同步背包">
              <el-switch v-model="formData.syncUserProp" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="onSubmit">保存</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="deleteDialog.visible" title="删除游戏道具" width="480px" :close-on-click-modal="false">
      <el-form label-width="120px">
        <el-form-item label="删除对象">
          <span>{{ deleteDialog.row?.productName || deleteDialog.row?.id || '-' }}</span>
        </el-form-item>
        <el-form-item label="同步玩家背包">
          <el-switch v-model="deleteDialog.syncUserProp" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="deleteDialog.visible = false">取消</el-button>
        <el-button type="danger" :loading="deleteDialog.loading" @click="confirmDelete">确认删除</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="statisticsVisible" title="道具销售统计" width="900px" :close-on-click-modal="false">
      <div class="stats-toolbar">
        <el-date-picker
          v-model="statisticsRange"
          type="datetimerange"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          value-format="x"
          class="stats-range"
        />
        <el-button type="primary" :loading="statisticsLoading" @click="loadStatistics">查询统计</el-button>
      </div>
      <el-row :gutter="16" class="stats-row">
        <el-col :span="12">
          <div class="stats-card">
            <div class="stats-label">销售总量</div>
            <div class="stats-value">{{ statistics.total.salesVolume || 0 }}</div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="stats-card">
            <div class="stats-label">总金额</div>
            <div class="stats-value">{{ formatCentAmount(statistics.total.totalAmount) }}</div>
          </div>
        </el-col>
      </el-row>
      <el-table :data="statistics.detail || []" v-loading="statisticsLoading">
        <el-table-column prop="productId" label="商品ID" width="100" />
        <el-table-column prop="productName" label="商品名称" min-width="160" show-overflow-tooltip />
        <el-table-column label="支付方式" width="100">
          <template #default="{ row }">{{ payTypeText(row.payType) }}</template>
        </el-table-column>
        <el-table-column prop="salesVolume" label="销售量" width="100" />
        <el-table-column label="销售金额" width="120">
          <template #default="{ row }">{{ formatCentAmount(row.totalAmount) }}</template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <product-select ref="productSelectRef" @select="onSelectProduct" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, toRefs } from 'vue'
import { ElForm, ElMessage } from 'element-plus'
import productSelect from '@/views/product/component/select.vue'
import {
  addGamePropByIds,
  deleteGameProp,
  getGamePropDetail,
  getGamePropEffectList,
  getGamePropList,
  getGamePropSalesStatistics,
  updateGameProp,
} from '@/api/gameProp/index'

const formRef = ref<InstanceType<typeof ElForm>>()
const productSelectRef = ref()

const createDefaultForm = () => ({
  id: undefined as number | undefined,
  productId: undefined as number | undefined,
  productName: '',
  effectId: undefined as number | undefined,
  payType: 10,
  consumePoints: 0,
  status: 1,
  syncUserProp: false,
})

const state = reactive({
  list: [] as any[],
  loading: false,
  currentPage: 1,
  pageSize: 10,
  total: 0,
  query: {
    keyword: '',
    status: undefined as number | undefined,
    payType: undefined as number | undefined,
  },
  dialogVisible: false,
  dialogType: 'add' as 'add' | 'edit',
  submitLoading: false,
  formData: createDefaultForm(),
  effectOptions: [] as any[],
  deleteDialog: {
    visible: false,
    loading: false,
    row: null as any,
    syncUserProp: false,
  },
  statisticsVisible: false,
  statisticsLoading: false,
  statisticsRange: [] as any[],
  statistics: {
    total: {
      salesVolume: 0,
      totalAmount: 0,
    },
    detail: [] as any[],
  },
  rules: {
    productId: [{ required: true, message: '请选择商品', trigger: 'change' }],
    effectId: [{ required: true, message: '请选择效果配置', trigger: 'change' }],
    payType: [{ required: true, message: '请选择支付方式', trigger: 'change' }],
  },
})

const {
  list,
  loading,
  currentPage,
  pageSize,
  total,
  query,
  dialogVisible,
  dialogType,
  submitLoading,
  formData,
  effectOptions,
  deleteDialog,
  statisticsVisible,
  statisticsLoading,
  statisticsRange,
  statistics,
  rules,
} = toRefs(state)

const listQueryData = computed(() => {
  const queryData: Record<string, any> = {
    page: state.currentPage,
    size: state.pageSize,
  }
  if (state.query.keyword) queryData.keyword = state.query.keyword
  if (state.query.status) queryData.status = state.query.status
  if (state.query.payType) queryData.payType = state.query.payType
  return queryData
})

const payTypeText = (value: number) => ({ 10: '微信支付', 30: '豪气值支付' }[value] || '-')
const statusText = (value: number) => ({ 1: '上架', 2: '下架' }[value] || '-')
const formatPrice = (value?: number) => (typeof value === 'number' ? `¥${value.toFixed(2)}` : '-')
const formatCentAmount = (value?: number) => `¥${(((value || 0) as number) / 100).toFixed(2)}`

const getListData = async () => {
  state.loading = true
  try {
    const data = await getGamePropList(listQueryData.value)
    const items = data.list || data.data || []
    state.list = items
    const pages = data.pages || 0
    state.total = data.total || pages * state.pageSize
    if (!state.total && state.currentPage === 1 && items.length < state.pageSize) {
      state.total = items.length
    }
  } finally {
    state.loading = false
  }
}

const loadEffects = async () => {
  const data = await getGamePropEffectList({ status: 1 })
  state.effectOptions = data.list || data.data || []
}

const onSizeChange = () => {
  state.currentPage = 1
  getListData()
}

const resetQuery = () => {
  state.query = {
    keyword: '',
    status: undefined,
    payType: undefined,
  }
  state.currentPage = 1
  getListData()
}

const openProductSelect = () => {
  productSelectRef.value?.openDialog('radio', [])
}

const onSelectProduct = (rows: any[]) => {
  const [row] = rows || []
  if (!row) return
  state.formData.productId = row.id
  state.formData.productName = row.name || ''
  formRef.value?.validateField('productId')
}

const clearProduct = () => {
  state.formData.productId = undefined
  state.formData.productName = ''
}

const onEffectChange = () => {
  formRef.value?.validateField('effectId')
}

const openDialog = async (type: 'add' | 'edit', row?: any) => {
  state.dialogType = type
  state.dialogVisible = true
  state.formData = createDefaultForm()
  await loadEffects()
  formRef.value?.clearValidate()
  if (type === 'edit' && row?.id) {
    const data = await getGamePropDetail(row.id)
    state.formData = {
      ...createDefaultForm(),
      ...data,
      productName: data.productName || row.productName || '',
      syncUserProp: false,
    }
  }
}

const buildPayload = () => ({
  productId: state.formData.productId,
  effectId: state.formData.effectId,
  payType: state.formData.payType,
  consumePoints: state.formData.consumePoints,
  status: state.formData.status,
  syncUserProp: state.formData.syncUserProp,
})

const onSubmit = () => {
  formRef.value?.validate(async (valid) => {
    if (!valid) return
    state.submitLoading = true
    try {
      const payload = buildPayload()
      if (state.dialogType === 'edit' && state.formData.id) {
        await updateGameProp(state.formData.id, payload)
      } else {
        await addGamePropByIds(payload)
      }
      ElMessage.success('保存成功')
      state.dialogVisible = false
      getListData()
    } finally {
      state.submitLoading = false
    }
  })
}

const openDeleteDialog = (row: any) => {
  state.deleteDialog = {
    visible: true,
    loading: false,
    row,
    syncUserProp: false,
  }
}

const confirmDelete = async () => {
  if (!state.deleteDialog.row?.id) return
  state.deleteDialog.loading = true
  try {
    await deleteGameProp({
      id: state.deleteDialog.row.id,
      syncUserProp: state.deleteDialog.syncUserProp,
    })
    ElMessage.success('删除成功')
    state.deleteDialog.visible = false
    getListData()
  } finally {
    state.deleteDialog.loading = false
  }
}

const openStatisticsDialog = () => {
  state.statisticsVisible = true
  state.statistics = {
    total: {
      salesVolume: 0,
      totalAmount: 0,
    },
    detail: [],
  }
}

const loadStatistics = async () => {
  const [startTime, endTime] = state.statisticsRange || []
  if (!startTime || !endTime) {
    ElMessage.warning('请选择统计时间范围')
    return
  }
  state.statisticsLoading = true
  try {
    const data = await getGamePropSalesStatistics({
      startTime: Number(startTime),
      endTime: Number(endTime),
    })
    state.statistics = {
      total: data.total || { salesVolume: 0, totalAmount: 0 },
      detail: data.detail || [],
    }
  } finally {
    state.statisticsLoading = false
  }
}

onMounted(async () => {
  await loadEffects()
  getListData()
})
</script>

<style scoped lang="scss">
.page-intro {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 18px;
  margin-bottom: 18px;
  border: 1px solid #e7eef7;
  border-radius: 16px;
  background: linear-gradient(135deg, #f4fbff 0%, #f8fff3 100%);
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

.query :deep(.el-form-item) {
  margin-right: 12px;
  margin-bottom: 12px;
}

.page-bottom {
  display: flex;
  justify-content: flex-end;
  margin-top: 18px;
}

.product-image,
.image-placeholder {
  width: 44px;
  height: 44px;
  border-radius: 8px;
}

.product-image {
  object-fit: cover;
  border: 1px solid #e7ecf3;
}

.image-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #98a2b3;
  border: 1px dashed #d0d5dd;
  background: #f8fafc;
  font-size: 12px;
}

.w100 {
  width: 100%;
}

.w160 {
  width: 160px;
}

.selector-row {
  display: flex;
  gap: 10px;
  width: 100%;
}

.selector-row :deep(.el-input) {
  flex: 1;
}

.dialog-form :deep(.el-form-item) {
  margin-bottom: 18px;
}

.stats-toolbar {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.stats-range {
  width: 420px;
}

.stats-row {
  margin-bottom: 16px;
}

.stats-card {
  padding: 16px 18px;
  border: 1px solid #e7eef7;
  border-radius: 14px;
  background: #f8fafc;
}

.stats-label {
  font-size: 13px;
  color: #667085;
}

.stats-value {
  margin-top: 8px;
  font-size: 24px;
  font-weight: 700;
  color: #111827;
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
</style>
