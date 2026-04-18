<template>
  <div class="card">
    <div class="left">
      <div class="top">
        <span>可用店铺余额(元)</span>&nbsp;
        <el-tooltip effect="light" placement="right">
          <template #content>Right Center prompts info</template>
          <SvgIcon name="svg-question" />
        </el-tooltip>&nbsp;
        <div class="navi">
          <span class="navi-item">充值记录</span>&nbsp;
          <span>|</span>&nbsp;
          <span class="navi-item">提现记录</span>
        </div>
      </div>
      <div class="content">
        <div class="money">
          0.00
        </div>
        <el-button color="#e8e9eb">收益发放</el-button>
      </div>
    </div>
    <div class="right">
      <div class="top">
        <span>不可用余额(元)</span>&nbsp;
        <el-tooltip effect="light" placement="right">
          <template #content>Right Center prompts info</template>
          <SvgIcon name="svg-question" />
        </el-tooltip>&nbsp;
        <div class="navi">
          <span class="navi-item">明细</span>&nbsp;
        </div>
      </div>
      <div class="content">
        <div class="money">
          0.00
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toRefs, reactive } from 'vue'

// 定义变量
const state = reactive({
  list: [],
  loading: false,
  show: true,
})

const { list, loading, show } = toRefs(state)


</script>

<style scoped lang="scss">
.card {
  background-color: #f7f8fa;
  display: flex;
  justify-content: space-between;
  padding: 20px;
  margin-bottom: 16px;

  .top {
    display: flex;
    align-items: center;
    margin-bottom: 20px;

    .navi {
      color: gray;
      font-size: 12px;

      .navi-item {
        color: var(--el-color-primary);
        cursor: pointer;
      }
    }
  }

  .content {
    display: flex;
    align-items: center;

    .money {
      font-size: 20px;
      font-weight: bold;
      margin-right: 30px;
    }
  }
}
</style>
