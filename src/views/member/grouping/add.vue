<template>
  <div class="page-container layout-padding">
    <el-card shadow="never" class="layout-padding-auto">
      <el-row :gutter="30" style="height: 100%;">
        <el-col :span="7" style="height: 100%;">
          <div class="box-title">
            选择人群特征
            <el-button size="small" text type="primary" @click="onRetract">全部收起</el-button>
          </div>
          <div class="option-box">
            <el-collapse v-model="activeNames" v-for="(item, index) in featureList" :key="index">
              <el-collapse-item :name="index.toString()">
                <template #title>
                  {{ item.title }}
                  <div class="select-num" v-if="item.number > 0">
                    {{ item.number }}
                  </div>
                </template>
                <el-row :gutter="10">
                  <el-col :span="12" v-for="(btnItem, btnIndex) in item.list" :key="btnIndex">
                    <div :class="['option-btn', { disable: btnItem.disable }, { select: btnItem.select }]"
                      @click="selectOption(btnItem, btnIndex, index)">
                      {{ btnItem.name }}
                    </div>
                  </el-col>
                </el-row>
              </el-collapse-item>
            </el-collapse>
          </div>
        </el-col>
        <el-col :span="17" style="height: 100%;position: relative;">
          <div class="box-title" style="line-height: 25px;">人群需同时满足以下特征</div>
          <div class="form-box" id="form-box">
            <groupForm ref="groupFormRef" :search="activeList" @del="delActiveItem" />
            <div class="estimate" v-if="activeList.length">
              预估人数：{{ acount >= 0 ? acount : '-' }}人
              <el-button type="primary" style="margin-left: 10px;" @click="onEstimate">估算</el-button>
            </div>
          </div>
        </el-col>
      </el-row>
      <div class="bottom">
        <el-button @click="onCancel" :loading="loading">取消</el-button>
        <el-button type="primary" @click="onSubmit" :loading="loading">保存</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts" name="memberGroupingAdd">
import { defineAsyncComponent, reactive, onMounted, ref, toRefs } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import mittBus from '@/utils/mitt'
import { formatDate } from '@/utils/formatTime'
// import { getMemberList } from '@/api/member/index'
import { parseMoney } from '@/utils/filters'

// 引入组件
const groupForm = defineAsyncComponent(
  () => import('./component/groupForm.vue')
)

const groupFormRef = ref()

