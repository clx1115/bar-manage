<template>
  <div class="page-container layout-pd">
    <el-form ref="dialogFormRef" :model="ruleForm" :rules="rules" size="default" label-width="240px">
      <div class="card">
        <h2 class="title">基本信息</h2>
        <div class="line"></div>
        <div class="form-item-list">
          <el-form-item label="场景类型：">
            销售分佣（供货关系）-总部统管资金
          </el-form-item>
          <el-form-item label="政策名称：" prop="name">
            <el-input v-model="ruleForm.name" placeholder="15个字以内" maxlength="15" style="width: 200px" />
          </el-form-item>
          <el-form-item label="发布主体：">
            总部
          </el-form-item>
          <el-form-item label="经营模式：" prop="bussinessModel">
            <el-checkbox-group v-model="ruleForm.bussinessModel">
              <el-checkbox label="直营" value="1" />
              <el-checkbox label="加盟" value="2" />
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="店铺分类：" prop="shopType">
            <el-checkbox-group v-model="ruleForm.shopType">
              <el-checkbox label="门店" value="1" />
              <el-checkbox label="商城" value="2" />
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="网点业绩归属优先级：" prop="priority">
            <div>
              <p>网点的订单可以选择业绩归属于那个门店，系统会按照优先级顺序自上而下自动判断；</p>
              <p>例如：网店销售门店发货的场景，可以将"发货门店"置顶，这样后续结算网店订单的收款及费用会默认归属与发货门店</p>
              <VueDraggable v-model="storeList" :animation="150" ghostClass="ghost">
                <div v-for="item in storeList" :key="item.id" class="dragItem">
                  {{ item.name }}
                  <div style="transform: scaleX(1.5); color: #c8c8c8;">≡</div>
                </div>
              </VueDraggable>
            </div>
          </el-form-item>
          <el-form-item label="计算时点：">
            履约完成
          </el-form-item>
          <el-form-item label="有效期：" prop="indate" style="width: 650px">
            <el-date-picker :disabled="ruleForm.islong" v-model="ruleForm.indate" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" />
            <el-checkbox label="长期" v-model="ruleForm.islong" style="margin-left: 10px" />
          </el-form-item>
          <el-form-item label="所属部门：" prop="department" style="width: 590px">
            <el-input v-model="ruleForm.department" placeholder="20个字以内" maxlength="20" />
          </el-form-item>
          <el-form-item label="" prop="department" style="margin-top: -14px;">
            <span style="font-size: 13px; color: gray;">发布政策人员所归属部门</span>
          </el-form-item>
          <el-form-item label="备注：" prop="extra" style="width: 590px">
            <el-input v-model="ruleForm.extra" placeholder="请输入" type="textarea" />
          </el-form-item>
        </div>
      </div>

      <div class="card">
        <h2 class="title">分佣条款</h2>
        <div class="line"></div>
        <div class="form-item-list">
          <el-form-item label="业务主体：">
            总部
          </el-form-item>
          <el-form-item label="销售渠道：">
            全部
          </el-form-item>
          <el-form-item label="起算金额：" prop="startAmount" style="width: 430px">
            <el-input v-model="ruleForm.startAmount">
              <template #append>元</template>
            </el-input>
          </el-form-item>

          <el-form-item label="扣除项规则：" style="width: 600px;">
            <div>
              <el-checkbox label="运费" v-model="ruleForm.deductionRule1" />
              <div v-if="ruleForm.deductionRule1" style="display: flex; width: 1000px;">
                运费归属：
                <el-radio-group v-model="ruleForm.deductionRule1Detail">
                  <el-radio :label="1">销售单元</el-radio>
                  <el-radio :label="2">发货单元</el-radio>
                  <el-radio :label="3">业绩归属单元</el-radio>
                  <el-radio :label="4">总部</el-radio>
                </el-radio-group>
              </div>
              <div>
                <el-checkbox label="自定义费用" v-model="ruleForm.deductionRule2" />
                <el-input placeholder="请输入" style="margin-left: 10px; width: 200px;">
                  <template #append>%</template>
                </el-input>
              </div>
              <el-checkbox label="储值赠送金" v-model="ruleForm.deductionRule3" />
              <div>
                <el-checkbox label="储值分佣" v-model="ruleForm.deductionRule4" />
                <el-input placeholder="请输入" style="margin-left: 10px; width: 200px;">
                  <template #append>%</template>
                </el-input>
              </div>
            </div>
          </el-form-item>

          <el-form-item label="分佣规则：">
            <el-button type="primary" @click="onOpenDrawer">新建分佣规则</el-button>
          </el-form-item>
        </div>
      </div>

      <div class="card">
        <h2 class="title">费用条款</h2>
        <div class="line"></div>
        <div class="form-item-list">
          <el-form-item label="储值费用是否需要分担：" prop="needShare">
            <el-radio-group v-model="ruleForm.needShare">
              <el-radio :label="true">是</el-radio>
              <el-radio :label="false">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="" style="margin-top: -14px;">
            <p>若选择是，分佣金额与储值费用会合并计算；若选择否，则系统只会根据分佣规则去计算，不会计算储值费用</p>
          </el-form-item>
          <div style="margin-left: 238px" v-if="ruleForm.needShare">
            <el-form-item label="储值支付赠送金店铺承担比例：" prop="shareProportion" label-width="210px">
              <el-input v-model="ruleForm.shareProportion" style="width: 200px">
                <template #append>%</template>
              </el-input>
            </el-form-item>
            <el-form-item label="储值回款费用店铺承担比例：" prop="shareProportion2">
              <el-input v-model="ruleForm.shareProportion2" style="width: 200px">
                <template #append>%</template>
              </el-input>
            </el-form-item>
          </div>
          <el-form-item label="交易服务费是否参与计算：" prop="needCompute">
            <el-radio-group v-model="ruleForm.needCompute">
              <el-radio :label="true">是</el-radio>
              <el-radio :label="false">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="" style="margin-top: -14px;">
            <p>若选择了是，订单中所产生的交易服务费，将按比例分摊。</p>
          </el-form-item>
          <div style="margin-left: 238px" v-if="ruleForm.needCompute">
            <el-form-item label="交易服务费分摊比例（业绩单元）：" prop="computeProportion1" label-width="238px">
              <el-input v-model="ruleForm.shareProportion" style="width: 200px">
                <template #append>%</template>
              </el-input>
            </el-form-item>
            <el-form-item label="交易服务费分摊比例（总部）：" prop="computeProportion2">
              <el-input v-model="ruleForm.shareProportion2" style="width: 200px">
                <template #append>%</template>
              </el-input>
            </el-form-item>
          </div>
        </div>
      </div>

      <Drawer ref="drawerRef" :type="type" />

      <div class="card">
        <h2 class="title">结算条款</h2>
        <div class="line"></div>
        <div class="form-item-list">
          <el-form-item label="结算方式：">
            <el-radio-group v-model="ruleForm.settleType">
              <el-radio :label="1">自动代扣</el-radio>
              <el-radio :label="2">对账结算</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="" style="margin-top: -14px;">
            <p>自动代扣：订单交易完成后，系统自动根据结算周期分钱到对应店铺。</p>
            <p>对账结算：可根据计算结果完成对账结算付款的全链路流程。</p>
          </el-form-item>
          <el-form-item label="结算账户：">
            <el-radio-group v-model="ruleForm.accountType">
              <el-radio :label="1">余额账户</el-radio>
              <el-radio :label="2">收益账户</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="结算周期：">
            <el-radio-group v-model="ruleForm.cycleType">
              <template v-if="ruleForm.settleType == 1">
                <el-radio :label="1">交易完成（实时）</el-radio>
                <el-radio :label="2">
                  交易完成
                  <el-input style="width: 80px" />
                  天后自动代扣
                </el-radio>
              </template>
              <template v-else>
                <el-radio :label="3">按日结算</el-radio>
                <el-radio :label="4">按周结算</el-radio>
                <el-radio :label="5">按月结算</el-radio>
              </template>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="" v-if="ruleForm.settleType == 2" style="margin-top: -14px;">
            <div style="font-size: 13px; color: gray;">
              需在
              <el-link :underline="false" style="font-size: 13px; color: #1577dc">财务设置</el-link>
              中开通自动创建结算单才可以按照配置周期自动出具结算单
            </div>
          </el-form-item>
          <template v-if="ruleForm.settleType == 2">
            <el-form-item label="结算日：" v-if="ruleForm.cycleType == 3">
              每日
            </el-form-item>
            <el-form-item label="结算日：" v-else-if="ruleForm.cycleType == 4">
              每
              <el-select v-model="ruleForm.week" placeholder="Select" style="width: 80px; margin: 0 4px">
                <el-option v-for="item in weekList" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="结算日：" v-else-if="ruleForm.cycleType == 5">
              每月
              <el-input style="width: 80px; margin: 0 4px" />
              号
            </el-form-item>
          </template>
        </div>
      </div>

      <div class="bottom">
        <el-button type="primary" @click="onSubmit">提交</el-button>
        <el-button @click="$router.back()">取消</el-button>
      </div>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, toRefs, watch, defineAsyncComponent } from 'vue'
