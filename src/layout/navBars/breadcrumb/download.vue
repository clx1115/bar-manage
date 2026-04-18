<template>
  <div class="dialog-container">
    <el-dialog title="下载打印控件" v-model="state.isShow" width="500px" :close-on-click-modal="false" :destroy-on-close="true">
      <div class="printer-list">
        <a href="https://ca.xcx100.info/printWin32.exe" class="printer-item" target="_blank">
          <el-icon title="win 32" size="40">
            <ele-Printer />
          </el-icon>
          <div class="name">32位</div>
        </a>
        <a href="https://ca.xcx100.info/printWin64.exe" class="printer-item" target="_blank">
          <el-icon title="win 32" size="40">
            <ele-Printer />
          </el-icon>
          <div class="name">64位</div>
        </a>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="close" size="default">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

// 定义变量内容
const state = reactive({
  isShow: false,
})

// 搜索弹窗打开
const open = () => {
  state.isShow = true
}
// 搜索弹窗关闭
const close = () => {
  state.isShow = false
}

// 暴露变量
defineExpose({
  open,
})
</script>

<style scoped lang="scss">
.layout-search-dialog {
  position: relative;

  :deep(.el-dialog) {

    .el-dialog__header,
    .el-dialog__body {
      display: none;
    }

    .el-dialog__footer {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      top: -53vh;
    }
  }

  :deep(.el-autocomplete) {
    width: 560px;
    position: absolute;
    top: 150px;
    left: 50%;
    transform: translateX(-50%);
  }
}

.printer-list {
  display: flex;

  .printer-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;

    .name {
      margin-top: 10px;
    }
  }
}
</style>
