<template>
  <div class="dialog-container">
    <el-dialog title="客户订单列表" v-model="isShowDialog" width="900px" :close-on-click-modal="false" :destroy-on-close="true">
      <el-table :data="list" v-loading="loading" style="width: 100%">
        <el-table-column type="expand" width="30">
          <template #default="{ row }">
            <el-table :data="row.detailList">
              <el-table-column align="center" label="商品ID">
                <template #default="scope2">
                  {{ scope2.row.productId }}
                </template>
              </el-table-column>
              <el-table-column align="center" label="商品名称">
                <template #default="scope2">
                  {{ scope2.row.productName }}
                </template>
              </el-table-column>
              <el-table-column align="center" label="商品单价">
                <template #default="scope2">
                  {{ parseMoney(scope2.row.productPrice) }}
                </template>
              </el-table-column>
              <el-table-column align="center" label="商品数量">
                <template #default="scope2">
                  {{ scope2.row.number }}
                </template>
              </el-table-column>
              <el-table-column align="center" label="商品总价">
                <template #default="scope2">
                  {{ parseMoney(scope2.row.subTotal) }}
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column prop="orderNo" label="订单编号" min-width="180" show-overflow-tooltip></el-table-column>
        <el-table-column label="用户信息" show-overflow-tooltip width="180">
          <template #default="{ row }">
            <span v-if="row.uid">{{ row.userName }}(UID:{{ row.uid }})</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column prop="productCount" label="商品数量" width="100"></el-table-column>
        <el-table-column label="订单金额" width="100">
          <template #default="{ row }">
            {{ parseMoney(row.realPay) }}
          </template>
        </el-table-column>
        <el-table-column label="订单状态" width="100">
          <template #default="{ row }">
            {{ formatOrderStatus(row.status) }}
          </template>
        </el-table-column>
        <el-table-column label="下单时间" width="200">
          <template #default="{ row }">
            {{ formatDate(row.createTime, 'YYYY-mm-dd HH:MM:SS') }}
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <div class="select-footer">
          <el-pagination v-model:currentPage="currentPage" background layout="prev, pager, next, jumper" :page-count="totalPage" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, toRefs } from 'vue'
import { formatDate } from '@/utils/formatTime'
import { formatOrderStatus, parseMoney } from '@/utils/filters'
import { getDealerCustomersOrder } from '@/api/member/index'

// 定义变量内容
const state = reactive({
  list: [],
  loading: false,
  currentPage: 1,
  totalPage: 1,
  queryData: {
    uid: 0,
  },
  submitData: {},
  isShowDialog: false,
  totalMembers: 0,
})

const { list, loading, currentPage, totalPage, isShowDialog, totalMembers } =
  toRefs(state)

// 打开弹窗
const openDialog = (row: any) => {
  state.queryData.uid = row.id
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
  getDealerCustomersOrder({
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