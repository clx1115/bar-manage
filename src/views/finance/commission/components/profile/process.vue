<template>
  <h2>
    业绩分佣全流程示例
  </h2>
  <p>业绩分佣从创建政策开始到最后完成分钱，整个流程如下；其中根据结算方式的不同，操作流程有所差异。</p>
  <h3>自动代扣</h3>
  <p>结算方式为自动代扣，则订单交易完成且到了代扣时点，系统自动完成分钱；适用于对分钱时效性要求比较高且无需复杂的审批流程的商家</p>
  <keep-alive>
    <FlowChart :process-list="processList1" />
  </keep-alive>
  <h3>对账结算</h3>
  <p>订单交易完成，需要商家进行对账并创建报批审核结算单，创建并报批收付款单，最后完成收付款动作；适用于周期结算，以及对于结算付款流程需要审核的商家。</p>
  <keep-alive>
    <FlowChart :process-list="processList2" />
  </keep-alive>
</template>

<script setup lang="ts">
import { toRefs, reactive, defineAsyncComponent } from 'vue'

const FlowChart = defineAsyncComponent(() => import('./flowChart.vue'))

// 定义变量
const state = reactive({

})

const processList1 = [
  [
    {
      title: '1.创建政策',
      content: '选择政策类型入口 → 新建政策',
      type: 'anchor',
      url: '#entry'
    },
    {
      title: '2.关联适用店铺',
      content: '自动生成分佣协议'
    },
    {
      title: '3.查询计算结果',
      content: '业绩分佣明细表'
    },
    {
      title: '4.查询自动代扣结果',
      content: '销售结算-对账'
    },
  ],
]

const processList2 = [
  [
    {
      title: '1.创建政策',
      content: '选择政策类型入口 → 新建政策',
      type: 'anchor',
      url: '#entry'
    },
    {
      title: '2.关联适用店铺',
      content: '自动生成分佣协议'
    },
    {
      title: '3.查询计算结果',
      content: '业绩分佣明细表'
    },
    {
      title: '4.对账并创建结算单',
      content: '销售结算-对账'
    },
  ],
  [
    {
      title: '5.报批并审核结算单',
      content: '销售结算-结算'
    },
    {
      title: '6.生成并报批收付款单',
      content: '收付款管理'
    },
    {
      title: '7.操作收付款',
      content: '收付款管理'
    },
  ],
]


</script>

<style scoped lang="scss">
.flex {
  display: flex;
}

h2 {
  font-weight: normal;
  font-size: 16px;
  margin-bottom: 8px;
}

p {
  font-size: 13px;
  color: gray;
}

h3 {
  font-size: 14px;
  font-weight: normal;
  margin-top: 30px;
  margin-bottom: 8px;
}

.process-r,
.process-l {
  margin-top: 10px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 40px;
  width: 1044px;

  .item {
    width: 226px;
    height: 69px;
    background-color: #f6f8fa;
    padding: 14px;
    cursor: pointer;

    .title {
      margin-bottom: 4px;
    }

    .content {
      color: #a5a7a9;
      display: flex;
      align-items: center;
    }
  }
}

.process-l {
  flex-direction: row-reverse;
}
</style>