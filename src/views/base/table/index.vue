<template>
  <div class="page-container layout-padding">
    <el-card shadow="hover" class="layout-padding-auto">
      <div class="page-intro">
        <div>
          <div class="page-intro__title">桌位管理</div>
          <div class="page-intro__desc">统一维护门店桌位、区域、关联游戏和状态信息，支持批量清理无效桌位。</div>
        </div>
      </div>
      <el-form class="query" :inline="true" size="default">
        <el-row>
          <el-form-item>
            <el-button size="default" type="primary" @click="getListData">
              <el-icon>
                <ele-Search />
              </el-icon>
              刷新列表
            </el-button>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item>
            <el-button size="default" type="success" class="ml10" @click="onOpenAdd('add')">
              <el-icon>
                <ele-Plus />
              </el-icon>
              新增桌位
            </el-button>
          </el-form-item>
          <el-form-item>
            <el-button size="default" type="danger" plain :disabled="multipleSelection.length === 0" @click="onBatchDel">
              批量删除
            </el-button>
          </el-form-item>
        </el-row>
      </el-form>

      <el-table :data="list" v-loading="loading" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="ID" width="90" />
        <el-table-column prop="tableNum" label="桌号" min-width="120" show-overflow-tooltip />
        <el-table-column prop="name" label="区域名称" min-width="140" show-overflow-tooltip />
        <el-table-column prop="gameId" label="游戏ID" min-width="100" />
        <el-table-column prop="gameName" label="游戏名称" min-width="140" show-overflow-tooltip />
        <el-table-column prop="orderIds" label="订单ID" min-width="160" show-overflow-tooltip />
        <el-table-column prop="xPos" label="X坐标" min-width="100" />
        <el-table-column prop="yPos" label="Y坐标" min-width="100" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 20 ? 'warning' : 'success'">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" min-width="180">
          <template #default="{ row }">
            {{ formatTime(row.createdTime) }}
          </template>
        </el-table-column>
        <el-table-column label="更新时间" min-width="180">
          <template #default="{ row }">
            {{ formatTime(row.updateTime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button size="small" text type="primary" @click="onOpenAdd('edit', row)">编辑</el-button>
            <el-button size="small" text type="danger" @click="onRowDel(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="page-bottom">
        <el-pagination
          v-model:currentPage="currentPage"
          v-model:page-size="pageSize"
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          :page-sizes="[10, 20, 50, 100]"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <detailDialog ref="detailDialogRef" @refresh="getListData" />
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, onMounted, reactive, ref, toRefs } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import dayjs from 'dayjs'
import { deleteAreaTable, getAreaTableList } from '@/api/base/table/index'

const detailDialog = defineAsyncComponent(() => import('./component/detail.vue'))

const detailDialogRef = ref()
const state = reactive({
  list: [] as any[],
  loading: false,
  currentPage: 1,
  pageSize: 10,
  total: 0,
  multipleSelection: [] as any[],
})

const { list, loading, currentPage, pageSize, total, multipleSelection } = toRefs(state)

const getListData = () => {
  state.loading = true
  getAreaTableList({
    page: state.currentPage,
    size: state.pageSize,
  })
    .then((data: any) => {
      state.list = data.list || []
      state.total = (data.pages || 0) * state.pageSize
    })
    .finally(() => {
      state.loading = false
    })
}

const onOpenAdd = (type: string, row?: any) => {
  detailDialogRef.value.openDialog(type, row)
}

const handleSizeChange = () => {
  state.currentPage = 1
  getListData()
}

const handleCurrentChange = () => {
  getListData()
}

const handleSelectionChange = (rows: any[]) => {
  state.multipleSelection = rows
}

const getStatusText = (status: number) => {
  if (status === 20) return '有人'
  if (status === 10) return '空闲'
  return '-'
}

const formatTime = (time?: number) => {
  return time ? dayjs(time).format('YYYY-MM-DD HH:mm:ss') : '-'
}

const doDelete = (ids: number[]) => {
  deleteAreaTable({ ids }).then(() => {
    if (state.list.length === ids.length && state.currentPage > 1) {
      state.currentPage -= 1
    }
    getListData()
    ElMessage.success('删除成功')
  })
}

const onRowDel = (row: any) => {
  ElMessageBox.confirm(`确认删除桌位「${row.tableNum}」吗？`, '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      doDelete([row.id])
    })
    .catch(() => {})
}

const onBatchDel = () => {
  const ids = state.multipleSelection.map((item: any) => item.id)
  ElMessageBox.confirm(`确认删除选中的 ${ids.length} 个桌位吗？`, '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      doDelete(ids)
    })
    .catch(() => {})
}

onMounted(() => {
  getListData()
})
</script>

<style scoped lang="scss">
.page-intro {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 18px;
  margin-bottom: 18px;
  border: 1px solid #e7eef7;
  border-radius: 16px;
  background: linear-gradient(135deg, #f8fbff 0%, #f4fbf5 100%);
}

.page-intro__title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2d3d;
}

.page-intro__desc {
  margin-top: 4px;
  font-size: 13px;
  line-height: 1.6;
  color: #667085;
}

.query {
  padding-top: 4px;
}

.query :deep(.el-form-item) {
  margin-right: 12px;
  margin-bottom: 12px;
}

.page-bottom {
  display: flex;
  justify-content: flex-end;
  margin-top: 18px;
}

:deep(.el-card__body) {
  padding: 24px 24px 18px;
}

:deep(.el-table) {
  overflow: hidden;
  border: 1px solid #edf2f7;
  border-radius: 14px;
}

:deep(.el-table th.el-table__cell) {
  background: #f8fafc;
  color: #475467;
}

:deep(.el-table .el-table__cell) {
  padding: 13px 0;
}
</style>
