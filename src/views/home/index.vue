<template>
  <div class="home-container layout-pd">

    <el-row v-if="userInfos.roles[0] === 'admin' || userInfos.roles[0] === 'director' || userInfos.roles[0] === 'finance' || userInfos.roles[0] === 'cashier'" :gutter="15" class="home-card mb15">
      <el-col v-for="(item, index) in statData" :key="index" :span="6">
        <div class="grid-content ">
          <div class="grid-title">
            <b>{{ item.name }}</b>
            <div class="grid-title-now">
              今日
            </div>
          </div>
          <div class="grid-main">
            {{ item.value }}
            <div class="grid-main-yesterday">昨日 {{ item.last }}</div>
          </div>
          <div class="grid-bottom">
            本月
            <div>
              {{ item.month }}
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-card v-else shadow="hover" class="layout-padding-auto">
      欢迎您：{{ userInfos.name }}
    </el-card>
    <el-row v-if="userInfos.roles[0] === 'admin' || userInfos.roles[0] === 'director' || userInfos.roles[0] === 'finance' || userInfos.roles[0] === 'cashier'" :gutter="15" class="home-card-two mb15">
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <div class="home-card-item mb20">
          <div style="height: 100%" ref="moneyLineRef"></div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <div class="home-card-item">
          <div style="height: 100%" ref="orderLineRef"></div>
        </div>
      </el-col>
    </el-row>
    <!-- <div class="bottom-list">
      <div class="bottom-list-left">
        <b>一周订单数</b>
        <div id="saleLine" style="height: 100%; width:90%"></div>
      </div>
      <div class="bottom-list-right">
        <b>客户情况</b>
        <div id="userLine" style="height: 100% ;width: 80%"></div>
      </div>
    </div> -->
  </div>
</template>

<script setup lang="ts">
import {
  reactive,
  onMounted,
  ref,
  toRefs,
  watch,
  nextTick,
  onActivated,
  markRaw,
} from 'vue'
import * as echarts from 'echarts'
import { storeToRefs } from 'pinia'
import { useThemeConfig } from '@/stores/themeConfig'
import { useTagsViewRoutes } from '@/stores/tagsViewRoutes'
import { getHomeStat } from '@/api/stat/index'
import { useUserInfo } from '@/stores/userInfo'

const stores = useUserInfo()
const { userInfos } = storeToRefs(stores) as any

//定义变量
const moneyLineRef = ref()
const orderLineRef = ref()
const storesTagsViewRoutes = useTagsViewRoutes()
const storesThemeConfig = useThemeConfig()
const { themeConfig } = storeToRefs(storesThemeConfig)
const { isTagsViewCurrenFull } = storeToRefs(storesTagsViewRoutes)
const state = reactive({
  global: {
    homeChartOne: null,
    homeChartTwo: null,
    dispose: [null, '', undefined],
  } as any,
  statData: [] as any,
  statList: [] as any,
  myCharts: [] as EmptyArrayType,
  charts: {
    theme: '',
    bgColor: '',
    color: '#303133',
  },
})

const { statData } = toRefs(state)

// 获取列表
const getStatData = () => {
  getHomeStat().then((data: any) => {
    const statData = [
      {
        name: '销售额',
        key: 'totalMoney',
        value: data.totalMoney / 100,
        month: data.monthOrderMoney / 100,
      },
      {
        name: '销售数量',
        key: 'products',
        value: data.products,
        month: data.monthSoldProducts,
      },
      {
        name: '订单量',
        key: 'orders',
        value: data.orders,
        month: data.monthOrders,
      },
      {
        name: '新增会员',
        key: 'regCount',
        value: data.regCount,
        month: data.monthRegCount,
      },
    ]
    const dayStatList = data.dayStatList.map((item: any) => {
      item.totalMoney = item.totalMoney / 100
      item.paidUp = item.paidUp / 100
      item.profit = item.profit / 100
      item.deposit = item.deposit / 100
      item.withdraw = item.withdraw / 100
      return item
    })
    statData.map((item: any) => {
      const key = item.key
      item.last = dayStatList[1][key] === 0 ? 0 : dayStatList[1][key]
      return item
    })
    state.statData = statData
    state.statList = dayStatList.reverse()
    nextTick(() => {
      initEchartsResize()
    })
  })
}

