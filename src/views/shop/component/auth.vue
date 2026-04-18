<template>
  <div class="dialog-container">
    <el-dialog title="打印授权码" v-model="isShowDialog" width="500px" :close-on-click-modal="false" :destroy-on-close="true">
      <div class="auth">
        <div class="url mb20">
          {{ authSec || '暂无授权码' }}
        </div>
        <div class="btn">
          <el-button @click="onGenerateAuth()" type="success" size="large">生成授权码</el-button>
          <el-button @click="copyText(authSec)" type="primary" size="large">复制授权码</el-button>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closeDialog" size="default">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, toRefs } from 'vue'
import commonFunction from '@/utils/commonFunction';
import { getShopDetail, generateAuth } from '@/api/shop/index'
import { ElMessageBox, ElMessage } from 'element-plus'

// 定义子组件向父组件传值/事件
const emit = defineEmits(['select'])

// 定义变量内容
const { copyText } = commonFunction();
const state = reactive({
  shopId: 0,
  authSec: '',
  isShowDialog: false,
})

const {
  authSec,
  isShowDialog,
} = toRefs(state)

// 打开弹窗
const openDialog = (row: any) => {
  state.shopId = row.id
  getShopDetailData()
  state.isShowDialog = true
}
// 关闭弹窗
const closeDialog = () => {
  state.isShowDialog = false
}


const getShopDetailData = () => {
  getShopDetail({
    id: state.shopId,
  }).then((res) => {
    state.authSec = res.authSec
  })
}

//生成授权码
const onGenerateAuth = () => {
  ElMessageBox.confirm(
    `此操作将重新生成授权码，原授权码将失效，是否继续?`,
    '提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      generateAuth({
        shopId: state.shopId,
      }).then(() => {
        getShopDetailData()
        ElMessage.success('生成成功')
      })
    })
}


// 暴露变量
defineExpose({
  openDialog,
})
</script>
<style lang="scss" scoped>
.auth {
  .url {
    padding: 20px;
    background: #e5f5ff;
    border: 1px solid #409eff;
    border-radius: 5px;
  }

  .btn {
    text-align: center;
  }
}
</style>