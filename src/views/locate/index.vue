<template>
  <div class="page-container">
    <Nav types="1" />
    <div class="locate-container">
      <detail v-if="shopStatus === 0 || shopStatus === 1 || shopStatus === -1 " :shop-data="shopData" @getShopInfo="getShopInfo" />
      <proof v-else-if="shopStatus === 30 || showProof" @getShopInfo="getShopInfo" />
      <div v-else class="status-tip">
        <i v-if="shopStatus === 50" class="el-icon-success icon success-icon" />
        <i v-else class="el-icon-warning icon info-icon" />
        <div v-if="shopStatus === 10" class="tip-text">
          入驻申请已提交，等待管理员审核
        </div>
        <div v-if="shopStatus === -2" class="tip-text">
          你的转账凭证审核未通过，请根据以下原因修改后再提交审核
          <div class="note">
            {{ shopData.approveNote }}
          </div>
          <div class="btn-wrap">
            <el-button type="primary" @click="showProof= true">前往修改</el-button>
          </div>
        </div>
        <div v-if="shopStatus === 30" class="tip-text">
          恭喜你，你的入驻申请已通过,请尽快缴纳保证金并上传凭证
          <div class="note">
            <p>请将保证金汇到以下收款账号：</p>
            <div class="account-info" v-html="accountInfo" />
          </div>
          <div class="btn-wrap">
            <el-button type="primary" @click="showProof= true">已完成汇款</el-button>
          </div>
        </div>
        <div v-if="shopStatus === 40" class="tip-text">
          已提交保证金凭证，等待管理员审核
        </div>
        <div v-if="shopStatus === 50" class="tip-text">
          恭喜你，你的店铺已经开通
          <div class="btn-wrap">
            <router-link :to="{path: '/'}">
              <el-button type="primary">前往控制台</el-button>
            </router-link>
          </div>
        </div>
      </div>
    </div>
    <div class="w100p">
      <Footer />
    </div>
  </div>
</template>
<script>
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import detail from './components/detail'
import proof from './components/proof'
import { getUserInfo } from '@/api/user'
import { getShopInfo, getParamConfig } from '@/api/base'
export default {
  components: {
    Nav,
    Footer,
    detail,
    proof
  },
  data() {
    return {
      shopStatus: 200,
      shopData: {},
      showProof: false,
      accountInfo: ''
    }
  },
  created() {
    this.getUserInfo()
  },
  methods: {
    getUserInfo() {
      return new Promise((resolve, reject) => {
        getUserInfo().then(data => {
          this.shopStatus = data.shopStatus
          if (data.shopStatus !== 0) {
            this.getShopInfo()
          }
          if (data.shopStatus === 30) {
            this.getParamConfig()
          }
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    },
    getShopInfo() {
      getShopInfo().then(data => {
        this.shopStatus = data.shopProfile.status
        this.shopData = data.shopProfile
      })
    },
    getParamConfig() {
      getParamConfig({
        key: 'EARNEST_MONEY_ACCOUNT'
      }).then(data => {
        this.accountInfo = data.value.split('\n').join('<br/>')
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.page-container {
  .locate-container {
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
  }
  .ruleForm >>> .el-form-item__label {
    font-size: 14px;
    font-weight: normal;
  }
  .w100p {
    width: 100%;
  }
  .status-tip {
    width: 100%;
    margin: 80px 0;
    background-color: #f0f9eb;
    padding: 80px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .icon {
      font-size: 60px;
    }
    .success-icon {
      color: #67c23a;
    }
    .info-icon {
      color: #409eff;
    }
    .warning-icon {
      color: #f56c6c;
    }
    .tip-text {
      margin-top: 40px;
      .note {
        margin-top: 20px;
        background-color: #f6f6f6;
        padding: 20px;
      }
      .btn-wrap {
        text-align: center;
        margin-top: 40px;
      }
    }
    .approve-note {
      color: #f56c6c;
    }
    .account-info {
      line-height: 30px;
    }
  }
}
</style>
