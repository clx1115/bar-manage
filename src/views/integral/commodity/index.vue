<template>
  <div class="page-container layout-padding">
    <el-card shadow="hover" class="layout-padding-auto">
      <el-form class="query" :inline="true" size="default" label-width="90px">
        <el-row>
          <el-form-item>
            <el-radio-group v-model="queryData.status" size="default" @change="getListData">
              <el-radio-button :label="0">全部</el-radio-button>
              <el-radio-button :label="1">已上架</el-radio-button>
              <el-radio-button :label="-1">已下架</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="关键字">
            <el-input v-model="queryData.filter" size="default" placeholder="关键字" clearable> </el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <el-cascader v-model="queryData.categoryId" :options="categoryList" clearable collapse-tags
              :props="{ value: 'id', label: 'name', multiple: false, emitPath: false }" style="width: 100%"
              placeholder="商品分类" @change="getListData" />
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
        </el-row>
        <el-row>
          <el-form-item>
            <router-link to="/integral/commodity/add">
              <el-button size="default" type="success" class="ml10">
                <el-icon>
                  <ele-Plus />
                </el-icon>
                新增商品
              </el-button>
            </router-link>
          </el-form-item>
          <el-form-item>
            <el-button :disabled="!selectedList.length" type="success" @click="batchStatus(1)">
              <el-icon>
                <ele-Upload />
              </el-icon>
              上架
            </el-button>
          </el-form-item>
          <el-form-item>
            <el-button :disabled="!selectedList.length" type="danger" @click="batchStatus(-1)">
              <el-icon>
                <ele-Download />
              </el-icon>
              下架
            </el-button>
          </el-form-item>
          <el-form-item>
            <el-button size="default" :loading="exportLoading" type="primary" @click="downloadFile">
              <el-icon>
                <ele-Download />
              </el-icon>
              导出
            </el-button>
          </el-form-item>
        </el-row>
      </el-form>
      <el-table :data="list" v-loading="loading" style="width: 100%" @selection-change="selectedList = $event">
        <el-table-column type="selection" width="30" />
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="coverImgUrl" label="图片" width="120">
          <template #default="{ row }"><img :src="row.coverImgUrl" class="smallImage"></template>
        </el-table-column>
        <el-table-column prop="name" label="名称" width="120" show-overflow-tooltip />
        <el-table-column prop="unit" label="单位" width="120" show-overflow-tooltip />
        <el-table-column label="积分" width="120">
          <template #default="{ row }">
            <span v-if="row.minScore === row.maxScore"> {{ row.minScore }} </span>
            <span v-else> {{ row.minScore }} - {{ row.maxScore }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="排列序号" />
        <el-table-column fixed="right" width="100px" label="状态" align="center">
          <template #default="{ row }">
            <el-tag type="success" v-if="row.status === 1">上架</el-tag>
            <el-tag type="danger" v-if="row.status === -1">下架</el-tag>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="200">
          <template #default="{ row }">
            <router-link :to="`/integral/commodity/edit?scoreProductId=${row.id}`" class="mr10">
              <el-button size="small" text type="primary">修改</el-button>
            </router-link>
            <el-button size="small" text type="primary" @click="onSetStatus(row)">{{ row.status === 1 ? '下架' : '上架'
            }}</el-button>
            <el-button size="small" text type="primary" @click="delProduct(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="page-bottom">
        <el-pagination v-model:currentPage="currentPage" background layout="prev, pager, next, jumper"
          :page-count="totalPage" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      </div>
    </el-card>
  </div>
</template>
<script lang="ts">
export default {
  name: 'productIndex',
  beforeRouteEnter(to, from, next) {
    next((vm: any) => {
      if (from.name === 'productAdd' || from.name === 'productEdit') {
        vm.getListData()
      }
    })
  },
}
</script>
<script setup lang="ts">
import { reactive, onMounted, toRefs } from 'vue'
import { parseMoney } from '@/utils/filters'
import { ElMessageBox, ElMessage } from 'element-plus'
import {
  getScoreList,
  setStatus,
  batchSetStatus,
  delScore,
} from '@/api/integral/index'
import { getCategroyList } from '@/api/product/category/index'

// 定义变量
const defaultQuery = {
  status: 0,
  filter: '',
  categoryId: '',
}
const state = reactive({
  list: [],
  categoryList: [] as any,
  loading: false,
  currentPage: 1,
  totalPage: 1,
  queryData: Object.assign({}, defaultQuery),
  submitData: {},
  selectedList: [],
  exportLoading: false,
})

const {
  list,
  categoryList,
  loading,
  currentPage,
  totalPage,
  queryData,
  selectedList,
  exportLoading,
} = toRefs(state)

// 获取分类列表
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

  getScoreList({
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

const handleSizeChange = () => {
  getListData()
}

const handleCurrentChange = () => {
  getListData()
}

//导出表格
const downloadFile = () => {
  import('@/utils/export.js').then((excel) => {
    state.exportLoading = true
    getScoreList({ page: 0, ...state.submitData }).then((data) => {
      data.list.map((item: any) => {
        item.price =
          item.minScore === item.maxScore
            ? item.minScore
            : item.minScore + ' - ' + item.maxScore
        item.status = item.status ? '上架' : '下架'
        return item
      })
      const exportJsonToExcel = excel.export_json_to_excel
      const tableHead = [
        'ID',
        '名称',
        '单位',
        '价格',
        '原价',
        '排列序号',
        '状态',
      ]
      const filterVal = [
        'id',
        'name',
        'unit',
        'price',
        'oldPrice',
        'sort',
        'status',
      ]
      const tableBody = data.list.map((v: any) => filterVal.map((j) => v[j]))
      state.exportLoading = false
      exportJsonToExcel({
        header: tableHead,
        data: tableBody,
        filename: '商品列表',
        autoWidth: true,
      })
    })
  })
}

//删除
const delProduct = (row: any) => {
  ElMessageBox.confirm(
    `此操作将永久删除商品名称：“${row.name}”，是否继续?`,
    '提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      delScore({
        id: [row.id],
      }).then(() => {
        getListData()
        ElMessage.success('删除成功')
      })
    })
    .catch(() => { })
}
// 上下架
const onSetStatus = (row: any) => {
  setStatus({
    id: row.id,
    status: row.status === 1 ? -1 : 1,
  }).then(() => {
    getListData()
  })
}

// 批量上下架
const batchStatus = (status: number) => {
  batchSetStatus({
    list: state.selectedList.map((item: any) => item.id),
    status: status,
  }).then(() => {
    getListData()
    ElMessage.success(status === 1 ? '上架成功' : '下架成功')
  })
}

// 批量绑定商品到店铺
// const batchClone = () => {
//   batchCloneProduct({
//     list: state.selectedList.map((item: any) => item.id),
//   }).then(() => {
//     ElMessage.success('绑定成功')
//   })
// }

// 页面加载时
onMounted(() => {
  getListData()
  getCategoryListData()
})

// 暴露变量
defineExpose({
  getListData,
})
</script>
<style scoped ></style>
