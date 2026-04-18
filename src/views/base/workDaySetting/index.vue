<template>
  <div class="page-container layout-padding">
    <el-card shadow="hover" class="layout-padding-auto">
      <el-form class="query" :inline="true" size="default" label-width="90px">
        <el-row>
          <el-form-item>
            <el-button size="default" :loading="exportLoading" type="success" @click="onOpenAdd('add')">
              <el-icon>
                <ele-Plus />
              </el-icon>
              新增考勤天数
            </el-button>
          </el-form-item>
        </el-row>
      </el-form>
      <el-table :data="list" v-loading="loading" style="width: 100%">
        <el-table-column label="月份" width="120">
          <template #default="{ row }">
            {{ row.month }}
          </template>
        </el-table-column>
        <el-table-column prop="workDay" label="考勤天数" min-width="150" show-overflow-tooltip />
        <el-table-column label="操作" width="250">
          <template #default="{ row }">
            <el-button size="small" text type="primary" @click="onOpenEdit('edit', row)">编辑</el-button>
            <el-button size="small" text type="primary" @click="onRowDel(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="page-bottom">
        <el-pagination v-model:currentPage="currentPage" background layout="prev, pager, next, jumper" :page-count="totalPage" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      </div>
    </el-card>
    <detailDialog ref="detailDialogRef" @refresh="getListData" />
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, reactive, onMounted, toRefs, ref, watch } from 'vue'
import { parseMoney } from '@/utils/filters'
import { formatDate } from '@/utils/formatTime'
import { getWorkDaySettingList, delWorkDaySetting } from '@/api/base/workDaySetting/index'
import { ElMessageBox, ElMessage } from 'element-plus'

// 引入组件
const detailDialog = defineAsyncComponent(
  () => import('./component/detail.vue')
)



// 定义变量
const detailDialogRef = ref()
const timeRange = ref('')
const state = reactive({
  list: [],
  loading: false,
  currentPage: 1,
  totalPage: 1,
})

const {
  list,
  loading,
  currentPage,
  totalPage,
} = toRefs(state)

// 获取列表
const getListData = () => {
  state.loading = true
  getWorkDaySettingList({
    page: state.currentPage,
  }).then((data: any) => {
    state.loading = false
    state.list = data.list
  })
}

const handleSizeChange = () => {
  getListData()
}

const handleCurrentChange = () => {
  getListData()
}


// 打开新增弹窗
const onOpenAdd = (type: string) => {
  detailDialogRef.value.openDialog(type)
}

// 打开修改弹窗
const onOpenEdit = (type: string, row: any) => {
  detailDialogRef.value.openDialog(type, row)
}


// 删除
const onRowDel = (row: any) => {
  ElMessageBox.confirm(
    `此操作将永久删除该记录，是否继续?`,
    '提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      delWorkDaySetting({
        id: row.id,
      }).then(() => {
        getListData()
        ElMessage.success('删除成功')
      })
    })
    .catch(() => { })
}


// 页面加载时
onMounted(() => {
  getListData()
})
</script>

<style scoped lang="scss"></style>
