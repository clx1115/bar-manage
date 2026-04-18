<template>
  <el-drawer v-model="drawerShow" direction="rtl" size="40%">
    <template #header>
      <h4>新建分佣规则</h4>
    </template>
    <template #default>
      <div class="drawer-content">
        <el-form ref="dialogFormRef" :model="ruleForm" :rules="rules" size="default" label-width="82px">
          <el-form-item label="计算基数：">
            成交金额
          </el-form-item>
          <el-form-item label="分佣模式：" prop="type">
            <template v-if="type == 4 || type == 5 || type == 8">
              <el-radio-group v-model="ruleForm.type">
                <el-radio :label="1">销售节点按比率优先抵扣</el-radio>
                <el-radio v-if="type != 8" :label="2">供货节点按成本优先抵扣</el-radio>
              </el-radio-group>
            </template>
            <template v-else-if="type == 6 || type == 7">
              自定义角色分佣
            </template>
          </el-form-item>

          <template v-if="type == 4 || type == 5 || type == 8">
            <el-form-item label="分佣节点：">
              <p>对于交易过程中三个角色分佣；设置销售角色、发货角色、供货角色分别参与分佣的计算规则。</p>
            </el-form-item>
            <div class="second-card">
              <h3>销售：</h3>
              <el-form-item label="分佣比率" prop="commissionRatio" label-width="68px">
                <el-input v-model="ruleForm.commissionRatio" placeholder="请输入" style="width: 200px">
                  <template #append>
                    %
                  </template>
                </el-input>
              </el-form-item>
              <div style="margin-left: 68px;">
                <el-form-item label="顾客关联分佣" prop="relativeRatio" label-width="96px">
                  <el-radio-group v-model="ruleForm.relativeRatio">
                    <el-radio :label="1">无</el-radio>
                    <el-radio :label="2">会员所属店铺</el-radio>
                    <el-radio :label="3">客户所属店铺</el-radio>
                  </el-radio-group>
                </el-form-item>
                <div v-if="ruleForm.relativeRatio == 2">
                  <el-form-item label="会员所属直营店" prop="vipRatio1" label-width="110px" class="ratio-item">
                    <el-input v-model="ruleForm.vipRatio1" placeholder="请输入">
                      <template #append>
                        %
                      </template>
                    </el-input>
                  </el-form-item>
                  <el-form-item label="会员所属加盟店" prop="vipeRatio2" label-width="110px" class="ratio-item">
                    <el-input v-model="ruleForm.vipeRatio2" placeholder="请输入">
                      <template #append>
                        %
                      </template>
                    </el-input>
                  </el-form-item>
                </div>
                <div v-if="ruleForm.relativeRatio == 3">
                  <el-form-item label="客户所属直营店" prop="clienteRatio1" label-width="110px" class="ratio-item">
                    <el-input v-model="ruleForm.serviceChargeRatio1" placeholder="请输入">
                      <template #append>
                        %
                      </template>
                    </el-input>
                  </el-form-item>
                  <el-form-item label="客户所属加盟店" prop="clienteRatio2" label-width="110px" class="ratio-item">
                    <el-input v-model="ruleForm.serviceChargeRatio2" placeholder="请输入">
                      <template #append>
                        %
                      </template>
                    </el-input>
                  </el-form-item>
                </div>
                <el-form-item v-if="type != 8" label="品牌服务费率" prop="serviceChargeRatio" label-width="96px">
                  <el-input v-model="ruleForm.serviceChargeRatio" placeholder="请输入" style="width: 150px">
                    <template #append>
                      %
                    </template>
                  </el-input>
                </el-form-item>
              </div>
            </div>
            <template v-if="type != 8">
              <div class="second-card">
                <h3>发货：</h3>
                <el-form-item label="分佣比率" prop="commissionRatio2" label-width="68px">
                  <el-input v-model="ruleForm.commissionRatio2" placeholder="请输入" style="width: 200px">
                    <template #append>
                      %
                    </template>
                  </el-input>
                </el-form-item>
                <div style="margin-left: 68px;">
                  <el-form-item label="品牌服务费率" prop="serviceChargeRatio2" label-width="96px">
                    <el-input v-model="ruleForm.serviceChargeRatio2" placeholder="请输入" style="width: 150px">
                      <template #append>
                        %
                      </template>
                    </el-input>
                  </el-form-item>
                </div>
              </div>
              <div class="second-card">
                <h3>供货：</h3>
                <template v-if="ruleForm.type == 1">
                  <el-form-item label="分佣比率" prop="commissionRatio3" label-width="68px">
                    <el-input v-model="ruleForm.commissionRatio3" placeholder="请输入" style="width: 200px">
                      <template #append>
                        %
                      </template>
                    </el-input>
                  </el-form-item>
                  <el-form-item label="经营方式" prop="operatingMode" label-width="68px">
                    <el-select style="width: 200px" v-model="ruleForm.operatingMode">
                      <el-option label="佣金模式" :value="1"></el-option>
                    </el-select>
                  </el-form-item>
                </template>
                <template v-else>
                  <div>成本金额</div>
                  <el-form-item label="经营方式" label-width="68px">
                    佣金模式
                  </el-form-item>
                </template>
                <el-form-item label=" " label-width="68px" style="margin-top: -20px;">
                  <p>供货分佣归属的业务单元默认为总部</p>
                </el-form-item>
              </div>
            </template>
          </template>
          <template v-else-if="type == 6 || type == 7">
            <el-form-item label="分佣规则：">
              <el-table :data="ruleList" style="width: 100%" :header-cell-style="{ background: '#f5f7fa' }">
                <el-table-column prop="index" label="序号" width="60" />
                <el-table-column label="角色类型" width="180">
                  <template #default="{ row }">
                    <el-select v-model="row.roleType">
                      <el-option v-for="i in roleTypeList" :key="i.value" :label="i.label" :value="i.value" />
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column prop="ratio" label="比例">
                  <template #default="{ row }">
                    <el-input v-model.number="row.ratio">
                      <template #append>
                        %
                      </template>
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="70">
                  <template #default="{ row }">
                    <el-link type="primary" :underline="false" @click="delRoleType(row)">删除</el-link>
                  </template>
                </el-table-column>
              </el-table>
              <el-link type="primary" :underline="false" @click="addRoleType">+新增角色类型</el-link>
            </el-form-item>
          </template>

          <el-form-item label="参与商品：" prop="goods">
            <el-select style="width: 200px" v-model="ruleForm.goods">
              <el-option label="全部商品" :value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button type="primary" @click="confirmClick">confirm</el-button>
        <el-button @click="cancelClick">cancel</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, reactive, toRefs } from 'vue'

