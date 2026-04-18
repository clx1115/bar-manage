<template>
  <div class="page-container layout-padding">
    <el-card shadow="hover" class="layout-padding-auto">
      <el-form class="query" :inline="true" size="default" label-width="90px">
        <el-row>
          <el-form-item>
            <el-button size="default" type="success" class="ml10" @click="onOpenAdd('add')">
              <el-icon>
                <ele-Plus />
              </el-icon>
              新增充值配置
            </el-button>
          </el-form-item>
        </el-row>
      </el-form>
      <el-table :data="list" v-loading="loading" style="width: 100%">
        <el-table-column label="充值金额">
          <template #default="{ row }">
            {{ parseMoney(row.upto) }}
          </template>
        </el-table-column>
        <el-table-column label="赠送金额">
          <template #default="{ row }">
            {{ parseMoney(row.give) }}
          </template>
        </el-table-column>
        <el-table-column label="赠送优惠券" min-width="80" show-overflow-tooltip>
          <template #default="{ row }">
            <div v-for="(item, index) in row.couponGift" :key="index">
              {{ item.couponTitle }} * {{ item.count }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="赠送卡券" min-width="80" show-overflow-tooltip>
          <template #default="{ row }">
            <div v-for="(item, index) in row.cardWallet" :key="index">
              {{ item.title }} * {{ item.count }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250">
          <template #default="{ row }">
            <el-form>
              <el-button size="small" text type="primary" @click="onOpenEdit('edit', row)">编辑</el-button>
              <el-button size="small" text type="primary" @click="onRowDel(row)">删除</el-button>
            </el-form>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <detailDialog ref="detailDialogRef" @refresh="getListData" />
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, reactive, onMounted, ref, toRefs } from 'vue'
import { parseMoney } from '@/utils/filters'
import { ElMessageBox, ElMessage } from 'element-plus'
import { getDepositConfigList, delDepositConfig } from '@/api/market/depositConfig/index'
// 引入组件
const detailDialog = defineAsyncComponent(
  () => import('./component/detail.vue')
)

// 定义变量
const detailDialogRef = ref()
const state = reactive({
  list: [],
  loading: false,
})

const { list, loading } = toRefs(state)

// 获取列表
const getListData = () => {
  state.loading = true
  getDepositConfigList().then((data: any) => {
    state.loading = false
    state.list = data.list.map((item: any) => {
      item.couponGift = item.couponGift ? JSON.parse(item.couponGift) : []
      item.cardWallet = item.cardWallet ? JSON.parse(item.cardWallet) : []
      return item
    })
  })
}
// 打开新增弹窗
const onOpenAdd = (type: string) => {
  detailDialogRef.value.openDialog(type)
}
// 打开修改弹窗
const onOpenEdit = (type: string, row: any) => {
  detailDialogRef.value.openDialog(type, row)
}
// 删除
const onRowDel = (row: any) => {
  ElMessageBox.confirm(`您确定要删除吗?`, '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      delDepositConfig({
        id: row.id,
      }).then(() => {
        getListData()
        ElMessage.success('删除成功')
      })
    })
    .catch(() => { })
}

// 页面加载时
onMounted(() => {
  getListData()
})
</script>

<style scoped lang="scss"></style>
