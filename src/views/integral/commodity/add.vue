<template>
  <div class="page-container layout-padding">
    <el-card shadow="hover" class="layout-padding-auto">
      <el-tabs v-model="activeName">
        <el-tab-pane label="商品信息" name="info">
          <product-info ref="infoRef" />
        </el-tab-pane>
        <el-tab-pane label="商品规格" name="attr">
          <product-attr ref="attrRef" :attrTemplateList="attrTemplateList" />
        </el-tab-pane>
        <el-tab-pane label="商品参数" name="parame">
          <product-parame ref="parameRef" :attrTemplateList="attrTemplateList" />
        </el-tab-pane>
      </el-tabs>
      <div class="bottom">
        <el-button type="primary" @click="onSubmit" :loading="loading">保存</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts" name="productAdd">
import { reactive, toRefs, ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
import mittBus from '@/utils/mitt'
import productInfo from './component/productInfo.vue'
import productAttr from './component/productAttr.vue'
import productParame from './component/productParame.vue'
import { getTemplateList } from '@/api/product/attr/index'
import { addScore } from '@/api/integral/index'

// 定义变量内容
const route = useRoute()
const router = useRouter()
const activeName = ref('info')
const infoRef = ref()
const attrRef = ref()
const parameRef = ref()
// 定义变量内容
const state = reactive({
  attrTemplateList: [],
  loading: false,
})

const { attrTemplateList, loading } = toRefs(state)

// 获取列表
const getAttrTemplateData = () => {
  getTemplateList().then((data: any) => {
    state.attrTemplateList = data.list
  })
}
//增加商品
const onSubmit = () => {
  const infoData = infoRef.value.transmit()
  const attrData = attrRef.value.transmit()
  const parameData = parameRef.value.transmit()
  const groupData = Object.assign(infoData, attrData, parameData)
  const formData = JSON.parse(JSON.stringify(groupData))
  let sku = {
    ver: 1,
    attrType: formData.attrType,
    priceModel: formData.priceModel,
    skuList: [],
  } as any
  //根据规格类型生成SKULIST
  if (formData.attrType === 1) {
    console.log(321, formData.simpleProudct)
    let simpleProudct = formData.simpleProudct
    simpleProudct.Score = Math.round(simpleProudct.score)
    simpleProudct.oldPrice = Math.round(simpleProudct.oldPrice * 100)
    simpleProudct.bidPrice = Math.round(simpleProudct.bidPrice * 100)
    simpleProudct.purchasingPrice = Math.round(
      simpleProudct.purchasingPrice * 100
    )
    sku.skuList = [formData.simpleProudct]
    formData.minScore = simpleProudct.Score
    formData.maxScore = simpleProudct.Score
    formData.oldPrice = simpleProudct.oldPrice
    formData.purchasingPrice = simpleProudct.purchasingPrice
    formData.attr = []
    formData.priceModel = 1
    formData.stepPrice = []
  } else {
    if (formData.skuList.length) {
      if (formData.priceModel === 1) {
        const skuList = JSON.parse(JSON.stringify(formData.skuList))
        const skuPriceList = skuList.sort((a: any, b: any) => a.score - b.score)
        formData.minScore = Math.round(skuPriceList[0].score)
        formData.maxScore = Math.round(
          skuPriceList[skuPriceList.length - 1].score
        )
        formData.oldPrice = Math.round(skuPriceList[0].oldPrice * 100)
        sku.skuList = formData.skuList.map((item: any) => {
          item.score = Math.round(item.score)
          item.oldPrice = Math.round(item.oldPrice * 100)
          item.purchasingPrice = Math.round(item.purchasingPrice * 100)
          item.bidPrice = Math.round(item.bidPrice * 100)
          return item
        })
      }
    }
  }
  formData.sort = formData.sort || 1
  if (!formData.name) {
    return ElMessage({
      message: '请填写商品名称',
      type: 'error',
    })
  }
  if (formData.status === 1) {
    if (!formData.categoryId) {
      return ElMessage({
        message: '请选择商品分类',
        type: 'error',
      })
    }
    if (!formData.unit) {
      return ElMessage({
        message: '请填写商品单位',
        type: 'error',
      })
    }
    if (!formData.coverImgUrl) {
      return ElMessage({
        message: '请上传商品主图',
        type: 'error',
      })
    }
    if (!formData.album.length) {
      return ElMessage({
        message: '请上传商品相册',
        type: 'error',
      })
    }
    if (!formData.details.length) {
      return ElMessage({
        message: '请上传商品详情',
        type: 'error',
      })
    }
    if (!sku.skuList.length) {
      return ElMessage({
        message: '请至少生成一条商品规格',
        type: 'error',
      })
    }
  }
  formData.sku = JSON.stringify(sku)
  const attr = formData.attr.map((item: any) => {
    return {
      name: item.name,
      list: item.list,
    }
  })
  const param = formData.param.map((item: any) => {
    return {
      name: item.name,
      value: item.value,
    }
  })
  formData.attr = JSON.stringify(attr)
  formData.param = JSON.stringify(param)
  formData.album = JSON.stringify(formData.album)
  formData.details = JSON.stringify(formData.details)
  delete formData.attrType
  delete formData.skuList
  delete formData.stepPrice
  delete formData.priceModel
  delete formData.uniPrice
  delete formData.uniOldPrice
  delete formData.uniBidPrice
  delete formData.uniPurchasingPrice
  delete formData.simpleProudct


  addScore(formData)
    .then(() => {
      state.loading = false
      router.push('/market/integral/commodity')
      closeCurrentTagsView()
    })
    .catch(() => {
      state.loading = false
    })
}

// 关闭当前 tagsView
const closeCurrentTagsView = () => {
  mittBus.emit(
    'onCurrentContextmenuClick',
    Object.assign({}, { contextMenuClickId: 1, ...route })
  )
}

// 页面加载时
onMounted(() => {
  getAttrTemplateData()
})
</script>
