<template>
  <div class="custom-body">
    <el-form class="query" :inline="true">
      <el-form-item label="规则">
        <el-select v-model="queryData.rule" placeholder="请选择规则">
          <el-option v-for="item in ruleList" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="queryData.status" placeholder="请选择状态">
          <el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="标签组名称">
        <el-input v-model="queryData.name" size="default" placeholder="请输入标签组名称" clearable> </el-input>
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
        <router-link to="/member/tagGroup/add">
          <el-button size="default" type="success" class="ml10">
            <el-icon>
              <ele-Plus />
            </el-icon>
            新增标签组
          </el-button>
        </router-link>
      </el-form-item>
    </el-form>
    <el-table :data="list" v-loading="loading" style="width: 100%" header-cell-class-name="header-name">
      <el-table-column prop="id" label="ID" show-overflow-tooltip width="100"></el-table-column>
      <el-table-column prop="name" label="标签组名称" show-overflow-tooltip min-width="150"></el-table-column>
      <el-table-column prop="tags" label="标签名称" show-overflow-tooltip min-width="200"></el-table-column>
      <el-table-column prop="ruleType" label="添加规则" min-width="150" show-overflow-tooltip></el-table-column>
      <el-table-column prop="markMethod" label="打标方式" min-width="150" show-overflow-tooltip></el-table-column>
      <el-table-column prop="status" label="状态" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column fixed="right" align="right" label="操作" min-width="200">
        <template #default="{ row }">
          <el-form>
            <router-link to="/member/tagGroup/edit" class="mr10">
              <el-button size="small" text type="primary">修改</el-button>
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

// 定义变量
const defaultQuery = {
  name: '',
  rule: '',
  status: '',
}
const state = reactive({
  list: [],
  loading: false,
  currentPage: 1,
  totalPage: 1,
  queryData: Object.assign({}, defaultQuery),
  submitData: {},
  ruleList: [{
    label: '仅唯一添加',
    value: 1
  }, {
    label: '可添加多个',
    value: 2
  }] as any,
  statusList: [{
    label: '启用中',
    value: 1
  }, {
    label: '禁用中',
    value: 2
  }] as any,
})

const { loading, queryData, list, currentPage, totalPage, ruleList, statusList } = toRefs(state)

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
  getListData()
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

:deep(.header-name) {
  background-color: #f7f7f7 !important;
}
</style>