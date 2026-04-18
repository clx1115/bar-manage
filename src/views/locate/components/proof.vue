<template>
  <div class="box">
    <div class="title">提交转账凭证</div>
    <el-form ref="ruleForm" v-loading="loading" :model="ruleForm" :rules="rules" label-width="120px" label-position="left" class="ruleForm">
      <el-form-item label="转账凭证" prop="transferProof">
        <Upload v-model="ruleForm.transferProof" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Upload from '@/components/Upload/singleImage'
import { transferProof } from '@/api/locate'
export default {
  components: {
    Upload
  },
  data() {
    return {
      loading: false,
      ruleForm: {
        transferProof: ''
      },
      rules: {
        transferProof: [
          { required: true, message: '请上传转账凭证', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          transferProof(this.ruleForm).then(data => {
            this.loading = false
            this.$message({
              message: '提交成功',
              type: 'success'
            })
            this.$emit('getShopInfo')
          }).catch(err => {
            console.log(err)
            this.loading = false
          })
        } else {
          return false
        }
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
      color: #F56C6C;
      margin-right: 5px;
    }
  }
}
</style>
