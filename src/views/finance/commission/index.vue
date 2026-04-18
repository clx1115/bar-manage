<template>
  <div class="page-container layout-pd">
    <div class="navi">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <template v-for="item in tabList" :key="item.name">
          <el-tab-pane :label="item.title" :name="item.name">
            <template v-if="item.isShow">
              <component :is="item.component" />
            </template>
          </el-tab-pane>
        </template>
      </el-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toRefs, reactive, defineAsyncComponent, ref, markRaw } from 'vue'

const Profile = defineAsyncComponent(() => import('./components/profile/index.vue'))
const Detail = defineAsyncComponent(() => import('./components/detail/index.vue'))
const Policy = defineAsyncComponent(() => import('./components/policy/index.vue'))
const Protocol = defineAsyncComponent(() => import('./components/protocol/index.vue'))
const Relation = defineAsyncComponent(() => import('./components/relation/index.vue'))

let tabList = ref([
  {
    title: '政策概览',
    name: 'profile',
    component: markRaw(Profile),
    isShow: true,
  },
  {
    title: '分佣明细',
    name: 'detail',
    component: markRaw(Detail),
    isShow: false,
  },
  {
    title: '政策查询',
    name: 'policy',
    component: markRaw(Policy),
    isShow: false,
  },
  {
    title: '协议查询',
    name: 'protocol',
    component: markRaw(Protocol),
    isShow: false,
  },
  {
    title: '分佣店铺邀请关系',
    name: 'relation',
    component: markRaw(Relation),
    isShow: false,
  },
])

// 定义变量
const state = reactive({
  activeName: 'profile'
})

const { activeName } = toRefs(state)

const handleClick = (val: any) => {
  console.log(val)
  tabList.value = tabList.value.map(item => {
    if (item.name === val.paneName) {
      item.isShow = true
    } else {
      item.isShow = false
    }
    return item
  })
  console.log(tabList.value)
}

</script>

<style scoped lang="scss">
.navi {

  :deep(.el-tabs__nav-scroll) {
    background-color: white;
    padding-left: 20px;
  }
}

.flex {
  display: flex;
}
</style>
