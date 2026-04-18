<template>
  <el-tabs>
    <el-tab-pane label="提现">
      <Withdraw />
    </el-tab-pane>
    <el-tab-pane label="提现记录">
      <Log />
    </el-tab-pane>
  </el-tabs>
</template>

<script setup lang="ts">
import { toRefs, reactive, defineAsyncComponent } from 'vue'

const Withdraw = defineAsyncComponent(() => import('./withdraw.vue'))
const Log = defineAsyncComponent(() => import('./log.vue'))

// 定义变量
const state = reactive({
  list: [],
  loading: false,
})

const { list, loading } = toRefs(state)


</script>

<style scoped lang="scss"></style>
