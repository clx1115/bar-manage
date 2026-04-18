<template>
  <div class="dialog-container">
    <el-dialog :title="dialog.title" v-model="dialog.isShowDialog" width="500px" :close-on-click-modal="false" :destroy-on-close="true">
      <el-form ref="dialogFormRef" :model="ruleForm" :rules="rules" size="default" label-width="150px">
        <el-row :gutter="35">
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="配送方式" prop="method">
              <el-radio-group v-model="ruleForm.method">
                <el-radio :label="2">跑腿</el-radio>
                <el-radio :label="4">邮递</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <template v-if="ruleForm.method === 2">
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
              <el-form-item label="首3公里费用" prop="firstKMFee">
                <el-input v-model="ruleForm.firstKMFee" placeholder="请输入首3公里费用" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
              <el-form-item label="3公里后每公里费用" prop="nextKMFee">
                <el-input v-model="ruleForm.nextKMFee" placeholder="请输入3公里后每公里费用" clearable></el-input>
              </el-form-item>
            </el-col>
          </template>
          <template v-else-if="ruleForm.method === 4">
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
              <el-form-item label="计费方式" prop="calcType">
                <el-radio-group v-model="ruleForm.calcType">
                  <el-radio :label="1">按件</el-radio>
                  <el-radio :label="2">按重量</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <template v-if="ruleForm.calcType === 1">
              <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
                <el-form-item label="首件费用" prop="firstAmountFee">
                  <el-input v-model="ruleForm.firstAmountFee" placeholder="请输入首件费用" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
                <el-form-item label="续件费用" prop="nextAmountFee">
                  <el-input v-model="ruleForm.nextAmountFee" placeholder="请输入续件费用" clearable></el-input>
                </el-form-item>
              </el-col>
            </template>
            <template v-else>
              <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
                <el-form-item label="首重费用(1KG)" prop="firstWeightFee">
                  <el-input v-model="ruleForm.firstWeightFee" placeholder="请输入首重费用(1KG)" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
                <el-form-item label="续重费用(1KG)" prop="nextWeightFee">
                  <el-input v-model="ruleForm.nextWeightFee" placeholder="请输入续重费用(1KG)" clearable></el-input>
                </el-form-item>
              </el-col>
            </template>
          </template>
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
import { reactive, ref, toRefs } from 'vue'
import { ElForm } from 'element-plus'
import { updateMail, addMail } from '@/api/product/mail/index'

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh'])


function validateFirstKMFee(rule: any, value: any, callback: any) {
  if (!value && state.ruleForm.method === 2) {
    callback(new Error('请输入首3公里费用'))
  } else {
    callback()
  }
}

function validateNextKMFee(rule: any, value: any, callback: any) {
  if (!value && state.ruleForm.method === 2) {
    callback(new Error('请输入首3公里费用'))
  } else {
    callback()
  }
}


function validateFirstAmountFee(rule: any, value: any, callback: any) {
  if (!value && state.ruleForm.method === 4 && state.ruleForm.calcType === 1) {
    callback(new Error('请输入首件费用'))
  } else {
    callback()
  }
}

function validateNextAmountFee(rule: any, value: any, callback: any) {
  if (!value && state.ruleForm.method === 4 && state.ruleForm.calcType === 1) {
    callback(new Error('请输入续件费用'))
  } else {
    callback()
  }
}

function validateFirstWeightFee(rule: any, value: any, callback: any) {
  if (!value && state.ruleForm.method === 4 && state.ruleForm.calcType === 1) {
    callback(new Error('请输入首重费用(1KG)'))
  } else {
    callback()
  }
}

function validateNextWeightFee(rule: any, value: any, callback: any) {
  if (!value && state.ruleForm.method === 4 && state.ruleForm.calcType === 2) {
    callback(new Error('请输入续重费用(1KG)'))
  } else {
    callback()
  }
}

