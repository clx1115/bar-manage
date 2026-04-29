<template>
  <div>

  </div>
</template>

<script setup lang="ts" name="orderDetail">
import { getOrderDetail } from '@/api/order/index'
import { formatDate } from '@/utils/formatTime'
import { parseMoney } from '@/utils/filters'
import { storeToRefs } from 'pinia'
import { useUserInfo } from '@/stores/userInfo'
import { hiprint } from 'vue-plugin-hiprint'
import { verifyNumberCnUppercase } from "@/utils/toolsValidate";

// 定义变量
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
// 打印订单
const printOrder = (template: any, orderId: any) => {
  getOrderDetail({
    id: orderId,
  }).then((res) => {
    const address = res.deliveryType === 2 ? normalizeAddress(res.orderReceiveDetail ?? res.addressDetail) : { name: '', telephone: '', details: '', address: '' }
    const templateData = JSON.parse(template)
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
  })
}

// 暴露变量
defineExpose({
  printOrder,
})
</script>
