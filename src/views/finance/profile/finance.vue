<template>
  <div class="page-container layout-padding">
    <div class="bg top">
      <div class="date">
        <span>统计时间：</span>
        <el-select v-model="dateType" style="width: 100px">
          <el-option v-for="item in dateTypes" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>&nbsp;&nbsp;
        <el-date-picker v-model="date" :type="dateType" style="width: 150px" />
      </div>
      <div class="shop">
        <span>选择店铺：</span>
        <el-select v-model="shopId" placeholder="请选择店铺">
          <el-option v-for="item in shopList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </div>
    </div>

    <div class="bg content">
      <div class="flex mb20 head">
        <span>数据概览</span>&nbsp;
        <el-tooltip effect="light" placement="right">
          <template #content>Right Center prompts info</template>
          <SvgIcon name="svg-question" />
        </el-tooltip>
      </div>
      <div class="body">
        <div class="item">
          <div class="title flex">
            <span>店铺收款（元）</span>
            <el-tooltip effect="light" placement="right">
              <template #content>Right Center prompts info</template>
              <SvgIcon name="svg-question" />
            </el-tooltip>
          </div>
          <div class="money">
            0.00
          </div>
        </div>
        <div class="item">
          <div class="title flex">
            <span>订单成交（元）</span>
            <el-tooltip effect="light" placement="right">
              <template #content>Right Center prompts info</template>
              <SvgIcon name="svg-question" />
            </el-tooltip>
          </div>
          <div class="money">
            0.00
          </div>
        </div>
        <div class="item">
          <div class="title flex">
            <span>销售发货（元）</span>
            <el-tooltip effect="light" placement="right">
              <template #content>Right Center prompts info</template>
              <SvgIcon name="svg-question" />
            </el-tooltip>
          </div>
          <div class="money">
            0.00
          </div>
        </div>
        <div class="item">
          <div class="title flex">
            <span>交易完成（元）</span>
            <el-tooltip effect="light" placement="right">
              <template #content>Right Center prompts info</template>
              <SvgIcon name="svg-question" />
            </el-tooltip>
          </div>
          <div class="money">
            0.00
          </div>
        </div>
        <div class="item">
          <div class="title flex">
            <span>回款入账（元）</span>
            <el-tooltip effect="light" placement="right">
              <template #content>Right Center prompts info</template>
              <SvgIcon name="svg-question" />
            </el-tooltip>
          </div>
          <div class="money">
            0.00
          </div>
        </div>
      </div>
      <div class="chart bg">

      </div>
    </div>

    <div class="footer bg">
      <div class="title mb20">
        快捷入口
      </div>
      <div class="item-list">
        <div class="item">
          <div class="icon-container">
            <SvgIcon name="svg-receipt" size="30" class="icon" :style="{ marginLeft: '1px' }" />
          </div>
          <div class="right">
            <div class="name">收款对账</div>
            <div class="info">昨天收款差异<span :style="{ color: '#000', fontWeight: 'bold' }">0.00</span>元</div>
          </div>
        </div>
        <div class="item">
          <div class="icon-container">
            <SvgIcon name="svg-refund" size="30" class="icon" :style="{ marginLeft: '1px', marginTop: '1px' }" />
          </div>
          <div class="right">
            <div class="name">回款对账</div>
            <div class="info">昨天订单未入账<span :style="{ color: '#000', fontWeight: 'bold' }">0.00</span>元</div>
          </div>
        </div>
        <div class="item">
          <div class="icon-container">
            <SvgIcon name="svg-cart" size="30" class="icon" />
          </div>
          <div class="right">
            <div class="name">采购结算</div>
            <div class="info">结算供应商贷款、费用</div>
          </div>
        </div>
        <div class="item">
          <div class="icon-container">
            <SvgIcon name="svg-league" size="30" class="icon" />
          </div>
          <div class="right">
            <div class="name">加盟要货结算</div>
            <div class="info">结算加盟商贷款、费用</div>
          </div>
        </div>
        <div class="item">
          <div class="icon-container">
            <SvgIcon name="svg-statistics" size="30" class="icon" :style="{ marginLeft: '1px' }" />
          </div>
          <div class="right">
            <div class="name">销售结算</div>
            <div class="info">结算店铺销售佣金</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, toRefs } from 'vue'

const state = reactive({
  dateType: 'month',
  date: ''
})

const dateTypes = [
  {
    label: '月',
    value: 'month'
  },
  {
    label: '年',
    value: 'year'
  }
]

const { dateType, date } = toRefs(state)

</script>

<style scoped lang="scss">
.bg {
  background-color: white;
}

.top {
  padding: 16px;
  display: flex;
  align-items: center;

  .date {
    margin-right: 30px;
  }
}

.content {
  margin-top: 15px;
  padding: 16px;

  .head {
    font-size: 16px;
    font-weight: bold;
  }

  .body {
    display: flex;
    justify-content: space-between;
    padding-right: 30px;

    .money {
      margin-top: 5px;
      font-weight: bold;
      font-size: 16px;
    }
  }

  .chart {
    height: 350px;
  }
}

.footer {
  margin-top: 15px;
  padding: 16px;

  .title {
    font-size: 16px;
    font-weight: bold;
  }

  .item-list {
    display: flex;
    justify-content: space-between;
    padding-left: 10px;
    padding-right: 50px;

    .item {
      display: flex;
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

      .right {
        .name {
          font-weight: bold;
        }

        .info {
          color: gray;
        }
      }
    }
  }
}
</style>
