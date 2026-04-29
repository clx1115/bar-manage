<template>
  <div class="dialog-container">
    <el-dialog title="打印结果" v-model="isShowDialog" width="810px" :close-on-click-modal="false" :destroy-on-close="true">
      <el-table :data="list" v-loading="loading" style="width: 100%">
        <el-table-column prop="orderNo" label="订单编号" min-width="180" show-overflow-tooltip></el-table-column>
        <el-table-column label="用户信息" show-overflow-tooltip width="180">
          <template #default="{ row }">
            <span v-if="row.uid">{{ row.userName }}(UID:{{ row.uid }})</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="打印状态" width="120">
          <template #default="{ row }">
            <el-tag type="success" v-if="row.printStatus">已打印</el-tag>
            <el-tag type="danger" v-else>未打印</el-tag>
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="onCancel" size="default">关 闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, toRefs, ref } from 'vue'
import { getOrderList, getPrintTemplate, updatePrintCount } from '@/api/order/index'
import { ElMessage } from 'element-plus'
import { getOrderDetail } from '@/api/order/index'
import { storeToRefs } from 'pinia'
import { useUserInfo } from '@/stores/userInfo'
import { hiprint } from 'vue-plugin-hiprint'
import { verifyNumberCnUppercase } from "@/utils/toolsValidate";
import { formatDate } from '@/utils/formatTime'
import { parseMoney } from '@/utils/filters'

// 定义变量内容
let hiprintTemplate: any;

const stores = useUserInfo()
const { userInfos } = storeToRefs(stores) as any

const normalizeAddress = (source: any) => {
  if (!source) return { name: '', telephone: '', details: '', address: '' }
  if (source.address) {
    try {
      return JSON.parse(source.address)
    } catch (error) {
      return source
    }
  }
  return {
    name: source.userName ?? '',
    telephone: source.telephone ?? '',
    details: `${source.province ?? ''}${source.city ?? ''}${source.details ?? ''}`,
    address: '',
  }
}

const normalizeDetailList = (source: any[] = []) => source.map((item: any) => ({
  ...item,
  productName: item.productName ?? item.merchantName ?? '',
  skuName: item.skuName ?? item.attributeName ?? item.attributeDetails ?? item.attributes ?? '',
  productPrice: item.productPrice ?? item.price ?? 0,
  subTotal: item.subTotal ?? item.eachTotalMoney ?? 0,
  number: item.number ?? item.amount ?? 0,
}))
const state = reactive({
  loading: false,
  isShowDialog: false,
  list: [] as any,
  printTemplate: '',
  printIndex: 0,
})

const { list, loading, isShowDialog } = toRefs(state)

// 打开弹窗
const openDialog = (parame: any) => {
  getListData(parame)
  state.isShowDialog = true
}



// 获取列表
const getListData = (parame: any) => {
  state.loading = true
  const formData = JSON.parse(JSON.stringify(parame))
  getOrderList({
    page: 0,
    ...formData,
  }).then((data: any) => {
    state.loading = false
    const list: any = []
    data.list.forEach((item: any) => {
      if (!item.printCount) {
        list.push({
          "id": item.id,
          "uid": item.uid,
          "orderNo": item.orderNo,
          "userName": item.userName,
          "printStatus": false
        })
      }
    })
    state.list = list
    if (state.list.length) {
      getPrintTemplateData()
    }
  })
}

// 获取打印模板
const getPrintTemplateData = () => {
  getPrintTemplate({ page: 1 }).then((data: any) => {
    const printTemplateData = data.list.find((item: any) => item.title === '销售出库单')
    if (printTemplateData) {
      state.printTemplate = printTemplateData.template
      state.printIndex = 0
      onPrint()
    } else {
      ElMessage.warning('暂无打印模板')
    }
  })
}

const onPrint = () => {
  const orderData: any = state.list[state.printIndex]
  if (orderData.printCount) {
    state.printIndex++
  } else {
    getOrderDetail({
      id: orderData.id,
    }).then((res) => {
      const address = res.deliveryType === 2 ? normalizeAddress(res.orderReceiveDetail ?? res.addressDetail) : { name: '', telephone: '', details: '', address: '' }
      const templateData = JSON.parse(state.printTemplate)
      hiprintTemplate = new hiprint.PrintTemplate({
        template: templateData.content
      });
      const detailList = normalizeDetailList(res.detailList ?? res.merchantList).map((item: any) => {
        return {
          shopName: res.shopName,
          barcode: item.barcode,
          productName: item.productName,
          skuName: item.skuName,
          productionDate: '',
          product: item.productName + item.skuName,
          number: item.number,
          unit: item.unit,
          productPrice: parseMoney(item.productPrice),
          subTotal: parseMoney(item.subTotal)
        }
      })
      const printData = {
        orderNo: res.orderNo,
        userName: res.userName ?? res.addressDetail?.userName,
        contact: address.name + ' - ' + address.telephone,
        address: address.details + address.address,
        salesman: res.dealerName,
        date: formatDate(res.createTime, 'YYYY-mm-dd HH:MM:SS'),
        creater: userInfos.value.name,
        printDate: formatDate(new Date().getTime(), 'YYYY-mm-dd HH:MM:SS'),
        payMethod: res.payMethodName ?? '',
        totalMoney: parseMoney(res.realPay ?? res.totalMoney ?? 0),
        totalCap: verifyNumberCnUppercase(parseMoney(res.realPay ?? res.totalMoney ?? 0)),
        table: detailList
      }
      hiprintTemplate.print2(printData, { printer: '', pageSize: { height: templateData.paperConfig.height * 1000, width: templateData.paperConfig.width * 1000 }, title: '订单打印' });
      hiprintTemplate.on('printSuccess', function(e: any) {
        state.list[state.printIndex].printStatus = true
        state.printIndex++
        updatePrintCount({
          id: orderData.id
        }).then((res: any) => {
          if (res.code === 200) {
            if (state.printIndex < state.list.length) {
              onPrint()
            }
          }
        })
      })
    })
  }
}


// 关闭弹窗
const closeDialog = () => {
  state.isShowDialog = false
}
// 取消
const onCancel = () => {
  closeDialog()
}

// 暴露变量
defineExpose({
  openDialog,
})
</script>
