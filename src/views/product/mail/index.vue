<template>
  <div class="page-container layout-padding">
    <el-card shadow="hover" class="layout-padding-auto">
      <el-form class="query" :inline="true">
        <el-form-item>
          <el-button size="default" type="success" class="ml10" @click="onOpenAdd('add')">
            <el-icon>
              <ele-Plus />
            </el-icon>
            新增运费模板
          </el-button>
        </el-form-item>
      </el-form>
      <el-table :data="list" v-loading="loading" style="width: 100%">
        <el-table-column label="配送方式" width="150">
          <template #default="{ row }">
            <span v-if="row.method === 2">跑腿</span>
            <span v-if="row.method === 4">配送</span>
          </template>
        </el-table-column>
        <el-table-column label="运费配置">
          <template #default="{ row }">
            <span v-if="row.method === 2">首3公里费用：{{ parseMoney(row.firstKMFee) }}元<br>3公里后每公里费用：{{ parseMoney(row.nextKMFee) }}元</span>
            <template v-if="row.method === 4">
              <span v-if="row.firstAmountFe">首件费用：{{ parseMoney(row.firstAmountFee) }}元<br>续件费用：{{ parseMoney(row.nextAmountFee) }}元</span>
              <span v-else>首件费用：{{ parseMoney(row.firstWeightFee) }}元<br>续件费用：{{ parseMoney(row.nextWeightFee) }}元</span>
            </template>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template #default="{ row }">
            <el-button size="small" text type="primary" @click="onOpenEdit('edit', row)">修改</el-button>
            <el-button size="small" text type="primary" @click="onRowDel(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <detailDialog ref="detailDialogRef" @refresh="getListData" />
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, reactive, onMounted, ref, toRefs } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { parseMoney } from '@/utils/filters'
import { getMailList, delMail } from '@/api/product/mail/index'
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
  getMailList().then((data: any) => {
    state.loading = false
    state.list = data.list
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
  ElMessageBox.confirm(
    `此操作将永久删除此运费模板，是否继续?`,
    '提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      delMail({
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
