<template>
  <div class="page-container layout-padding">
    <el-card shadow="hover" class="layout-padding-auto">
      <el-form class="query" :inline="true">
        <el-form-item label="UID">
          <el-input v-model="queryData.uid" size="default" placeholder="请输入UID" clearable> </el-input>
        </el-form-item>
        <el-form-item label="昵称/手机号">
          <el-input v-model="queryData.filter" size="default" placeholder="请输入昵称" clearable> </el-input>
        </el-form-item>
        <el-form-item label="会员等级">
          <el-select v-model="queryData.level" size="default" placeholder="会员等级" clearable>
            <el-option label="全部" :value="0" />
            <el-option v-for="item in levelList" :key="item.id" :label="item.levelName" :value="item.level" />
          </el-select>
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
      <el-table :data="list" v-loading="loading" style="width: 100%">
        <el-table-column prop="id" label="Id" width="90" />
        <el-table-column label="用户头像" show-overflow-tooltip width="90">
          <template #default="{ row }">
            <img v-if="row.avatar" :src="row.avatar" class="avatar">
          </template>
        </el-table-column>
        <el-table-column prop="phoneNumber" label="手机号码" show-overflow-tooltip width="130"></el-table-column>
        <el-table-column prop="memberNo" label="会员卡号" show-overflow-tooltip width="120"></el-table-column>
        <el-table-column prop="nickName" label="用户昵称" min-width="150" show-overflow-tooltip></el-table-column>
        <el-table-column prop="realName" label="用户姓名" min-width="150" show-overflow-tooltip></el-table-column>
        <el-table-column prop="userNote" label="备注名" min-width="150" show-overflow-tooltip></el-table-column>
        <el-table-column label="推荐人ID" show-overflow-tooltip width="200">
          <template #default="{ row }">
            <span v-if="row.dealerId">{{ row.dealerId }}</span>
          </template>
        </el-table-column>
        <el-table-column label="用户角色" show-overflow-tooltip width="100">
          <template #default="{ row }">
            {{ formatUserType(row.userType) }}
          </template>
        </el-table-column>
        <el-table-column prop="levelName" label="用户等级" width="120"></el-table-column>
        <el-table-column label="余额" width="150">
          <template #default="{ row }">
            {{ parseMoney(row.leftBalance) }}
          </template>
        </el-table-column>
        <el-table-column label="加入时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.createdTime, 'YYYY-mm-dd HH:MM:SS') }}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="状态" show-overflow-tooltip width="100">
          <template #default="{ row }">
            <el-tag type="success" v-if="row.status === 1">正常</el-tag>
            <el-tag v-if="row.status === 2">禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="100">
          <template #default="{ row }">
            <el-form>
              <router-link :to="`/member/detail?uid=${row.id}`" class="mr10">
                <el-button size="small" text type="primary">详情</el-button>
              </router-link>
              <el-dropdown style="margin-left:10px">
                <el-button size="small" text type="primary">
                  更多
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="onOpenEdit(row)">修改</el-dropdown-item>
                    <el-dropdown-item @click="onOpenTopUp(row)">充值</el-dropdown-item>
                    <el-dropdown-item @click="onDownload(row)">下载宣传码</el-dropdown-item>
                    <el-dropdown-item @click="onOpenCustomerList(row)">客户列表</el-dropdown-item>
                    <el-dropdown-item @click="onOpenCustomerOrder(row)">客户订单列表</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </el-form>
          </template>
        </el-table-column>
      </el-table>
      <div class="page-bottom">
        <span class="mr20" v-if="userInfos.roles[0] === 'admin' || userInfos.roles[0] === 'director'">总会员数：{{ totalMembers }}</span>
        <span class="mr20" v-if="userInfos.roles[0] === 'admin' || userInfos.roles[0] === 'director'">会员总余额：{{ parseMoney(totalBalance) }}</span>
        <el-pagination v-model:currentPage="currentPage" background layout="prev, pager, next, jumper" :page-count="totalPage" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      </div>
    </el-card>
    <updateBalanceDialog ref="updateBalanceDialogRef" @refresh="getListData" />
    <editDialog ref="editDialogRef" @refresh="getListData" />
    <publicize ref="publicizeRef" />
    <customerListDialog ref="customerListDialogRef" />
    <customerOrderDialog ref="customerOrderDialogRef" />
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, reactive, onMounted, ref, toRefs } from 'vue'
import { formatDate } from '@/utils/formatTime'
import { getMemberList, getLevelList } from '@/api/member/index'
import { formatUserType } from '@/dict/member'
import { parseMoney } from '@/utils/filters'
import { storeToRefs } from 'pinia'
import { useUserInfo } from '@/stores/userInfo'
const stores = useUserInfo()
const { userInfos } = storeToRefs(stores) as any

