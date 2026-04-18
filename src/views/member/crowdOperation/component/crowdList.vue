<template>
  <div class="custom-body">
    <div class="crowd-title">
      运营计划
      <el-button size="small" text type="primary" @click="showPlan">{{ planFlag ? '收起计划' : '查看全部计划'
        }}</el-button>
    </div>
    <div :class="['plan-add', { show: planFlag }]" id="add-box">
      <div class="plan-add-item" v-for="(item, index) in addPlanList" :key="index">
        <div class="add-title">
          <div class="title">
            {{ item.title }}
            <span v-if="item.num || item.num === 0">：{{ item.num }}</span>
          </div>
          <div :class="['tag', { warn: item.tag == '深耕', error: item.tag == '促活' }]" v-if="item.tag">{{ item.tag }}
          </div>
        </div>
        <div class="info">{{ item.info }}</div>
        <router-link :to="`/member/crowdOperation/add?type=${item.title}`">
          <el-button size="default" type="primary" :disabled="item.disable || false">立即新建</el-button>
        </router-link>
      </div>
      <div class="right-btn" v-if="!planFlag && scrollLeft !== (scrollWidth * 2 / 3)" @click="onScroll(1)">
        <el-icon>
          <ele-ArrowRight />
        </el-icon>
      </div>
      <div class="left-btn" v-if="!planFlag && scrollLeft !== 0" @click="onScroll(2)">
        <el-icon>
          <ele-ArrowLeft />
        </el-icon>
      </div>
    </div>
    <!-- 列表为空 -->
    <div class="empty" v-if="!list.length">当前还没有任何计划，快选择人群创建计划吧</div>
    <template v-else>
      <el-form class="query" :inline="true">
        <el-form-item>
          <el-input v-model="queryData.name" size="default" placeholder="请输入计划名称" clearable> </el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="default" type="primary" @click="getListData">
            <el-icon>
              <ele-Search />
            </el-icon>
            查询
          </el-button>
        </el-form-item>
      </el-form>
      <el-table :data="list" v-loading="loading" style="width: 100%" header-cell-class-name="header-name">
        <el-table-column prop="name" label="计划名称" show-overflow-tooltip min-width="150"></el-table-column>
        <el-table-column prop="type" label="计划类型" show-overflow-tooltip min-width="200"></el-table-column>
        <el-table-column prop="time" label="计划时间" min-width="150" show-overflow-tooltip></el-table-column>
        <el-table-column prop="range" label="会员范围" min-width="150" show-overflow-tooltip></el-table-column>
        <el-table-column prop="status" label="状态" min-width="150" show-overflow-tooltip></el-table-column>
        <el-table-column fixed="right" align="right" label="操作" min-width="200">
          <template #default="{ row }">
            <el-form>
              <router-link :to="`/member/crowdOperation/edit?id=${row.id}&type=${row.type}`" class="mr10">
                <el-button size="small" text type="primary">修改</el-button>
              </router-link>
              <el-button size="small" text type="primary" @click="delProduct(row)">删除</el-button>
            </el-form>
          </template>
        </el-table-column>
      </el-table>
      <div class="page-bottom">
        <el-pagination v-model:currentPage="currentPage" background layout="prev, pager, next, jumper"
          :page-count="totalPage" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, reactive, onMounted, ref, toRefs } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { formatDate } from '@/utils/formatTime'
// import { getMemberList } from '@/api/member/index'
import { parseMoney } from '@/utils/filters'

// 定义变量
const defaultQuery = {
  name: '',
  markMethod: '',
}
const state = reactive({
  list: [],
  loading: false,
  currentPage: 1,
  totalPage: 1,
  queryData: Object.assign({}, defaultQuery),
  planFlag: false,
  flag: true,
  scrollLeft: 0 as any,
  scrollWidth: 0 as any,
  addPlanList: [{
    title: '自定义人群',
    info: '根据自身经营情况，创建个性化的人群运营计划'
  }, {
    title: '指定手机号客户',
    info: '指定手机号， 精准定位客户'
  }, {
    title: '访问未支付客户',
    info: '近3个月有浏览店铺，但未进行消费的客户',
    num: 0,
    tag: '获客'
  }, {
    title: '加购未支付客户',
    info: '近7天有加购行为，但没有成功付款的客户',
    num: 0,
    tag: '获客'
  }, {
    title: '互动粉丝转化',
    info: '通过公众号持续激活店铺客户',
    disable: true
  }, {
    title: '需重点召回客户',
    info: '历史下单数和客单价都高于平均，但近90天未下单',
    num: 0,
    tag: '深耕'
  }, {
    title: '需重点发展客户',
    info: '近30天有过交易记录，下单数和客单价都高于平均',
    num: 0,
    tag: '深耕'
  }, {
    title: '需重点活跃客户',
    info: '历史下单数和客单价都高于平均，但近30天未下单',
    num: 0,
    tag: '促活'
  }, {
    title: '需刺激消费客户',
    info: '近30天有过交易记录，下单数低于平均但客单价高于平均',
    num: 0,
    tag: '深耕'
  }] as any,
})

