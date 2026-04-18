<template>
  <div class="page-container layout-padding">
    <el-card shadow="hover" class="layout-padding-auto">
      <div>
        <publicSearch :search="search" @search="onSearch" :is-toggle="true" />
        <el-button class="mb20" type="primary" @click="toDetail('add')">发布商品</el-button>
        <div class="mb20">
          <el-button :disabled="!selectedList.length">删除</el-button>
          <el-button :disabled="!selectedList.length">上架</el-button>
          <el-button :disabled="!selectedList.length">下架</el-button>
          <el-button :disabled="!selectedList.length">不可售</el-button>
        </div>
        <el-table :data="list" v-loading="loading" style="width: 100%" :header-cell-style="{ background: '#f5f7fa' }" @selection-change="selectedList = $event">
          <el-table-column type="selection" width="55" />
          <el-table-column prop="code" label="商品名称" min-width="150" show-overflow-tooltip />
          <el-table-column prop="name" label="价格(元)" min-width="150" show-overflow-tooltip />
          <el-table-column prop="itemTypeName" label="套餐类型" min-width="150" show-overflow-tooltip />
          <el-table-column prop="itemTypeName" label="商品状态" min-width="150" show-overflow-tooltip />
          <el-table-column prop="itemTypeName" label="访问量" min-width="150" show-overflow-tooltip />
          <el-table-column prop="itemTypeName" label="总可售库存" min-width="150" show-overflow-tooltip />
          <el-table-column prop="itemTypeName" label="销量" min-width="150" show-overflow-tooltip />
          <el-table-column prop="itemTypeName" label="序号" min-width="150" show-overflow-tooltip />
          <el-table-column prop="itemTypeName" label="商品分类" min-width="150" show-overflow-tooltip />
          <el-table-column prop="itemTypeName" label="商品类目" min-width="150" show-overflow-tooltip />
          <el-table-column prop="itemTypeName" label="品牌" min-width="150" show-overflow-tooltip />
          <el-table-column label="操作" min-width="180" fixed="right">
            <template #default="scope">
              <el-link type="primary" :underline="false" style="margin-right: 10px;">删除</el-link>
              <el-link type="primary" :underline="false" style="margin-right: 10px;">上架</el-link>
              <el-link type="primary" :underline="false" style="margin-right: 10px;">下架</el-link>
              <el-link type="primary" :underline="false">不可售</el-link>
            </template>
          </el-table-column>
        </el-table>
        <div class="page-bottom">
          <el-pagination v-model:currentPage="currentPage" background layout="prev, pager, next, jumper" :page-count="totalPage" @size-change="getListData" @current-change="getListData" />
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { toRefs, reactive, ref, defineAsyncComponent } from 'vue'
import { useRouter } from 'vue-router'

const publicSearch = defineAsyncComponent(
  () => import('@/components/publicSearch/index.vue')
)

//搜索条件
const search = ref([
  {
    label: '商品名称',
    prop: 'name',
    type: 'input',
    placeholder: '请输入商品名称',
  },
  {
    label: '子商品筛选',
    prop: 'subName',
    type: 'input',
    placeholder: '请输入子商品名称',
  },
  {
    label: '商品分类',
    prop: 'category',
    type: 'select',
    options: [

    ],
  },
  {
    label: '商品类目',
    prop: 'category',
    type: 'select',
    options: [

    ],
  },
  {
    label: '商品分组',
    prop: 'group',
    type: 'select',
    options: [

    ],
  },
  {
    label: '销量',
    prop: ['lowSales', 'highSales'],
    type: 'range',
    placeholder: ['最低', '最高'],
  },
  {
    label: '价格',
    prop: ['lowPrice', 'highPrice'],
    type: 'range',
    placeholder: ['最低', '最高'],
  },
  {
    label: '品牌',
    prop: 'brand',
    type: 'select',
    options: [

    ],
  },
  {
    label: '套餐类型',
    prop: 'packageType',
    type: 'select',
    options: [

    ],
  },
])

// 定义变量
const state = reactive({
  list: [1],
  loading: false,
  queryData: {},
  submitData: {},
  currentPage: 1,
  totalPage: 1,
  selectedList: [],
})

const { list, loading, currentPage, totalPage, selectedList } = toRefs(state)

const onSearch = (e: any, type: any) => {
  state.queryData = Object.assign({}, e)
  getListData()
}

// 获取列表
const getListData = () => {
  // state.loading = true
  if (JSON.stringify(state.queryData) !== JSON.stringify(state.submitData)) {
    state.currentPage = 1
  }
  const formData = JSON.parse(JSON.stringify(state.queryData))
}

const router = useRouter()
// 打开新增弹窗
const toDetail = (type: string) => {
  router.push(`/product/setDetail?type=${type}`)
}

</script>

<style scoped></style>
