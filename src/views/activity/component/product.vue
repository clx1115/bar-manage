<template>
  <div class="dialog-container">
    <el-dialog :title="title" @close="close" v-model="isShowDialog" width="800px" :close-on-click-modal="false" :destroy-on-close="true">
      <el-table :data="productList" style="width: 100%" @selection-change="selectedList = $event">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="商品名称" min-width="150" show-overflow-tooltip />
        <el-table-column fixed="right" label="操作" width="150">
          <template #default="scope">
            <el-button size="small" text type="primary" @click="onMoveUp(scope.$index)">↑上移</el-button>
            <el-button size="small" text type="primary" @click="onMoveDown(scope.$index)">↓下移</el-button>
            <el-button size="small" text type="primary" @click="onDel(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <div class="select-footer">
          <div class="footer-btn" v-if="selectedList.length">
            <el-button type="primary" @click="onBatchDel">
              批量删除
            </el-button>
          </div>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, toRefs } from 'vue'
import { getClassifysDetail, updateClassifys } from '@/api/base/classifys/index'
import { defineEmits } from 'vue'


// 定义变量内容
const state = reactive({
  id: 0,
  title: '',
  productList: [] as any,
  isShowDialog: false,
  selectedList: [] as any,
})

// 使用defineEmits创建名称，接受一个数组
const emit = defineEmits(['getListData'])

const { productList, title, isShowDialog, selectedList } = toRefs(state)

// 打开弹窗
const openDialog = (row: any) => {
  state.id = row.id
  state.title = row.classifyCode + ' 商品管理'
  getClassifysDetail({
    id: row.id,
  }).then((res) => {
    state.productList = res.productIdList ? JSON.parse(res.productIdList) : []
  })
  state.isShowDialog = true
}

const close = () => {
  emit('getListData')
}
// 选中单条
const onDel = (index: number) => {
  state.productList.splice(index, 1)
  updateList()
}


//批量选中删除
const onBatchDel = () => {
  for (let i = 0;i < state.selectedList.length;i++) {
    state.productList.splice(
      state.productList.findIndex(
        (item: any) => item.productId === state.selectedList[i].productId
      ),
      1
    )
  }
  updateList()
}

//上移
const onMoveUp = (index: number) => {
  const upDate = state.productList[index - 1]
  state.productList.splice(index - 1, 1)
  state.productList.splice(index, 0, upDate)
  updateList()
}

//上移
const onMoveDown = (index: number) => {
  const downDate = state.productList[index + 1]
  state.productList.splice(index + 1, 1)
  state.productList.splice(index, 0, downDate)
  updateList()
}

const updateList = () => {
  updateClassifys({
    id: state.id,
    productIdList: JSON.stringify(state.productList),
  })
    .then(() => { })
    .catch(() => { })
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