<template>
  <div class="page-container layout-padding">
    <el-card shadow="hover" class="layout-padding-auto">
      <div class="page-header">
        <div>
          <div class="page-title">免费礼品配置</div>
          <div class="page-subtitle">配置引流品规则，并查看当前门店的领取统计</div>
        </div>
        <div class="header-actions">
          <el-button @click="loadConfig" :loading="configLoading">刷新配置</el-button>
          <el-button type="primary" @click="onSave" :loading="saveLoading">
            保存配置
          </el-button>
        </div>
      </div>

      <div class="stats-toolbar">
        <el-date-picker
          v-model="timeRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="YYYY-MM-DD"
          value-format="x"
        />
        <el-button type="primary" @click="loadStatistics" :loading="statsLoading">
          查询统计
        </el-button>
      </div>

      <el-row :gutter="16" class="stats-row">
        <el-col :xs="24" :sm="12" :md="6">
          <div class="stats-card">
            <div class="stats-label">发放总数</div>
            <div class="stats-value">{{ statistics.totalCouponCount }}</div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6">
          <div class="stats-card">
            <div class="stats-label">积分兑换数</div>
            <div class="stats-value">{{ statistics.totalExchangeCount }}</div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6">
          <div class="stats-card">
            <div class="stats-label">参与用户数</div>
            <div class="stats-value">{{ statistics.participatingUserCount }}</div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6">
          <div class="stats-card">
            <div class="stats-label">已使用券数</div>
            <div class="stats-value">{{ statistics.usedCouponCount }}</div>
          </div>
        </el-col>
      </el-row>

      <el-alert
        v-if="currentConfigId"
        type="success"
        show-icon
        :closable="false"
        class="config-alert"
      >
        当前已存在门店配置，配置ID：{{ currentConfigId }}
      </el-alert>

      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="180px"
        v-loading="configLoading"
        class="config-form"
      >
        <div class="config-section">
          <div class="section-title">基础设置</div>
          <el-row :gutter="24">
            <el-col :xs="24" :md="12">
              <el-form-item label="关联商品" prop="itemId">
                <div class="product-selector">
                  <el-input
                    :model-value="form.itemName"
                    readonly
                    placeholder="请选择引流品"
                    class="w100"
                  />
                  <el-button type="primary" plain @click="openProductSelect">
                    选择商品
                  </el-button>
                  <el-button v-if="form.itemId" @click="clearSelectedProduct">
                    清空
                  </el-button>
                </div>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :md="12">
              <el-form-item label="积分类型" prop="pointsType">
                <el-radio-group v-model="form.pointsType">
                  <el-radio :label="1">豪气值</el-radio>
                  <el-radio :label="2">游戏积分</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <div class="config-section">
          <div class="section-title">活动规则</div>
          <el-row :gutter="24">
            <el-col :xs="24" :md="12">
              <el-form-item label="新用户首次绑定赠送数量" prop="freeFreebieCount">
                <el-input-number v-model="form.freeFreebieCount" :min="0" class="w100" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :md="12">
              <el-form-item label="每日首次绑定赠送数量" prop="dailyFirstFreebieCount">
                <el-input-number
                  v-model="form.dailyFirstFreebieCount"
                  :min="0"
                  class="w100"
                />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :md="12">
              <el-form-item label="积分兑换比例分子" prop="pointsExchangeRatio">
                <el-input-number
                  v-model="form.pointsExchangeRatio"
                  :min="0"
                  class="w100"
                />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :md="12">
              <el-form-item label="积分兑换比例分母" prop="pointsPerBottle">
                <el-input-number v-model="form.pointsPerBottle" :min="1" class="w100" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :md="12">
              <el-form-item label="每日免费领取上限" prop="dailyFreeLimit">
                <el-input-number v-model="form.dailyFreeLimit" :min="0" class="w100" />
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <div class="config-section">
          <div class="section-title">功能开关</div>
          <el-row :gutter="24">
            <el-col :xs="24" :md="12">
              <el-form-item label="活动总开关" class="switch-item">
                <el-switch v-model="form.activityEnabled" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :md="12">
              <el-form-item label="积分兑换通道" class="switch-item">
                <el-switch v-model="form.exchangeEnabled" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :md="12">
              <el-form-item label="新用户首次绑定赠送" class="switch-item">
                <el-switch v-model="form.newUserFirstBindingGift" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :md="12">
              <el-form-item label="每日首次绑定赠送" class="switch-item">
                <el-switch v-model="form.dailyFirstBindingGift" />
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
    </el-card>
    <productSelect ref="productSelectRef" @select="onProductSelect" />
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, onMounted, reactive, ref, toRefs } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import {
  getFreebieConfig,
  getFreebieStatistics,
  saveFreebieConfig,
} from '@/api/freebie/index'

