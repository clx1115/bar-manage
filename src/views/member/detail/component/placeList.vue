<template>
  <div>
    <el-table :data="list" v-loading="loading" height="400" style="width: 100%">
      <el-table-column label="商品名称" min-width="150">
        <template #default="{ row }">
          <span>{{ row.productName }}({{ row.skuName }})</span>
        </template>
      </el-table-column>
      <el-table-column label="剩余数量" width="150">
        <template #default="{ row }">
          <span>{{ row.stock }}</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="mt20">
      <el-pagination v-model:currentPage="currentPage" background layout="prev, pager, next, jumper" :page-count="totalPage" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, toRefs, onMounted } from 'vue'
import { getPlaceList } from '@/api/member/index'

const props = defineProps({
  uid: {
    type: Number,
    default: 0,
  }
})

// 定义变量内容
const state = reactive({
  list: [],
  loading: false,
  currentPage: 1,
  totalPage: 1,
})

const { list, loading, currentPage, totalPage } = toRefs(state)

// 获取列表
const getListData = () => {
  state.loading = true
  getPlaceList({
    uid: props.uid,
    page: state.currentPage,
  }).then((data: any) => {
    state.loading = false
    state.list = data.list
    if (state.currentPage === 1 && data.pages > 0) {
      state.totalPage = data.pages
    }
  })
}

const handleSizeChange = () => {
  getListData()
}

const handleCurrentChange = () => {
  getListData()
}

// 页面加载时
onMounted(() => {
  getListData()
})
</script>
<style lang="scss" scoped></style>