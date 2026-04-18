<template>
  <div class="page-container layout-padding">
    <el-card shadow="hover" class="layout-padding-auto">
      <tagDetail :isEidt="true" />
    </el-card>
  </div>
</template>

<script setup lang="ts" name="tagEdit">
import tagDetail from './component/tagDetail.vue'
</script>