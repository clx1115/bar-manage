<template>
  <div class="page-container layout-padding">
    <el-card shadow="hover" class="layout-padding-auto">
      <operationDetail :isEidt="true" />
    </el-card>
  </div>
</template>

<script setup lang="ts" name="memberCrowdOperationEdit">
import operationDetail from './component/operationDetail.vue'
</script>