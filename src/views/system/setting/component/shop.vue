<template>
  <div v-if="isEdit === false">
    <div class="view-page">
      <div class="view-page-row">
        <div class="view-page-item">
          <div class="label">
            商家头像
          </div>
          <div class="value">
            <el-image style="width: 80px;height: 80px;" :src="info.avatar" :preview-src-list="[info.avatar]" />
          </div>
        </div>
        <div class="view-page-item">
          <div class="label">
            商家LOGO
          </div>
          <div class="value">
            <el-image style="width: 80px;height: 80px;" :src="info.rectLogo" :preview-src-list="[info.rectLogo]" />
          </div>
        </div>
      </div>
      <div class="view-page-row">
        <div class="view-page-item">
          <div class="label">
            商家名称
          </div>
          <div class="value">
            {{ info.name }}
          </div>
        </div>
      </div>
      <div class="view-page-row">
        <div class="view-page-item">
          <div class="label">
            联系人
          </div>
          <div class="value">
            {{ info.contactName }}
          </div>
        </div>
        <div class="view-page-item">
          <div class="label">
            联系电话
          </div>
          <div class="value">
            {{ info.contactNumber }}
          </div>
        </div>
      </div>
      <div class="view-page-row">
        <div class="view-page-item">
          <div class="label">
            店铺地址
          </div>
          <div class="value">
            <span v-if="info.shopPlaceName">{{ info.shopPlaceName }}</span><span v-if="info.floor">{{ info.floor }}</span> {{ info.contactAddress }}
          </div>
        </div>
      </div>
      <div class="view-page-row">
        <div class="view-page-item">
          <div class="label">
            营业时间
          </div>
          <div class="value">
            {{ info.openTime }}:{{ info.openTimeMinute < 10 ? '0' + info.openTimeMinute : info.openTimeMinute }}-{{ info.closeTime }}:{{ info.closeTimeMinute < 10 ? '0' + info.closeTimeMinute : info.closeTimeMinute }} </div>
          </div>
        </div>
        <div class="view-page-row">
          <div class="view-page-item">
            <div class="label">
              打包费
            </div>
            <div class="value">
              {{ parseMoney(info.packingFee) }}
            </div>
          </div>
          <div class="view-page-item">
            <div class="label">
              起送金额
            </div>
            <div class="value">
              {{ parseMoney(info.minToSend) }}
            </div>
          </div>
          <div class="view-page-item">
            <div class="label">
              配送费
            </div>
            <div class="value">
              {{ parseMoney(info.deliveryFee) }}
            </div>
          </div>
          <div class="view-page-item">
            <div class="label">
              配送时间
            </div>
            <div class="value">
              {{ info.timeToDeliver }}分钟
            </div>
          </div>
        </div>
        <div class="view-page-row">
          <div class="view-page-item">
            <div class="label">
              营业执照号码
            </div>
            <div class="value">
              {{ info.licenseNumber }}
            </div>
          </div>
        </div>
        <div class="view-page-row">
          <div class="view-page-item">
            <div class="label">
              营业执照
            </div>
            <div class="value">
              <el-image style="width: 80px;height: 80px;" :src="info.licenseImg" :preview-src-list="[info.licenseImg]" />
            </div>
          </div>
        </div>
        <div style="text-align: center;">
          <el-button @click="changeEdit" type="primary">编辑</el-button>
        </div>
      </div>
    </div>
    <div v-if="isEdit === true" class="detail-container">
      <el-form ref="detailFormRef" :model="ruleForm" :rules="rules" size="default" label-width="150px">
        <el-row :gutter="35">
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="营业时间" prop="status">
              <el-space>
                <el-time-select v-model="openTime" start="00:00" step="00:15" end="24:00" placeholder="营业开始时间" />
                <el-time-select v-model="closeTime" start="00:00" step="00:15" end="24:00" placeholder="营业结束时间" />
              </el-space>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="8" :md="8" :lg="8" :xl="8" class="mb20">
            <el-form-item label="打包费" prop="packingFee">
              <el-input v-model="ruleForm.packingFee" placeholder="请输入打包费" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="8" :md="8" :lg="8" :xl="8" class="mb20">
            <el-form-item label="起送金额" prop="minToSend">
              <el-input v-model="ruleForm.minToSend" placeholder="请输入起送金额" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="8" :md="8" :lg="8" :xl="8" class="mb20">
            <el-form-item label="配送费" prop="deliveryFee">
              <el-input v-model="ruleForm.deliveryFee" placeholder="请输入配送费" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="8" :md="8" :lg="8" :xl="8" class="mb20">
            <el-form-item label="配送时间" prop="timeToDeliver">
              <el-space wrap>
                <el-input v-model="ruleForm.timeToDeliver" placeholder="配送时间" clearable style="width: 80px;"></el-input>
                分钟
              </el-space>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20" style="text-align: center;">
            <el-button @click="changeEdit">取消</el-button>
            <el-button type="primary" @click="submit">提交</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
