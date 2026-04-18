<template>
  <div class="card flex" style="align-items: center;">
    <span>当前生效中的政策数</span>
    <span class="num">0</span>
    <span>当前生效中的协议数</span>
    <span class="num">0</span>
  </div>
  <div class="card">
    <keep-alive>
      <Process />
    </keep-alive>
  </div>
  <div class="card entry">
    <h2 id="entry">场景化创建入口</h2>
    <p>根据业务场景目前分为4大类政策；分别为收款收集政策、收款归属政策，销售分佣政策和储值充值奖励政策；其中同一个店铺在同一时间只能存在唯一一个销售业绩归属政策或销售分佣政策。</p>
    <p>总部统管资金：适用资金强管控模式，销售款默认全部归属总部管控，由总部作为主体给各方回款或分佣。</p>
    <p>销售单元自营资金：适用于资金弱管控模式，销售款默认在销售单元，由销售单元作为主体给各方回款或分佣。</p>
    <div class="group" v-for="(entry, entryi) in entryList" :key="entryi">
      <h3>{{ entry.title }}</h3>
      <p v-if="entry.desc">{{ entry.desc }}</p>
      <div class="line"></div>
      <div class="item-list">
        <div class="item" v-for="(item, index) in entry.itemList" :key="index">
          <div class="title">{{ item.title }}</div>
          <div class="content">
            <p>{{ item.content }}</p>
            <el-link type="primary" :underline="false">查看场景示例图</el-link>
          </div>
          <el-button @click="toAdd(item.path)">立即新建</el-button>
        </div>
      </div>
    </div>
  </div>
  <div class="card">
    <keep-alive>
      <Fast />
    </keep-alive>
  </div>
</template>

<script setup lang="ts">
import { toRefs, reactive, defineAsyncComponent } from 'vue'
import { useRouter } from 'vue-router'

const Process = defineAsyncComponent(() => import('./process.vue'))
const Fast = defineAsyncComponent(() => import('./fast.vue'))

const router = useRouter()

// 定义变量
const state = reactive({

})

let entryList = [
  {
    title: '销售收款归集政策',
    desc: '',
    itemList: [
      {
        title: '销售收款实时归集',
        content: '适用于资金强管控模式的商家，实现每笔订单销售款的自动归集到总部，方便商家资金统管',
        sample: '',
        path: '/finance/commission/addpolicy?type=1'
      }
    ]
  },
  {
    title: '销售业绩归属政策',
    desc: '主要解决销售款的回款，以及相关费用归属问题；适用场景：总部给业绩单元回储值款、网点销售、销售款归属门店等。',
    itemList: [
      {
        title: '销售业绩归属-总部统管资金',
        content: '适用于资金强管控模式，总部给业绩归属单元回销收款的场景',
        sample: '',
        path: '/finance/commission/addpolicy?type=2'
      },
      {
        title: '销售业绩归属-销售单元自管资金',
        content: '适用于资金强管控模式，销售单元给业绩归属单元回储值款的场景',
        sample: '',
        path: '/finance/commission/addpolicy?type=3'
      },
    ]
  },
  {
    title: '销售分佣政策',
    desc: '主要解决总部销售单元给各个利益相关方分配收益的问题；包括基于交易环节中销售、发货、供货角色之间的供货关系配置分佣规则；或基于不同的组织架构层级和角色配置分佣规则',
    itemList: [
      {
        title: '销售分佣（供货关系）-总部统管资金',
        content: '适用于资金强管控模式，总部基于给交易环节中销售、发货、供货各节点的供货关系给各利益相关方分配收益的场景',
        sample: '',
        path: '/finance/commission/addpolicy?type=4'
      },
      {
        title: '销售分佣（供货关系）-销售单元自管资金',
        content: '适用于资金强管控模式，销售单元基于给交易环节中销售、发货、供货各节点的供货关系给各利益相关方分配收益的场景',
        sample: '',
        path: '/finance/commission/addpolicy?type=5'
      },
      {
        title: '销售分佣（自定义角色）-总部统管资金',
        content: '适用于资金强管控模式，总部作为主体，给合伙人、门店/网店、上级邀请店铺等不同角色分配收益的场景',
        sample: '',
        path: '/finance/commission/addpolicy?type=6'
      },
      {
        title: '销售分佣（自定义角色）-销售单元自管资金',
        content: '适用于资金强管控模式，销售单元作为主体，给合伙人、门店/网店、上级邀请店铺等不同角色分配收益的场景',
        sample: '',
        path: '/finance/commission/addpolicy?type=7'
      },
    ]
  },
  {
    title: '储值充值奖励政策',
    desc: '',
    itemList: [
      {
        title: '储值充值奖励',
        content: '总部激励所属店铺做会员储值：针对顾客储值充值金额，给予门店一定比例的奖励。',
        sample: '',
        path: '/finance/commission/addpolicy?type=8'
      },
    ]
  },
]

const toAdd = (path: string) => {
  router.push(path)
}

</script>

<style scoped lang="scss">
.card {
  background-color: white;
  border: 1px solid #e1e1e4;
  padding: 16px;
  margin-bottom: 15px;

  .num {
    margin: 0 300px 0 18px;
    font-weight: bold;
    font-size: 20px;
    position: relative;
    top: 1px;
  }
}

.card.entry {
  h2 {
    font-weight: normal;
    font-size: 16px;
    margin-bottom: 8px;
  }

  p {
    font-size: 13px;
    color: gray;
  }

  .group {
    h3 {
      font-size: 14px;
      margin-top: 20px;
      margin-bottom: 8px;
    }

    p {
      margin-bottom: 8px;
    }

    .line {
      width: 100%;
      height: 1px;
      background-color: #eee;
      margin-bottom: 20px;
    }

    .item-list {
      display: flex;

      .item {
        width: 300px;
        padding: 12px;
        background-color: #f6f8fa;
        margin-right: 16px;

        .title {
          margin-bottom: 8px;
        }

        .content {
          :deep(.el-link__inner) {
            font-size: 13px;
          }

          margin-bottom: 12px
        }
      }
    }
  }
}

.flex {
  display: flex;
}
</style>