// 定义变量内容
const dialogFormRef = ref(ElForm)
const state = reactive({
  loading: false,
  ruleForm: {} as any,
  rules: {
    // firstKMFee: [{ required: true, trigger: 'blur', validator: validateFirstKMFee }],
    // nextKMFee: [{ required: true, trigger: 'blur', validator: validateNextKMFee }],
    // firstAmountFee: [{ required: true, trigger: 'blur', validator: validateFirstAmountFee }],
    // nextAmountFee: [{ required: true, trigger: 'blur', validator: validateNextAmountFee }],
    // firstWeightFee: [{ required: true, trigger: 'blur', validator: validateFirstWeightFee }],
    // nextWeightFee: [{ required: true, trigger: 'blur', validator: validateNextWeightFee }],
  },
  list: [] as any,
  dialog: {
    isShowDialog: false,
    type: '',
    title: '',
    submitTxt: '',
  },
})

const { loading, ruleForm, rules, dialog } = toRefs(state)


// 打开弹窗
const openDialog = (type: string, row: any) => {
  console.log(type, row)
  state.dialog.type = type
  state.dialog.isShowDialog = true
  if (type === 'edit') {
    state.dialog.title = '修改运费模板'
    state.dialog.submitTxt = '修 改'
    let calcType = 1
    if (row.firstAmountFee) {
      calcType = 1
    } else {
      calcType = 2
    }
    state.ruleForm = {
      id: row.id,
      method: row.method,
      regionCode: row.regionCode,
      regionName: row.regionName,
      firstKMFee: row.firstKMFee,
      nextKMFee: row.nextKMFee,
      firstWeightFee: row.firstWeightFee,
      firstAmountFee: row.firstAmountFee,
      nextWeightFee: row.nextWeightFee,
      nextAmountFee: row.nextAmountFee,
      calcType: calcType
    }
  } else {
    state.dialog.title = '新增运费模板'
    state.dialog.submitTxt = '新 增'
    state.ruleForm = {
      method: 2,
      firstKMFee: '',
      nextKMFee: '',
      regionCode: '',
      regionName: '',
      calcType: 1,
      firstWeightFee: '',
      firstAmountFee: '',
      nextWeightFee: '',
      nextAmountFee: '',
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
// 提交
const onSubmit = () => {
  const ruleForm = JSON.parse(JSON.stringify(state.ruleForm))
  if (ruleForm.method === 2) {
    ruleForm.firstKMFee = Math.round(ruleForm.firstKMFee * 100)
    ruleForm.nextKMFee = Math.round(ruleForm.nextKMFee * 100)
    ruleForm.firstWeightFee = ''
    ruleForm.firstAmountFee = ''
    ruleForm.nextWeightFee = ''
    ruleForm.nextAmountFee = ''
  } else if (ruleForm.method === 4) {
    ruleForm.firstKMFee = ''
    ruleForm.nextKMFee = ''
    if (ruleForm.calcType === 1) {
      ruleForm.firstWeightFee = ''
      ruleForm.firstAmountFee = Math.round(ruleForm.firstAmountFee * 100)
      ruleForm.nextWeightFee = ''
      ruleForm.nextAmountFee = Math.round(ruleForm.nextAmountFee * 100)
    } else {
      ruleForm.firstWeightFee = Math.round(ruleForm.firstWeightFee * 100)
      ruleForm.firstAmountFee = ''
      ruleForm.nextWeightFee = Math.round(ruleForm.nextWeightFee * 100)
      ruleForm.nextAmountFee = ''
    }
  }
  dialogFormRef.value.validate((valid: boolean) => {
    if (valid) {
      state.loading = true
      if (state.dialog.type === 'add') {
        addMail(ruleForm)
          .then(() => {
            state.loading = false
            closeDialog()
            emit('refresh')
          })
          .catch(() => {
            console.log(111)
            state.loading = false
          })
      } else {
        updateMail(ruleForm)
          .then(() => {
            console.log(ruleForm)
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