// 流水折线图
const initMoneyLineChart = () => {
  if (!state.global.dispose.some((b: any) => b === state.global.homeChartOne))
    state.global.homeChartOne.dispose()
  state.global.homeChartOne = markRaw(
    echarts.init(moneyLineRef.value, state.charts.theme)
  )
  const option = {
    backgroundColor: state.charts.bgColor,
    title: {
      text: '流水统计报表',
      x: 'left',
      textStyle: { fontSize: '15', color: state.charts.color },
    },
    grid: { top: 70, right: 20, bottom: 30, left: 30 },
    tooltip: { trigger: 'axis' },
    legend: {
      data: ['订单额', '实收额', '利润额', '充值额', '提现额'],
      right: 0,
    },
    xAxis: {
      data: state.statList.map((item: any) => item.day),
    },
    yAxis: [
      {
        type: 'value',
        name: '金额',
        splitLine: {
          show: true,
          lineStyle: { type: 'dashed', color: '#f5f5f5' },
        },
      },
    ],
    series: [
      {
        name: '订单额',
        type: 'line',
        symbolSize: 6,
        symbol: 'circle',
        smooth: true,
        data: state.statList.map((item: any) => item.totalMoney),
        lineStyle: { color: '#E44D26' },
        itemStyle: { color: '#E44D26', borderColor: '#E44D26' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#E44D26b3' },
            { offset: 1, color: '#E44D2603' },
          ]),
        },
      },
      {
        name: '实收额',
        type: 'line',
        symbolSize: 6,
        symbol: 'circle',
        smooth: true,
        data: state.statList.map((item: any) => item.paidUp),
        lineStyle: { color: '#9E87FF' },
        itemStyle: { color: '#9E87FF', borderColor: '#9E87FF' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#9E87FFb3' },
            { offset: 1, color: '#9E87FF03' },
          ]),
        },
      },
      {
        name: '利润额',
        type: 'line',
        symbolSize: 6,
        symbol: 'circle',
        smooth: true,
        data: state.statList.map((item: any) => item.profit),
        lineStyle: { color: '#fe9a8b' },
        itemStyle: { color: '#fe9a8b', borderColor: '#fe9a8b' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#fe9a8bb3' },
            { offset: 1, color: '#fe9a8b03' },
          ]),
        },
      },
      {
        name: '充值额',
        type: 'line',
        symbolSize: 6,
        symbol: 'circle',
        smooth: true,
        data: state.statList.map((item: any) => item.deposit),
        lineStyle: { color: '#0ED2F7' },
        itemStyle: { color: '#0ED2F7', borderColor: '#0ED2F7' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#0ED2F7b3' },
            { offset: 1, color: '#0ED2F703' },
          ]),
        },
      },
      {
        name: '提现额',
        type: 'line',
        symbolSize: 6,
        symbol: 'circle',
        smooth: true,
        data: state.statList.map((item: any) => item.withdraw),
        lineStyle: { color: '#6190E8' },
        itemStyle: { color: '#6190E8', borderColor: '#6190E8' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#6190E8b3' },
            { offset: 1, color: '#6190E803' },
          ]),
        },
      },
    ],
  }
  state.global.homeChartOne.setOption(option)
  state.myCharts.push(state.global.homeChartOne)
}

