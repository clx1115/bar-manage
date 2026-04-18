<template>
  <div class="dialog-container">
    <el-dialog :title="dialog.title" v-model="dialog.isShowDialog" width="600px" :close-on-click-modal="false" :destroy-on-close="true">
      <el-form ref="detailFormRef" :model="ruleForm" :rules="rules" size="default" label-width="120px">
        <el-row :gutter="35">
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="店铺" prop="shopId">
              <el-select v-model="ruleForm.shopId" placeholder="选择店铺" filterable>
                <el-option v-for="item in shopList" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="打印机sn" prop="printerSn">
              <el-input v-model="ruleForm.printerSn" placeholder="请输入打印机sn" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="打印机key" prop="printerKey">
              <el-input v-model="ruleForm.printerKey" placeholder="请输入打印机key" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="打印机类型" prop="printerType">
              <el-select v-model="ruleForm.printerType" placeholder="请选择打印机类型" class="w100">
                <el-option label="线上小票" :value="1"></el-option>
                <el-option label="线下小票" :value="2"></el-option>
                <el-option label="线上标签" :value="3"></el-option>
                <el-option label="线下标签" :value="4"></el-option>
                <el-option label="要货单小票" :value="5"></el-option>
                <el-option label="后厨小票" :value="6"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="备注" prop="note">
              <el-input v-model="ruleForm.note" type="textarea" placeholder="请输入备注"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="状态">
              <el-switch v-model="ruleForm.enable" inline-prompt :active-value="true" :inactive-value="false" active-text="启用" inactive-text="禁用"></el-switch>
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
import { reactive, ref, toRefs } from 'vue'
import { ElForm } from 'element-plus'
import {
  getPrinterDetail,
  addPrinter,
  updatePrinter
} from '@/api/base/printer/index'
import { getShopList } from '@/api/shop/index'


// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh'])

// 定义变量内容
const detailFormRef = ref(ElForm)

const state = reactive({
  loading: false,
  ruleForm: {} as any,
  rules: {
    shopId: [{ required: true, trigger: 'blur', message: '请选择店铺' }],
    printerSn: [{ required: true, trigger: 'blur', message: '请输入打印机sn' }],
    printerKey: [{ required: true, trigger: 'blur', message: '请输入打印机key' }],
    printerType: [
      { required: true, trigger: 'blur', message: '请选择打印机类型' },
    ],
  },
  dialog: {
    isShowDialog: false,
    type: '',
    title: '',
    submitTxt: '',
  },
  shopList: [] as any
})

const { loading, ruleForm, rules, dialog, shopList } =
  toRefs(state)

// 打开弹窗
const openDialog = (type: string, row: any) => {
  if (type === 'edit') {
    state.dialog.title = '修改打印机'
    state.dialog.submitTxt = '修 改'
    getPrinterDetail({
      id: row.id,
    }).then((res) => {
      state.ruleForm = {
        id: row.id,
        shopId: row.shopId,
        printerSn: res.printerSn,
        printerKey: res.printerKey,
        note: res.note,
        printerType: res.printerType,
        enable: res.enable
      }
    })
  } else {
    state.dialog.title = '新增打印机'
    state.dialog.submitTxt = '新 增'
    state.ruleForm = {
      shopId: '',
      printerSn: '',
      printerKey: '',
      note: '',
      printerType: 1,
      enable: true,
    }
  }
  state.dialog.type = type
  state.dialog.isShowDialog = true
  getShopListData()
}
// 关闭弹窗
const closeDialog = () => {
  state.dialog.isShowDialog = false
}
// 取消
const onCancel = () => {
  closeDialog()
}

// 获取店铺列表
const getShopListData = () => {
  getShopList({
    page: 0
  }).then((data: any) => {
    state.shopList = data.list
  })
}


// 提交
const onSubmit = () => {
  const ruleForm = JSON.parse(JSON.stringify(state.ruleForm))
  detailFormRef.value.validate((valid: boolean) => {
    if (valid) {
      state.loading = true
      if (state.dialog.type === 'add') {
        addPrinter(ruleForm)
          .then(() => {
            state.loading = false
            closeDialog()
            emit('refresh')
          })
          .catch(() => {
            state.loading = false
          })
      } else {
        updatePrinter(ruleForm)
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
