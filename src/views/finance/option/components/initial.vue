<template>
  <el-tabs>
    <el-tab-pane label="销售往来">
      <el-form label-width="120px">
        <el-form-item label="初始化日期：" prop="date">
          <el-date-picker v-model="ruleForm.date" type="date" placeholder="请选择" />
        </el-form-item>
        <el-form-item label=" " class="tip">
          初始化完成后，针对商家下全量店铺的日期前发生的交易订单的往来明细将不会统计进往来报告汇总，且不支持后续对账结算操作。
        </el-form-item>
        <el-form-item label="备注：" prop="mark" style="max-width: 420px;">
          <el-input v-model="ruleForm.mark" type="textarea" placeholder="请输入" />
        </el-form-item>
      </el-form>

      <h2 ref="resizeRef">初始明细</h2>
      <div class="line"></div>
      <div class="btn-box">
        <div>
          <el-button @click="" :disabled="!ruleForm.date">添加明细</el-button>
          <el-button @click="" :disabled="!ruleForm.date">批量导入</el-button>
          <el-button @click="">导出</el-button>
          <el-link type="primary" :underline="false">查看导入记录</el-link>
          <el-link type="primary" :underline="false">查看导出报表</el-link>
        </div>
        <el-button @click="" :disabled="!ruleForm.date">清空明细</el-button>
      </div>
      <el-table :data="list" v-loading="loading" style="width: 100%" :header-cell-style="{ background: '#f5f7fa' }">
        <el-table-column prop="payType" label="往来主体" min-width="150" />
        <el-table-column prop="type" label="往来对象" min-width="150" />
        <el-table-column prop="origin" label="业务分类" min-width="150" />
        <el-table-column prop="rule" label="往来项目" min-width="150" />
        <el-table-column prop="date" label="收付类型" min-width="150" />
        <el-table-column prop="edit" label="初期余额(元)" min-width="150" />
        <el-table-column label="操作" min-width="100" />
      </el-table>
      <div class="pagination">
        <el-pagination v-model:currentPage="currentPage" background layout="prev, pager, next, jumper" :page-count="totalPage" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      </div>

      <div class="bottom" ref="bottomRef">
        <el-button type="primary" :disabled="!ruleForm.date">执行初始化</el-button>
      </div>
    </el-tab-pane>
  </el-tabs>
</template>

<script setup lang="ts">
import { reactive, toRefs, onMounted, ref, onBeforeUnmount } from 'vue'

// 定义变量
const state = reactive({
  list: [] as any,
  loading: false,
  currentPage: 1,
  totalPage: 1,
  ruleForm: {} as any
})

const { list, loading, currentPage, totalPage, ruleForm } = toRefs(state)

const resizeRef = ref()
const bottomRef = ref()

// 获取列表
const getListData = () => {

}

const handleSizeChange = () => {
  getListData()
}

const handleCurrentChange = () => {
  getListData()
}

let resizeObserver: any = null
const openMonitor = () => {
  //获取监听元素 id class ref
  const target = resizeRef.value
  // 创建 ResizeObserver 实例
  resizeObserver = new ResizeObserver(entries => {
    // entries 是一个 ResizeObserverEntry 对象数组，包含目标元素的信息
    entries.forEach(item => {
      const { width } = item.contentRect;
      //获取 监听元素的宽高
      console.log('Width', width)
      resizeBottom(width)
    })
  });

  // 开始监听目标元素的大小变化
  resizeObserver.observe(target);
}

const resizeBottom = (w: number) => {
  bottomRef.value.style.width = (w + 62) + 'px'
}

onMounted(() => {
  openMonitor()
})

onBeforeUnmount(() => {
  resizeObserver.disconnect();
})

</script>

<style scoped lang="scss">
h2 {
  font-size: 14px;
  margin-top: 16px;
}

.line {
  border-bottom: 1px solid #eee;
  margin: 6px 0 16px 0;
}

.tip {
  color: #989898;
  font-size: 13px;
  margin-top: -20px;
}

.btn-box {
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;

  .el-link {
    margin-left: 12px;
  }
}

.pagination {
  margin-top: 20px;
}

.bottom {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  z-index: 999;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 60px;
  background-color: white;
}
</style>