<template>
  <div class="dialog-container">
    <el-dialog :title="dialog.title" v-model="dialog.isShowDialog" width="600px" :close-on-click-modal="false" :destroy-on-close="true">
      <el-form ref="detailFormRef" :model="ruleForm" :rules="rules" size="default" label-width="120px">
        <el-row :gutter="35">
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="充值金额" prop="upto">
              <el-input v-model="ruleForm.upto" placeholder="请输入充值金额" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="赠送金额" prop="give">
              <el-input v-model="ruleForm.give" placeholder="请输入赠送金额" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="是否仅赠送">
              <el-space>
                <el-switch v-model="ruleForm.onlyGive" inline-prompt :active-value="true" :inactive-value="false" active-text="是" inactive-text="否"></el-switch>
                <el-text class="mx-1">开启后,充值金额不会添加到用户余额</el-text>
              </el-space>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="是否赠送霸王餐">
              <el-space>
                <el-switch v-model="ruleForm.allowFreeOrder" inline-prompt :active-value="true" :inactive-value="false" active-text="是" inactive-text="否"></el-switch>
              </el-space>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="赠送优惠券">
              <el-button size="small" text type="primary" @click="onOpenBind('coupon')">绑定优惠券</el-button>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20" v-if="ruleForm.couponGift">
            <el-form-item>
              <el-table :data="ruleForm.couponGift" v-loading="loading" style="width: 100%">
                <el-table-column prop="couponTitle" label="名字" min-width="80" />
                <el-table-column label="数量" width="80">
                  <template #default="{ row }">
                    <el-input v-model="row.count" type="number" min="1"></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="80">
                  <template #default="scoped">
                    <el-button @click="delCoupon(scoped.$index)" size="small" text type="primary">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="赠送卡券">
              <el-button size="small" text type="primary" @click="onOpenBind('card')">绑定卡券</el-button>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20" v-if="ruleForm.couponGift">
            <el-form-item>
              <el-table :data="ruleForm.cardWallet" v-loading="loading" style="width: 100%">
                <el-table-column prop="title" label="名字" min-width="80" />
                <el-table-column label="数量" width="80">
                  <template #default="{ row }">
                    <el-input v-model="row.count" type="number" min="1"></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="80">
                  <template #default="scoped">
                    <el-button @click="delCard(scoped.$index)" size="small" text type="primary">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="onCancel" size="default">取 消</el-button>
          <el-button type="primary" @click="onSubmit" size="default" :loading="loading">{{ dialog.submitTxt }}</el-button>
        </span>
      </template>
    </el-dialog>
    <selectDialog ref="selectDialogRef" @onSelect="onBind" />
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, reactive, ref, toRefs } from 'vue'
import { ElForm } from 'element-plus'
import {
  getDepositConfigDetail,
  addDepositConfig,
  updateDepositConfig
} from '@/api/market/depositConfig/index'

const selectDialog = defineAsyncComponent(
  () => import('@/components/selectBind/index.vue')
)

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh'])

// 定义变量内容
const detailFormRef = ref(ElForm)
const selectDialogRef = ref()
const state = reactive({
  loading: false,
  ruleForm: {} as any,
  rules: {
    upto: [{ required: true, trigger: 'blur', message: '请输入充值金额' }],
  },
  dialog: {
    isShowDialog: false,
    type: '',
    title: '',
    submitTxt: '',
  },
})

const { loading, ruleForm, rules, dialog } =
  toRefs(state)

// 打开弹窗
const openDialog = (type: string, row: any) => {
  if (type === 'edit') {
    state.dialog.title = '修改充值配置'
    state.dialog.submitTxt = '修 改'
    getDepositConfigDetail({
      id: row.id
    }).then((res: any) => {
      state.ruleForm = {
        id: row.id,
        upto: row.upto / 100,
        give: row.give / 100,
        couponGift: res.couponGift ? JSON.parse(res.couponGift) : [],
        cardWallet: res.cardWallet ? JSON.parse(res.cardWallet) : [],
        onlyGive: res.onlyGive,
        allowFreeOrder: res.allowFreeOrder
      }
    })
  } else {
    state.dialog.title = '新增充值配置'
    state.dialog.submitTxt = '新 增'
    state.ruleForm = {
      upto: '',
      give: '',
      couponGift: [],
      cardWallet: [],
      onlyGive: false,
      allowFreeOrder: false
    }
  }
  state.dialog.type = type
  state.dialog.isShowDialog = true
}
// 关闭弹窗
const closeDialog = () => {
  state.dialog.isShowDialog = false
}
// 取消
const onCancel = () => {
  closeDialog()
}

const onBind = (dataType: any, val: any) => {
  if (dataType === 'coupon') {
    val.map((item: any) => {
      state.ruleForm.couponGift.push(
        {
          couponId: item.id,
          count: 1,
          couponTitle: item.name
        }
      )
    })
  } else {
    val.map((item: any) => {
      state.ruleForm.cardWallet.push(
        {
          id: item.id,
          count: 1,
          title: item.name
        }
      )
    })
  }
}

//打开优惠券弹窗
const onOpenBind = (type: string) => {
  selectDialogRef.value.openDialog(type, 'checkbox', [])
}

// 删除绑定列表
const delCoupon = (index: number) => {
  state.ruleForm.couponGift.splice(index, 1)
}


// 删除绑定列表
const delCard = (index: number) => {
  state.ruleForm.cardWallet.splice(index, 1)
}


// 提交
const onSubmit = () => {
  const ruleForm = JSON.parse(JSON.stringify(state.ruleForm))
  ruleForm.upto = Math.round(ruleForm.upto * 100)
  ruleForm.give = Math.round(ruleForm.give * 100)
  ruleForm.couponGift = JSON.stringify(ruleForm.couponGift)
  ruleForm.cardWallet = JSON.stringify(ruleForm.cardWallet)
  detailFormRef.value.validate((valid: boolean) => {
    if (valid) {
      state.loading = true
      if (state.dialog.type === 'add') {
        addDepositConfig(ruleForm)
          .then(() => {
            state.loading = false
            closeDialog()
            emit('refresh')
          })
          .catch(() => {
            state.loading = false
          })
      } else {
        updateDepositConfig(ruleForm)
          .then(() => {
            state.loading = false
            closeDialog()
            emit('refresh')
          })
          .catch(() => {
            state.loading = false
          })
      }
    } else {
      return false
    }
  })
}

// 暴露变量
defineExpose({
  openDialog,
})
</script>