// 定义变量
const route = useRoute()
const router = useRouter()
const state = reactive({
  formData: {},
  loading: false,
  activeNames: ['0', '1', '2'] as any,
  featureList: [{
    title: '基础信息',
    number: 0,
    list: [{
      name: '性别',
      disable: false,
      tip: '客户的性别',
      prop: ['gender'],
      type: 'radio',
      option: [{
        label: '男',
        value: 1
      }, {
        label: '女',
        value: 2
      }]
    }, {
      name: '生日',
      disable: false,
      tip: '生日在选定时间内的客户',
      prop: ['birthdayType', 'birthday', 'birthdayType1', 'days'],
      default: [1, [], 1, ''],
      type: 'timeRange',
      options: [[{
        label: '固定时间',
        value: 1
      }, {
        label: '相对时间',
        value: 2
      }], [{
        label: '最近',
        value: 1
      }, {
        label: '之后',
        value: 2
      }]]
    }, {
      name: '地域',
      disable: false,
      tip: '用户当前填写的地域信息',
      prop: ['address'],
      type: 'dialog'
    }, {
      name: '会员等级',
      disable: false,
      tip: '用户当前的会员等级',
      prop: ['freeLevel', 'paidLevel'],
      type: 'selectMultiple',
      options: [[], []]
    }, {
      name: '标签',
      disable: false,
      tip: '当前拥有以下任一标签的客户',
      prop: ['tags'],
      type: 'dialog'
    }, {
      name: '来源渠道',
      disable: false,
      tip: '从以下任一渠道（如微信、支付宝）、方式（如下单、领取优惠券）成为客户',
      prop: ['channel', 'way'],
      type: 'selectMore',
      options: [[{
        label: '微信',
        value: 1
      }, {
        label: '支付宝',
        value: 2
      }], [{
        label: '下单',
        value: 1
      }, {
        label: '领取优惠券',
        value: 2
      }]]
    }, {
      name: '企微好友',
      disable: true
    }, {
      name: '所在群聊',
      disable: true
    }, {
      name: '企微积分',
      disable: true
    }, {
      name: '是否授权手机号',
      disable: false,
      tip: '',
      prop: ['isAuthorize'],
      type: 'radio',
      option: [{
        label: '是',
        value: true
      }, {
        label: '否',
        value: false
      }]
    }, {
      name: '是否是分销员',
      disable: false,
      tip: '',
      prop: ['isDistributor'],
      type: 'radio',
      option: [{
        label: '是',
        value: true
      }, {
        label: '否',
        value: false
      }]
    }, {
      name: '积分',
      disable: false,
      tip: '用户当前可用积分数量',
      prop: ['pointsCompare', 'points', 'maxPoints'],
      default: [1, null, null],
      unit: '个',
      type: 'number'
    }, {
      name: '储值余额',
      disable: false,
      tip: '客户当前账户内储值余额（包含赠送金额）',
      prop: ['balanceCompare', 'balance', 'maxBalance'],
      default: [1, null, null],
      unit: '元',
      type: 'number'
    }, {
      name: '持有权益卡',
      disable: false,
      tip: '当前持有以下任一权益卡的客户（包含状态已过期、未激活、使用中的权益卡）',
      prop: ['holdingEquityCards'],
      type: 'dialog'
    }, {
      name: '有效权益卡',
      disable: false,
      tip: '当前持有以下任一权益卡的客户（仅支持在有效使用中的权益卡）',
      prop: ['validEquityCards'],
      type: 'dialog'
    }, {
      name: '店铺有购买',
      disable: false,
      tip: '选定时间内，购买过本店商品的客户（以支付成功为准，不剔除退款）',
      prop: ['buyTime'],
      type: 'time'
    }, {
      name: '店铺无购买',
      disable: false,
      tip: '选定时间内，没有购买过本店商品的客户（以支付成功为准，不剔除退款）',
      prop: ['noBuyTime'],
      type: 'time'
    }, {
      name: '归属分店',
      disable: false,
      tip: '在选定店铺内成为会员',
      prop: ['branch'],
      type: 'select',
      option: [{
        label: '无归属',
        value: 0
      }]
    }, {
      name: '礼品卡',
      disable: false,
      tip: '多张礼品卡当前卡内余额（包含赠送金）的累计金额',
      prop: ['giftCard', 'cardBalanceCompare', 'cardBalance', 'maxCardBalance'],
      default: [[], 1, null, null],
      unit: '元',
      type: 'dialogNumber'
    }]
  }, {
    title: '客户行为',
    number: 0,
    list: [{
      name: '店铺有访问',
      disable: false,
      tip: '选定时间内，访问过本店的客户',
      prop: ['visitTime'],
      type: 'time'
    }, {
      name: '店铺无访问',
      disable: false,
      tip: '选定时间内，没有访问过本店的客户',
      prop: ['noVisitTime'],
      type: 'time'
    }, {
      name: '店铺有下单',
      disable: false,
      tip: '选定时间内，在店铺有下单行为的客户',
      prop: ['placeOrderTime'],
      type: 'time'
    }, {
      name: '店铺无下单',
      disable: false,
      tip: '选定时间内，在店铺无下单行为的客户',
      prop: ['noPlaceOrderTime'],
      type: 'time'
    }, {
      name: '店铺有加购',
      disable: false,
      tip: '选定时间内，加购过本店商品的客户',
      prop: ['purchaseTime'],
      type: 'time'
    }, {
      name: '店铺无加购',
      disable: false,
      tip: '选定时间内，没有加购过本店商品的客户',
      prop: ['noPurchaseTime'],
      type: 'time'
    }, {
      name: '店铺有分享',
      disable: false,
      tip: '选定时间内，分享过店内商品或活动的客户',
      prop: ['shareTime'],
      type: 'time'
    }, {
      name: '店铺无分享',
      disable: false,
      tip: '选定时间内，没有分享过店内商品或活动的客户',
      prop: ['noShareTime'],
      type: 'time'
    }]
  }, {
    title: '客户洞察',
    number: 0,
    list: [{
      name: '有效购买次数',
      disable: false,
      tip: '客户累计在店内支付成功的订单数量，剔除全额退款的订单',
      prop: ['numStatisticType', 'numStatisticTypeTime', 'effectivePurchaseNumCompare', 'effectivePurchaseNum', 'maxEffectivePurchaseNum'],
      default: [1, [], 1, null, null],
      unit: '次',
      type: 'radioNumber',
      option: [{
        label: '历史累计',
        value: 1
      }, {
        label: '自定义时间段',
        value: 2
      }]
    }, {
      name: '有效购买金额',
      disable: false,
      tip: '客户累计在店内支付成功的订单金额，剔除退款金额',
      prop: ['amountStatisticType', 'amountStatisticTypeTime', 'effectivePurchaseAmountCompare', 'effectivePurchaseAmount', 'maxEffectivePurchaseAmount'],
      default: [1, [], 1, null, null],
      unit: '元',
      type: 'radioNumber',
      option: [{
        label: '历史累计',
        value: 1
      }, {
        label: '自定义时间段',
        value: 2
      }]
    }, {
      name: '购买商品',
      disable: false,
      tip: '购买过任一选择商品的客户（以支付成功为准，不剔除退款）',
      prop: ['purchaseProduct'],
      type: 'dialog'
    }, {
      name: '笔单价',
      disable: false,
      tip: '客户在店铺的消费金额/购次',
      prop: ['penUnitPriceCompare', 'penUnitPrice', 'maxPenUnitPrice'],
      default: [1, null, null],
      unit: '元',
      type: 'number'
    }, {
      name: '回购周期',
      disable: false,
      tip: '（客户在店内的最近支付时间-首次支付时间）/（购次-1）',
      prop: ['repurchaseCycleCompare', 'repurchaseCycle', 'maxRepurchaseCycle'],
      default: [1, null, null],
      unit: '天',
      type: 'number'
    }, {
      name: '无退款订单数',
      disable: false,
      tip: '客户累计在店内支付成功的订单数量，剔除全额退款的订单',
      prop: ['noRefundOrderNumCompare', 'noRefundOrderNum', 'maxNoRefundOrderNum'],
      default: [1, null, null],
      unit: '个',
      type: 'number'
    }, {
      name: '加购物车商品',
      disable: false,
      tip: '当前购物车存在任一选择商品的客户',
      prop: ['shopCartProducts'],
      type: 'dialog'
    }, {
      name: '有公众号互动',
      disable: false,
      tip: '选定时间内，点击公众号导航栏、扫描带参数二维码的客户',
      prop: ['officialAccountInteract'],
      type: 'time'
    }, {
      name: '权益',
      disable: false,
      tip: '当前享受以下任一权益的客户',
      prop: ['inviolableRights'],
      type: 'dialog'
    }]
  }] as any,
  activeList: [] as any,
  acount: undefined as any,
})

