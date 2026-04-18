<template>
  <div class="page-container layout-padding">
    <el-card shadow="hover" class="layout-padding-auto">
      <el-form class="query" :inline="true" size="default" label-width="90px">
        <el-row>
          <el-form-item>
            <el-radio-group v-model="queryData.status" size="default" @change="getListData">
              <el-radio-button :label="0">全部</el-radio-button>
              <el-radio-button :label="1">已开业</el-radio-button>
              <el-radio-button :label="2">未开业</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="关键字">
            <el-input v-model="queryData.filter" size="default" placeholder="关键字" clearable> </el-input>
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
            <router-link to="/shop/add">
              <el-button size="default" type="success" class="ml10">
                <el-icon>
                  <ele-Plus />
                </el-icon>
                新增店铺
              </el-button>
            </router-link>
          </el-form-item>
        </el-row>
      </el-form>
      <el-table :data="list" v-loading="loading" style="width: 100%">
        <el-table-column type="selection" width="30" />
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="coverImgUrl" label="图片" width="100">
          <template #default="{ row }"><img :src="row.coverImgUrl" class="smallImage" /></template>
        </el-table-column>
        <el-table-column prop="name" label="名称" min-width="100" show-overflow-tooltip />
        <el-table-column prop="contactName" label="联系人" width="100">
        </el-table-column>
        <el-table-column prop="contactNumber" label="联系电话" width="150">
        </el-table-column>
        <el-table-column prop="contactAddress" label="地址" min-width="120" show-overflow-tooltip />
        <el-table-column fixed="right" width="100px" label="状态" align="center">
          <template #default="{ row }">
            <el-tag type="success" v-if="row.status === 1">开业</el-tag>
            <el-tag type="danger" v-if="row.status === 2">歇业</el-tag>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="200">
          <template #default="{ row }">
            <router-link :to="`/shop/edit?shopId=${row.id}`" class="mr10">
              <el-button size="small" text type="primary">修改</el-button>
            </router-link>
            <el-button size="small" text type="primary" @click="onSetStatus(row)">{{ row.status === 1 ? '歇业' : '开业'
            }}</el-button>
            <el-button size="small" text type="primary" @click="onGenerateAuth(row)">打印授权码</el-button>
            <el-button size="small" text type="primary" @click="onDel(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="page-bottom">
        <el-pagination v-model:currentPage="currentPage" background layout="prev, pager, next, jumper" :page-count="totalPage" @size-change="getListData" @current-change="getListData" />
      </div>
    </el-card>
    <authDialog ref="authDialogRef" />
  </div>
</template>
<script lang="ts">
export default {
  name: 'shopIndex',
  beforeRouteEnter(to, from, next) {
    next((vm: any) => {
      if (from.name === 'shopAdd' || from.name === 'shopEdit') {
        vm.getListData()
      }
    })
  },
}
</script>
<script setup lang="ts">
import { defineAsyncComponent, reactive, onMounted, toRefs, ref } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { getShopList, updateShop, deleteShop, generateAuth } from '@/api/shop/index'

const authDialog = defineAsyncComponent(
  () => import('./component/auth.vue')
)

// 定义变量
const authDialogRef = ref('')
const defaultQuery = {
  status: 0,
  filter: '',
}
const state = reactive({
  list: [],
  loading: false,
  currentPage: 1,
  totalPage: 1,
  queryData: Object.assign({}, defaultQuery),
  submitData: {},
})

const { list, loading, currentPage, totalPage, queryData } =
  toRefs(state)

// 获取店铺列表
const getListData = () => {
  state.loading = true
  if (JSON.stringify(state.queryData) !== JSON.stringify(state.submitData)) {
    state.currentPage = 1
  }
  const formData = JSON.parse(JSON.stringify(state.queryData))
  getShopList({
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

//重置搜索条件
const refreshQuery = () => {
  state.queryData = Object.assign({}, defaultQuery)
  getListData()
}

//授权码
const onGenerateAuth = (row: any) => {
  authDialogRef.value.openDialog(row)
}

//删除
const onDel = (row: any) => {
  ElMessageBox.confirm(
    `此操作将永久删除店铺名称：“${row.name}”，是否继续?`,
    '提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      deleteShop({
        id: row.id,
      }).then(() => {
        getListData()
        ElMessage.success('删除成功')
      })
    })
    .catch(() => { })
}

// 开业/未开业
const onSetStatus = (row: any) => {
  updateShop({
    id: row.id,
    status: row.status === 1 ? 2 : 1,
  }).then(() => {
    getListData()
  })
}

// 页面加载时
onMounted(() => {
  getListData()
})

// 暴露变量
defineExpose({
  getListData,
})
</script>
<style scoped></style>
