<template>
  <div class="detail-container">
    <el-form ref="formRef" :model="ruleForm" :rules="rules" size="default" label-width="150px">
      <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
        <el-row :gutter="35">
          <el-col :xs="24" :sm="16" :md="16" :lg="16" :xl="16" class="mb20">
            <el-form-item label="标签名称" prop="name">
              <el-input v-model="ruleForm.name" clearable placeholder="最多可输入32个字符" :maxlength="32"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="16" :md="16" :lg="16" :xl="16" class="mb20">
            <el-form-item label="标签类型" prop="tagType">
              <el-radio-group v-model="ruleForm.tagType">
                <el-radio :label="1">手动打标</el-radio>
                <el-radio :label="2">自动打标</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="20" :md="20" :lg="20" :xl="20" class="mb20" v-if="ruleForm.tagType == 2">
            <el-form-item label="满足条件" prop="condition">
              <el-radio-group v-model="ruleForm.condition">
                <el-radio :label="1">必须满足所有被选中的条件</el-radio>
                <el-radio :label="2">满足任意一个被选中的条件</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="16" :md="16" :lg="16" :xl="16" class="mb20" v-if="ruleForm.tagType == 2">
            <el-form-item label="商品条件" prop="productCondition">
              <el-checkbox-group v-model="ruleForm.productCondition">
                <el-checkbox :label="1">历史时间购买过以下商品</el-checkbox>
              </el-checkbox-group>
              <el-button type="primary" text v-if="ruleForm.productCondition.length" @click="selectProduct">
                选择商品
              </el-button>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="16" :md="16" :lg="16" :xl="16" class="mb20" v-if="ruleForm.tagType == 2">
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
          <el-col :xs="24" :sm="16" :md="16" :lg="16" :xl="16" class="mb20" v-if="ruleForm.tagType == 2">
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
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item>
              <el-button type="primary" @click="onSubmit" :loading="loading">{{ submitTxt }}</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-col>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, reactive, toRefs, ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElForm } from 'element-plus';
// import { getIcCardDetail, addIcCard, updateIcCard } from '@/api/member/ic/index';
// import { getMemberList } from '@/api/member/index';
import mittBus from '@/utils/mitt';

const props = defineProps({
  isEidt: {
    type: Boolean,
    default: false,
  },
});

// 定义变量内容
const route = useRoute();
const router = useRouter();
const formRef = ref(ElForm);
const state = reactive({
  loading: false,
  ruleForm: {} as any,
  rules: {
    name: [{ required: true, trigger: 'blur', message: '请填写标签名称' }],
  },
  type: '',
  submitTxt: '',
  list: [] as any,
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
});

const { loading, ruleForm, rules, submitTxt, compare } = toRefs(state);

// 获取详情
const getDetailData = () => {
  if (props.isEidt) {
    state.type = 'edit';
    state.submitTxt = '修改';
    const id = router.currentRoute.value.query.id;
    // getIcCardDetail({
    //   id,
    // }).then((res: any) => {
    //   state.ruleForm = {
    //     id: res.id,
    //     name: '',
    //     tagType: 1,
    //     condition: '',
    //     productCondition: [],
    //     assetCondition: [],
    //     tradeCondition: [],
    //     productList: [],
    //     assetType: 1,
    //     asset: null,
    //     maxAsset: null,
    //     tradeNumType: 1,
    //     tradeNum: null,
    //     maxTradeNum: null,
    //     tradeAmountType: 1,
    //     tradeAmount: null,
    //     maxTradeAmount: null,
    //     unitPriceType: 1,
    //     unitPrice: null,
    //     maxUnitPrice: null,
    //     tradeTimeType: 1,
    //     tradeTime: [],
    //     tradeTimeNum: null,
    //   };
    // });
  } else {
    state.type = 'add';
    state.submitTxt = '保存';
    state.ruleForm = {
      name: '',
      tagType: 1,
      condition: '',
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
    };
  }
};

// 选择商品
const selectProduct = () => { }

// 提交
const onSubmit = () => {
  const ruleForm = JSON.parse(JSON.stringify(state.ruleForm));
  formRef.value.validate((valid: boolean) => {
    if (valid) {
      state.loading = true;
      // if (state.type === 'add') {
      // 	addIcCard(ruleForm)
      // 		.then(() => {
      // 			state.loading = false;
      // 			router.push('/member/tag/index');
      // 			closeCurrentTagsView();
      // 		})
      // 		.catch(() => {
      // 			state.loading = false;
      // 		});
      // } else {
      // 	updateIcCard(ruleForm)
      // 		.then(() => {
      // 			state.loading = false;
      // 			router.push('/member/tag/index');
      // 			closeCurrentTagsView();
      // 		})
      // 		.catch(() => {
      // 			state.loading = false;
      // 		});
      // }
    } else {
      return false;
    }
  });
};

// 关闭当前 tagsView
const closeCurrentTagsView = () => {
  mittBus.emit('onCurrentContextmenuClick', Object.assign({}, { contextMenuClickId: 1, ...route }));
};

// 页面加载时
onMounted(() => {
  getDetailData();
});
</script>
<style scoped lang="scss">
.mr-1 {
  margin-right: 4%;
}

.f-ac {
  display: flex;
  align-items: center;
}

:deep(.el-form-item__content) {
  flex-direction: column;
  align-items: flex-start;
}
</style>