<template>
  <div class="custom-body">
    <el-form class="query" :inline="true">
      <el-form-item label="人群名称">
        <el-input v-model="queryData.name" size="default" placeholder="请输入人群名称" clearable> </el-input>
      </el-form-item>
      <el-form-item>
        <el-button size="default" type="primary" @click="getListData">
          <el-icon>
            <ele-Search />
          </el-icon>
          查询
        </el-button>
      </el-form-item>
      <el-form-item>
        <router-link to="/member/grouping/add">
          <el-button size="default" type="success" class="ml10">
            <el-icon>
              <ele-Plus />
            </el-icon>
            新增人群
          </el-button>
        </router-link>
      </el-form-item>
    </el-form>
    <el-table :data="list" v-loading="loading" style="width: 100%" header-cell-class-name="header-name">
      <el-table-column prop="name" label="人群名称" show-overflow-tooltip min-width="150"></el-table-column>
      <el-table-column prop="info" label="人群定义" show-overflow-tooltip min-width="200"></el-table-column>
      <el-table-column prop="number" align="right" label="人群数量" min-width="150" show-overflow-tooltip></el-table-column>
      <el-table-column prop="updateTime" label="更新时间" min-width="150" show-overflow-tooltip></el-table-column>
      <el-table-column prop="updateUser" label="操作人" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column fixed="right" align="right" label="操作" min-width="200">
        <template #default="{ row }">
          <el-form>
            <router-link to="" class="mr10">
              <el-button size="small" text type="primary">人群画像</el-button>
            </router-link>
            <router-link to="/member/grouping/analysis" class="mr10">
              <el-button size="small" text type="primary">人群分析</el-button>
            </router-link>
            <router-link to="" class="mr10">
              <el-button size="small" text type="primary">查看客户</el-button>
            </router-link>
            <router-link to="" class="mr10">
              <el-button size="small" text type="primary">去运营</el-button>
            </router-link>
            <el-button size="small" text type="primary" @click="delProduct(row)">删除</el-button>
          </el-form>
        </template>
      </el-table-column>
    </el-table>
    <div class="page-bottom">
      <el-pagination v-model:currentPage="currentPage" background layout="prev, pager, next, jumper"
        :page-count="totalPage" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, reactive, onMounted, ref, toRefs } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { formatDate } from '@/utils/formatTime'
// import { getMemberList } from '@/api/member/index'
import { parseMoney } from '@/utils/filters'

// 引入组件
// const pieChart = defineAsyncComponent(
//   () => import('./component/pieChart.vue')
// )

// 定义变量
const defaultQuery = {
  name: '',
}
const state = reactive({
  list: [],
  loading: false,
  currentPage: 1,
  totalPage: 1,
  queryData: Object.assign({}, defaultQuery),
  submitData: {},
})

const { loading, queryData, list, currentPage, totalPage } = toRefs(state)

// 获取列表
const getListData = () => {
  // state.loading = true
  // if (JSON.stringify(state.queryData) !== JSON.stringify(state.submitData)) {
  //   state.currentPage = 1
  // }
  // const formData = JSON.parse(JSON.stringify(state.queryData))
  // getMemberList({
  //   page: state.currentPage,
  //   ...formData,
  // }).then((data: any) => {
  //   state.loading = false
  //   state.list = data.list
  //   if (state.currentPage === 1 && data.pages > 0) {
  //     state.totalPage = data.pages
  //   }

  //   state.submitData = JSON.parse(JSON.stringify(state.queryData))
  // })
  console.log('sss')
}

const handleSizeChange = () => {
  getListData()
}

const handleCurrentChange = () => {
  getListData()
}

//删除
const delProduct = (row: any) => {
  // ElMessageBox.confirm(
  //   `此操作将永久删除商品名称：“${row.name}”，是否继续?`,
  //   '提示',
  //   {
  //     confirmButtonText: '确认',
  //     cancelButtonText: '取消',
  //     type: 'warning',
  //   }
  // )
  //   .then(() => {
  //     deleteProduct({
  //       id: [row.id],
  //     }).then(() => {
  //       getListData()
  //       ElMessage.success('删除成功')
  //     })
  //   })
  //   .catch(() => { })
}

// 页面加载时
onMounted(() => {
  // getListData()
})

// 暴露变量
defineExpose({
  getListData,
});
</script>

<style scoped lang="scss">
.custom-body {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: auto;
  height: 100%;
}

::v-deep .header-name {
  background-color: #f7f7f7 !important;
}
</style>