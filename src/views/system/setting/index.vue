<template>
  <div class="page-container layout-padding">
    <el-card shadow="hover" class="layout-padding-auto">
      <el-tabs v-model="activeName" class="demo-tabs">
        <el-tab-pane label="店铺信息配置" name="third">
          <shopInfo></shopInfo>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>
<script setup lang="ts">
import { ref, defineAsyncComponent, } from 'vue'

const activeName = ref('third')

//引入组件
const shopInfo = defineAsyncComponent(() => import('./component/shop.vue'))

</script>