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
// 打印订单
const printOrder = (template: any, orderId: any) => {
  getOrderDetail({
    id: orderId,
  }).then((res) => {
    const address = res.deliveryType === 2 ? JSON.parse(res.orderReceiveDetail.address) : { name: '', telephone: '', details: '', address: '' }
    const templateData = JSON.parse(template)
    hiprintTemplate = new hiprint.PrintTemplate({
      template: templateData.content
    });
    const detailList = res.detailList.map((item: any) => {
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
      userName: res.userName,
      contact: address.name + ' - ' + address.telephone,
      address: address.details + address.address,
      salesman: res.dealerName,
      date: formatDate(res.createTime, 'YYYY-mm-dd HH:MM:SS'),
      creater: userInfos.value.name,
      printDate: formatDate(new Date().getTime(), 'YYYY-mm-dd HH:MM:SS'),
      payMethod: res.payMethodName,
      totalMoney: parseMoney(res.realPay),
      totalCap: verifyNumberCnUppercase(parseMoney(res.realPay)),
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