// 引入组件
const updateBalanceDialog = defineAsyncComponent(
  () => import('./component/updateBalance.vue')
)


const editDialog = defineAsyncComponent(
  () => import('./component/edit.vue')
)

const publicize = defineAsyncComponent(
  () => import('./component/publicize.vue')
)

const customerListDialog = defineAsyncComponent(
  () => import('./component/customerList.vue')
)

const customerOrderDialog = defineAsyncComponent(
  () => import('./component/customerOrder.vue')
)



// 定义变量
const editDialogRef = ref()
const updateBalanceDialogRef = ref()
const publicizeRef = ref()
const customerListDialogRef = ref()
const customerOrderDialogRef = ref()
const state = reactive({
  list: [],
  loading: false,
  currentPage: 1,
  totalPage: 1,
  queryData: {
    filter: '',
    uid: '',
    orgId: '',
    shopId: '',
    status: '',
    level: 0
  } as any,
  submitData: {},
  levelList: [] as any,
  totalMembers: 0,
  totalBalance: 0
})

const { list, loading, currentPage, totalPage, queryData, levelList, totalMembers, totalBalance } = toRefs(state)

// 获取列表
const getListData = () => {
  state.loading = true
  if (JSON.stringify(state.queryData) !== JSON.stringify(state.submitData)) {
    state.currentPage = 1
  }
  const formData = state.queryData
  getMemberList({
    page: state.currentPage,
    ...formData,
  }).then((data: any) => {
    state.loading = false
    state.list = data.list
    if (state.currentPage === 1) {
      state.totalPage = data.pages
      state.totalMembers = data.totalMembers
      state.totalBalance = data.totalBalance
    }
    state.submitData = state.queryData
  }).catch(() => {
    state.loading = false
    state.queryData.filter = JSON.parse(state.queryData.filter)
  })
}

const getLevelListData = () => {
  getLevelList({
    page: 0
  }).then((data: any) => {
    state.levelList = data.list
  })
}

//充值
const onOpenTopUp = (row: any) => {
  updateBalanceDialogRef.value.openDialog(row)
}

//设置用户角色
const onOpenEdit = (row: any) => {
  editDialogRef.value.openDialog(row)
}

// 打开客户列表弹窗
const onOpenCustomerList = (row: any) => {
  customerListDialogRef.value.openDialog(row)
}

// 打开客户订单列表弹窗
const onOpenCustomerOrder = (row: any) => {
  customerOrderDialogRef.value.openDialog(row)
}



const handleSizeChange = () => {
  getListData()
}

const handleCurrentChange = () => {
  getListData()
}

const onDownload = (row: any) => {
  publicizeRef.value.getBarcode(row)
}

// 页面加载时
onMounted(() => {
  getListData()
  getLevelListData()
})
</script>

<style scoped lang="scss">
.el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
  font-size: 12px;
}

.list {
  width: 400px;
  height: 100%;
  display: flex;
  align-items: center;

  .img {
    width: 120px;
    height: 100%;
    margin-left: 10px;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      width: 100px;
      height: 110px;
    }
  }

  .text {
    flex: 1;
    display: flex;
    flex-direction: column;
    font-size: 18px;
    padding: 10px;
    box-sizing: border-box;

    .name {
      width: 100%;
      height: 18px;
      overflow: hidden;
    }
  }
}
</style>
