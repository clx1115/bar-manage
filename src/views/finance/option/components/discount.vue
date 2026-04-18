<template>
  <div class="tip">
    <div class="icon">
      <el-icon color="#1a59cc" style="margin-right: 6px; margin-top: 2px">
        <info-filled />
      </el-icon>
    </div>
    <div class="content">
      <div>1、设置-资产设置-支付方式页面修改支付方式名称后，支付优惠设置需要重新设置。</div>
      <div>2、计入优惠的支付方式不支持含打包费和运费的订单。</div>
      <div>3、礼品卡、提货卡售卖、储值充值订单使用标记支付方式.计收入规则全部为计入收入。</div>
    </div>
  </div>
  <el-table :data="list" v-loading="loading" style="width: 100%" :header-cell-style="{ background: '#f5f7fa' }">
    <el-table-column prop="payType" label="支付方式" min-width="150" />
    <el-table-column prop="type" label="类型" min-width="150" />
    <el-table-column prop="origin" label="来源" min-width="150" />
    <el-table-column prop="rule" label="计收入规则" min-width="150" />
    <el-table-column prop="date" label="修改时间" min-width="150" />
    <el-table-column prop="edit" label="修改人" min-width="150" />
    <el-table-column label="操作" min-width="100" />
  </el-table>
  <div class="page-bottom">
    <el-pagination v-model:currentPage="currentPage" background layout="prev, pager, next, jumper" :page-count="totalPage" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
  </div>
</template>

<script setup lang="ts">
import { reactive, toRefs, onMounted } from 'vue'
import { InfoFilled } from '@element-plus/icons-vue'

// 定义变量
const state = reactive({
  list: [] as any,
  loading: false,
  currentPage: 1,
  totalPage: 1,
})

const { list, loading, currentPage, totalPage } = toRefs(state)

// 获取列表
const getListData = () => {
  // state.loading = true
  // if (JSON.stringify(state.queryData) !== JSON.stringify(state.submitData)) {
  //   state.currentPage = 1
  // }
  // const formData = JSON.parse(JSON.stringify(state.queryData))
  // getBalanceLog({
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

onMounted(() => {
  state.list = [
    {
      payType: '微信支付',
      type: '微信支付',
      origin: '系统默认',
      rule: '计入收入',
      date: '',
      edit: '-',
    },
    {
      payType: '银行卡支付',
      type: '银行卡支付',
      origin: '系统默认',
      rule: '计入收入',
      date: '',
      edit: '-',
    }
  ]
})

</script>

<style scoped lang="scss">
.tip {
  border: 1px solid #abb8ce;
  background-color: #eef4fc;
  margin-bottom: 16px;
  display: flex;
  padding: 10px;
}

.page-bottom {
  margin-top: 20px;
}
</style>