const props = defineProps({
  type: {
    type: Number,
    required: true,
  },
})

const state = reactive({
  drawerShow: false,
  ruleForm: {} as any,
  ruleList: [] as any,
})

const { drawerShow, ruleForm, ruleList } = toRefs(state)

const rules = reactive({

})

const roleTypeList = [
  { label: '总部', value: 1 },
  { label: '销售单元', value: 2 },
  { label: '合伙人', value: 3 },
  { label: '发货单元', value: 4 },
  { label: '会员所属单元', value: 5 },
  { label: '专属导购所属单元', value: 6 },
  { label: '上级邀请店铺', value: 7 },
  { label: '客户所属单元', value: 8 },
]

const addRoleType = () => {
  state.ruleList.push({
    index: state.ruleList.length + 1,
    roleType: 1,
    ratio: 1,
  })
  console.log(state.ruleList)
}

const delRoleType = (row: any) => {
  state.ruleList.splice(row.index - 1, 1)
  state.ruleList.forEach((item: any, index: number) => {
    item.index = index + 1
  })
}

const cancelClick = () => {
  state.drawerShow = false
}

const confirmClick = () => {
  state.drawerShow = false
}

const openDrawer = () => {
  state.drawerShow = true
  state.ruleForm = {
    type: 1,
    relativeRatio: 1
  }
  state.ruleList = [
    {
      index: 1,
      roleType: 1,
      ratio: 1,
    },
  ]
}

defineExpose({
  openDrawer,
})


</script>

<style scoped lang="scss">
.drawer-content {
  padding: 30px 50px;

  p {
    line-height: 20px;
    font-size: 13px;
    color: #999;
  }

  .second-card {
    background-color: #f8f8f8;
    margin-left: 82px;
    padding: 14px;
    margin-bottom: 10px;

    &:nth-child(4) {
      margin-top: -10px;
    }

    h3 {
      font-size: 14px;
    }

    .ratio-item {
      width: 300px;
      margin-bottom: 20px !important;
      margin-left: 96px;
    }
  }
}
</style>