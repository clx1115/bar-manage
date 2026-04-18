<template>
  <div class="dialog-container">
    <el-dialog title="生成桌码" v-model="isShowDialog" width="600px" :close-on-click-modal="false" :destroy-on-close="true">
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
            <el-form-item label="桌码前辍" prop="prefix">
              <el-input v-model="ruleForm.prefix" placeholder="请输入桌码前辍" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="生成数量" prop="amount">
              <el-input v-model="ruleForm.amount" placeholder="生成的桌码总数量,会自动累计之前生成的桌码" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="onCancel" size="default">取 消</el-button>
          <el-button type="primary" @click="onSubmit" size="default" :loading="loading">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, toRefs } from 'vue'
import { ElForm } from 'element-plus'
import {
  generateTable,
} from '@/api/base/table/index'
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
    prefix: [{ required: true, trigger: 'blur', message: '请输入桌码前辍' }],
    amount: [{ required: true, trigger: 'blur', message: '请输入生成数量' }],
  },
  isShowDialog: false,
  shopList: [] as any
})

const { loading, ruleForm, rules, isShowDialog, shopList } =
  toRefs(state)

// 打开弹窗
const openDialog = () => {
  state.ruleForm = {
    shopId: '',
    prefix: '',
    amount: ''
  }
  state.isShowDialog = true
  getShopListData()
}
// 关闭弹窗
const closeDialog = () => {
  state.isShowDialog = false
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
      generateTable(ruleForm)
        .then(() => {
          state.loading = false
          closeDialog()
          emit('refresh')
        })
        .catch(() => {
          state.loading = false
        })
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
