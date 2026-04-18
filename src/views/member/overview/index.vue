<template>
  <div class="page-container layout-pd">
    <!-- 实时概况 -->
    <div class="overview border">
      <div class="title">
        实时概况
        <span class="update-time">更新时间：</span>
      </div>
      <div class="overview-content">
        <div class="overview-item">
          <div>支付金额</div>
          <div class="value">
            <span class="sign">￥</span>
            <span class="int">0</span>
            <span class="decimal">.00</span>
          </div>
          <div>昨日：￥0.00</div>
        </div>
        <div class="overview-item">
          <div>支付人数</div>
          <div class="value">
            <span class="int">0</span>
          </div>
          <div>昨日：0</div>
        </div>
        <div class="overview-item">
          <div>客单价</div>
          <div class="value">
            <span class="sign">￥</span>
            <span class="int">0</span>
            <span class="decimal">.00</span>
          </div>
          <div>昨日：￥0.00</div>
        </div>
        <div class="overview-item left-border">
          <div>访客数</div>
          <div class="value">
            <span class="int">2</span>
          </div>
          <div>昨日：2</div>
        </div>
        <div class="overview-item">
          <pieChart />
        </div>
      </div>
    </div>
    <!-- 会员 -->
    <el-row :gutter="20">
      <el-col :span="12">
        <div class="border t-margin">
          <div class="title">会员管理</div>
          <div class="link-content">
            <div class="link-item" v-for="(item, index) in managerList" :key="index">
              <router-link :to="item.link" class="f-ac">
                <div :class="['link-img', { green: index > 1 }]">
                  <img :src="getAssetsFile(item.icon)" alt="">
                </div>
                <div class="link-text">
                  <div>{{ item.title }}</div>
                  <div class="link-info">{{ item.info }}</div>
                </div>
              </router-link>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="border t-margin">
          <div class="title">会员营销</div>
          <div class="link-content">
            <div class="link-item" v-for="(item, index) in marketList" :key="index">
              <router-link :to="item.link" class="f-ac">
                <div class="link-img red">
                  <img :src="getAssetsFile(item.icon)" alt="">
                </div>
                <div class="link-text">
                  <div>{{ item.title }}</div>
                  <div class="link-info">{{ item.info }}</div>
                </div>
              </router-link>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <!-- 持续复购 -->
    <div class="repurchase border t-margin">
      <div class="title">持续复购</div>
      <el-row :gutter="30" class="repurchase-content">
        <el-col :span="12">
          <div class="repurchase-item">
            <div class="top">
              <img src="@/assets/images/repurchase-plan.png" alt="">
              精准触达
              <el-icon>
                <ele-ArrowRight />
              </el-icon>
            </div>
            <div class="con">
              <div class="left">
                <div class="info">进行中的计划</div>
                <div class="value">0</div>
              </div>
              <div class="right">
                <router-link to="" class="f-ac right-info">
                  查看客户画像，精细化运营
                  <el-icon>
                    <ele-ArrowRight />
                  </el-icon>
                </router-link>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="repurchase-item">
            <div class="top">
              <img src="@/assets/images/repurchase-birthday.png" alt="">
              生日关怀
              <el-icon>
                <ele-ArrowRight />
              </el-icon>
            </div>
            <div class="con">
              <div class="left">
                <div class="info">当月生日会员数</div>
                <div class="value">0</div>
              </div>
              <div class="right">
                <router-link to="" class="f-ac right-info">
                  批量对生日会员送券
                  <el-icon>
                    <ele-ArrowRight />
                  </el-icon>
                </router-link>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="repurchase-item">
            <div class="top">
              <img src="@/assets/images/repurchase-vip.png" alt="">
              会员日营销
              <el-icon>
                <ele-ArrowRight />
              </el-icon>
            </div>
            <div class="con">
              <div class="left">
                <div class="info">累计会员数</div>
                <div class="value">0</div>
              </div>
              <div class="right">
                <router-link to="" class="f-ac right-info">
                  每周会员日，培养会员复购习惯
                  <el-icon>
                    <ele-ArrowRight />
                  </el-icon>
                </router-link>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, reactive, onMounted, ref, toRefs } from 'vue'
