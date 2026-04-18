<template>
  <div class="page-container layout-pd">
    <el-card shadow="never" class="layout-padding-auto">
      <el-row :gutter="15">
        <el-col :span="17">
          <div class="grouping">
            {{ groupingData.name }}
            <div class="info">{{ groupingData.info }}</div>
          </div>
        </el-col>
        <el-col :span="7">
          <div class="grouping">
            人数
            <div class="number">{{ groupingData.number }}</div>
          </div>
        </el-col>
      </el-row>
      <!-- 人群行为 -->
      <div class="title-box">
        <div class="title">
          人群行为
        </div>
        <div class="tooltip">
          最近7天统计数据（统计截止至前一天，人数去重）
        </div>
      </div>
      <behavior />
      <!-- 商品兴趣 -->
      <div class="title-box">
        <div class="title">
          商品兴趣
        </div>
      </div>
      <interest />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, reactive, onMounted, ref, toRefs } from 'vue'
import { formatDate } from '@/utils/formatTime'
// import { getMemberList } from '@/api/member/index'
import { parseMoney } from '@/utils/filters'

// 引入组件
const behavior = defineAsyncComponent(
  () => import('./component/behavior.vue')
)
const interest = defineAsyncComponent(
  () => import('./component/interest.vue')
)

// 定义变量
const state = reactive({
  list: [],
  loading: false,
  groupingData: {
    id: 21,
    name: '兴趣人群',
    info: '近7天有加商品到购物车，但是没有购买过商品的客户',
    number: 0
  },
  managerList: [],
  marketList: [],
})

const { list, loading, groupingData, marketList } = toRefs(state)

// 获取列表
const getListData = () => {
  state.loading = true
  // getMemberList({}).then((data: any) => {
  //   state.loading = false
  //   state.groupingData = data
  // }).catch(() => {
  //   state.loading = false
  // })
}

// 页面加载时
onMounted(() => {
  // getListData()
})
</script>

<style scoped lang="scss">
.f-ac {
  display: flex;
  align-items: center;
}

.grouping {
  padding: 15px;
  padding-bottom: 1px;
  margin-bottom: 15px;
  border-radius: 8px;
  background-color: #f8f8f8;
  font-size: 16px;
  color: #555;

  .info {
    margin: 6px 0 16px 0;
    font-size: 13px;
    color: #a6a6a6;
  }

  .number {
    margin: 6px 0 10px 0;
    font-size: 20px;
    color: #343434;
  }
}

.title-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
  padding: 10px;
  border-radius: 4px;
  background-color: #f8f6f9;
  font-size: 15px;
  color: #555;

  .title {
    position: relative;
    padding-left: 12px;

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 3px;
      width: 3px;
      height: 15px;
      background-color: #0e4cae;
    }
  }

  .tooltip {
    font-size: 14px;
    color: #a6a6a6;
  }
}
</style>