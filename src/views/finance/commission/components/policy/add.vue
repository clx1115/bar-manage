<template>
  <component :is="componentList['./type' + type + '.vue']"></component>
</template>

<script setup lang="ts">
import { reactive, toRefs, onMounted, defineAsyncComponent, markRaw } from 'vue'
import { useRoute } from 'vue-router'

// 批量导入 type*.vue 组件
const componentList: Record<string, any> = reactive({});
const components = import.meta.glob('./type*.vue');
Object.entries(components).forEach(async ([key, val]) => {
  componentList[key] = markRaw(defineAsyncComponent(() => val() as Promise<{ default: any }>));
});

// 定义变量内容
const state = reactive({
  type: 1,
})

const { type } =
  toRefs(state)

const route = useRoute()

onMounted(() => {
  state.type = Number(route.query.type);
});

</script>

<style lang="scss" scoped></style>