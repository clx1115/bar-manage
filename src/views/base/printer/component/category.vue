<template>
  <div class="dialog-container">
    <el-dialog title="打印机绑定分类" v-model="isShowDialog" width="500px" :close-on-click-modal="false" :destroy-on-close="true">
      <el-scrollbar v-loading="listLoading" class="scrollbar">
        <el-tree :data="categoryList" :props="{ label: 'name' }" node-key="id" show-checkbox default-expand-all :default-checked-keys="selectedList" @check="onCheck" />
      </el-scrollbar>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="onCancel" size="default">取 消</el-button>
          <el-button type="primary" @click="onSubmit" size="default" :loading="loading">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, toRefs } from 'vue'
import { getCategroyList } from '@/api/product/category/index'
import {
  updatePrinter
} from '@/api/base/printer/index'

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh'])

// 定义变量内容
const state = reactive({
  listLoading: false,
  loading: false,
  printerId: 0,
  categoryList: [] as any,
  selectedList: [] as any,
  isShowDialog: false,
})

const { listLoading, loading, categoryList, selectedList, isShowDialog } =
  toRefs(state)

// 打开弹窗
const openDialog = (row: any) => {
  state.printerId = row.id
  state.selectedList = row.categoryList ? JSON.parse(row.categoryList) : []
  getCategroyListData()
  state.isShowDialog = true
}
// 关闭弹窗
const closeDialog = () => {
  state.isShowDialog = false
}
// 取消
const onCancel = () => {
  closeDialog()
}

// 获取列表
const getCategroyListData = () => {
  state.listLoading = true
  getCategroyList().then((data: any) => {
    state.listLoading = false
    state.categoryList = data.list
  })
}

// 更改选中的权限
const onCheck = (checkedNodes: any, checkedKeys: any) => {
  state.selectedList = checkedKeys.checkedKeys
}

// 提交
const onSubmit = () => {
  state.loading = true
  updatePrinter({
    id: state.printerId,
    categoryList: JSON.stringify(state.selectedList)
  })
    .then(() => {
      state.loading = false
      emit('refresh')
      closeDialog()
    })
    .catch(() => {
      state.loading = false
    })
}

// 暴露变量
defineExpose({
  openDialog,
})
</script>
