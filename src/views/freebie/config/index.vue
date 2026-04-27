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
        class="mb20"
      >
        当前已存在门店配置，配置ID：{{ currentConfigId }}
      </el-alert>

      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="180px"
        v-loading="configLoading"
      >
        <el-row :gutter="20">
          <el-col :xs="24" :md="12">
            <el-form-item label="关联商品" prop="itemId">
              <el-select
                v-model="form.itemId"
                filterable
                remote
                reserve-keyword
                clearable
                placeholder="请选择引流品"
                :remote-method="loadItemOptions"
                :loading="itemLoading"
                @focus="loadItemOptions('')"
                class="w100"
              >
                <el-option
                  v-for="item in itemOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
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
          <el-col :xs="24" :md="12">
            <el-form-item label="活动总开关">
              <el-switch v-model="form.activityEnabled" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :md="12">
            <el-form-item label="积分兑换通道">
              <el-switch v-model="form.exchangeEnabled" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :md="12">
            <el-form-item label="新用户首次绑定赠送">
              <el-switch v-model="form.newUserFirstBindingGift" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :md="12">
            <el-form-item label="每日首次绑定赠送">
              <el-switch v-model="form.dailyFirstBindingGift" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, toRefs } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { getItemList } from '@/api/product/item/index'
import {
  getFreebieConfig,
  getFreebieStatistics,
  saveFreebieConfig,
} from '@/api/freebie/index'

const createDefaultForm = () => ({
  itemId: undefined as number | undefined,
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
const timeRange = ref([] as any[])
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
  itemLoading: false,
  itemOptions: [] as any[],
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
  itemLoading,
  itemOptions,
  statsLoading,
  statistics,
} = toRefs(state)

const ensureCurrentItem = (config: any) => {
  if (!config?.itemId || !config?.itemName) return
  const exists = state.itemOptions.some((item) => item.id === config.itemId)
  if (!exists) {
    state.itemOptions.unshift({
      id: config.itemId,
      name: config.itemName,
    })
  }
}

const loadItemOptions = async (keyword = '') => {
  state.itemLoading = true
  try {
    const data = await getItemList({
      page: 1,
      size: 100,
      filter: keyword,
    })
    state.itemOptions = data.list || []
  } finally {
    state.itemLoading = false
  }
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
      ensureCurrentItem(config)
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
  await loadItemOptions('')
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

.w100 {
  width: 100%;
}
</style>