import { ElForm } from 'element-plus'
import { VueDraggable } from 'vue-draggable-plus'

const Drawer = defineAsyncComponent(() => import('./addRule.vue'))

// 定义变量内容
const dialogFormRef = ref(ElForm)
const state = reactive({
  loading: false,
  ruleForm: {} as any,
  rules: {
    categoryId: [{ required: true, trigger: 'blur', message: '请选择类目' }],
    date: [{ required: true, trigger: 'blur', message: '请选择日期' }],
    amount: [{ required: true, trigger: 'blur', message: '请填写金额' }],
  },
  type: 4,
})

const { ruleForm, rules, type } =
  toRefs(state)

const storeList = ref([
  {
    id: 1,
    name: '销售单元'
  },
  {
    id: 2,
    name: '发货门店'
  },
  {
    id: 3,
    name: '会员所属店铺'
  },
  {
    id: 4,
    name: '专属导购所属店铺'
  },
  {
    id: 5,
    name: '发货前置仓'
  },
])

const weekList = [
  { value: 1, label: '周一' },
  { value: 2, label: '周二' },
  { value: 3, label: '周三' },
  { value: 4, label: '周四' },
  { value: 5, label: '周五' },
  { value: 6, label: '周六' },
  { value: 7, label: '周日' },
]

watch(storeList, (val) => {
  console.log(val);
})

const drawerRef = ref(Drawer)
const onOpenDrawer = () => {
  drawerRef.value.openDrawer()
}

// 提交
const onSubmit = () => {
  const ruleForm = JSON.parse(JSON.stringify(state.ruleForm))
  ruleForm.amount = Math.round(ruleForm.amount * 100)
  dialogFormRef.value.validate((valid: boolean) => {
    if (valid) {

    } else {
      return false
    }
  })
}

</script>

<style lang="scss" scoped>
.card {
  padding: 16px;
  background-color: white;
  margin-bottom: 16px;

  .title {
    font-size: 14px;
    margin-top: 10px;
  }

  .line {
    width: 100%;
    height: 1px;
    background-color: #eee;
    margin-top: 10px;
    margin-bottom: 24px;
  }

  .form-item-list {

    p {
      color: #aeaeae;
      font-size: 13px;
      line-height: 20px;
    }

    .dragItem {
      border: 1px solid #e2e2e2;
      padding: 0 20px;
      display: flex;
      justify-content: space-between;
      width: 200px;
      cursor: grab;
    }
  }

  &:last-child {
    margin-bottom: 50px;
  }
}

.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}

.bottom {
  height: 50px;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>