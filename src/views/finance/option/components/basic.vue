<template>
  <el-form :model="ruleForm" label-width="380">
    <h2>存货核算</h2>
    <div class="line"></div>
    <el-form-item label="存货核算方式：" prop="inventoryCalcType">
      <el-radio-group v-model="ruleForm.inventoryCalcType">
        <el-radio :label="1">现金先出</el-radio>
        <el-radio :label="2">移动加权平均</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label=" " class="tip">
      <span>切换成本核算方式，将影响存货成本取值规则，请谨慎操作。</span>
    </el-form-item>
    <el-form-item label="商品成本暂估比例：" prop="estimateCostRatio">
      <el-input v-model="ruleForm.estimateCostRatio" style="width: 180px">
        <template #append>
          %
        </template>
      </el-input>
    </el-form-item>

    <h2>往来核算</h2>
    <div class="line"></div>
    <el-form-item label="结算单多少天未报批作废：" prop="cancelExp">
      <el-input v-model="ruleForm.cancelExp" style="width: 180px">
        <template #append>
          天
        </template>
      </el-input>
    </el-form-item>

    <div class="title">
      <div class="flex">
        <div class="block"></div>
        <div>与供应商往来</div>
      </div>
    </div>
    <el-form-item label="结算单报批后是否自动审核：" prop="vendor_autoCheck">
      <el-radio-group v-model="ruleForm.vendor_autoCheck">
        <el-radio :label="1">是</el-radio>
        <el-radio :label="2">否</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="报批后多少天自动审核：" prop="vendor_autoCheckDate" v-show="ruleForm.vendor_autoCheck === 1">
      <el-input v-model="ruleForm.vendor_autoCheckDate" style="width: 180px">
        <template #append>
          天
        </template>
      </el-input>
    </el-form-item>
    <el-form-item label="结算单双方审核后是否自动生成付款单：" prop="vendor_autoGeneratePayment">
      <el-radio-group v-model="ruleForm.vendor_autoGeneratePayment">
        <el-radio :label="1">是</el-radio>
        <el-radio :label="2">否</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="付款单生成后是否自动报批：" prop="vendor_paymentAutoSubApproval">
      <el-radio-group v-model="ruleForm.vendor_paymentAutoSubApproval">
        <el-radio :label="1">是</el-radio>
        <el-radio :label="2">否</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="预付款单生成后是否自动报批：" prop="vendor_prepaidAutoSubApproval">
      <el-radio-group v-model="ruleForm.vendor_prepaidAutoSubApproval">
        <el-radio :label="1">是</el-radio>
        <el-radio :label="2">否</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="退款单生成后是否自动报批：" prop="vendor_refundAutoSubApproval">
      <el-radio-group v-model="ruleForm.vendor_refundAutoSubApproval">
        <el-radio :label="1">是</el-radio>
        <el-radio :label="2">否</el-radio>
      </el-radio-group>
    </el-form-item>

    <div class="title">
      <div class="flex">
        <div class="block"></div>
        <div>与加盟商往来</div>
      </div>
    </div>
    <el-form-item label="结算单报批后是否自动审核：" prop="franchise_autoCheck">
      <el-radio-group v-model="ruleForm.franchise_autoCheck">
        <el-radio :label="1">是</el-radio>
        <el-radio :label="2">否</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="报批后多少天自动审核：" prop="franchise_autoCheckDate" v-show="ruleForm.franchise_autoCheck === 1">
      <el-input v-model="ruleForm.franchise_autoCheckDate" style="width: 180px">
        <template #append>
          天
        </template>
      </el-input>
    </el-form-item>
    <el-form-item label="结算单双方审核后是否自动生成付款单：" prop="franchise_autoGeneratePayment">
      <el-radio-group v-model="ruleForm.franchise_autoGeneratePayment">
        <el-radio :label="1">是</el-radio>
        <el-radio :label="2">否</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="付款单生成后是否自动报批：" prop="franchise_paymentAutoSubApproval">
      <el-radio-group v-model="ruleForm.franchise_paymentAutoSubApproval">
        <el-radio :label="1">是</el-radio>
        <el-radio :label="2">否</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="预付款单生成后是否自动报批：" prop="franchise_prepaidAutoSubApproval">
      <el-radio-group v-model="ruleForm.franchise_prepaidAutoSubApproval">
        <el-radio :label="1">是</el-radio>
        <el-radio :label="2">否</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="离线支付收款方是否自动确认收款：" prop="franchise_autoConfirmPayment">
      <el-radio-group v-model="ruleForm.franchise_autoConfirmPayment">
        <el-radio :label="1">是</el-radio>
        <el-radio :label="2">否</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="退款单生成后是否自动报批：" prop="franchise_refundAutoSubApproval">
      <el-radio-group v-model="ruleForm.franchise_refundAutoSubApproval">
        <el-radio :label="1">是</el-radio>
        <el-radio :label="2">否</el-radio>
      </el-radio-group>
    </el-form-item>

    <div class="title">
      <div class="flex">
        <div class="block"></div>
        <div>与组织机构往来（销售结算）</div>
      </div>
    </div>
    <el-form-item label="未对账数据是否可以创建结算单：" prop="orga_canCreatePayment">
      <el-radio-group v-model="ruleForm.orga_canCreatePayment">
        <el-radio :label="1">是</el-radio>
        <el-radio :label="2">否</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="是否自动生成结算单：" prop="orga_autoGeneratePayment">
      <el-radio-group v-model="ruleForm.orga_autoGeneratePayment">
        <el-radio :label="1">是</el-radio>
        <el-radio :label="2">否</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="结算单付款方是否自动报批：" prop="orga_autoSubmitApproval">
      <el-radio-group v-model="ruleForm.orga_autoSubmitApproval">
        <el-radio :label="1">是</el-radio>
        <el-radio :label="2">否</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="结算单付款方是否自动审核：" prop="orga_autoCheck">
      <el-radio-group v-model="ruleForm.orga_autoCheck">
        <el-radio :label="1">是</el-radio>
        <el-radio :label="2">否</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="结算单收款方是否自动审核：" prop="orga_autoCheck2">
      <el-radio-group v-model="ruleForm.orga_autoCheck2">
        <el-radio :label="1">是</el-radio>
        <el-radio :label="2">否</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="结算单双方审核后是否自动生成付款单：" prop="orga_autoGeneratePayment">
      <el-radio-group v-model="ruleForm.orga_autoGeneratePayment">
        <el-radio :label="1">是</el-radio>
        <el-radio :label="2">否</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="付款单生成后付款方是否自动报批：" prop="orga_paymentAutoSubApproval">
      <el-radio-group v-model="ruleForm.orga_paymentAutoSubApproval">
        <el-radio :label="1">是</el-radio>
        <el-radio :label="2">否</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="离线支付收款方是否自动确认收款：" prop="orga_autoConfirmPayment">
      <el-radio-group v-model="ruleForm.orga_autoConfirmPayment">
        <el-radio :label="1">是</el-radio>
        <el-radio :label="2">否</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="付款单报批后是否自动转账（仅支持余额到余额）：" prop="orga_autoTransfer">
      <el-radio-group v-model="ruleForm.orga_autoTransfer">
        <el-radio :label="1">是</el-radio>
        <el-radio :label="2">否</el-radio>
      </el-radio-group>
    </el-form-item>

    <div class="title">
      <div class="flex">
        <div class="block"></div>
        <div>其它往来单位(合作伙伴、XX、员工)</div>
      </div>
    </div>
    <el-form-item label="付款单生成后是否自动报批：" prop="other_paymentAutoSubApproval">
      <el-radio-group v-model="ruleForm.other_paymentAutoSubApproval">
        <el-radio :label="1">是</el-radio>
        <el-radio :label="2">否</el-radio>
      </el-radio-group>
    </el-form-item>
  </el-form>
  <div class="bottom">
    <el-button type="primary">保存</el-button>
  </div>
</template>

<script setup lang="ts">
import { reactive, toRefs } from 'vue'

const state = reactive({
  ruleForm: {} as any,
})

const { ruleForm } = toRefs(state)


</script>

<style scoped lang="scss">
h2 {
  font-size: 14px;
}

.tip {
  color: #989898;
  font-size: 13px;
  margin-top: -24px;
}

.title {
  background-color: #f7f7f7;
  padding: 10px;
  margin-bottom: 16px;
  margin-top: 16px;

  .block {
    width: 4px;
    background-color: var(--el-color-primary);
    background-clip: content-box;
    padding: 1px 0;
    margin-right: 10px;
  }

  .navi-item {
    color: var(--el-color-primary);
    cursor: pointer;
  }

}

:deep(.el-tabs__item) {
  background-color: #f7f7f7;

  &.is-active {
    background-color: #fff;
  }
}

.flex {
  display: flex;
}

.line {
  border-bottom: 1px solid #eee;
  margin: 6px 0 16px 0;
}

.bottom {
  margin-top: 14px;
  display: flex;
  background-color: white;
  padding: 10px;
  justify-content: center;
  align-items: center;
}
</style>