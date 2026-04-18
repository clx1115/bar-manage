<template>
  <div v-if="isEdit===false">
    <el-row :gutter="35">
      <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
        <el-form-item>
          <el-col :xs="10" :sm="10" :md="10" :lg="10" :xl="10">
            前置图片1：
          </el-col>
          <el-col :xs="14" :sm="14" :md="14" :lg="14" :xl="14">
            <img :src="info.prependImg1" class="image">
          </el-col>
        </el-form-item>
      </el-col>

      <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
        <el-form-item >
          <el-col :xs="10" :sm="10" :md="10" :lg="10" :xl="10">
            后置图片1：
          </el-col>
          <el-col :xs="14" :sm="14" :md="14" :lg="14" :xl="14">
            <img :src="info.appendImg1" class="image">
          </el-col>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="35">
      <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
        <el-form-item >
          <el-col :xs="10" :sm="10" :md="10" :lg="10" :xl="10">
            前置图片2：
          </el-col>
          <el-col :xs="14" :sm="14" :md="14" :lg="14" :xl="14">
            <img :src="info.prependImg2" class="image">
          </el-col>
        </el-form-item>
      </el-col>

      <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
        <el-form-item >
          <el-col :xs="10" :sm="10" :md="10" :lg="10" :xl="10">
            后置图片2：
          </el-col>
          <el-col :xs="14" :sm="14" :md="14" :lg="14" :xl="14">
            <img :src="info.appendImg2" class="image">
          </el-col>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="35">
      <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
        <el-form-item >
          <el-col :xs="10" :sm="10" :md="10" :lg="10" :xl="10">
            前置图片3：
          </el-col>
          <el-col :xs="14" :sm="14" :md="14" :lg="14" :xl="14">
            <img :src="info.prependImg3" class="image">
          </el-col>
        </el-form-item>
      </el-col>

      <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
        <el-form-item >
          <el-col :xs="10" :sm="10" :md="10" :lg="10" :xl="10">
            后置图片3：
          </el-col>
          <el-col :xs="14" :sm="14" :md="14" :lg="14" :xl="14">
            <img :src="info.appendImg3" class="image">
          </el-col>
        </el-form-item>
      </el-col>
    </el-row>
    <el-button @click="changeEdit">编辑</el-button>
  </div>
  <div v-if="isEdit===true">
    <el-row :gutter="35">
      <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
        <el-form-item>
          <el-col :xs="10" :sm="10" :md="10" :lg="10" :xl="10">
            前置图片1：
          </el-col>
          <el-col :xs="14" :sm="14" :md="14" :lg="14" :xl="14">
            <upload-img v-model="submitData.prependImg1" />

          </el-col>
        </el-form-item>
      </el-col>

      <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
        <el-form-item >
          <el-col :xs="10" :sm="10" :md="10" :lg="10" :xl="10">
            后置图片1：
          </el-col>
          <el-col :xs="14" :sm="14" :md="14" :lg="14" :xl="14">
            <upload-img v-model="submitData.appendImg1" />

          </el-col>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="35">
      <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
        <el-form-item >
          <el-col :xs="10" :sm="10" :md="10" :lg="10" :xl="10">
            前置图片2：
          </el-col>
          <el-col :xs="14" :sm="14" :md="14" :lg="14" :xl="14">
            <upload-img v-model="submitData.prependImg2" />

          </el-col>
        </el-form-item>
      </el-col>

      <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
        <el-form-item >
          <el-col :xs="10" :sm="10" :md="10" :lg="10" :xl="10">
            后置图片2：
          </el-col>
          <el-col :xs="14" :sm="14" :md="14" :lg="14" :xl="14">
            <upload-img v-model="submitData.appendImg2" />

          </el-col>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="35">
      <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
        <el-form-item >
          <el-col :xs="10" :sm="10" :md="10" :lg="10" :xl="10">
            前置图片3：
          </el-col>
          <el-col :xs="14" :sm="14" :md="14" :lg="14" :xl="14">
            <upload-img v-model="submitData.prependImg3" />

          </el-col>
        </el-form-item>
      </el-col>

      <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
        <el-form-item >
          <el-col :xs="10" :sm="10" :md="10" :lg="10" :xl="10">
            后置图片3：
          </el-col>
          <el-col :xs="14" :sm="14" :md="14" :lg="14" :xl="14">
            <upload-img v-model="submitData.appendImg3" />

          </el-col>
        </el-form-item>
      </el-col>
    </el-row>
    <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
        <el-button @click="changeEdit">取消</el-button>
        <el-button @click="submit">提交</el-button>
      </el-col>
  </div>
</template>
<script setup lang="ts">
import { defineProps,toRefs,reactive } from 'vue'
import {setProductImg} from '@/api/system/setting/index'
import { ElMessage, ElMessageBox } from 'element-plus'
import UploadImg from '@/components/upload/uploadImg.vue'


const props = defineProps({
  info: {} as any,
})

// 定义变量
const state = reactive({
  isEdit:false,
  submitData:{} as any,
  loading:false
})
const {info} = toRefs(props)
const {isEdit,submitData} = toRefs(state)
//改变编辑状态
const changeEdit=()=>{
  state.isEdit=!state.isEdit;
  let {prependImg1,prependImg2,prependImg3,appendImg1,appendImg2,appendImg3} = info.value
  state.submitData={prependImg1,prependImg2,prependImg3,appendImg1,appendImg2,appendImg3}
  console.log(state.submitData)
}
// 提交信息
const submit = ()=>{
  state.loading=true
  setProductImg({
    ...submitData
  }).then(()=>{
    state.loading=false;
    ElMessage.success('上传成功')

  })
}

</script>