const createDefaultForm = () => ({
  itemId: undefined as number | undefined,
  itemName: '',
  freeFreebieCount: 0,
  dailyFirstFreebieCount: 0,
  pointsExchangeRatio: 0,
  pointsPerBottle: 1,
  dailyFreeLimit: 0,
  exchangeEnabled: false,
  activityEnabled: true,
  newUserFirstBindingGift: false,
  dailyFirstBindingGift: false,
  pointsType: 1,
})

const formRef = ref<FormInstance>()
const productSelectRef = ref()
const timeRange = ref([] as any[])
const productSelect = defineAsyncComponent(
  () => import('@/views/product/component/select.vue')
)
const rules: FormRules = {
  itemId: [{ required: true, message: '请选择关联商品', trigger: 'change' }],
  pointsType: [{ required: true, message: '请选择积分类型', trigger: 'change' }],
  freeFreebieCount: [{ required: true, message: '请输入赠送数量', trigger: 'blur' }],
  dailyFirstFreebieCount: [{ required: true, message: '请输入赠送数量', trigger: 'blur' }],
  pointsExchangeRatio: [{ required: true, message: '请输入兑换比例分子', trigger: 'blur' }],
  pointsPerBottle: [{ required: true, message: '请输入兑换比例分母', trigger: 'blur' }],
  dailyFreeLimit: [{ required: true, message: '请输入每日上限', trigger: 'blur' }],
}

const state = reactive({
  form: createDefaultForm(),
  currentConfigId: 0,
  configLoading: false,
  saveLoading: false,
  statsLoading: false,
  statistics: {
    totalCouponCount: 0,
    totalExchangeCount: 0,
    participatingUserCount: 0,
    usedCouponCount: 0,
  },
})

const {
  form,
  currentConfigId,
  configLoading,
  saveLoading,
  statsLoading,
  statistics,
} = toRefs(state)

const openProductSelect = () => {
  productSelectRef.value?.openDialog('radio', [])
}

const onProductSelect = (rows: any[]) => {
  const [row] = rows || []
  if (!row) return
  state.form.itemId = row.id
  state.form.itemName = row.name || ''
  formRef.value?.validateField('itemId')
}

const clearSelectedProduct = () => {
  state.form.itemId = undefined
  state.form.itemName = ''
  formRef.value?.validateField('itemId')
}

const loadConfig = async () => {
  state.configLoading = true
  try {
    const data = await getFreebieConfig()
    const config = data.config
    if (config) {
      state.currentConfigId = config.id || 0
      state.form = {
        itemId: config.itemId,
        itemName: config.itemName || config.productName || '',
        freeFreebieCount: config.freeFreebieCount ?? 0,
        dailyFirstFreebieCount: config.dailyFirstFreebieCount ?? 0,
        pointsExchangeRatio: config.pointsExchangeRatio ?? 0,
        pointsPerBottle: config.pointsPerBottle ?? 1,
        dailyFreeLimit: config.dailyFreeLimit ?? 0,
        exchangeEnabled: !!config.exchangeEnabled,
        activityEnabled: !!config.activityEnabled,
        newUserFirstBindingGift: !!config.newUserFirstBindingGift,
        dailyFirstBindingGift: !!config.dailyFirstBindingGift,
        pointsType: config.pointsType ?? 1,
      }
    } else {
      state.currentConfigId = 0
      state.form = createDefaultForm()
    }
  } finally {
    state.configLoading = false
  }
}