// 订单折线图
const initOrderLineChart = () => {
  if (!state.global.dispose.some((b: any) => b === state.global.homeChartTwo))
    state.global.homeChartTwo.dispose()
  state.global.homeChartTwo = markRaw(
    echarts.init(orderLineRef.value, state.charts.theme)
  )
  const option = {
    backgroundColor: state.charts.bgColor,
    title: {
      text: '订单统计报表',
      x: 'left',
      textStyle: { fontSize: '15', color: state.charts.color },
    },
    grid: { top: 70, right: 20, bottom: 30, left: 30 },
    tooltip: { trigger: 'axis' },
    legend: {
      data: ['订单总数', '商品数', '注册会员数'],
      right: 0,
    },
    xAxis: {
      data: state.statList.map((item: any) => item.day),
    },
    yAxis: [
      {
        type: 'value',
        name: '数量',
        splitLine: {
          show: true,
          lineStyle: { type: 'dashed', color: '#f5f5f5' },
        },
      },
    ],
    series: [
      {
        name: '订单总数',
        type: 'line',
        symbolSize: 6,
        symbol: 'circle',
        smooth: true,
        data: state.statList.map((item: any) => item.orders),
        lineStyle: { color: '#E44D26' },
        itemStyle: { color: '#E44D26', borderColor: '#E44D26' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#E44D26b3' },
            { offset: 1, color: '#E44D2603' },
          ]),
        },
      },
      {
        name: '商品数',
        type: 'line',
        symbolSize: 6,
        symbol: 'circle',
        smooth: true,
        data: state.statList.map((item: any) => item.products),
        lineStyle: { color: '#9E87FF' },
        itemStyle: { color: '#9E87FF', borderColor: '#9E87FF' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#9E87FFb3' },
            { offset: 1, color: '#9E87FF03' },
          ]),
        },
      },
      {
        name: '注册会员数',
        type: 'line',
        symbolSize: 6,
        symbol: 'circle',
        smooth: true,
        data: state.statList.map((item: any) => item.regCount),
        lineStyle: { color: '#0ED2F7' },
        itemStyle: { color: '#0ED2F7', borderColor: '#0ED2F7' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#0ED2F7b3' },
            { offset: 1, color: '#0ED2F703' },
          ]),
        },
      },
    ],
  }
  state.global.homeChartTwo.setOption(option)
  state.myCharts.push(state.global.homeChartTwo)
}

// 用户统计圆饼图
const userPieChart = () => {
  let d = document.querySelector('#userLine') as HTMLElement
  let dd = echarts.init(d)
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c} ({d}%)',
    },
    legend: {
      bottom: 10,
      orient: 'vertical',
      x: 'right',
      y: 'top',
      data: ['回流客户', '消费一次客户', '未消费客户'],
    },
    series: [
      {
        type: 'pie',
        radius: '75%',
        center: ['50%', '50%'],
        selectedMode: 'single',
        data: [
          { value: 500, name: '未消费客户' },
          { value: 80, name: '消费一次客户' },
          { value: 20, name: '回流客户' },
        ],
        itemStyle: {
          normal: {
            color: function(params: any) {
              var colorList = ['#5CADFF', '#B37FEB', '#19BE6B']
              return colorList[params.dataIndex]
            },
          },
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  }
  dd.setOption(option)
}

// 销售折线图
const saleLineChart = () => {
  let d = document.querySelector('#saleLine') as HTMLElement
  let dd = echarts.init(d)
  const option = {
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: ['销量', '平均值'],
    },
    xAxis: [
      {
        type: 'category',
        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      },
    ],
    yAxis: [
      {
        type: 'value',
        name: '销量',
        axisLabel: {
          formatter: '{value} 件',
        },
      },
      {
        type: 'value',
        name: '平均值',
        axisLabel: {
          formatter: '{value} 元',
        },
      },
    ],
    series: [
      {
        name: '销量',
        type: 'bar',
        data: [120, 100, 150, 80, 70, 110, 130],
      },
      {
        name: '平均值',
        type: 'line',
        yAxisIndex: 1,
        data: [100, 150, 120, 90, 80, 100, 110],
      },
    ],
  }
  dd.setOption(option)
}

