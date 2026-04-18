<template>
  <div class="detail-container">
    <el-form ref="formRef" :model="ruleForm" :rules="rules" size="default" label-width="150px">
      <el-row :gutter="35">
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
          <el-form-item label="LOGO" prop="rectLogo">
            <upload-img v-model="ruleForm.rectLogo" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
          <el-form-item label="店铺名称" prop="name">
            <el-input v-model="ruleForm.name" placeholder="请输入店铺名称" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
          <el-form-item label="简介" prop="description">
            <el-input v-model="ruleForm.description" type="textarea" placeholder="请输入简介"></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
          <el-form-item label="营业时间" prop="status">
            <el-space>
              <el-time-select v-model="openTime" start="06:00" step="00:15" end="24:00" placeholder="营业开始时间" />
              <el-time-select v-model="closeTime" start="06:00" step="00:15" end="24:00" placeholder="营业结束时间" />
            </el-space>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
          <el-form-item label="店铺状态" prop="status">
            <el-radio-group v-model="ruleForm.status">
              <el-radio :label="1">开业</el-radio>
              <el-radio :label="2">歇业</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="8" :md="8" :lg="8" :xl="8" class="mb20">
          <el-form-item label="请输入联系人" prop="contactName">
            <el-input v-model="ruleForm.contactName" placeholder="请输入联系人" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="8" :md="8" :lg="8" :xl="8" class="mb20">
          <el-form-item label="联系电话" prop="contactNumber">
            <el-input v-model="ruleForm.contactNumber" placeholder="请输入联系电话" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
          <el-form-item label="联系人地址" prop="contactAddress">
            <el-input v-model="ruleForm.contactAddress" placeholder="请输入店铺地址" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="8" :md="8" :lg="8" :xl="8" class="mb20">
          <el-form-item label="经度" prop="lat">
            <el-input v-model="ruleForm.lat" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="8" :md="8" :lg="8" :xl="8" class="mb20">
          <el-form-item label="纬度" prop="lon">
            <el-input v-model="ruleForm.lon" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="8" :md="8" :lg="8" :xl="8" class="mb20">
          <el-form-item label-width="0">
            <el-button type="primary" @click="onOpenMap">
              <svg-icon name="svg-location" />
              地图定位
            </el-button>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
          <el-form-item>
            <el-button type="primary" @click="onSubmit" :loading="loading">{{ submitTxt }}</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <tmap ref="tmapRef" @onChange="updateAddress" />
  </div>
</template>

<script setup lang="ts">
import { reactive, toRefs, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElForm } from 'element-plus'
import uploadImg from '@/components/upload/uploadImg.vue'
import { getShopDetail, addShop, updateShop } from '@/api/shop/index'
import tmap from '@/components/tmap/index.vue'
import mittBus from '@/utils/mitt'
import { centerLatLng } from '@/config'

const props = defineProps({
  isEidt: {
    type: Boolean,
    default: false,
  },
})

// 定义变量内容
function validatePhone(rule: any, value: any, callback: any) {
  if (!value) {
    callback(new Error('联系手机号码不能为空'))
  } else {
    const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
    if (reg.test(value)) {
      callback()
    } else {
      callback(new Error('请填写正确的手机号码'))
    }
  }
}
const route = useRoute()
const router = useRouter()
const formRef = ref(ElForm)
const tmapRef = ref()
const state = reactive({
  loading: false,
  categoryList: [
    {
      status: '1',
      name: '开业',
    },
    {
      status: '2',
      name: '未开业',
    },
  ],
  openTime: '',
  closeTime: '',
  ruleForm: {} as any,
  rules: {
    name: [{ required: true, trigger: 'blur', message: '请填写店铺名称' }],
    contactName: [{ required: true, trigger: 'blur', message: '请填写联系人' }],
    contactNumber: [
      { required: true, trigger: 'blur', validator: validatePhone },
    ]
  },
  type: '',
  submitTxt: '',
})

const { loading, ruleForm, rules, submitTxt, openTime, closeTime } = toRefs(state)

// 获取详情
const getDetailData = () => {
  if (props.isEidt) {
    state.type = 'edit'
    state.submitTxt = '修 改'
    const shopId = router.currentRoute.value.query.shopId
    getShopDetail({
      id: shopId,
    }).then((res) => {
      state.ruleForm = {
        id: res.id,
        name: res.name,
        status: res.status,
        contactName: res.contactName,
        contactNumber: res.contactNumber,
        contactAddress: res.contactAddress,
        lat: res.lat,
        lon: res.lon,
        description: res.description,
        openTime: '',
        closeTime: '',
        rectLogo: res.rectLogo
      }
      //判断返回分钟
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
  } else {
    state.type = 'add'
    state.submitTxt = '新 增'
    state.ruleForm = {
      name: '',
      status: 1,
      contactName: '',
      contactNumber: '',
      contactAddress: '',
      lat: '',
      lon: '',
      description: '',
      rectLogo: ''
    }
  }
}

//打开地图弹窗
const onOpenMap = () => {
  const latitude = state.ruleForm.lat || centerLatLng.lat
  const longitude = state.ruleForm.lon || centerLatLng.lng
  tmapRef.value.openDialog(latitude, longitude, state.ruleForm.contactAddress)
}


//更新地址信息
const updateAddress = (val: any) => {
  state.ruleForm.contactAddress = val.address
  state.ruleForm.lat = val.latitude
  state.ruleForm.lon = val.lngitude
}

// 提交
const onSubmit = () => {
  //时间格式
  let open = state.openTime.toString()
  state.ruleForm.openTimeMinute = open.slice(3)
  state.ruleForm.openTime = open.slice(0, 2)
  let close = state.closeTime.toString()
  state.ruleForm.closeTimeMinute = close.slice(3)
  state.ruleForm.closeTime = close.slice(0, 2)
  const ruleForm = JSON.parse(JSON.stringify(state.ruleForm))
  formRef.value.validate((valid: boolean) => {
    if (valid) {
      state.loading = true
      if (state.type === 'add') {
        addShop(ruleForm)
          .then(() => {
            state.loading = false
            router.push('/shop/index')
            closeCurrentTagsView()
          })
          .catch(() => {
            state.loading = false
          })
      } else {
        updateShop(ruleForm)
          .then(() => {
            state.loading = false
            router.push('/shop/index')
            closeCurrentTagsView()
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

// 关闭当前 tagsView
const closeCurrentTagsView = () => {
  mittBus.emit(
    'onCurrentContextmenuClick',
    Object.assign({}, { contextMenuClickId: 1, ...route })
  )
}

// 页面加载时
onMounted(() => {
  getDetailData()
})
</script>
