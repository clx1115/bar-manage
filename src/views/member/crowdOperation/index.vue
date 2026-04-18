<template>
  <div class="page-container layout-padding">
    <el-card shadow="never" class="layout-padding-auto">
      <el-tabs v-model="activeName" class="demo-tabs" @tab-change="handleTabs">
        <el-tab-pane label="人群运营" name="first">
          <crowdList ref="crowdListRef" />
        </el-tab-pane>
        <el-tab-pane label="场景营销" name="second">
          <sceneList ref="sceneListRef" />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script lang="ts">
export default {
  name: 'memberCrowdOperationIndex',
  beforeRouteEnter(to, from, next) {
    next((vm: any) => {
      if (from.name === 'memberCrowdOperationAdd' || from.name === 'memberCrowdOperationEdit') {
        vm.handleTabs('first')
      }
      if (from.name === 'memberCrowdOperationSceneAdd' || from.name === 'memberCrowdOperationSceneEdit') {
        vm.handleTabs('second')
      }
    })
  },
}
</script>
<script setup lang="ts">
import { defineAsyncComponent, reactive, onMounted, ref, toRefs } from 'vue'
import { formatDate } from '@/utils/formatTime'
import { parseMoney } from '@/utils/filters'

// 引入组件
const crowdList = defineAsyncComponent(
  () => import('./component/crowdList.vue')
)
const sceneList = defineAsyncComponent(
  () => import('./component/sceneList.vue')
)

const crowdListRef = ref()
const sceneListRef = ref()

// 定义变量
const state = reactive({
  loading: false,
  activeName: 'first',
})

const { loading, activeName } = toRefs(state)

// 切换tab
const handleTabs = (name: any) => {
  if (name == 'first') {
    crowdListRef.value.getListData()
  } else {
    sceneListRef.value.getListData()
  }
}

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