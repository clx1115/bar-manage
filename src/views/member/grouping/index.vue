<template>
  <div class="page-container layout-padding">
    <el-card shadow="never" class="layout-padding-auto">
      <el-tabs v-model="activeName" class="demo-tabs" @tab-change="handleTabs">
        <el-tab-pane label="自定义人群" name="first">
          <customList ref="customListRef" />
        </el-tab-pane>
        <el-tab-pane label="推荐人群" name="second">
          <!-- 基础运营 -->
          <div class="title">基础运营</div>
          <el-table :data="baseList" v-loading="loading" style="width: 100%" header-cell-class-name="header-name">
            <el-table-column prop="name" label="人群名称" show-overflow-tooltip min-width="150"></el-table-column>
            <el-table-column prop="info" label="人群定义" show-overflow-tooltip min-width="200"></el-table-column>
            <el-table-column prop="number" align="right" label="人群数量" min-width="150"
              show-overflow-tooltip></el-table-column>
            <el-table-column fixed="right" align="right" label="操作" min-width="200">
              <template #default="{ row }">
                <el-form>
                  <router-link to="" class="mr10">
                    <el-button size="small" text type="primary">人群画像</el-button>
                  </router-link>
                  <router-link :to="`/member/grouping/analysis?id=${row.id}`" class="mr10">
                    <el-button size="small" text type="primary">人群分析</el-button>
                  </router-link>
                  <router-link to="" class="mr10">
                    <el-button size="small" text type="primary">查看客户</el-button>
                  </router-link>
                  <router-link to="" class="mr10">
                    <el-button size="small" text type="primary">去运营</el-button>
                  </router-link>
                </el-form>
              </template>
            </el-table-column>
          </el-table>
          <!-- 生命周期运营 -->
          <div class="title">生命周期运营</div>
          <el-table :data="lifecycleList" v-loading="loading" style="width: 100%" header-cell-class-name="header-name">
            <el-table-column prop="name" label="人群名称" show-overflow-tooltip min-width="150"></el-table-column>
            <el-table-column prop="info" label="人群定义" show-overflow-tooltip min-width="200"></el-table-column>
            <el-table-column prop="number" align="right" label="人群数量" min-width="150"
              show-overflow-tooltip></el-table-column>
            <el-table-column fixed="right" align="right" label="操作" min-width="200">
              <template #default="{ row }">
                <el-form>
                  <router-link to="" class="mr10">
                    <el-button size="small" text type="primary">人群画像</el-button>
                  </router-link>
                  <router-link :to="`/member/grouping/analysis?id=${row.id}`" class="mr10">
                    <el-button size="small" text type="primary">人群分析</el-button>
                  </router-link>
                  <router-link to="" class="mr10">
                    <el-button size="small" text type="primary">查看客户</el-button>
                  </router-link>
                  <router-link to="" class="mr10">
                    <el-button size="small" text type="primary">去运营</el-button>
                  </router-link>
                </el-form>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分层运营 -->
          <div class="title">分层运营</div>
          <el-table :data="layeredList" v-loading="loading" style="width: 100%" header-cell-class-name="header-name">
            <el-table-column prop="name" label="人群名称" show-overflow-tooltip min-width="150"></el-table-column>
            <el-table-column prop="info" label="人群定义" show-overflow-tooltip min-width="200"></el-table-column>
            <el-table-column prop="number" align="right" label="人群数量" min-width="150"
              show-overflow-tooltip></el-table-column>
            <el-table-column fixed="right" align="right" label="操作" min-width="200">
              <template #default="{ row }">
                <el-form>
                  <router-link to="" class="mr10">
                    <el-button size="small" text type="primary">人群画像</el-button>
                  </router-link>
                  <router-link :to="`/member/grouping/analysis?id=${row.id}`" class="mr10">
                    <el-button size="small" text type="primary">人群分析</el-button>
                  </router-link>
                  <router-link to="" class="mr10">
                    <el-button size="small" text type="primary">查看客户</el-button>
                  </router-link>
                  <router-link to="" class="mr10">
                    <el-button size="small" text type="primary">去运营</el-button>
                  </router-link>
                </el-form>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script lang="ts">
export default {
  name: 'memberGroupingIndex',
  beforeRouteEnter(to, from, next) {
    next((vm: any) => {
      if (from.name === 'memberGroupingAdd' || from.name === 'memberGroupingEdit') {
        vm.getcustomListData()
      }
    })
  },
}
</script>
<script setup lang="ts">
import { defineAsyncComponent, reactive, onMounted, ref, toRefs } from 'vue'
import { formatDate } from '@/utils/formatTime'
// import { getMemberList } from '@/api/member/index'
import { parseMoney } from '@/utils/filters'

// 引入组件
const customList = defineAsyncComponent(
  () => import('./component/customList.vue')
)

const customListRef = ref()

// 定义变量
const state = reactive({
  baseList: [{
    id: 1,
    name: '为企微好友的客户',
    info: '是企微好友',
    number: 0
  }, {
    id: 2,
    name: '访问未支付客户',
    info: '近90天有访问店铺，近90天无购买',
    number: 0
  }, {
    id: 3,
    name: '加购未支付客户',
    info: '近7天有加过购物车，近7天无购买',
    number: 0
  }, {
    id: 4,
    name: '下单未支付客户',
    info: '近7天有下单，近7天无购买',
    number: 0
  }, {
    id: 5,
    name: '未及时二回客户',
    info: '近30天无购买，有效购买次数1',
    number: 0
  }, {
    id: 6,
    name: '消费未入会',
    info: '近30天有购买，没有等级',
    number: 0
  }, {
    id: 7,
    name: '下月生日会员',
    info: '生日在下个月，会员',
    number: 0
  }, {
    id: 8,
    name: '本月生日会员',
    info: '生日在该月，会员',
    number: 0
  }],
  lifecycleList: [{
    id: 1,
    name: '为企微好友的客户',
    info: '是企微好友',
    number: 0
  }, {
    id: 2,
    name: '访问未支付客户',
    info: '近90天有访问店铺，近90天无购买',
    number: 0
  }],
  layeredList: [{
    id: 1,
    name: '为企微好友的客户',
    info: '是企微好友',
    number: 0
  }, {
    id: 2,
    name: '访问未支付客户',
    info: '近90天有访问店铺，近90天无购买',
    number: 0
  }],
  loading: false,
  submitData: {},
  activeName: 'second',
})

const { loading, activeName, baseList, lifecycleList, layeredList } = toRefs(state)

// 获取列表
const getListData = () => {
  // state.loading = true
  // getMemberList({}).then((data: any) => {
  //   state.loading = false
  //   state.baseList = data.list
  // }).catch(() => {
  //   state.loading = false
  // })
  console.log('www')
}

// 切换tab
const handleTabs = (name: any) => {
  if (name == 'first') {
    getcustomListData()
  } else {
    getListData()
  }
}

// 获取自定义人群列表
const getcustomListData = () => {
  customListRef.value.getListData()
}

// 页面加载时
onMounted(() => {
  getListData()
})

// 暴露变量
defineExpose({
  getcustomListData
})
</script>

<style scoped lang="scss">
.title {
  margin: 10px 0;
  font-size: 16px;
  color: #343434;
}

:deep(.header-name) {
  background-color: #f7f7f7 !important;
}

.demo-tabs {
  height: 100%;

  :deep(.el-tabs__content) {
    height: calc(100% - 55px);
    overflow: auto;

    #pane-first {
      height: 100%;
    }
  }
}
</style>