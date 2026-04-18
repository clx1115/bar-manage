<template>
  <h2>快捷入口</h2>
  <div class="item-list">
    <div class="item" v-for="(item, index) in entryList" :key="index">
      <div class="icon-container">
        <SvgIcon :name="item.svgName" color="white" :size="30" class="icon" :style="{ marginLeft: '1px' }" />
      </div>
      <div>
        <div class="title">
          {{ item.title }}
        </div>
        <div class="content">
          {{ item.content }}
        </div>
      </div>
    </div>
  </div>
  <h2>相关报表</h2>
  <template v-for="(itemO, indexO) in statementList" :key="indexO">
    <div class="tip">
      {{ itemO.tip }}
    </div>
    <div class="item-list">
      <div class="item" v-for="(item, index) in itemO.list" :key="index">
        <div class="icon-container" style="background-color: #0ecc70;">
          <SvgIcon :name="item.svgName" color="white" :size="30" class="icon" style="margin-left: 1px" />
        </div>
        <div>
          <div class="title">
            {{ item.title }}
          </div>
          <div class="content">
            {{ item.content }}
          </div>
        </div>
      </div>
    </div>
  </template>
</template>

<script setup lang="ts">
import { toRefs, reactive } from 'vue'

// 定义变量
const state = reactive({

})

const entryList = [
  {
    svgName: 'svg-xiaoshoujs',
    title: '销售结算',
    content: '自动代扣：支持查询订单代扣状态；对账结算：支持操作对账并生成',
    path: '',
  },
  {
    svgName: 'svg-shoufuk',
    title: '收付款管理',
    content: '对账结算：收付款单的报批以及收付款操作',
    path: '',
  },
  {
    svgName: 'svg-caiwusz',
    title: '财务设置',
    content: '对账结算方式如下，结算单和付款单的报批审核流程节点自动化设置',
    path: '',
  },
  {
    svgName: 'svg-chengbenrl',
    title: '成本日历',
    content: '对于按照供货成本分佣的场景，可以在成本日历中维护商品的成本',
    path: '',
  },
]

const statementList = [
  {
    tip: '支持查询归集、业绩、分佣、费用的计算结果',
    list: [
      {
        svgName: 'svg-yejify',
        title: '业绩分佣明细报表',
        content: '统计收款归集、业绩、分佣、费用明细信息',
        path: '',
      }
    ]
  },
  {
    tip: '支持查询订单、店铺不同维度应收应付&实收实付查询',
    list: [
      {
        svgName: 'svg-xiaoshouwl',
        title: '销售往来明细报表',
        content: '销售往来明细信息',
        path: '',
      },
      {
        svgName: 'svg-xiaoshouyf',
        title: '销售应收/付汇总报表',
        content: '实时统计汇总销售应收/付结算情况',
        path: '',
      },
      {
        svgName: 'svg-xiaoshouyf',
        title: '销售往来余额表',
        content: '统计每天实际发生的收/付及累计金额',
        path: '',
      },
    ]
  },
]

</script>

<style scoped lang="scss">
h2 {
  font-size: 16px;
  font-weight: normal;
  margin-bottom: 10px;
}

.tip {
  color: gray;
  font-size: 13px;
  margin-bottom: 10px;
}

.item-list {
  display: flex;
  flex-wrap: wrap;

  .item {
    display: flex;
    background-color: #f6f8fa;
    padding: 16px;
    overflow: hidden;
    margin: 0 16px 16px 0;
    cursor: pointer;

    .icon-container {
      width: 38px;
      height: 38px;
      background-color: #6a92ff;
      border-radius: 6px;
      margin-right: 10px;

      .icon {
        height: 100%;
        justify-content: center;
      }
    }

    .title {}

    .content {
      width: 360px;
      font-size: 13px;
      color: gray;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }
}
</style>