<template>
  <div class="custom-body">
    <div class="plan-add">
      <div class="plan-add-item" v-for="(item, index) in addPlanList" :key="index">
        <div class="add-title">
          {{ item.title }}
        </div>
        <div class="info">{{ item.info }}</div>
        <router-link :to="`/member/crowdOperation/sceneAdd?type=${item.title}`">
          <el-button size="default" type="primary" :disabled="item.disable || false">立即新建</el-button>
        </router-link>
      </div>
    </div>
    <el-form class="query" :inline="true">
      <el-form-item>
        <el-input v-model="queryData.name" size="default" placeholder="请输入活动名称" clearable> </el-input>
      </el-form-item>
      <el-form-item>
        <el-button size="default" type="primary" @click="getListData">
          <el-icon>
            <ele-Search />
          </el-icon>
          查询
        </el-button>
      </el-form-item>
    </el-form>
    <el-table :data="list" v-loading="loading" style="width: 100%" header-cell-class-name="header-name">
      <el-table-column prop="name" label="活动名称" show-overflow-tooltip min-width="150"></el-table-column>
      <el-table-column prop="type" label="活动类型" show-overflow-tooltip min-width="200"></el-table-column>
      <el-table-column prop="time" label="活动时间" min-width="150" show-overflow-tooltip></el-table-column>
      <el-table-column prop="range" label="会员范围" min-width="150" show-overflow-tooltip></el-table-column>
      <el-table-column prop="status" label="状态" min-width="150" show-overflow-tooltip></el-table-column>
      <el-table-column fixed="right" align="right" label="操作" min-width="200">
        <template #default="{ row }">
          <el-form>
            <router-link :to="`/member/crowdOperation/sceneEdit?id=${row.id}&type=${row.type}`" class="mr10">
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
  markMethod: '',
}
const state = reactive({
  list: [],
  loading: false,
  currentPage: 1,
  totalPage: 1,
  queryData: Object.assign({}, defaultQuery),
  submitData: {},
  addPlanList: [{
    title: '会员日营销',
    info: '特定时间会员专属优惠，提高店铺销量和复购'
  }, {
    title: '生日营销',
    info: '会员生日月特别活动，提高客户粘性'
  }, {
    title: '节日营销',
    info: '烘托节日氛围，会员专享权益，提升店铺营销额'
  }, {
    title: '付费会员特价体验',
    info: '让用户低价体验付费会员权益，吸引续费转化',
    disable: true
  }] as any,
})

const { loading, queryData, list, currentPage, totalPage, addPlanList } = toRefs(state)

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
  overflow-y: auto;
  overflow-x: hidden;
  height: 100%;

  .plan-add {
    display: flex;
    flex-wrap: nowrap;
    margin: 0 -5px;
    overflow-x: hidden;

    .plan-add-item {
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
      align-items: flex-start;
      width: calc((100% - 40px) / 4);
      margin: 0 5px 10px;
      padding: 15px;
      background-color: #ecf4fe;

      .add-title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        font-size: 16px;
        color: #343434;
      }

      .info {
        margin: 18px 0;
        font-size: 13px;
        color: #999;
      }
    }
  }
}

:deep(.header-name) {
  background-color: #f7f7f7 !important;
}
</style>