const loadStatistics = async () => {
  state.statsLoading = true
  try {
    const payload: any = {}
    if (timeRange.value?.[0] && timeRange.value?.[1]) {
      payload.startTime = Number(timeRange.value[0])
      payload.endTime = Number(timeRange.value[1]) + 24 * 60 * 60 * 1000 - 1
    }
    const data = await getFreebieStatistics(payload)
    state.statistics = {
      totalCouponCount: data.totalCouponCount || 0,
      totalExchangeCount: data.totalExchangeCount || 0,
      participatingUserCount: data.participatingUserCount || 0,
      usedCouponCount: data.usedCouponCount || 0,
    }
  } finally {
    state.statsLoading = false
  }
}

const onSave = async () => {
  if (!formRef.value) return
  await formRef.value.validate()
  state.saveLoading = true
  try {
    await saveFreebieConfig({
      itemId: state.form.itemId,
      freeFreebieCount: state.form.freeFreebieCount,
      dailyFirstFreebieCount: state.form.dailyFirstFreebieCount,
      pointsExchangeRatio: state.form.pointsExchangeRatio,
      pointsPerBottle: state.form.pointsPerBottle,
      dailyFreeLimit: state.form.dailyFreeLimit,
      exchangeEnabled: state.form.exchangeEnabled,
      activityEnabled: state.form.activityEnabled,
      newUserFirstBindingGift: state.form.newUserFirstBindingGift,
      dailyFirstBindingGift: state.form.dailyFirstBindingGift,
      pointsType: state.form.pointsType,
    })
    ElMessage.success('配置已保存')
    await loadConfig()
  } finally {
    state.saveLoading = false
  }
}

onMounted(async () => {
  await Promise.all([loadConfig(), loadStatistics()])
})
</script>

<style scoped lang="scss">
.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
}

.page-title {
  font-size: 20px;
  font-weight: 600;
  color: #303133;
}

.page-subtitle {
  margin-top: 6px;
  color: #909399;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.stats-toolbar {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.stats-row {
  margin-bottom: 20px;
}

.stats-card {
  padding: 20px;
  border-radius: 12px;
  background: linear-gradient(135deg, #f5f7fa 0%, #eef5ff 100%);
}

.stats-label {
  color: #909399;
  font-size: 13px;
}

.stats-value {
  margin-top: 10px;
  font-size: 28px;
  line-height: 1;
  font-weight: 700;
  color: #303133;
}

.config-alert {
  margin: 8px 0 26px;
}

:deep(.config-alert.el-alert) {
  padding: 14px 18px;
  border: 1px solid #b7e3c1;
  border-radius: 14px;
  background: linear-gradient(135deg, #f3fbf5 0%, #edf9f1 100%);
}

:deep(.config-alert .el-alert__icon) {
  font-size: 18px;
  color: #3fb950;
}

:deep(.config-alert .el-alert__content) {
  color: #2f6b3b;
  font-weight: 500;
}

.config-form {
  margin-top: 8px;
}

.config-section {
  padding: 22px 24px 10px;
  margin-bottom: 18px;
  border: 1px solid #ebeef5;
  border-radius: 16px;
  background: linear-gradient(180deg, #ffffff 0%, #fafcff 100%);
}

.section-title {
  margin-bottom: 18px;
  font-size: 15px;
  font-weight: 600;
  color: #303133;
}

.config-section :deep(.el-row) {
  row-gap: 10px;
}

.w100 {
  width: 100%;
}

.product-selector {
  display: flex;
  width: 100%;
  gap: 12px;
  align-items: center;
}

:deep(.config-form .el-form-item) {
  margin-bottom: 24px;
}

:deep(.config-form .el-form-item__label) {
  color: #606266;
}

:deep(.config-form .el-form-item__content) {
  min-height: 40px;
  display: flex;
  align-items: center;
}

:deep(.config-form .el-input__wrapper) {
  min-height: 40px;
}

:deep(.config-form .el-input-number) {
  width: 100%;
}

:deep(.switch-item .el-form-item__content) {
  min-height: 32px;
  display: flex;
  align-items: center;
}

@media screen and (max-width: 768px) {
  .config-alert {
    margin: 4px 0 20px;
  }

  .config-section {
    padding: 18px 16px 6px;
    border-radius: 12px;
  }

  .product-selector {
    flex-wrap: wrap;
  }
}
</style>
