<template>
  <div class="page-container layout-pd">
    <div class="card">
      <el-form :model="ruleForm" label-width="140">
        <h2>基本信息</h2>
        <div class="line"></div>
        <el-form-item label="单位编码：" prop="code">
          <el-input v-model="ruleForm.code" style="width: 220px" />
        </el-form-item>
        <el-form-item label="合作伙伴名称：" prop="partnerName">
          <el-input v-model="ruleForm.partnerName" style="width: 220px" />
        </el-form-item>
        <el-form-item label="合作伙伴分类：" prop="category">
          <el-select v-model="ruleForm.category" style="width: 220px">
            <el-option label="xxx" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="联系地址：" prop="address">
          <el-cascader />
        </el-form-item>
        <el-form-item label=" " prop="addressDetail">
          <el-input v-model="ruleForm.addressDetail" style="width: 220px" type="textarea" placeholder="请输入详细地址" />
        </el-form-item>
        <el-form-item label="联系人姓名：" prop="contactName">
          <el-input v-model="ruleForm.contactName" style="width: 220px" />
        </el-form-item>
        <el-form-item label="联系人电话：" prop="contactPhone">
          <el-input v-model="ruleForm.contactPhone" style="width: 220px" />
        </el-form-item>
        <el-form-item label="联系人邮箱：" prop="contactEmail">
          <el-input v-model="ruleForm.contactEmail" style="width: 220px" />
        </el-form-item>

        <h2>银行账户信息(请填写对公银行账户信息)</h2>
        <div class="line"></div>
        <el-form-item label="账户名称：" prop="accountName">
          <el-input v-model="ruleForm.accountName" style="width: 220px" />
        </el-form-item>
        <el-form-item label="银行卡号：" prop="bankCard">
          <el-input v-model="ruleForm.bankCard" style="width: 220px" />
        </el-form-item>
        <el-form-item label="开户银行：" prop="bank">
          <el-select v-model="ruleForm.bank" style="width: 220px">
            <el-option label="xxx" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="开户地区：">
          <el-cascader />
        </el-form-item>
        <el-form-item label="支行名称：" prop="branchName">
          <el-input v-model="ruleForm.branchName" style="width: 220px" />
        </el-form-item>
      </el-form>
    </div>
    <div class="bottom">
      <el-button>取消</el-button>
      <el-button type="primary">确定</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, toRefs } from 'vue'

const state = reactive({
  ruleForm: {} as any,
  currentPage: 1,
  totalPage: 1,
  loading: false,
  list: [] as any,
})

const { ruleForm, currentPage, totalPage, loading, list } = toRefs(state)

// 获取列表
const getListData = () => {
  // state.loading = true
}


</script>

<style scoped lang="scss">
.card {
  background-color: white;
  padding: 16px;
}

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

.pagination {
  margin-top: 20px;
}
</style>