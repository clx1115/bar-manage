<template>
  <div class="page-container layout-padding">
    <el-card shadow="hover" class="layout-padding-auto">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-table :data="staffSaleList" v-loading="loading" border style="width: 100%">
            <el-table-column prop="staffName" label="员工" width="150"></el-table-column>
            <el-table-column label="提成金额" min-width="200">
              <template #default="{ row }">
                {{ parseMoney(row.commission) }}
              </template>
            </el-table-column>
          </el-table>
          <div class="mt20">
            <span>提成总额：{{ parseMoney(totalAward) }}</span>
          </div>
        </el-col>
        <el-col :span="18">
          <el-table :data="memberSaleList" v-loading="loading" border style="width: 100%">
            <el-table-column label="销售日期" width="200">
              <template #default="{ row }">
                {{ row.date }}
              </template>
            </el-table-column>
            <el-table-column label="会员等级" min-width="200">
              <template #default="{ row }">
                {{ row.levelName }}
              </template>
            </el-table-column>
            <el-table-column label="充值金额" width="100">
              <template #default="{ row }">
                {{ parseMoney(row.depositAmount) }}
              </template>
            </el-table-column>
            <el-table-column label="提成比例" width="100">
              <template #default="{ row }">
                {{ row.awardRatio }}
              </template>
            </el-table-column>
            <el-table-column label="提成金额" width="100">
              <template #default="{ row }">
                {{ parseMoney(row.commission) }}
              </template>
            </el-table-column>
            <el-table-column label="员工" width="150">
              <template #default="{ row }">
                {{ parseMoney(row.staffName) }}
              </template>
            </el-table-column>
            <el-table-column label="客户" width="150">
              <template #default="{ row }">
                {{ parseMoney(row.userName) }}
              </template>
            </el-table-column>
            <el-table-column label="数量" width="100">
              <template #default="{ row }">
                {{ parseMoney(row.number) }}
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
<script setup lang="ts">
import {
  reactive,
  onMounted,
  toRefs,
} from 'vue'
import { parseMoney } from '@/utils/filters'
import { getStaffDepositStatList } from '@/api/stat/index'


// 定义变量
const state = reactive({
  loading: false,
  totalAward: 0,
  staffSaleList: [] as any,
  memberSaleList: [] as any,
})

const { loading, totalAward, staffSaleList, memberSaleList } =
  toRefs(state)


// 获取列表
const getListData = () => {
  state.loading = true
  getStaffDepositStatList().then((data: any) => {
    state.loading = false
    state.staffSaleList = data.staffSaleList
    state.memberSaleList = data.memberSaleList
    state.totalAward = data.totalAward
  })
}


// 页面加载时
onMounted(() => {
  getListData()
})
</script>

<style scoped lang="scss"></style>
