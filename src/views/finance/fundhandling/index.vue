<template>
  <div class="page-container layout-padding">
    <div class="card">
      <el-tabs>
        <el-tab-pane label="充值">
          <Charge />
        </el-tab-pane>
        <el-tab-pane label="提现">
          <Withdraw />
        </el-tab-pane>
        <el-tab-pane label="资金归集">
          <Concentration />
        </el-tab-pane>
        <el-tab-pane label="收益发放">
          <Distribution />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toRefs, reactive, defineAsyncComponent } from 'vue'

const Charge = defineAsyncComponent(() => import('./components/charge/index.vue'))
const Withdraw = defineAsyncComponent(() => import('./components/withdraw/index.vue'))
const Concentration = defineAsyncComponent(() => import('./components/concentration/index.vue'))
const Distribution = defineAsyncComponent(() => import('./components/distribution/index.vue'))

// 定义变量
const state = reactive({

})

</script>

<style scoped lang="scss">
.card {
  background-color: white;
  padding: 16px 20px;

}

.flex {
  display: flex;
}
</style>
