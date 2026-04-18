<template>
  <div class="page-container layout-padding">
    <el-card shadow="hover" class="layout-padding-auto">
      <sceneDetail :isEidt="true" />
    </el-card>
  </div>
</template>

<script setup lang="ts" name="memberCrowdOperationSceneEdit">
import sceneDetail from './component/sceneDetail.vue'
</script>