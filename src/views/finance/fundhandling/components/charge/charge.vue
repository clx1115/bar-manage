<template>
  <div class="charge">
    <el-alert style="margin-bottom: 20px" v-if="isTry" title="因店铺在试用期内，暂不支持店铺余额充值" type="warning" show-icon :closable="false" />
    <el-form ref="ruleFormRef" :model="form" label-width="auto" :rules="rules" style="max-width: 350px; margin-left: 40px">
      <el-form-item label="店铺名称">
        XX蛋糕店
      </el-form-item>
      <el-form-item label="收款账户" prop="account">
        <el-radio-group v-model="form.account">
          <el-radio label="default">店铺余额账户</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="账户可用余额">
        0.00 元
      </el-form-item>
      <el-form-item label="充值金额" prop="amount">
        <el-input v-model.number="form.amount" placeholder="请输入充值金额">
          <template #append>元</template>
        </el-input>
      </el-form-item>
      <el-form-item label=" ">
        <el-button :disabled="isTry" type="primary" @click="onSubmit">确定充值</el-button>
      </el-form-item>
    </el-form>
    <div class="tip">
      <h2>使用遇到问题？</h2>
      <h3>1.输入充值金额后，为什么无法充值成功</h3>
      <p>
        请确认充值金额是否正确，充值金额必须为数字，且不能超过店铺余额账户可用余额。<br>
        请确认充值金额是否正确，充值金额必须为数字，且不能超过店铺余额账户可用余额。
      </p>
      <h3>2.xxx</h3>
      <p>
        xxxxxx<br>
        xxxx
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toRefs, reactive, ref } from 'vue'

// 定义变量
const state = reactive({
  isTry: true,
  form: {
    account: '',
    amount: '',
  }
})

const { isTry, form } = toRefs(state)

const rules = {
  account: [
    { required: true, message: '请选择收款账户', trigger: 'blur' }
  ],
  amount: [
    { required: true, message: '请输入充值金额', trigger: 'blur' },
    { type: 'number', message: '充值金额必须为数字值', trigger: ['blur', 'change'] }
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
.charge {
  :deep(.el-alert) {
    border: none;
  }

  .tip {
    background-color: #fbfbfb;
    border: 1px solid #e8e8e8;
    padding: 15px 25px;
    margin-top: 80px;

    h2 {
      font-size: 14px;
      font-weight: normal;
    }

    h3 {
      font-size: 13px;
      font-weight: normal;
      margin-top: 10px;
    }

    p {
      margin-top: 5px;
      font-size: 13px;
      color: #818181;
    }
  }
}
</style>
