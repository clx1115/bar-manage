<template>
  <div class="page-container layout-padding">
    <div class="card">
      <el-form :model="ruleForm" label-width="150px" style="max-width: 600px">
        <el-form-item label="费用金额：" props="ruleForm.money">
          <el-input v-model.number="ruleForm.money" style="width: 220px">
            <template #append>
              元
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="费用项目：" props="ruleForm.project">
          <el-select v-model="ruleForm.project">
            <el-option label="费用项目" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="费用归属：" props="ruleForm.attribution">
          <el-select v-model="ruleForm.attribution">
            <el-option label="xxx" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="往来单位：" props="ruleForm.unit">
          <el-select v-model="ruleForm.unit">
            <el-option label="往来单位" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="费用发生日期：" props="ruleForm.date">
          <el-date-picker v-model="ruleForm.date" type="date" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="收付类型：" props="ruleForm.type">
          <el-radio-group v-model="ruleForm.type">
            <el-radio :label="1">收款</el-radio>
            <el-radio :label="2">付款</el-radio>
          </el-radio-group>
        </el-form-item>
        <template v-if="ruleForm.type === 2">
          <el-form-item label="付款状态：" props="ruleForm.status">
            <el-radio-group v-model="ruleForm.status">
              <el-radio :label="1">未付款</el-radio>
              <el-radio :label="2">已付款</el-radio>
            </el-radio-group>
          </el-form-item>
        </template>
        <template v-else-if="ruleForm.type === 1">
          <el-form-item label="收款状态：" props="ruleForm.status">
            <el-radio-group v-model="ruleForm.status">
              <el-radio :label="1">未收款</el-radio>
              <el-radio :label="2">已收款</el-radio>
            </el-radio-group>
          </el-form-item>
        </template>
        <el-form-item label="上传图片：">
          <upload-img v-model="ruleForm.img" :width="90" :height="90"></upload-img>
        </el-form-item>
        <el-form-item label="附件：">
          <el-link :underline="false" type="primary">选择文件</el-link>
        </el-form-item>
        <el-form-item label="备注：">
          <el-input type="textarea" v-model="ruleForm.remark" style="width: 220px"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="bottom">
      <el-button type="primary" @click="onSubmit">提交审核</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, toRefs, defineAsyncComponent, onMounted } from 'vue'

const uploadImg = defineAsyncComponent(() => import('@/components/upload/uploadImg.vue'))

const state = reactive({
  ruleForm: {} as any,
})

const { ruleForm } = toRefs(state)

const onSubmit = () => {
  console.log('submit!')
}

onMounted(() => {
  state.ruleForm = {
    money: 0,
    project: '',
    attribution: '',
    unit: '',
    date: '',
    type: 2,
    status: 1,
    img: '',
    remark: '',
  }
})

</script>

<style scoped lang="scss">
.card {
  background-color: white;
  padding: 16px;
}

.flex {
  display: flex;
}

.bottom {
  height: 50px;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 16px;
}
</style>
