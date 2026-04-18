<template>
  <div class="page-container layout-padding">
    <el-row :gutter="14">
      <el-col :span="16">
        <div class="card">
          <div class="head">
            账户概览
            <el-icon @click="show = !show">
              <View v-if="show" />
              <Hide v-else />
            </el-icon>
          </div>
          <div class="content">
            <div class="flex mb10">
              可用店铺余额（元）
              <el-tooltip effect="light" placement="right">
                <template #content>Right Center prompts info</template>
                <SvgIcon name="svg-question" />
              </el-tooltip>
            </div>
            <div class="price mb30">
              {{ show ? '0.00' : '******' }}
              <span :style="{ color: '#999', fontWeight: 'normal' }">></span>
            </div>
          </div>
          <div class="bottom">
            <el-button type="primary">充值</el-button>
            <el-button color="#f0f0f0">提现</el-button>
            <el-button color="#f0f0f0">转账</el-button>
            <el-button color="#f0f0f0">收益发放</el-button>
          </div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="card">
          <div class="head">
            账户信息
          </div>
          <div class="content">
            <div class="mb10">
              商户名：-
              <a href="#">去认证</a>
            </div>
            <div>
              银行卡：0张
              <a href="#">去添加</a>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="14" :style="{ marginTop: '2px' }">
      <el-col :span="16">
        <div class="card">
          <div :style="{ display: 'flex' }">
            <div class="left" :style="{ marginRight: '200px' }">
              <div class="flex mb10">
                待结算金额（元）
                <el-tooltip effect="light" placement="right">
                  <template #content>Right Center prompts info</template>
                  <SvgIcon name="svg-question" />
                </el-tooltip>
              </div>
              <div class="price">
                {{ show ? '0.00' : '******' }}
                <span :style="{ color: '#999', fontWeight: 'normal' }">></span>
              </div>
            </div>
            <div class="right">
              <div class="flex mb10">
                订购预付款（元）
                <el-tooltip effect="light" placement="right">
                  <template #content>Right Center prompts info</template>
                  <SvgIcon name="svg-question" />
                </el-tooltip>
              </div>
              <div class="price">
                {{ show ? '0.00' : '******' }}
                <span :style="{ color: '#999', fontWeight: 'normal' }">></span>
              </div>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="card" :style="{ padding: '16px 0px' }">
          <div :style="{ display: 'flex', justifyContent: 'space-around' }">
            <div class="info-item">
              <div class="icon-container">
                <SvgIcon name="svg-certify" :size="30" class="icon" />
              </div>
              <div class="title">
                认证信息
              </div>
            </div>
            <div class="info-item">
              <div class="icon-container">
                <SvgIcon name="svg-xieyi" :size="30" class="icon" />
              </div>
              <div class="title">
                协议信息
              </div>
            </div>
            <div class="info-item">
              <div class="icon-container">
                <SvgIcon name="svg-money" :size="30" class="icon" />
              </div>
              <div class="title">
                支付方式
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <div class="card form-card">
      <div class="head">
        <div class="left">
          收支概况
        </div>
        <div class="right">
          查看更多 >
        </div>
      </div>
      <div class="content">
        <el-table :data="list" v-loading="loading" style="width: 100%" :header-cell-style="{ background: '#f5f7fa' }">
          <el-table-column prop="uid" label="账户" width="200" />
          <el-table-column prop="memberNo" label="收入" min-width="200" />
          <el-table-column prop="memberName" label="支出" min-width="200" />
        </el-table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toRefs, reactive } from 'vue'
import { View, Hide } from '@element-plus/icons-vue'

// 定义变量
const state = reactive({
  list: [],
  loading: false,
  show: true,
})

const { list, loading, show } = toRefs(state)


</script>

<style scoped lang="scss">
.flex {
  display: flex;
}

a {
  color: var(--el-color-primary);
}

.card {
  height: 100%;
  background-color: white;
  padding: 16px;

  .head {
    font-size: 15px;
    margin-bottom: 14px;
  }

  .price {
    display: inline-block;
    font-weight: bold;
    font-size: 20px;
    cursor: pointer;
  }

  .info-item {

    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    margin-bottom: 50px;

    .icon-container {
      background-color: #6a92ff;
      width: 36px;
      height: 36px;
      border-radius: 6px;
      padding-bottom: 2px;

      .icon {
        height: 100%;
        justify-content: center;
      }
    }

    .title {
      font-size: 12px;
      margin-top: 6px;
    }

  }
}

.form-card {
  margin-top: 14px;

  .head {
    display: flex;
    justify-content: space-between;

    .right {
      font-size: 14px;
      color: var(--el-color-primary);
      cursor: pointer;
    }
  }
}
</style>
