<template>
  <div class="card">
    <h1>新建挂账结算单</h1>
    <div class="search">
      <el-form :inline="true" :model="searchForm" label-width="auto">
        <el-form-item label="发生日期：" prop="date">
          <el-date-picker v-model="searchForm.date" type="daterange" :shortcuts="shortcuts" range-separator="-" />
        </el-form-item>
        <el-form-item label="销售门店：" prop="shop" style="width: 280px">
          <el-select v-model="searchForm.shop" placeholder="请选择">
            <el-option label="xxx" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="客户手机号：" prop="phone" style="width: 280px">
          <el-input v-model="searchForm.phone" placeholder="请输入客户手机号" />
        </el-form-item>
        <el-form-item label="客户名称：" prop="name" style="width: 280px">
          <el-select v-model="searchForm.name" placeholder="请选择">
            <el-option label="xxx" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="单据编号：" prop="code" style="width: 280px">
          <el-input v-model="searchForm.code" placeholder="请输入单据编号" />
        </el-form-item>
        <div style="margin-left: 70px">
          <el-button type="primary">筛选</el-button>
          <el-button>重置</el-button>
        </div>
      </el-form>
    </div>

    <h2>订单明细</h2>
    <div class="line"></div>
    <div>
      应收金额合计<span> 0 </span>元
    </div>
    <el-table :data="list2" style="width: 100%; margin-top: 10px" :header-cell-style="{ background: '#f5f7fa' }" @selection-change="selectionList = $event">
      <el-table-column type="selection" width="55" />
      <el-table-column prop="uid" label="单据编号" min-width="150" />
      <el-table-column prop="uid" label="交易类型" min-width="150" />
      <el-table-column prop="memberNo" label="成交金额(元)" min-width="150" />
      <el-table-column prop="memberNo" label="挂账金额(元)" min-width="150" />
      <el-table-column prop="memberName" label="销售门店" min-width="150" />
      <el-table-column prop="memberName" label="导购员" min-width="150" />
      <el-table-column prop="memberName" label="发生日期" min-width="150" />
    </el-table>
    <div class="pagination">
      <el-pagination v-model:currentPage="currentPage" background layout="prev, pager, next, jumper" :page-count="totalPage" @size-change="getListData" @current-change="getListData" />
    </div>
  </div>
  <div class="bottom">
    <el-button :disabled="!selectionList.length" type="primary" style="margin-left: 20px">生成结算单</el-button>
  </div>
</template>

<script setup lang="ts">
import { reactive, toRefs } from 'vue'

const state = reactive({
  searchForm: {} as any,
  list1: [] as any,
  list2: [1] as any,
  currentPage: 1,
  totalPage: 1,
  selectionList: [] as any,
})

const { searchForm, list1, list2, currentPage, totalPage, selectionList } = toRefs(state)

const shortcuts = [
  {
    text: '近7天',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    },
  },
  {
    text: '近30天',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    },
  },
]

const getListData = () => {

}

</script>

<style scoped lang="scss">
.card {
  background-color: white;
  padding: 16px;
}

.flex {
  display: flex;
}

h1 {
  font-weight: normal;
  text-align: center;
  margin-bottom: 16px;
}

h2 {
  font-size: 15px;
}

.line {
  border-bottom: 1px solid #eee;
  margin: 6px 0 10px 0;
}

.search {
  background-color: #f8f8f8;
  padding: 16px 400px 16px 24px;
  margin-bottom: 14px;
}

.pagination {
  margin: 14px 0;
  display: flex;
  justify-content: flex-end;
}

.bottom {
  margin-top: 14px;
  display: flex;
  background-color: white;
  padding: 10px;
  justify-content: center;
  align-items: center;
}
</style>