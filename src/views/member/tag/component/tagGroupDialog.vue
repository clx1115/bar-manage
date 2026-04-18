<template>
  <div class="dialog-container">
    <el-dialog title="自动打标规则" v-model="dialog.isShowDialog" width="1000px" :close-on-click-modal="false"
      :destroy-on-close="true">
      <el-form ref="dialogFormRef" :model="ruleForm" :rules="rules" size="default" label-width="120px">
        <el-row :gutter="35">
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="满足条件" prop="condition">
              <el-radio-group v-model="ruleForm.condition">
                <el-radio :label="1">必须满足所有被选中的条件</el-radio>
                <el-radio :label="2">满足任意一个被选中的条件</el-radio>
              </el-radio-group>
              <div class="info">标签创建后新满足条件的客户会实时打标，标签创建前已满足条件的客户会在次日凌晨进行打标</div>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="商品条件" prop="productCondition">
              <el-checkbox-group v-model="ruleForm.productCondition">
                <el-checkbox :label="1">历史时间购买过以下商品</el-checkbox>
              </el-checkbox-group>
              <el-button type="primary" text v-if="ruleForm.productCondition.length" @click="selectProduct">
                选择商品
              </el-button>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="资产条件" prop="assetCondition">
              <el-checkbox-group v-model="ruleForm.assetCondition">
                <el-checkbox :label="1">历史累计获得积分</el-checkbox>
              </el-checkbox-group>
              <div class="f-ac" v-if="ruleForm.assetCondition.length">
                <el-select v-model="ruleForm.assetType" style="width: 120px;">
                  <el-option v-for="(val, key) in compare" :key="key" :label="val.label" :value="val.value">
                  </el-option>
                </el-select>
                <el-input-number v-model="ruleForm.asset" :min="0" controls-position="right" />
                <span style="margin: 0 6px;">{{ ruleForm.assetType !== 3 ? '个' : '到' }}</span>
                <el-input-number v-model="ruleForm.maxAsset" :min="0" controls-position="right"
                  v-if="ruleForm.assetType == 3" />
              </div>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="交易条件" prop="tradeCondition">
              <el-checkbox-group v-model="ruleForm.tradeCondition">
                <el-checkbox :label="1">最后消费时间</el-checkbox>
              </el-checkbox-group>
              <div class="f-ac" v-if="ruleForm.tradeCondition.indexOf(1) > -1">
                <el-select v-model="ruleForm.tradeTimeType" style="margin-right: 10px;width: 120px;">
                  <el-option label="固定时间" :value="1"></el-option>
                  <el-option label="相对时间" :value="2"></el-option>
                </el-select>
                <el-date-picker v-model="ruleForm.tradeTime" type="daterange" value-format="x" style="flex-grow: 0;"
                  start-placeholder="开始日期" end-placeholder="结束日期" v-if="ruleForm.tradeTimeType != 2" />
                <span v-if="ruleForm.tradeTimeType == 2">最近</span>
                <el-input v-model.number="ruleForm.tradeTimeNum" v-if="ruleForm.tradeTimeType == 2"
                  style="margin: 0 6px;width: 120px" />
                <span v-if="ruleForm.tradeTimeType == 2">天</span>
              </div>
              <el-checkbox-group v-model="ruleForm.tradeCondition">
                <el-checkbox :label="2">历史累计消费次数</el-checkbox>
              </el-checkbox-group>
              <div class="f-ac" v-if="ruleForm.tradeCondition.indexOf(2) > -1">
                <el-select v-model="ruleForm.tradeNumType" style="width: 120px;">
                  <el-option v-for="(val, key) in compare" :key="key" :label="val.label" :value="val.value">
                  </el-option>
                </el-select>
                <el-input-number v-model="ruleForm.tradeNum" :min="0" controls-position="right" />
                <span style="margin: 0 6px;">{{ ruleForm.tradeNumType !== 3 ? '次' : '到' }}</span>
                <el-input-number v-model="ruleForm.maxTradeNum" :min="0" controls-position="right"
                  v-if="ruleForm.tradeNumType == 3" />
              </div>
              <el-checkbox-group v-model="ruleForm.tradeCondition">
                <el-checkbox :label="3">历史累计消费金额</el-checkbox>
              </el-checkbox-group>
              <div class="f-ac" v-if="ruleForm.tradeCondition.indexOf(3) > -1">
                <el-select v-model="ruleForm.tradeAmountType" style="width: 120px;">
                  <el-option v-for="(val, key) in compare" :key="key" :label="val.label" :value="val.value">
                  </el-option>
                </el-select>
                <el-input-number v-model="ruleForm.tradeAmount" :min="0" controls-position="right" />
                <span style="margin: 0 6px;">{{ ruleForm.tradeAmountType !== 3 ? '元' : '到' }}</span>
                <el-input-number v-model="ruleForm.maxTradeAmount" :min="0" controls-position="right"
                  v-if="ruleForm.tradeAmountType == 3" />
              </div>
              <el-checkbox-group v-model="ruleForm.tradeCondition">
                <el-checkbox :label="4">客单价</el-checkbox>
              </el-checkbox-group>
              <div class="f-ac" v-if="ruleForm.tradeCondition.indexOf(4) > -1">
                <el-select v-model="ruleForm.unitPriceType" style="width: 120px;">
                  <el-option v-for="(val, key) in compare" :key="key" :label="val.label" :value="val.value">
                  </el-option>
                </el-select>
                <el-input-number v-model="ruleForm.unitPrice" :min="0" controls-position="right" />
                <span style="margin: 0 6px;">{{ ruleForm.unitPriceType !== 3 ? '元' : '到' }}</span>
                <el-input-number v-model="ruleForm.maxUnitPrice" :min="0" controls-position="right"
                  v-if="ruleForm.unitPriceType == 3" />
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="onCancel" size="default">取 消</el-button>
          <el-button type="primary" @click="onSubmit" size="default" :loading="loading">保存规则</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, toRefs } from 'vue'
