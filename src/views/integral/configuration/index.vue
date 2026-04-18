<template>
  <div class="page-container layout-padding">
    <el-card shadow="hover" class="layout-padding-auto">
      <div class="from">
        <el-form ref="dialogFormRef" :model="ruleForm" size="default" label-width="200px">
          <el-row :gutter="35">
            <!-- <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
              <el-form-item label="积分折扣" prop="tabName">
                <el-input v-model="ruleForm.tabName" placeholder="请输入积分折扣" clearable></el-input>
                <span class="text">积分抵用比例(1积分抵多少金额)单位：元</span>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
              <el-form-item label="折扣上限" prop="tabName">
                <el-input v-model="ruleForm.tabName" placeholder="请输入折扣上限" clearable></el-input>
                <span class="text">单次下单积分使用上限,0不限制</span>
              </el-form-item>
            </el-col> -->
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
              <el-form-item label="下单赠送积分" prop="tabName">
                <el-input v-model="ruleForm.tabName" placeholder="请输入下单赠送积分" clearable></el-input>
                <span class="text">下单支付金额按比例赠送积分（实际支付1元赠送多少积分）</span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div class="conter"> <el-button type="primary">提交</el-button></div>

      </div>

    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, toRefs } from 'vue'

//变量
const state = reactive({
  ruleForm: {} as any,
})
const { ruleForm } = toRefs(state)
</script>
<style scoped lang="scss">
.from {
  width: 600px;

  .text {
    font-size: 12px;
    color: #a9a9a9;
  }

  .conter {
    text-align: center;
  }
}
</style>
