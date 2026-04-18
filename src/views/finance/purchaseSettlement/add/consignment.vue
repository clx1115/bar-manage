<template>
  <div class="card">
    <h1>新建代销结算单</h1>
    <div class="search">
      <el-form :inline="true" :model="searchForm" label-width="auto">
        <el-form-item label="供应商：" prop="vendor" style="width: 280px">
          <el-select v-model="searchForm.vendor" placeholder="请选择">
            <el-option label="xxx" value="1"></el-option>
          </el-select>
        </el-form-item>
        <div style="margin-left: 70px">
          <el-button type="primary">筛选</el-button>
          <el-button>重置</el-button>
        </div>
      </el-form>
    </div>

    <h2>销售明细</h2>
    <div class="line"></div>
    <el-table :data="list1" style="width: 100%; margin-top: 10px" :header-cell-style="{ background: '#f5f7fa' }">
      <el-table-column prop="uid" label="销售单元" min-width="150" />
      <el-table-column prop="uid" label="销售渠道" min-width="150" />
      <el-table-column prop="memberNo" label="销售金额(元)" min-width="150" />
      <el-table-column prop="memberNo" label="含税成本(元)" min-width="150" />
      <el-table-column prop="memberNo" label="不含税成本(元)" min-width="150" />
      <el-table-column prop="memberNo" label="进项税额(元)" min-width="150" />
      <el-table-column prop="memberNo" label="操作" min-width="80" />
    </el-table>
    <div class="pagination">
      <el-pagination v-model:currentPage="currentPage" background layout="prev, pager, next, jumper" :page-count="totalPage" @size-change="getListData" @current-change="getListData" />
    </div>

    <h2>费用单明细</h2>
    <div class="line"></div>
    <div>
      已选金额<span> 0 </span>元
    </div>
    <el-table :data="list2" style="width: 100%; margin-top: 10px" :header-cell-style="{ background: '#f5f7fa' }" @selection-change="selectionList = $event">
      <el-table-column type="selection" width="55" />
      <el-table-column prop="uid" label="费用单号" min-width="150" />
      <el-table-column prop="uid" label="费用项目" min-width="150" />
      <el-table-column prop="memberNo" label="收付类型" min-width="150" />
      <el-table-column prop="memberNo" label="制单日期" min-width="150" />
      <el-table-column prop="memberName" label="费用金额(元)" min-width="80" />
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