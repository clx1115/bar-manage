<template>
  <div class="page-container layout-padding">
    <el-card shadow="hover" class="layout-padding-auto">
      <tagGroupDetail :isEidt="true" />
    </el-card>
  </div>
</template>

<script setup lang="ts" name="tagGroupEdit">
import tagGroupDetail from './component/tagGroupDetail.vue'
</script>