import { ElForm } from 'element-plus'
// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh'])
// 定义变量内容
const dialogFormRef = ref(ElForm)
const state = reactive({
  loading: false,
  ruleForm: {} as any,
  rules: {},
  dialog: {
    isShowDialog: false,
  },
  compare: [{
    label: '大于',
    value: 1
  }, {
    label: '小于',
    value: 2
  }, {
    label: '区间',
    value: 3
  }]
})

const { loading, ruleForm, rules, dialog, compare } = toRefs(state)

// 打开弹窗
const openDialog = (row: any) => {
  state.ruleForm = {
    condition: 1,
    productCondition: [],
    assetCondition: [],
    tradeCondition: [],
    productList: [],
    assetType: 1,
    asset: null,
    maxAsset: null,
    tradeNumType: 1,
    tradeNum: null,
    maxTradeNum: null,
    tradeAmountType: 1,
    tradeAmount: null,
    maxTradeAmount: null,
    unitPriceType: 1,
    unitPrice: null,
    maxUnitPrice: null,
    tradeTimeType: 1,
    tradeTime: [],
    tradeTimeNum: null,
  }
  state.dialog.isShowDialog = true
}
// 关闭弹窗
const closeDialog = () => {
  state.dialog.isShowDialog = false
}
// 取消
const onCancel = () => {
  closeDialog()
}

// 选择商品
const selectProduct = () => { }
// 提交
const onSubmit = () => {
  state.loading = false
  closeDialog()
  emit('refresh')
}
// 暴露变量
defineExpose({
  openDialog,
})
</script>

<style lang="scss" scoped>
.f-ac {
  display: flex;
  align-items: center;
}

.info {
  // margin-left: 22px;
  margin-bottom: 4px;
  line-height: 1;
  font-size: 12px;
  color: #999;
}

:deep(.el-form-item__content) {
  flex-direction: column;
  align-items: flex-start;
}
</style>