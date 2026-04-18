<template>
  <div class="withdraw">
    <el-form ref="ruleFormRef" :model="form" label-width="auto" :rules="rules" style="max-width: 350px; margin-left: 40px">
      <el-form-item label="出款账户">
        <el-radio-group v-model="form.account">
          <el-radio label="balance">店铺余额</el-radio>
          <el-radio label="earning">店铺收益</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="到账银行卡" prop="receiver">
        <el-link :underline="false" type="primary">+ 添加银行卡</el-link>
      </el-form-item>
      <el-form-item label="提现金额" prop="amount" class="money">
        <el-input v-model.number="form.amount" placeholder="请输入提现金额">
          <template #append>元</template>
        </el-input>
        <el-link :underline="false" type="primary" style="width: 30%;">全部提现</el-link>
      </el-form-item>
      <el-form-item label=" " class="tip">
        <span>余额￥{{ balance }}</span>
        <span v-if="balance === 0">，暂不可提现</span>
      </el-form-item>
      <el-form-item label="备注" prop="note">
        <el-input v-model="form.note" :autosize="{ minRows: 2 }" type="textarea" placeholder="输入提现用途（选填）" />
      </el-form-item>
      <el-form-item label=" ">
        <el-button :disabled="balance === 0" type="primary" @click="onSubmit">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { toRefs, reactive, ref } from 'vue'

// 定义变量
const state = reactive({
  balance: 0.00,
  form: {
    account: '',
    amount: '',
    note: '',
  }
})

const { balance, form } = toRefs(state)

const rules = {
  amount: [
    { required: true, message: '', trigger: 'blur' },
    { type: 'number', message: '提现金额必须为数字值', trigger: ['blur', 'change'] }
  ]
}

const ruleFormRef = ref()
const onSubmit = async () => {
  await ruleFormRef.value.validate((valid: any) => {
    console.log(state.form)
    if (valid) {
      console.log('submit!')
    } else {
      console.log('false!')
    }
  })

}


</script>

<style scoped lang="scss">
.withdraw {

  .tip {
    margin-top: -20px;
    color: #9d9d9d;
  }

  .money {
    :deep(.el-form-item__content) {
      flex-wrap: nowrap;
    }
  }
}

.flex {
  display: flex;
}
</style>