const { loading, formData, activeNames, featureList, activeList, acount } = toRefs(state)

// 获取列表
const getListData = () => {
  // state.loading = true
  // getMemberList({}).then((data: any) => {
  //   state.loading = false
  //   state.baseList = data.list
  // }).catch(() => {
  //   state.loading = false
  // })
}

// 全部收起
const onRetract = () => {
  state.activeNames = []
}

// 选择选项
const selectOption = (btnItem: any, btnIndex: any, index: number) => {
  if (btnItem.disable) return
  // 修改选中状态
  let item = state.featureList[index].list[btnIndex]
  state.featureList[index].list[btnIndex].select = !item.select
  // 统计各分类选中的数量
  let select = state.featureList[index].list.filter((i: any) => {
    return i.select
  })
  state.featureList[index].number = select.length
  // 添加表单选项
  if (!btnItem.select) {
    let formIndex = state.activeList.findIndex((i: any) => {
      return btnItem.name == i.name
    })
    // state.activeList.splice(formIndex, 1)
    // 删除子组件中form对象的属性并移除对应的activeList的属性
    groupFormRef.value.delForm(formIndex, state.activeList[formIndex])
  } else {
    state.activeList.push(btnItem)
    groupFormRef.value.initFormField(btnItem).then(() => {
      let formBox = document.getElementById('form-box') as any
      formBox.scrollTop = formBox.scrollHeight;
    })
  }
}

// 删除表单项
const delActiveItem = (index: number, item: any) => {
  // 侧边栏选中取消
  state.featureList.forEach((val: any) => {
    val.list.forEach((i: any) => {
      if (i.name == state.activeList[index].name) {
        i.select = false
      }
    });
  });
  // 统计各分类选中的数量
  let key = state.featureList.findIndex((val: any) => {
    let valIndex = val.list.findIndex((i: any) => {
      return i.name == item.name
    });
    return valIndex >= 0
  })
  let select = state.featureList[key].list.filter((i: any) => {
    return i.select
  })
  state.featureList[key].number = select.length
  // 移除表单项
  state.activeList.splice(index, 1)
}

// 估算人数
const onEstimate = () => { }

// 取消
const onCancel = () => { }

// 提交
const onSubmit = () => {
  let data = groupFormRef.value.getFormData()
  console.log('sa', data)
  router.push('/member/grouping/index')
  closeCurrentTagsView()
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
  // getListData()
})
</script>

<style scoped lang="scss">
.box-title {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 16px;
  color: #343434;
}

:deep(.el-collapse) {
  border-top: none;
  border-bottom: none;

  .el-collapse-item__header,
  .el-collapse-item__wrap {
    border-bottom: none;
    background-color: transparent;
  }

  .el-collapse-item__header {
    height: auto;
    line-height: 2;
    margin-bottom: 10px;
  }
}

.option-box {
  height: calc(100% - 67px);
  padding: 15px;
  border: 1px solid #e4e7ed;
  background-color: #f8f8f8;
  overflow-y: scroll;

  .select-num {
    width: 20px;
    height: 20px;
    margin-left: 6px;
    border-radius: 50%;
    font-size: 12px;
    line-height: 20px;
    text-align: center;
    background-color: #007bff;
    color: #fff;
  }

  .option-btn {
    margin-bottom: 10px;
    line-height: 30px;
    background-color: #fff;
    color: #343434;
    border: 1px solid #e4e7ed;
    text-align: center;
    border-radius: 4px;
    cursor: pointer;

    &.disable {
      color: #ddd;
      cursor: not-allowed;
    }

    &.select {
      color: #007bff;
      border-color: #007bff;
    }
  }
}

.form-box {
  height: calc(100% - 67px);
  padding: 15px;
  padding-bottom: 0;
  background-color: #f8f8f8;
  overflow-y: scroll;

  .estimate {
    display: flex;
    align-items: center;
    position: absolute;
    bottom: 32px;
    left: 0;
    width: 100%;
    padding: 10px 50px;
    font-size: 13px;
    color: #343434;
    background-color: #fff;
    z-index: 9;
  }
}
</style>