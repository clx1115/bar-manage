<template>
  <div class="dialog-container">
    <el-dialog :title="dialog.title" v-model="dialog.isShowDialog" width="700px" :close-on-click-modal="false" :destroy-on-close="true">
      <el-form ref="dialogFormRef" :model="ruleForm" :rules="rules" size="default" label-width="100px">
        <el-row :gutter="35">
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="归集方式">
              资金将归集到店铺余额
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="归集店铺" prop="date">
              <el-link :underline="false" type="primary">添加店铺</el-link>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="归集模式" prop="type">
              <el-radio-group v-model="ruleForm.type">
                <el-radio :label="10">定额归集</el-radio>
                <el-radio :label="20">保底归集</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20" v-if="ruleForm.type === 10">
            <el-form-item label=" " prop="type">
              <el-radio-group v-model="ruleForm.type1">
                <el-radio :label="10">按照金额归集：
                  <el-input v-model="ruleForm.amount" style="width: 200px; margin-left: 10px;" :disabled="ruleForm.type1 === 20">
                    <template #append>
                      元
                    </template>
                  </el-input>
                </el-radio>
                <el-radio :label="20" style="margin-top: 10px">按照比例归集：
                  <el-input v-model="ruleForm.amount" style="width: 200px; margin-left: 10px;" :disabled="ruleForm.type1 === 10">
                    <template #append>
                      %
                    </template>
                  </el-input>
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20" v-if="ruleForm.type === 20">
            <el-form-item label="保底金额" prop="type">
              <el-input v-model="ruleForm.amount" style="width: 200px;">
                <template #append>
                  元
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="收集时间" prop="participants">
              <el-select v-model="ruleForm.dateType" filterable style="width: 120px; margin-right: 10px;">
                <el-option label="每日" :value="10" />
                <el-option label="每周" :value="20" />
                <el-option label="每月" :value="30" />
              </el-select>
              <el-select v-if="ruleForm.dateType === 20" v-model="ruleForm.week" placeholder="请选择星期" style="width: 180px; margin-right: 10px;">
                <el-option v-for="i in weekList" :label="i" :value="i" :key="i" />
              </el-select>
              <el-date-picker v-if="ruleForm.dateType === 30" v-model="ruleForm.date" type="date" placeholder="请选择日期" style="width: 180px; margin-right: 10px;" />
              <el-time-picker v-model="ruleForm.time" placeholder="请选择时间" style="width: 180px" />
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
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, toRefs, watch } from 'vue'
import { ElForm } from 'element-plus'
import {
  getVoucherDetail,
  addVoucher,
  updateVoucher,
} from '@/api/finance/voucher/index'
import { getCategroyList } from '@/api/finance/voucher/category/index'
import { getUserList } from '@/api/system/user/index'


// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh'])

// 定义变量内容
const dialogFormRef = ref(ElForm)
const state = reactive({
  loading: false,
  ruleForm: {} as any,
  rules: {
    categoryId: [{ required: true, trigger: 'blur', message: '请选择类目' }],
    date: [{ required: true, trigger: 'blur', message: '请选择日期' }],
    amount: [{ required: true, trigger: 'blur', message: '请填写金额' }],
  },
  categoryList: [] as any,
  dialog: {
    isShowDialog: false,
    type: '',
    title: '',
    submitTxt: '',
  },
  userList: [] as any,
})

const { loading, ruleForm, rules, categoryList, dialog, userList } =
  toRefs(state)

const weekList = [
  '星期一',
  '星期二',
  '星期三',
  '星期四',
  '星期五',
  '星期六',
  '星期日',
]


// 获取类目列表
const getCategoryListData = () => {
  getCategroyList().then((data: any) => {
    state.categoryList = data.list
  })
}

// 获取员工列表
const getUserListData = () => {
  getUserList().then((data: any) => {
    state.userList = data.list
  })
}

// 打开弹窗
const openDialog = (type: string, row: any) => {
  getCategoryListData()
  getUserListData()
  state.dialog.type = type
  state.dialog.isShowDialog = true
  if (type === 'edit') {
    state.dialog.title = '修改规则'
    state.dialog.submitTxt = '修 改'
  } else {
    state.dialog.title = '新建规则'
    state.dialog.submitTxt = '新 增'
  }
  if (type === 'edit') {
    getVoucherDetail({
      id: row.id,
    }).then((res) => {
      state.ruleForm = {
        id: row.id,
        date: row.data,
        categoryId: res.categoryId,
        amount: res.amount / 100,
        digest: res.digest,
        participants: res.participants
      }
    })
  } else {
    state.ruleForm = {
      type: 10,
      type1: 10,
      dateType: 10,
    }
  }
}
// 关闭弹窗
const closeDialog = () => {
  state.dialog.isShowDialog = false
}
// 取消
const onCancel = () => {
  closeDialog()
}

// 提交
const onSubmit = () => {
  const ruleForm = JSON.parse(JSON.stringify(state.ruleForm))
  ruleForm.amount = Math.round(ruleForm.amount * 100)
  dialogFormRef.value.validate((valid: boolean) => {
    if (valid) {
      state.loading = true
      if (state.dialog.type === 'add') {
        addVoucher(ruleForm)
          .then((res) => {
            state.loading = false
            closeDialog()
            emit('refresh')
          })
          .catch(() => {
            state.loading = false
          })
      } else {
        updateVoucher(ruleForm)
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
