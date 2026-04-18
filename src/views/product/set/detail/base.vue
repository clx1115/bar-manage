<template>
  <h1>基本信息</h1>
  <el-form :mode="form" label-width="120px" style="max-width: 500px;">
    <el-form-item label="套餐商品名称：" prop="name">
      <el-input v-model="form.name" placeholder="例如：鲜榨果汁 500ml" />
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { reactive, toRefs } from 'vue'

const state = reactive({
  form: {} as any,
})

const { form } = toRefs(state)

</script>

<style scoped lang="scss"></style>