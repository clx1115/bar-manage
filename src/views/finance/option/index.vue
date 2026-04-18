<template>
  <div class="page-container layout-pd">
    <div class="card">
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
import { defineAsyncComponent, ref, markRaw } from 'vue'

const Basic = defineAsyncComponent(
  () => import('./components/basic.vue')
)
const Discount = defineAsyncComponent(
  () => import('./components/discount.vue')
)
const Initial = defineAsyncComponent(
  () => import('./components/initial.vue')
)

let activeName = ref('basic')

let tabList = ref([
  {
    title: '基础设置',
    name: 'basic',
    component: markRaw(Basic),
    isShow: true,
  },
  {
    title: '支付优惠',
    name: 'discount',
    component: markRaw(Discount),
    isShow: false,
  },
  {
    title: '往来初始化',
    name: 'initial',
    component: markRaw(Initial),
    isShow: false,
  },
])

const handleClick = (val: any) => {
  tabList.value = tabList.value.map(item => {
    if (item.name === val.paneName) {
      item.isShow = true
    } else {
      item.isShow = false
    }
    return item
  })
}

</script>

<style scoped lang="scss">
.card {
  background-color: white;
  padding: 16px;
  min-height: 80vh;
}

.flex {
  display: flex;
}

.page-bottom {
  margin-top: 20px;
}
</style>