<template>
  <div class="page-container layout-padding">
    <el-card shadow="hover" class="layout-padding-auto">
      <el-form class="query" :inline="true">
        <el-form-item>
        </el-form-item>
      </el-form>
      <el-tabs type="border-card" @tab-change="selectTab">
        <el-tab-pane :label="item.label" v-for="item in tabName">
          <el-table :data="list" v-loading="loading" style="width: 100%">
            <el-table-column prop="note" label="参数名" show-overflow-tooltip></el-table-column>
            <el-table-column label="参数值" show-overflow-tooltip>
              <template #default="{ row }">
                <span v-if="row.contentType === 1">{{ row.value }}</span>
                <span v-if="row.contentType === 4">{{ row.value ? '启用' : '停用' }}</span>
              </template>
            </el-table-column>>
            <el-table-column label="操作" width="100">
              <template #default="{ row }">
                <el-form>
                  <el-button size="small" text type="primary" @click="onOpenEdit(row)">修改</el-button>
                </el-form>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <detailDialog ref="detailDialogRef" @refresh="getListData" />
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, reactive, onMounted, ref, toRefs } from 'vue'
import { getConfigList } from '@/api/system/config/index'
// 引入组件
const detailDialog = defineAsyncComponent(
  () => import('./component/dialog.vue')
)

// 定义变量
const detailDialogRef = ref()
const state = reactive({
  list: [],
  loading: false,
  tabName: [
    { label: '基础配置' },
    { label: '短信配置' },
    { label: '会员配置' },
    { label: '桌码配置' },
  ]
})

const { list, loading, tabName } = toRefs(state)

// 获取列表
const getListData = () => {
  state.loading = true
  getConfigList().then((data: any) => {
    state.loading = false
    state.list = data.list
  })
}

// 选择tab
const selectTab = (name: string) => {
  let tabName = ''
  switch (name) {
    case '0':
      tabName = '基础配置'
      break;
    case '1':
      tabName = '短信配置'
      break;
    case '2':
      tabName = '会员配置'
      break;
    case '3':
      tabName = '桌码配置'
      break;
    default:
      break;
  }
  state.loading = true
  getConfigList().then((data: any) => {
    state.loading = false
    state.list = data.list.filter((item: any) => item.tabName == tabName)
  })
}

// 打开修改弹窗
const onOpenEdit = (row: any) => {
  detailDialogRef.value.openDialog(row)
}


// 页面加载时
onMounted(() => {
  getListData()
})
</script>

<style scoped lang="scss"></style>
