<template>
  <div class="page-container layout-pd">
    <div class="card">
      <el-form :model="ruleForm" label-width="140">
        <h2>基本信息</h2>
        <div class="line"></div>
        <el-row :gutter="35">
          <el-col :xs="24" :sm="24" :md="7" :lg="7" :xl="7" class="mb20">
            <el-form-item label="组织编码：">
              xxxxx
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="7" :lg="7" :xl="7" class="mb20">
            <el-form-item label="组织类型：" prop="type">
              <el-select v-model="ruleForm.type" :disabled="true">
                <el-option label="总部" :value="1" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="35">
          <el-col :xs="24" :sm="24" :md="7" :lg="7" :xl="7" class="mb20">
            <el-form-item label="名称：" prop="name">
              <el-input v-model="ruleForm.name" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="7" :lg="7" :xl="7" class="mb20">
            <el-form-item label="公司全称：" prop="fullName">
              <el-input v-model="ruleForm.fullName" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="35">
          <el-col :xs="24" :sm="24" :md="7" :lg="7" :xl="7" class="mb20">
            <el-form-item label="公司税号：" prop="taxNumber">
              <el-input v-model="ruleForm.taxNumber" placeholder="请输入公司税号" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="7" :lg="7" :xl="7" class="mb20">
            <el-form-item label="公司地址：" prop="address">
              <el-input v-model="ruleForm.address" placeholder="请输入公司地址" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="35">
          <el-col :xs="24" :sm="24" :md="7" :lg="7" :xl="7" class="mb20">
            <el-form-item label="公司电话：" prop="phone">
              <el-input v-model="ruleForm.phone" placeholder="请输入公司电话" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="7" :lg="7" :xl="7" class="mb20">
            <el-form-item label="是否小规模纳税人：" prop="isSmall">
              <el-radio-group v-model="ruleForm.isSmall">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="2">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="35">
          <el-col :xs="24" :sm="24" :md="7" :lg="7" :xl="7" class="mb20">
            <el-form-item label="关联组织信息：">
              xxx店铺
            </el-form-item>
          </el-col>
        </el-row>

        <h2>银行账户信息</h2>
        <div class="line"></div>
        <el-row :gutter="35">
          <el-col :xs="24" :sm="24" :md="7" :lg="7" :xl="7" class="mb20">
            <el-form-item label="账户名称：" prop="accountName">
              <el-input v-model="ruleForm.accountName" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="35">
          <el-col :xs="24" :sm="24" :md="7" :lg="7" :xl="7" class="mb20">
            <el-form-item label="银行账号：" prop="bankNo">
              <el-input v-model="ruleForm.bankNo" placeholder="请输入银行卡号" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="7" :lg="7" :xl="7" class="mb20">
            <el-form-item label="开户银行：" prop="bankName">
              <el-input v-model="ruleForm.bankName" placeholder="请输入开户银行" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="35">
          <el-col :xs="24" :sm="24" :md="7" :lg="7" :xl="7" class="mb20">
            <el-form-item label="开户地区：" prop="bankArea">
              <el-cascader v-model="ruleForm.bankArea" :options="options" :props="{ checkStrictly: true, label: 'name', value: 'id' }" placeholder="请选择开户地区" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="7" :lg="7" :xl="7" class="mb20">
            <el-form-item label="支行名称：" prop="bankBranch">
              <el-input v-model="ruleForm.bankBranch" placeholder="请输入支行名称" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <h2>关联门店</h2>
      <div class="line"></div>
      <el-table :data="list" v-loading="loading" style="width: 100%" :header-cell-style="{ background: '#f5f7fa' }">
        <el-table-column prop="code" label="仓库门店" min-width="150" show-overflow-tooltip />
        <el-table-column prop="name" label="类型" min-width="150" show-overflow-tooltip />
        <el-table-column prop="itemTypeName" label="地址" min-width="150" show-overflow-tooltip />
        <el-table-column prop="itemTypeName" label="负责人" min-width="150" show-overflow-tooltip />
        <el-table-column prop="itemTypeName" label="状态" min-width="150" show-overflow-tooltip />
      </el-table>
      <div class="pagination">
        <el-pagination v-model:currentPage="currentPage" background layout="prev, pager, next, jumper" :page-count="totalPage" @size-change="getListData" @current-change="getListData" />
      </div>
    </div>
    <div class="bottom">
      <el-button type="primary">保存</el-button>
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