<template>
  <div class="dialog-container">
    <el-dialog :title="`选择${dialogTitle}`" v-model="isShowDialog" width="600px" :close-on-click-modal="false" :destroy-on-close="true">
      <el-form class="query" :inline="true">
        <el-form-item>
          <el-input v-model="queryData.filter" size="default" placeholder="请输入关键字" clearable> </el-input>
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
      <el-table :data="list" v-loading="loading" style="width: 100%" @selection-change="selectedList = $event">
        <el-table-column type="selection" v-if="selectType === 'checkbox'" :selectable="checkDisabled" width="55" />
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" :label="`${dialogTitle}名称`" min-width="150" show-overflow-tooltip />
        <el-table-column fixed="right" label="操作" width="80">
          <template #default="{ row }">
            <el-button size="small" text type="primary" :disabled="row.disabled" @click="onSelectItem(row)">选择</el-button>
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <div class="select-footer">
          <div class="footer-btn" v-if="selectedList.length">
            <el-button type="primary" @click="batchSelect">
              批量选中
            </el-button>
          </div>
          <el-pagination v-model:currentPage="currentPage" background layout="prev, pager, next, jumper" :page-count="totalPage" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, toRefs } from 'vue'
import { getProductList } from '@/api/product/index'
import { getCategroyList } from '@/api/product/category/index'
import {
  getCouponsList
} from '@/api/coupons/index'
import { getShopList } from '@/api/shop/index'
import {
  getCardList
} from '@/api/market/card/index'
// 定义子组件向父组件传值/事件
const emit = defineEmits(['onSelect'])

// 定义变量内容
const state = reactive({
  list: [] as any,
  loading: false,
  currentPage: 1,
  totalPage: 1,
  queryData: {
    filter: '',
  },
  submitData: {},
  selectedList: [],
  dataType: '',
  selectType: '',
  isShowDialog: false,
  dialogTitle: "",
  detachList: []
})

const {
  list,
  loading,
  currentPage,
  totalPage,
  queryData,
  selectedList,
  selectType,
  isShowDialog,
  dialogTitle
} = toRefs(state)

// 打开弹窗
const openDialog = (dataType: string, selectType: string, detachList: any) => {
  state.dataType = dataType
  state.selectType = selectType
  state.isShowDialog = true
  if (selectType === 'checkbox') {
    state.detachList = detachList
  }
  getListData()
}
// 关闭弹窗
const closeDialog = () => {
  state.isShowDialog = false
}

//验证是否可选
const checkDisabled = (row: any) => {
  return !row.disabled
}


//过滤
const filterList = (list: any) => {
  list.map((item: any) => {
    if (state.dataType === 'coupon') {
      item.name = item.couponTitle
      if (state.detachList.some((some: any) => some.couponId === item.id)) {
        item.disabled = true
      } else {
        item.disabled = false
      }
    } else if (state.dataType === 'card') {
      item.name = item.title
      if (state.detachList.some((some: any) => some.id === item.id)) {
        item.disabled = true
      } else {
        item.disabled = false
      }
    } else {
      if (state.detachList.some((some: any) => some.id === item.id)) {
        item.disabled = true
      } else {
        item.disabled = false
      }
    }
    return item
  })
  state.list = list
}
// 获取列表
const getListData = () => {
  state.loading = true
  if (JSON.stringify(state.queryData) !== JSON.stringify(state.submitData)) {
    state.currentPage = 1
  }
  const formData = JSON.parse(JSON.stringify(state.queryData))
  if (state.dataType == 'product') {
    state.dialogTitle = '商品'
    // 获取分类列表
    getProductList({
      page: state.currentPage,
      type: 10,
      ...formData,
    }).then((data: any) => {
      state.loading = false
      filterList(data.list)
      if (state.currentPage === 1 && data.pages > 0) {
        state.totalPage = data.pages
      }
    })
  } else if (state.dataType == 'productCategory') {
    state.dialogTitle = '商品分类'
    getCategroyList().then((data: any) => {
      state.loading = false
      filterList(data.list)
    })
  } else if (state.dataType == 'shop') {
    state.dialogTitle = '店铺'
    getShopList({ page: state.currentPage, ...formData }).then((data) => {
      state.loading = false
      filterList(data.list)
    })
  } else if (state.dataType == 'coupon') {
    state.dialogTitle = '优惠券'
    getCouponsList({ page: state.currentPage, ...formData }).then((data) => {
      state.loading = false
      filterList(data.list)
    })
  } else if (state.dataType == 'card') {
    state.dialogTitle = '卡券'
    getCardList({ page: state.currentPage, ...formData }).then((data) => {
      state.loading = false
      filterList(data.list)
    })
  }
  state.submitData = JSON.parse(JSON.stringify(state.queryData))
}

const handleSizeChange = () => {
  getListData()
}

const handleCurrentChange = () => {
  getListData()
}

// 选中单条
const onSelectItem = (row: any) => {
  closeDialog()
  emit('onSelect', state.dataType, [row])
}

//批量选中
const batchSelect = () => {
  closeDialog()
  emit('onSelect', state.dataType, state.selectedList)
}
// 暴露变量
defineExpose({
  openDialog,
})
</script>
<style lang="scss" scoped>
.select-footer {
  display: flex;

  .footer-btn {
    margin-right: 10px;
  }
}
</style>