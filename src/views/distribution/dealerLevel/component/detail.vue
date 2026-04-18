<template>
  <div class="dialog-container">
    <el-dialog :title="dialog.title" v-model="dialog.isShowDialog" width="800px" :close-on-click-modal="false" :destroy-on-close="true">
      <el-form ref="detailFormRef" :model="ruleForm" :rules="rules" size="default" label-width="120px">
        <el-row :gutter="35">
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="等级值" prop="level">
              <el-input v-model="ruleForm.level" placeholder="请输入等级值" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="等级名称" prop="levelName">
              <el-input v-model="ruleForm.levelName" placeholder="请输入等级名称" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="升级订单数" prop="requireOrders">
              <el-input v-model="ruleForm.requireOrders" placeholder="请输入升级订单数" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="升级订单金额" prop="requireOrderMoney">
              <el-input v-model="ruleForm.requireOrderMoney" placeholder="请输入升级订单金额" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="直推奖励比例" prop="directAwardPercentage">
              <el-space>
                <el-input v-model="ruleForm.directAwardPercentage" placeholder="请输入直推奖励比例" clearable></el-input>%
              </el-space>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="间推奖励比例" prop="indirectAwardPercentage">
              <el-space>
                <el-input v-model="ruleForm.indirectAwardPercentage" placeholder="请输入间推奖励比例" clearable></el-input>%
              </el-space>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="等级描述" prop="sketch">
              <el-input v-model="ruleForm.sketch" placeholder="请输入等级描述" type="textarea" clearable></el-input>
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
import { addDealerLevel, updateDealerLevel, getDealerLevelDetail } from "@/api/distribution/dealerLevel/index";
// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh'])


// 定义变量内容
const detailFormRef = ref(ElForm)
const state = reactive({
  loading: false,
  ruleForm: {} as any,
  rules: {
    level: [{ required: true, trigger: 'blur', message: '请填写等级值' }],
    levelName: [{ required: true, trigger: 'blur', message: '请填写等级名称' }],
  },
  dialog: {
    isShowDialog: false,
    type: '',
    title: '',
    submitTxt: '',
  },
  id: 0,
  discountList: [],
  couponList: [] as any
})

const { loading, ruleForm, rules, dialog } = toRefs(state)

// 打开弹窗
const openDialog = (type: string, row: any) => {
  if (row) {
    state.id = row.id
  }
  if (type === 'edit') {
    state.dialog.title = '修改分销员等级'
    state.dialog.submitTxt = '修 改'
    getDealerLevelDetail({
      id: row.id,
    }).then((res) => {
      state.ruleForm = {
        id: res.id,
        level: res.level,
        levelName: res.levelName,
        requireOrders: res.requireOrders,
        requireOrderMoney: res.requireOrderMoney / 100,
        directAwardPercentage: res.directAwardPercentage,
        indirectAwardPercentage: res.indirectAwardPercentage,
        sketch: res.sketch
      }
    })
  } else {
    state.dialog.title = '新增分销员等级'
    state.dialog.submitTxt = '新 增'
    state.ruleForm = {
      level: '',
      levelName: '',
      requireOrders: '',
      requireOrderMoney: '',
      directAwardPercentage: '',
      indirectAwardPercentage: '',
      sketch: ''
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
  ruleForm.requireOrderMoney = Math.round(ruleForm.requireOrderMoney * 100)
  detailFormRef.value.validate((valid: boolean) => {
    if (valid) {
      state.loading = true
      if (state.dialog.type === 'add') {
        addDealerLevel(ruleForm)
          .then(() => {
            state.loading = false
            closeDialog()
            emit('refresh')
          })
          .catch(() => {
            state.loading = false
          })
      } else {
        updateDealerLevel(ruleForm)
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

<style lang="scss" scoped></style>