import { formatDate } from '@/utils/formatTime'
// import { getMemberList } from '@/api/member/index'
import { parseMoney } from '@/utils/filters'
// import { storeToRefs } from 'pinia'
// import { useUserInfo } from '@/stores/userInfo'
// const stores = useUserInfo()
// const { userInfos } = storeToRefs(stores) as any

// 引入组件
const pieChart = defineAsyncComponent(
  () => import('./component/pieChart.vue')
)

// 定义变量
const state = reactive({
  list: [],
  loading: false,
  submitData: {},
  managerList: [
    {
      icon: 'free-vip.png',
      title: '免费会员',
      info: '会员精准分层运营',
      link: ''
    },
    {
      icon: 'pay-vip.png',
      title: '付费会员',
      info: '筛选高价值客户',
      link: ''
    },
    {
      icon: 'task.png',
      title: '成长任务',
      info: '持续消费提升会员等级',
      link: ''
    },
    {
      icon: 'points.png',
      title: '积分商城',
      info: '会员积分兑好礼',
      link: ''
    },
  ],
  marketList: [
    {
      icon: 'ticket.png',
      title: '会员限领券',
      info: '仅限会员用户领取',
      link: ''
    },
    {
      icon: 'birthday.png',
      title: '生日营销',
      info: '会员生日享专属福利',
      link: ''
    },
    {
      icon: 'vip-day.png',
      title: '会员日营销',
      info: '会员日专属会员福利',
      link: ''
    },
    {
      icon: 'holiday.png',
      title: '节日营销',
      info: '大促期间会员专属权益',
      link: ''
    },
  ],
})

const { list, loading, managerList, marketList } = toRefs(state)

// 获取列表
const getListData = () => {
  state.loading = true
  // getMemberList({}).then((data: any) => {
  //   state.loading = false
  //   state.list = data.list
  // }).catch(() => {
  //   state.loading = false
  // })
}

// 解析图片路径
const getAssetsFile = (url: string) => {
  return new URL(`../../../assets/images/${url}`, import.meta.url).href
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

.border {
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;

  .title {
    display: flex;
    align-items: baseline;
    margin-bottom: 20px;
    font-size: 22px;
    color: #343434;

    .update-time {
      margin-left: 10px;
      font-size: 16px;
      color: #a6a6a6;
    }
  }

  &.t-margin {
    margin-top: 16px;
  }
}

.overview-content {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .overview-item {
    flex: 1;
    padding-left: 20px;
    padding-bottom: 16px;
    font-size: 15px;
    color: #a6a6a6;

    .value {
      display: flex;
      align-items: baseline;
      margin: 10px 0;

      .sign {
        color: #343434;
      }

      .int {
        font-size: 26px;
        color: #343434;
      }
    }
  }

  .left-border {
    border-left: 1px solid #ddd;
  }
}

.link-content {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;

  .link-item {
    flex-shrink: 0;
    width: 50%;
    margin-bottom: 15px;
    padding-left: 20px;

    .link-img {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      margin-right: 10px;
      border-radius: 8px;
      background-color: #fca90c;

      &.green {
        background-color: #65be6f;
      }

      &.red {
        background-color: #dd4547;
      }

      img {
        width: 26px;
        height: 26px;
      }
    }

    .link-text {
      display: flex;
      flex-direction: column;
      align-content: space-between;
      height: 100%;
      font-size: 15px;
      color: #343434;

      .link-info {
        color: #a6a6a6;
      }
    }
  }
}

.repurchase-content {
  .repurchase-item {
    margin-bottom: 15px;
    border: 1px solid #eee;

    .top {
      display: flex;
      align-items: center;
      padding: 15px 20px;
      font-size: 18px;
      color: #343434;
      background-color: #f6f8fa;

      img {
        width: 20px;
        height: 20px;
        margin-right: 10px;
      }
    }

    .con {
      display: flex;
      align-items: center;
      padding: 20px;
      font-size: 15px;
      color: #a6a6a6;

      .left {
        flex: 1;
        flex-shrink: 0;
        border-right: 1px solid #eee;

        .value {
          margin-top: 10px;
          font-size: 20px;
          color: #343434;
        }
      }

      .right {
        flex: 2;
        flex-shrink: 0;

        .right-info {
          justify-content: center;
          color: #a6a6a6;
        }
      }
    }
  }
}
</style>