<template>
  <div class="dialog-container">
    <el-dialog title="修改参数配置" v-model="isShowDialog" width="650px" :close-on-click-modal="false" :destroy-on-close="true">
      <el-form ref="dialogFormRef" :model="ruleForm" :rules="rules" size="default" label-width="120px">
        <el-row :gutter="35">
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="参数名">
              {{ ruleForm.note }}
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item v-if="ruleForm.contentType == 1" label="参数值" prop="value">
              <el-input type="textarea" :rows="2" v-model="ruleForm.value" placeholder="请输入参数值" />
            </el-form-item>
            <el-form-item v-if="ruleForm.contentType == 2" label="上传图片" prop="value">
              <upload-img v-model="ruleForm.value" :width="80" :height="80" />
            </el-form-item>
            <el-form-item v-if="ruleForm.contentType == 3" label="输入颜色值" prop="value">
              <el-color-picker v-model="ruleForm.value" />
            </el-form-item>
            <el-form-item v-if="ruleForm.contentType == 4" label="是否开启" prop="value">
              <el-switch v-model="ruleForm.value" inline-prompt :active-value="true" :inactive-value="false" active-text="启" inactive-text="禁"></el-switch>
            </el-form-item>
            <template v-if="ruleForm.contentType === 5">
              <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
                <el-form-item label="是否开启会员日">
                  <el-switch v-model="ruleForm.value.status" inline-prompt :active-value="true" :inactive-value="false" active-text="是" inactive-text="否"></el-switch>
                </el-form-item>
              </el-col>
              <template v-if="ruleForm.value.status">
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
                  <el-form-item label="会员日类型">
                    <el-radio-group v-model="ruleForm.value.type">
                      <el-radio label="week">每周</el-radio>
                      <el-radio label="month">每月</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
                  <el-form-item label="日期">
                    <template v-if="ruleForm.value.type === 'week'">
                      <el-radio-group v-model="ruleForm.value.date" size="default">
                        <el-radio-button :label="1">周一</el-radio-button>
                        <el-radio-button :label="2">周二</el-radio-button>
                        <el-radio-button :label="3">周三</el-radio-button>
                        <el-radio-button :label="4">周四</el-radio-button>
                        <el-radio-button :label="5">周五</el-radio-button>
                        <el-radio-button :label="6">周六</el-radio-button>
                        <el-radio-button :label="0">周日</el-radio-button>
                      </el-radio-group>
                    </template>
                    <el-input v-else v-model="ruleForm.value.date" placeholder="日期" />
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
                  <el-form-item label="会员折扣">
                    <el-space>
                      <el-input v-model="ruleForm.value.discount" placeholder="会员折扣" />
                      <span>%</span>
                    </el-space>
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
                  <el-form-item label="是否弹窗提示">
                    <el-switch v-model="ruleForm.value.isDialog" inline-prompt :active-value="true" :inactive-value="false" active-text="是" inactive-text="否"></el-switch>
                  </el-form-item>
                </el-col>
                <template v-if="ruleForm.value.isDialog">
                  <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
                    <el-form-item label="弹窗图片">
                      <upload-img v-model="ruleForm.value.imgUrl" :width="80" :height="80" />
                    </el-form-item>
                  </el-col>
                </template>
              </template>
            </template>
            <template v-if="ruleForm.contentType === 6">
              <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
                <el-form-item label="是否开启折扣">
                  <el-switch v-model="ruleForm.value.status" inline-prompt :active-value="true" :inactive-value="false" active-text="是" inactive-text="否"></el-switch>
                </el-form-item>
              </el-col>
              <template v-if="ruleForm.value.status">
                <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
                  <el-form-item label="生日折扣">
                    <el-space>
                      <el-input v-model="ruleForm.value.discount" placeholder="生日折扣" />
                      <span>%</span>
                    </el-space>
                  </el-form-item>
                </el-col>
              </template>
            </template>
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
import { updateConfig } from '@/api/system/config/index'
import UploadImg from '@/components/upload/uploadImg.vue'

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh'])

// 定义变量内容
const dialogFormRef = ref(ElForm)
const state = reactive({
  loading: false,
  ruleForm: {} as any,
  rules: {},
  isShowDialog: false,
})

const { loading, ruleForm, rules, isShowDialog } = toRefs(state)

// 打开弹窗
const openDialog = (row: any) => {
  state.ruleForm = {
    id: row.id,
    note: row.note,
    contentType: row.contentType,
    value: row.value,
  }
  if (state.ruleForm.contentType == 5 || state.ruleForm.contentType == 6) {
    state.ruleForm.value = JSON.parse(state.ruleForm.value)
  }
  state.isShowDialog = true
}
// 关闭弹窗
const closeDialog = () => {
  state.isShowDialog = false
}
// 取消
const onCancel = () => {
  closeDialog()
}
// 提交
const onSubmit = () => {
  const ruleForm = JSON.parse(JSON.stringify(state.ruleForm))
  dialogFormRef.value.validate((valid: boolean) => {
    if (valid) {
      state.loading = true
      updateConfig(ruleForm)
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