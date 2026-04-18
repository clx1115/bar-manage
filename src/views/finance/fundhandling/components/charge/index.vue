<template>
  <el-tabs>
    <el-tab-pane label="充值">
      <Charge />
    </el-tab-pane>
    <el-tab-pane label="充值记录">
      <Log />
    </el-tab-pane>
  </el-tabs>
</template>

<script setup lang="ts">
import { toRefs, reactive, defineAsyncComponent } from 'vue'

const Charge = defineAsyncComponent(() => import('./charge.vue'))
const Log = defineAsyncComponent(() => import('./log.vue'))

// 定义变量
const state = reactive({
  list: [],
  loading: false,
})

const { list, loading } = toRefs(state)


</script>

<style scoped lang="scss"></style>
