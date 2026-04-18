<template>
  <div class="page-container layout-padding">
    <el-card shadow="never" class="layout-padding-auto">
      <el-tabs v-model="activeName" class="demo-tabs" @tab-change="handleTabs">
        <el-tab-pane label="标签组" name="first">
          <tagGroupList ref="tagGroupListRef" />
        </el-tab-pane>
        <el-tab-pane label="未分组标签" name="second">
          <tagList ref="tagListRef" />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script lang="ts">
export default {
  name: 'memberTagIndex',
  beforeRouteEnter(to, from, next) {
    next((vm: any) => {
      if (from.name === 'memberTagGroupAdd' || from.name === 'memberTagGroupEdit') {
        vm.handleTabs('first')
      }
      if (from.name === 'memberTagAdd' || from.name === 'memberTagEdit') {
        vm.handleTabs('second')
      }
    })
  },
}
</script>
<script setup lang="ts">
import { defineAsyncComponent, reactive, onMounted, ref, toRefs } from 'vue'
import { formatDate } from '@/utils/formatTime'
// import { getMemberList } from '@/api/member/index'
import { parseMoney } from '@/utils/filters'

// 引入组件
const tagGroupList = defineAsyncComponent(
  () => import('./component/tagGroupList.vue')
)
const tagList = defineAsyncComponent(
  () => import('./component/tagList.vue')
)

const tagGroupListRef = ref()
const tagListRef = ref()

// 定义变量
const state = reactive({
  loading: false,
  activeName: 'first',
})

const { loading, activeName } = toRefs(state)

// 切换tab
const handleTabs = (name: any) => {
  if (name == 'first') {
    tagGroupListRef.value.getListData()
  } else {
    tagListRef.value.getListData()
  }
}

// 页面加载时
onMounted(() => {
  // getListData()
})

// 暴露变量
defineExpose({
  handleTabs
})
</script>

<style scoped lang="scss">
.title {
  margin: 10px 0;
  font-size: 16px;
  color: #343434;
}

:deep(.header-name) {
  background-color: #f7f7f7 !important;
}

.demo-tabs {
  height: 100%;

  :deep(.el-tabs__content) {
    height: calc(100% - 55px);
    overflow: auto;

    .el-tab-pane {
      height: 100%;
    }
  }
}
</style>