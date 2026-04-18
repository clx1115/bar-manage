<template>
  <div id="pieChart" :style="{ width: '100%', height: '100%' }"></div>
</template>

<script setup lang="ts">
import { reactive, onMounted, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts';
// import { getStaPurcExp, getSalesRevenue } from "@/api/home/index";


let state = reactive({
  pieData: {
    buyNum: 0,
    nobuyNum: 2
  } as any
})

let pieChart: echarts.ECharts | null = null;

const getData = () => {
  // getStaPurcExp({}).then((data: any) => {
  //   state.pieData = data
  //   setChart()
  // })
  setChart()
}

const setChart = () => {
  const dom = document.getElementById('pieChart');
  if (!dom) {
    console.error("Chart DOM element not found");
    return;
  }
  pieChart = echarts.init(dom); // 初始化echarts实例
  const option = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      icon: 'circle',
      orient: 'vertical',
      top: 'middle',
      right: '20%'
    },
    series: [
      {
        type: 'pie',
        radius: ['40%', '80%'],
        center: ['18%', '50%'],
        color: '#49bcf7',
        label: {
          show: false
        },
        data: [{
          value: state.pieData.buyNum,
          name: '购买用户',
          itemStyle: {
            normal: {
              color: '#00cf71'
            },
            emphasis: {
              color: '#00cf71'
            }
          }
        }, {
          value: state.pieData.nobuyNum,
          name: '未购买用户',
          itemStyle: {
            normal: {
              color: '#ffb82b'
            },
            emphasis: {
              color: '#ffb82b'
            }
          }
        }]
      }
    ]
  };
  pieChart.setOption(option);
}

onMounted(() => {
  getData();

  // 监听窗口大小变化
  window.addEventListener('resize', () => {
    if (pieChart) {
      pieChart.resize(); // 调整图表大小
    }
  });
});

onBeforeUnmount(() => {
  // 清除事件监听器
  window.removeEventListener('resize', () => {
    if (pieChart) {
      pieChart.resize();
    }
  });
});
</script>

<style></style>
