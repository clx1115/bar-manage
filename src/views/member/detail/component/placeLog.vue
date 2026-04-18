<template>
  <div>
    <el-table :data="list" v-loading="loading" height="400" style="width: 100%">
      <el-table-column label="商品信息" min-width="150" show-overflow-tooltip>
        <template #default="{ row }">
          {{ row.productName }}({{ row.skuName }})
        </template>
      </el-table-column>
      <el-table-column label="类型" width="80" show-overflow-tooltip>
        <template #default="{ row }">
          {{ row.logType === 10 ? '寄存' : '消费' }}
        </template>
      </el-table-column>
      <el-table-column label="变动数量" width="100" show-overflow-tooltip>
        <template #default="{ row }">
          {{ row.changeAmount }}
        </template>
      </el-table-column>
      <el-table-column label="剩余数量" width="100" show-overflow-tooltip>
        <template #default="{ row }">
          {{ row.afterStock }}
        </template>
      </el-table-column>
      <el-table-column prop="shopName" label="门店" width="150" show-overflow-tooltip />
      <el-table-column label="时间" width="180">
        <template #default="{ row }">
          {{ formatDate(row.createTime, 'YY-mm-dd HH:MM:SS') }}
        </template>
      </el-table-column>
      <el-table-column prop="staffName" label="员工" width="120" />
      <el-table-column prop="operatorName" label="操作人" width="120" />
      <el-table-column label="状态" width="90">
        <template #default="{ row }">
          <span>{{ row.status === 10 ? '待审核' : '已审核' }}</span>
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
import { formatDate } from '@/utils/formatTime'
import { getPlaceLogList } from '@/api/member/index'

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
  getPlaceLogList({
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