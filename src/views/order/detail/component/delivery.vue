<template>
  <div class="dialog-container">
    <el-dialog title="订单发货" v-model="isShowDialog" width="900px" :close-on-click-modal="false" :destroy-on-close="true">
      <el-table :data="list" style="width: 100%; ">
        <el-table-column prop="productId" label="商品ID" width="100" />
        <el-table-column prop="productName" label="商品名称" min-width="180" show-overflow-tooltip />
        <el-table-column prop="number" label="商品总数量" width="120"></el-table-column>
        <el-table-column prop="number" label="已发货数量" width="120"></el-table-column>
        <el-table-column label="发货数量" width="200">
          <template #default="{ row }">
            {{ row.shippedNumber }}
          </template>
        </el-table-column>
      </el-table>
      <el-form size="default" label-width="100px" class="mt20">
        <el-form-item label="物流公司">
          <el-input v-model="expressCompany" placeholder="物流公司" />
        </el-form-item>
        <el-form-item label="物流单号">
          <el-input v-model="expressNo" placeholder="物流单号，自营配送可为空" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="onCancel" size="default">取 消</el-button>
          <el-button type="primary" @click="onSubmit" size="default" :loading="loading">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, toRefs, ref } from 'vue'
import { ElForm, ElMessage } from 'element-plus'
import { orderDelievered } from '@/api/order/index'

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh'])

// 定义变量内容
const dialogFormRef = ref(ElForm)
const state = reactive({
  loading: false,
  orderId: 0,
  list: [] as any,
  expressCompany: '自营配送',
  expressNo: '',
  isShowDialog: false,
})

const { loading, list, expressCompany, expressNo, isShowDialog } = toRefs(state)

// 打开弹窗
const openDialog = (orderId: number, detailList: any) => {
  state.isShowDialog = true
  state.orderId = orderId
  state.list = detailList
}
// 关闭弹窗
const closeDialog = () => {
  state.isShowDialog = false
}
// 取消
const onCancel = () => {
  closeDialog()
}

// 提交
const onSubmit = () => {
  const list = [] as any
  state.list.forEach((item: any) => {
    if (item.shippedNumber > 0) {
      list.push({
        detailId: item.id,
        number: item.shippedNumber
      })
    }
  })
  if (!list.length) {
    ElMessage({
      message: '请选择要发货的商品.',
      type: 'warning',
    })
    return
  }
  orderDelievered({
    orderId: state.orderId,
    expressNo: state.expressNo,
    expressCompany: state.expressCompany,
    list: list,
  })
    .then(() => {
      ElMessage({
        message: '发货成功.',
        type: 'success',
      })
      state.loading = false
      closeDialog()
      emit('refresh')
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
