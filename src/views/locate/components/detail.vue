<template>
  <div class="box">
    <div class="title">商家入驻</div>
    <div v-if="shopData.status === -1" class="status-tip">
      <i class="el-icon-warning icon" />{{ shopData.approveNote }}
    </div>
    <el-form ref="ruleForm" v-loading="loading" :model="ruleForm" :rules="rules" label-width="120px" label-position="left" class="ruleForm">
      <div class="section">店铺信息</div>
      <el-form-item label="入驻类目" prop="applyCategories">
        <el-select v-model="ruleForm.applyCategories" style="width: 400px" @change="changeCate">
          <el-option v-for="(item, index) in categoryList" :key="index" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="店铺名称" prop="shopName">
        <el-input v-model="ruleForm.shopName" style="width: 400px" />
      </el-form-item>
      <el-form-item label="店铺logo" prop="rectLogo">
        <Upload v-model="ruleForm.rectLogo" />
        <div class="tip">请上传400*400像素的图片,图片不能大于1M</div>
      </el-form-item>
      <el-form-item label="店铺地址" prop="contactAddress">
        <el-input v-model="ruleForm.contactAddress" />
      </el-form-item>
      <el-form-item label="联系人姓名" prop="contactName">
        <el-input v-model="ruleForm.contactName" style="width: 200px" />
      </el-form-item>
      <el-form-item label="联系人手机号码" prop="contactNumber">
        <el-input v-model="ruleForm.contactNumber" style="width: 200px" />
      </el-form-item>
      <div class="section">主体信息</div>
      <el-form-item label="企业名称" prop="companyName">
        <el-input v-model="ruleForm.companyName" style="width: 600px" />
      </el-form-item>
      <el-form-item label="营业执照号码" prop="licenseNumber">
        <el-input v-model="ruleForm.licenseNumber" style="width: 400px" />
      </el-form-item>
      <el-form-item label="营业执照" prop="licenseImg">
        <upload-img v-model="ruleForm.licenseImg" />
      </el-form-item>
      <el-form-item label="企业简介" prop="digest">
        <el-input v-model="ruleForm.digest" type="textarea" :rows="4" />
      </el-form-item>
      <el-form-item>
        <el-button @click="submitForm('ruleForm', 1)">保存</el-button>
        <el-button type="primary" @click="submitForm('ruleForm', 10)">提交审核</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import UploadImg from '@/components/upload/uploadImg.vue'
import { fetchCateList, shopLocate } from '@/api/locate'
export default {
  components: {
    Upload,
    ImageDrag
  },
  props: {
    shopData: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      loading: false,
      categoryList: '',
      imgList: [],
      ruleForm: {
        companyName: '',
        licenseNumber: '',
        licenseImg: '',
        lawName: '',
        lawContactNumber: '',
        idNo: '',
        idCardFront: '',
        idCardBack: '',
        shopName: '',
        contactName: '',
        contactNumber: '',
        contactAddress: '',
        digest: '',
        qualifications: '',
        applyCategories: '',
        applyCategoriesName: '',
        openBank: '',
        openUserName: '',
        openAccountName: '',
        openLicenseImg: '',
        rectLogo: '',
        status: 1
      },
      rules: {
        companyName: [
          { required: true, message: '请填写企业名称', trigger: 'blur' }
        ],
        licenseNumber: [
          { required: true, message: '请填写营业执照号码', trigger: 'blur' }
        ],
        licenseImg: [
          { required: true, message: '请上传营业执照', trigger: 'blur' }
        ],
        digest: [
          { required: true, message: '请填写企业简介', trigger: 'blur' }
        ],
        lawName: [
          { required: true, message: '请填写法人姓名', trigger: 'blur' }
        ],
        lawContactNumber: [
          { required: true, message: '请填写法人手机号码', trigger: 'blur' }
        ],
        idNo: [
          { required: true, message: '请填写法人身份证号码', trigger: 'blur' }
        ],
        idCardFront: [
          { required: true, message: '请上传法人身份证正面', trigger: 'blur' }
        ],
        idCardBack: [
          { required: true, message: '请上传法人身份证背面', trigger: 'blur' }
        ],
        openBank: [
          { required: true, message: '请填写开户银行', trigger: 'blur' }
        ],
        openUserName: [
          { required: true, message: '请填写开户名称', trigger: 'blur' }
        ],
        openAccountName: [
          { required: true, message: '请填写开户账号', trigger: 'blur' }
        ],
        openLicenseImg: [
          { required: true, message: '请上传开户许可证', trigger: 'blur' }
        ],
        shopName: [
          { required: true, message: '请填写店铺名称', trigger: 'blur' }
        ],
        contactName: [
          { required: true, message: '请填写联系人姓名', trigger: 'blur' }
        ],
        contactNumber: [
          { required: true, message: '请填写联系人手机号码', trigger: 'blur' }
        ],
        contactAddress: [
          { required: true, message: '请填写店铺地址', trigger: 'blur' }
        ],
        applyCategories: [
          { required: true, message: '请选择所属类目', trigger: 'blur' }
        ],
        rectLogo: [
          { required: true, message: '请上传店铺logo', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    shopData(e) {
      if (e) {
        this.ruleForm = {
          companyName: e.companyName,
          licenseNumber: e.licenseNumber,
          licenseImg: e.licenseImg,
          lawName: e.lawName,
          lawContactNumber: e.lawContactNumber,
          idNo: e.idNo,
          idCardFront: e.idCardFront,
          idCardBack: e.idCardBack,
          shopName: e.shopName,
          contactName: e.contactName,
          contactNumber: e.contactNumber,
          contactAddress: e.contactAddress,
          digest: e.digest,
          qualifications: e.qualifications ? JSON.parse(e.qualifications) : [],
          applyCategories: +e.applyCategories,
          applyCategoriesName: e.applyCategoriesName,
          openBank: e.openBank,
          openUserName: e.openUserName,
          openAccountName: e.openAccountName,
          openLicenseImg: e.openLicenseImg,
          rectLogo: e.rectLogo
        }
      }
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    changeCate(val) {
      this.ruleForm.applyCategoriesName = val ? this.categoryList.find(item => item.id === val).name : ''
    },
    getCateList() {
      fetchCateList().then(data => {
        this.categoryList = data.list
      })
    },
    submitForm(formName, status) {
      if (status === 10) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.ruleForm.status = 10
            this.shopLocate()
          } else {
            return false
          }
        })
      } else {
        this.ruleForm.status = 1
        this.shopLocate()
      }
    },
    shopLocate() {
      this.loading = true
      shopLocate(this.ruleForm).then(data => {
        this.loading = false
        if (this.ruleForm.status === 10) {
          this.$message({
            message: '提交成功',
            type: 'success'
          })
          this.$emit('getShopInfo')
        } else {
          this.$message({
            message: '保存成功',
            type: 'success'
          })
        }
      }).catch(err => {
        console.log(err)
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.box {
  max-width: 1092px;
  margin: 40px auto;

  .title {
    margin: 40px 0;
    text-align: center;
    font-size: 30px;
    font-weight: 700;
  }

  .section {
    font-size: 18px;
    margin: 20px 0;
  }

  .ruleForm>>>.el-form-item__label {
    font-size: 14px;
    font-weight: normal;
  }

  .tip {
    color: #909399;
  }

  .status-tip {
    width: 100%;
    background-color: #fde2e2;
    padding: 20px;
    font-size: 14px;

    .icon {
      font-size: 20px;
      color: #f56c6c;
      margin-right: 5px;
    }
  }
}
</style>