// 页面加载时
onMounted(() => {
  getStatData()
  // saleLineChart()
  // userPieChart()
})

// 批量设置 echarts resize
const initEchartsResizeFun = () => {
  nextTick(() => {
    for (let i = 0;i < state.myCharts.length;i++) {
      setTimeout(() => {
        state.myCharts[i].resize()
      }, i * 1000)
    }
  })
}
// 批量设置 echarts resize
const initEchartsResize = () => {
  window.addEventListener('resize', initEchartsResizeFun)
}
// 由于页面缓存原因，keep-alive
onActivated(() => {
  initEchartsResizeFun()
})
// 监听 pinia 中的 tagsview 开启全屏变化，重新 resize 图表，防止不出现/大小不变等
watch(
  () => isTagsViewCurrenFull.value,
  () => {
    initEchartsResizeFun()
  }
)
// 监听 pinia 中是否开启深色主题
watch(
  () => themeConfig.value.isIsDark,
  (isIsDark) => {
    nextTick(() => {
      state.charts.theme = isIsDark ? 'dark' : ''
      state.charts.bgColor = isIsDark ? 'transparent' : ''
      state.charts.color = isIsDark ? '#dadada' : '#303133'
      setTimeout(() => {
        initMoneyLineChart()
        initOrderLineChart()
      }, 500)
    })
  },
  {
    deep: true,
    immediate: true,
  }
)
</script>

<style scoped lang="scss">
.home-container {
  overflow: hidden;

  .home-card {
    .home-card-item {
      width: 100%;
      height: 200px;
      border-radius: 4px;
      background-color: #fff;
      display: flex;
      flex-direction: column;
      cursor: pointer;
      margin-bottom: 20px;

      .header {
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 16px;
        border-bottom: 1px solid #e8eaec;

        .title {
          font-size: 16px;
          color: #17233d;
        }
      }

      .body {
        padding: 0 12px;
        flex: 1;
        display: flex;
        flex-direction: column;

        .day {
          display: flex;

          .day-item {
            flex: 1;
            display: flex;
            flex-direction: column;

            .top {
              flex: 1;
              font-size: 30px;
              color: #515a6e;
              height: 106rpx;
              padding: 12px 0;
            }

            .mid {
              font-size: 14px;
              color: #515a6e;
              height: 42px;

              .el-icon-caret-top {
                color: #19be6b;
              }

              .el-icon-caret-bottom {
                color: #ed4014;
              }
            }
          }
        }

        .month {
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top: 1px solid #e8eaec;
          font-size: 14px;
          color: #515a6e;
        }
      }
    }
  }

  .home-card-two {
    .home-card-item {
      height: 400px;
      padding: 20px;
      overflow: hidden;
      background: #fff;
    }
  }

  .bottom-list {
    height: 320px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    .bottom-list-left {
      width: 65%;
      background-color: #ffffff;
      padding: 20px;
    }

    .bottom-list-right {
      width: 34%;
      background-color: #ffffff;
      padding: 20px;
    }
  }
}

.el-row {
  margin-bottom: 5px;
}

.el-col {
  border-radius: 4px;
}

.grid-content {
  border-radius: 4px;
  min-height: 170px;
  background-color: #ffffff;

  .grid-title {
    height: 40px;
    border-bottom: 1px solid #f8f8f8;
    padding: 10px;
    justify-content: space-between;
    display: flex;
    flex-wrap: wrap;

    .grid-title-now {
      color: #19be6b;
      border: 1px solid #19be6b;
      background-color: #f6ffed;
    }
  }

  .grid-main {
    font-size: 40px;
    height: 90px;
    padding: 10px;

    .grid-main-yesterday {
      margin-top: 10px;
      font-size: 15px;
    }
  }

  .grid-bottom {
    width: 95%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin: 0 auto;
    padding-top: 10px;
    border-top: 1px solid #f8f8f8;
  }
}
</style>