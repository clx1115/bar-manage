<template>
  <div class="dialog-container">
    <el-dialog title="客户列表" v-model="isShowDialog" width="900px" :close-on-click-modal="false" :destroy-on-close="true">
      <el-form class="query" :inline="true" size="default" label-width="80px">
        <el-row>
          <el-form-item label="关键字">
            <el-input v-model="queryData.filter" size="default" placeholder="请输入关键字" clearable> </el-input>
          </el-form-item>
          <el-form-item>
            <el-button size="default" type="primary" @click="getListData">
              <el-icon>
                <ele-Search />
              </el-icon>
              查询
            </el-button>
          </el-form-item>
        </el-row>
      </el-form>
      <el-table :data="list" v-loading="loading" style="width: 100%">
        <el-table-column prop="id" label="ID" width="100" />
        <el-table-column prop="phoneNumber" label="手机号码" show-overflow-tooltip></el-table-column>
        <el-table-column prop="nickName" label="用户昵称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="realName" label="用户姓名" show-overflow-tooltip></el-table-column>
      </el-table>
      <template #footer>
        <div class="select-footer">
          <span style="margin-right: 10px">
            <el-tag class="notice">
              <span>总客户数: {{ totalMembers }}</span>
            </el-tag>
          </span>
          <el-pagination v-model:currentPage="currentPage" background layout="prev, pager, next, jumper" :page-count="totalPage" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, toRefs } from 'vue'
import { getDealerCustomersList } from '@/api/member/index'

// 定义变量内容
const state = reactive({
  list: [],
  loading: false,
  currentPage: 1,
  totalPage: 1,
  queryData: {
    dealerId: 0,
    filter: ''
  },
  submitData: {},
  isShowDialog: false,
  totalMembers: 0,
})

const { list, loading, currentPage, queryData, totalPage, isShowDialog, totalMembers } =
  toRefs(state)

// 打开弹窗
const openDialog = (row: any) => {
  state.queryData.dealerId = row.id
  state.isShowDialog = true
  getListData()
}


// 获取列表
const getListData = () => {
  state.loading = true
  if (JSON.stringify(state.queryData) !== JSON.stringify(state.submitData)) {
    state.currentPage = 1
  }
  const formData = JSON.parse(JSON.stringify(state.queryData))
  getDealerCustomersList({
    page: state.currentPage,
    ...formData,
  }).then((data: any) => {
    state.loading = false
    state.list = data.list
    if (state.currentPage === 1 && data.pages > 0) {
      state.totalPage = data.pages
    }
    if (data.totalMembers) {
      state.totalMembers = data.totalMembers
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

// 暴露变量
defineExpose({
  openDialog,
})
</script>
<style lang="scss" scoped>
.select-footer {
  display: flex;

  .footer-btn {
    margin-right: 10px;
  }
}
</style>