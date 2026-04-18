<template>
  <div>
    <div class="tabs">
      <div :class="['tab-item', { active: current == index }]" v-for="(item, index) in behavior" :key="index"
        @click="handleTabs(item, index)">
        <div>
          <div class="tab-title">
            {{ item.title }}
            <el-tooltip effect="light" :content="item.tooltip" placement="bottom">
              <SvgIcon name="svg-question" />
            </el-tooltip>
          </div>
          {{ item.value }}
          <div class="tab-rate">
            占比： {{ item.rate }}%
          </div>
        </div>
        <img class="active-img" src="@/assets/images/behavior-active.png" alt="active">
      </div>
    </div>
    <div id="lineChart" class="chart"></div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, reactive, onMounted, ref, toRefs } from 'vue'
import * as echarts from 'echarts';
import { formatDate } from '@/utils/formatTime'
// import { getMemberList } from '@/api/member/index'
import { parseMoney } from '@/utils/filters'

// 定义变量
let lineChart: echarts.ECharts | null = null;
const state = reactive({
  behaviorList: [],
  loading: false,
  behavior: [{
    title: '访客人数',
    tooltip: '近7天访问过小程序的人数',
    value: 0,
    rate: '0.00'
  }, {
    title: '领券客户数',
    tooltip: '近7天领取过优惠券的人数',
    value: 0,
    rate: '0.00'
  }, {
    title: '加购客户数',
    tooltip: '近7天加入过购物车的人数',
    value: 0,
    rate: '0.00'
  }, {
    title: '成交客户数',
    tooltip: '近7天有订单成交的人数',
    value: 0,
    rate: '0.00'
  }],
  current: 0,
})

const { loading, behaviorList, behavior, current } = toRefs(state)

// 获取列表
const getListData = () => {
  // state.loading = true
  // getMemberList({
  // }).then((data: any) => {
  //   state.loading = false
  //   state.list = data.list
  // })
  setChart()
}

// 切换查询条件tab
const handleTabs = (item: any, index: number) => {
  state.current = index
}

const setChart = () => {
  const dom = document.getElementById('lineChart');
  if (!dom) {
    console.error("Chart DOM element not found");
    return;
  }
  lineChart = echarts.init(dom); // 初始化echarts实例
  const option = {
    tooltip: {
      trigger: 'axis'
    },
    grid: {
      left: '5%',
      right: '5%',
      top: '5%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: true,
      axisTick: {
        show: false
      },
      data: ['2024/11/07', '2024/11/08', '2024/11/09', '2024/11/10', '2024/11/11', '2024/11/12', '2024/11/13']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: state.behavior[state.current].title,
        type: 'line',
        stack: 'Total',
        smooth: true,
        data: [0, 0, 0, 0, 0, 0, 0]
      }
    ]
  };
  lineChart.setOption(option);
}

// 页面加载时
onMounted(() => {
  getListData()
  // 监听窗口大小变化
  window.addEventListener('resize', () => {
    if (lineChart) {
      lineChart.resize(); // 调整图表大小
    }
  });
})

onBeforeUnmount(() => {
  // 清除事件监听器
  window.removeEventListener('resize', () => {
    if (lineChart) {
      lineChart.resize();
    }
  });
});

// 暴露变量
defineExpose({
  getListData,
});
</script>

<style scoped lang="scss">
.tabs {
  display: flex;
  align-items: center;
  border-radius: 4px;
  margin-bottom: 15px;

  .tab-item {
    flex: 1;
    flex-shrink: 0;
    position: relative;
    display: flex;
    justify-content: center;
    padding: 15px;
    border: 1px solid #f8f6f9;
    font-size: 20px;
    color: #343434;

    &.active {
      border-color: #498af3;

      .active-img {
        opacity: 1;
      }
    }

    .tab-title {
      display: flex;
      align-items: center;
      margin-bottom: 15px;
      font-size: 15px;
      color: #555;

      .el-tooltip__trigger {
        margin-left: 6px;
      }
    }

    .tab-rate {
      margin-top: 15px;
      font-size: 15px;
      color: #555;
    }

    .active-img {
      position: absolute;
      right: 0;
      bottom: 0;
      width: 20px;
      height: 20px;
      opacity: 0;
    }
  }
}

.chart {
  width: 100%;
  height: 300px;
  margin-bottom: 15px;
}
</style>