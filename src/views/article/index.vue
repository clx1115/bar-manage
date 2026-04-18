<template>
  <div class="page-container layout-padding">
    <el-card shadow="hover" class="layout-padding-auto">
      <el-form class="query" :inline="true">
        <el-form-item>
          <el-input v-model="queryData.filter" size="default" placeholder="请输入关键字"> </el-input>
        </el-form-item>
        <el-form-item>
          <el-cascader v-model="queryData.categoryId" size="default" :options="categoryList" collapse-tags :props="{ value: 'id', label: 'name', multiple: false, emitPath: false }" style="width: 100%" placeholder="请选择文章分类" />
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
          <el-button size="default" @click="refreshQuery">
            <el-icon>
              <ele-Refresh />
            </el-icon>
            重置
          </el-button>
        </el-form-item>
        <el-form-item>
          <router-link to="/article/add">
            <el-button size="default" type="success" class="ml10">
              <el-icon>
                <ele-Plus />
              </el-icon>
              新增文章
            </el-button>
          </router-link>
        </el-form-item>
      </el-form>
      <el-table :data="list" v-loading="loading" style="width: 100%">
        <el-table-column prop="id" label="ID" width="100" />
        <el-table-column prop="title" label="文章标题" show-overflow-tooltip />
        <el-table-column prop="headPic" label="文章图片" show-overflow-tooltip>
          <template #default="{ row }"><img :src="row.headPic" class="smallImage"></template>
        </el-table-column>
        <el-table-column prop="author" label="文章作者" show-overflow-tooltip width="150" />
        <el-table-column prop="source" label="文章来源" show-overflow-tooltip />
        <el-table-column label="发布时间" width="200">
          <template #default="{ row }">
            {{ formatDate(row.createdTime, 'YYYY-mm-dd HH:MM:SS') }}
          </template>
        </el-table-column>
        <el-table-column prop="publishStatusName" label="发布状态" show-overflow-tooltip>
          <template #default="{ row }">
            <el-tag type="success" v-if="row.status === 1">启用</el-tag>
            <el-tag type="danger" v-if="row.status === 2">禁用</el-tag>
          </template>
        </el-table-column>>
        <el-table-column label="操作" width="120">
          <template #default="{ row }">
            <el-form>
              <router-link :to="`/article/edit?articleId=${row.id}`" class="mr10">
                <el-button size="small" text type="primary">编辑</el-button>
              </router-link>
              <el-button size="small" text type="primary" @click="onRowDel(row)">删除</el-button>
            </el-form>
          </template>
        </el-table-column>
      </el-table>
      <div class="page-bottom">
        <el-pagination v-model:currentPage="currentPage" background layout="prev, pager, next, jumper" :page-count="totalPage" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      </div>
    </el-card>
  </div>
</template>

<script lang="ts">
export default {
  name: 'articleIndex',
  beforeRouteEnter(to, from, next) {
    next((vm: any) => {
      if (from.name === 'articleAdd' || from.name === 'articleEdit') {
        vm.getListData()
      }
    })
  },
}
</script>
<script setup lang="ts">
import { reactive, onMounted, toRefs } from 'vue'
import { formatDate } from '@/utils/formatTime'
import { ElMessageBox, ElMessage } from 'element-plus'
import { getArticleList, delArticle } from '@/api/article/index'
import { getCategroyList } from '@/api/article/category/index'

// 定义变量
const defaultQuery = {
  filter: '',
  categoryId: 0,
}

const state = reactive({
  list: [],
  categoryList: [] as any,
  loading: false,
  currentPage: 1,
  totalPage: 1,
  queryData: Object.assign({}, defaultQuery),
  submitData: {},
})

const { list, categoryList, loading, currentPage, totalPage, queryData } =
  toRefs(state)

//获取文章分类列表
const getCategoryListData = () => {
  getCategroyList().then((data: any) => {
    state.categoryList = data.list
  })
}

// 获取列表
const getListData = () => {
  state.loading = true
  if (JSON.stringify(state.queryData) !== JSON.stringify(state.submitData)) {
    state.currentPage = 1
  }
  const formData = JSON.parse(JSON.stringify(state.queryData))
  getArticleList({
    page: state.currentPage,
    ...formData,
  }).then((data: any) => {
    state.loading = false
    state.list = data.list
    if (state.currentPage === 1 && data.pages > 0) {
      state.totalPage = data.pages
    }
    state.submitData = JSON.parse(JSON.stringify(state.queryData))
  })
}

const handleSizeChange = () => {
  getListData()
}

const handleCurrentChange = () => {
  getListData()
}

//重置搜索条件
const refreshQuery = () => {
  state.queryData = Object.assign({}, defaultQuery)
  getListData()
}

// 删除
const onRowDel = (row: any) => {
  ElMessageBox.confirm(`您确定要删除此文章吗?`, '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      delArticle({
        id: row.id,
        operation: 'del',
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
  getCategoryListData()
})

// 暴露变量
defineExpose({
  getListData
})
</script>

<style scoped lang="scss"></style>
