<template>
  <div class="dialog-container">
    <el-dialog :title="dialog.title" v-model="dialog.isShowDialog" width="500px" :close-on-click-modal="false" :destroy-on-close="true">
      <el-form ref="dialogFormRef" :model="ruleForm" :rules="rules" size="default" label-width="100px">
        <el-row :gutter="35">
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="所属类目" prop="categoryId">
              <el-cascader v-model="ruleForm.categoryId" :options="categoryList" collapse-tags clearable :props="{ value: 'id', label: 'name', multiple: false, emitPath: false }" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="时间" prop="date">
              <el-date-picker v-model="ruleForm.date" type="date" value-format="x" placeholder="请选择时间" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="金额" prop="amount">
              <el-input v-model="ruleForm.amount" placeholder="请输入金额，正数为收入，负数为支出" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="经手人" prop="participants">
              <el-select v-model="ruleForm.participants" placeholder="选择经手人" filterable>
                <el-option v-for="item in userList" :key="item.id" :label="item.realName" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="备注" prop="digest">
              <el-input v-model="ruleForm.digest" type="textarea" placeholder="请输入备注"></el-input>
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
    state.dialog.title = '修改收支'
    state.dialog.submitTxt = '修 改'
  } else {
    state.dialog.title = '新增收支'
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
      categoryId: '',
      date: Date.now(),
      amount: '',
      digest: '',
      participants: ''
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
