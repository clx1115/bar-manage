<template>
  <div class="page-container layout-pd">
    <el-form ref="dialogFormRef" :model="ruleForm" :rules="rules" size="default" label-width="240px">
      <div class="card">
        <h2 class="title">基本信息</h2>
        <div class="line"></div>
        <div class="form-item-list">
          <el-form-item label="场景类型：">
            销售收款归集
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
        <h2 class="title">归属条款</h2>
        <div class="line"></div>
        <div class="form-item-list">
          <el-form-item label="归集时点：">
            回款完成
          </el-form-item>
          <el-form-item label="归集额度：">
            100.00%
          </el-form-item>
          <el-form-item label="归集范围：" prop="range">
            <el-checkbox-group v-model="ruleForm.range">
              <el-checkbox label="商品下单" value="1" />
              <el-checkbox label="购买优惠券" value="2" />
              <el-checkbox label="购买权益卡" value="3" />
            </el-checkbox-group>
          </el-form-item>
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
import { reactive, ref, toRefs } from 'vue'
import { ElForm } from 'element-plus'

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
  type: 1,
})

const { ruleForm, rules } =
  toRefs(state)

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