const { loading, queryData, list, currentPage, totalPage, planFlag, addPlanList, scrollLeft, scrollWidth } = toRefs(state)

// 获取列表
const getListData = () => {
  let addBox = document.getElementById('add-box') as any
  state.scrollLeft = addBox.scrollLeft
  state.scrollWidth = addBox.scrollWidth
  // state.loading = true
  // if (JSON.stringify(state.queryData) !== JSON.stringify(state.submitData)) {
  //   state.currentPage = 1
  // }
  // const formData = JSON.parse(JSON.stringify(state.queryData))
  // getMemberList({
  //   page: state.currentPage,
  //   ...formData,
  // }).then((data: any) => {
  //   state.loading = false
  //   state.list = data.list
  //   if (state.currentPage === 1 && data.pages > 0) {
  //     state.totalPage = data.pages
  //   }

  //   state.submitData = JSON.parse(JSON.stringify(state.queryData))
  // })
  console.log('sss');

}

const handleSizeChange = () => {
  getListData()
}

const handleCurrentChange = () => {
  getListData()
}

// 计划展开与收起
const showPlan = () => {
  state.planFlag = !state.planFlag
  state.scrollLeft = 0
}

// 点击滚动
const onScroll = (type: number) => {
  if (!state.flag) return
  state.flag = false
  setTimeout(() => {
    state.flag = true
  }, 1000);
  let addBox = document.getElementById('add-box') as any
  state.scrollWidth = addBox.scrollWidth
  if (type === 1) {
    // 右
    addBox.scrollLeft = addBox.scrollLeft + (addBox.scrollWidth / 3);
    state.scrollLeft = addBox.scrollLeft + (addBox.scrollWidth / 3);
  } else {
    // 左
    addBox.scrollLeft = addBox.scrollLeft - (addBox.scrollWidth / 3);
    state.scrollLeft = addBox.scrollLeft - (addBox.scrollWidth / 3);
  }
}

//删除
const delProduct = (row: any) => {
  // ElMessageBox.confirm(
  //   `此操作将永久删除商品名称：“${row.name}”，是否继续?`,
  //   '提示',
  //   {
  //     confirmButtonText: '确认',
  //     cancelButtonText: '取消',
  //     type: 'warning',
  //   }
  // )
  //   .then(() => {
  //     deleteProduct({
  //       id: [row.id],
  //     }).then(() => {
  //       getListData()
  //       ElMessage.success('删除成功')
  //     })
  //   })
  //   .catch(() => { })
}

// 页面加载时
onMounted(() => {
  getListData()
})

// 暴露变量
defineExpose({
  getListData,
});
</script>

<style scoped lang="scss">
.custom-body {
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  height: 100%;

  .crowd-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 15px;
    font-size: 15px;
  }

  .plan-add {
    display: flex;
    flex-wrap: nowrap;
    margin: 0 -10px;
    overflow-x: hidden;
    scroll-behavior: smooth;

    &.show {
      flex-wrap: wrap;
    }

    .right-btn,
    .left-btn {
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      top: 95px;
      width: 24px;
      height: 24px;
      background-color: rgba(0, 0, 0, 0.3);
      color: #fff;
      font-size: 20px;
      cursor: pointer;
    }

    .right-btn {
      right: 0;
    }

    .left-btn {
      left: 0;
    }

    .plan-add-item {
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
      align-items: flex-start;
      width: calc((100% - 60px) / 3);
      margin: 0 10px 20px;
      padding: 15px;
      background-color: #ecf4fe;

      .add-title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;

        .title {
          display: flex;
          align-items: flex-end;
          font-size: 16px;
          color: #343434;
        }

        .tag {
          padding: 0 4px;
          font-size: 11px;
          border: 1px solid #70b06b;
          color: #70b06b;

          &.warn {
            border-color: #fbcd7f;
            color: #fbcd7f;
          }

          &.error {
            border-color: #d86571;
            color: #d86571;
          }
        }
      }

      .info {
        margin: 18px 0;
        font-size: 13px;
        color: #999;
      }
    }
  }

  .empty {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100px;
    border: 1px solid #ddd;
  }
}

:deep(.header-name) {
  background-color: #f7f7f7 !important;
}
</style>