</template>

<script setup lang='ts'>
import { ref, toRefs, reactive, onMounted } from 'vue';
import { getOrgInfo, updateOrgInfo } from '@/api/system/setting/index'
import { ElForm, ElMessage } from 'element-plus'
import { parseMoney } from '@/utils/filters'

const detailFormRef = ref(ElForm)
const state = reactive({
  isEdit: false,
  info: {} as any,
  ruleForm: {} as any,
  rules: {

  },
  openTime: '',
  closeTime: '',
})

const { isEdit, info, ruleForm, rules, openTime, closeTime } = toRefs(state);
//改变编辑状态
const changeEdit = () => {
  state.isEdit = !state.isEdit;
}
//提交编辑信息
const submit = () => {
  const ruleForm = JSON.parse(JSON.stringify(state.ruleForm))
  let open = state.openTime.toString()
  ruleForm.openTimeMinute = open.slice(3)
  ruleForm.openTime = open.slice(0, 2)
  let close = state.closeTime.toString()
  ruleForm.closeTimeMinute = close.slice(3)
  ruleForm.closeTime = close.slice(0, 2)
  ruleForm.businessItems = JSON.stringify(ruleForm.businessItems)
  ruleForm.tag = JSON.stringify(ruleForm.tag)
  ruleForm.minToSend = Math.round(ruleForm.minToSend * 100)
  ruleForm.deliveryFee = Math.round(ruleForm.deliveryFee * 100)
  ruleForm.packingFee = Math.round(ruleForm.packingFee * 100)
  detailFormRef.value.validate((valid: boolean) => {
    if (valid) {
      updateOrgInfo(ruleForm)
        .then(() => {
          state.isEdit = false;
          ElMessage.success('保存成功')
          getOrgInfoData()
        })
    } else {
      return false
    }
  })
}

const getOrgInfoData = () => {
  getOrgInfo().then((res) => {
    state.info = res
    state.ruleForm = {
      id: res.id,
      minToSend: res.minToSend / 100,
      deliveryFee: res.deliveryFee / 100,
      timeToDeliver: res.timeToDeliver,
      packingFee: res.packingFee / 100,
    }
    if (res.openTimeMinute < 10) {
      if (res.openTime < 10) {
        state.openTime = `0${res.openTime}:0${res.openTimeMinute}`
      } else {
        state.openTime = `${res.openTime}:0${res.openTimeMinute}`
      }
    } else {
      if (res.openTime < 10) {
        state.openTime = `0${res.openTime}:${res.openTimeMinute}`
      } else {
        state.openTime = `${res.openTime}:${res.openTimeMinute}`
      }
    }

    if (res.closeTimeMinute < 10) {
      if (res.closeTime < 10) {
        state.closeTime = `0${res.closeTime}:0${res.closeTimeMinute}`
      } else {
        state.closeTime = `${res.closeTime}:0${res.closeTimeMinute}`
      }
    } else {
      if (res.closeTime < 10) {
        state.closeTime = `0${res.closeTime}:${res.closeTimeMinute}`
      } else {
        state.closeTime = `${res.closeTime}:${res.closeTimeMinute}`
      }
    }
  })
}

onMounted(() => {
  getOrgInfoData()
})
</script>

<style lang="scss" scoped>
.view-page {
  display: flex;
  flex-direction: column;

  .view-page-row {
    display: flex;
    margin-bottom: 20px;

    .view-page-item {
      flex: 1;
      display: flex;
      align-items: center;

      .label {
        width: 100px;
        text-align: right;
        color: #666;
      }

      .value {
        flex: 1;
        margin-left: 10px;
        color: #212121;
      }
    }
  }
}
</style>