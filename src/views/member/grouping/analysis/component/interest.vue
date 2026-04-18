<template>
  <div class="page-container layout-pd">
    <el-card shadow="never" class="layout-padding-auto">
      <el-tabs v-model="activeName" class="demo-tabs" @tab-change="handleTabs">
        <el-tab-pane label="访问商品排行" name="first"></el-tab-pane>
        <el-tab-pane label="加购商品排行" name="second"></el-tab-pane>
        <el-tab-pane label="成交商品排行" name="three"></el-tab-pane>
      </el-tabs>
      <el-table :data="list" v-loading="loading" style="width: 100%" header-cell-class-name="header-name">
        <el-table-column type="index" label="排名" show-overflow-tooltip min-width="80"></el-table-column>
        <el-table-column prop="productName" label="商品" show-overflow-tooltip min-width="250"></el-table-column>
        <el-table-column prop="price" label="价格" min-width="100" show-overflow-tooltip></el-table-column>
        <el-table-column prop="number" label="人数" min-width="100" show-overflow-tooltip></el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted, ref, toRefs } from 'vue'
import { formatDate } from '@/utils/formatTime'
// import { getMemberList } from '@/api/member/index'
import { parseMoney } from '@/utils/filters'

// 定义变量
const state = reactive({
  list: [],
  loading: false,
  submitData: {},
  activeName: 'first',
})

const { loading, activeName, list } = toRefs(state)

// 获取列表
const getListData = () => {
  // state.loading = true
  // getMemberList({}).then((data: any) => {
  //   state.loading = false
  //   state.list = data.list
  // }).catch(() => {
  //   state.loading = false
  // })
}

// 切换tab
const handleTabs = (name: any) => {
  if (name == 'first') {
    // getListData()
  } else {
    // getListData()
  }
}

// 页面加载时
onMounted(() => {
  // getListData()
})
</script>

<style scoped lang="scss">
::v-deep .header-name {
  background-color: #f7f7f7 !important;
}
</style>