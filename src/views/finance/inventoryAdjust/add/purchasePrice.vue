<template>
  <div>
    <h2>基本信息</h2>
    <div class="line"></div>
    <el-form :model="ruleForm" label-width="150px" style="max-width: 600px">
      <el-form-item label="关联采购入库单：">
        <el-input placeholder="请选择关联采购入库单" v-model="ruleForm.relaReceipt" style="width: 220px">
          <template #append>
            <el-button :icon="Search" />
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="单据类型：">
        采购进价调整
      </el-form-item>
      <el-form-item label="制单人：">
        151******30
      </el-form-item>
      <el-form-item label="备注：">
        <el-input type="textarea" placeholder="请输入备注信息" style="width: 220px; margin-bottom: 50px" v-model="ruleForm.note" />
      </el-form-item>
    </el-form>

    <h2>商品明细</h2>
    <div class="line"></div>
    <el-table :data="list" style="width: 100%; margin-top: 10px" :header-cell-style="{ background: '#f5f7fa' }">
      <el-table-column prop="uid" label="商品名称" min-width="150" />
      <el-table-column prop="uid" label="单位" min-width="150" />
      <el-table-column prop="memberNo" label="调价前成本价(元)" min-width="150" />
      <el-table-column prop="memberNo" label="调价后成本价(元)" min-width="150" />
      <el-table-column prop="memberName" label="操作" min-width="80" />
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { reactive, toRefs } from 'vue'
import { Search } from '@element-plus/icons-vue'

const state = reactive({
  ruleForm: {} as any,
  list: [] as any,
})

const { ruleForm, list } = toRefs(state)

</script>

<style scoped lang="scss">
.card {
  background-color: white;
  padding: 16px;
}

.flex {
  display: flex;
}

h2 {
  font-size: 15px;
}

.line {
  border-bottom: 1px solid #eee;
  margin: 6px 0 10px 0;
}
</style>