<template>
  <div class="">
    <el-form ref="formRef" :model="ruleForm" :rules="rules" size="default" label-width="120px"
      style="margin-bottom: 50px;">
      <div class="tab-title">基础信息</div>
      <el-row style="margin-bottom: 10px">
        <el-col :xs="24" :sm="6" :md="6" :lg="6" :xl="6">
          <el-form-item label="活动名称" prop="name">
            <el-input v-model="ruleForm.name" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :xs="24" :sm="16" :md="16" :lg="16" :xl="16">
          <el-form-item label="活动时间" prop="activityTimeType">
            <el-radio-group v-model="ruleForm.activityTimeType" v-if="planType == '会员日营销'">
              <el-radio :label="1" style="margin-bottom: 10px">
                每月
                <el-select v-model="ruleForm.beginActivityDate" :disabled="ruleForm.activityTimeType !== 1"
                  style="width: 120px;margin: 0 10px 0 22px">
                  <el-option v-for="(val, key) in 31" :key="key" :label="val" :value="val">
                  </el-option>
                </el-select>
                日至
                <el-select v-model="ruleForm.endActivityDate" :disabled="ruleForm.activityTimeType !== 1"
                  style="width: 120px;margin: 0 10px">
                  <el-option v-for="(val, key) in 31" :key="key" :label="val" :value="val">
                  </el-option>
                </el-select>
                日
              </el-radio>
              <el-radio :label="2" style="margin-bottom: 10px">
                每月
                <el-select v-model="ruleForm.beginActivityDate" :disabled="ruleForm.activityTimeType !== 2"
                  style="width: 120px;margin: 0 10px 0 22px">
                  <el-option v-for="(val, key) in 31" :key="key" :label="val" :value="val">
                  </el-option>
                </el-select>
                日
              </el-radio>
              <el-radio :label="3" style="margin-bottom: 10px;">
                每周
                <el-checkbox-group v-model="ruleForm.activityWeek" :disabled="ruleForm.activityTimeType !== 3"
                  class="ml-2">
                  <el-checkbox v-for="item in week" :key="item.value" :label="item.value">{{ item.label }}</el-checkbox>
                </el-checkbox-group>
              </el-radio>
              <el-radio :label="4">
                每日
                <el-time-picker v-model="ruleForm.beginActivityTime" placeholder="开始时间"
                  style="width: 120px;margin: 0 10px 0 22px" :disabled="ruleForm.activityTimeType !== 4" />
                至
                <el-time-picker v-model="ruleForm.endActivityTime" placeholder="结束时间"
                  style="width: 120px;margin: 0 10px" :disabled="ruleForm.activityTimeType !== 4" />
              </el-radio>
            </el-radio-group>
            <el-radio-group v-model="ruleForm.activityTimeType" v-if="planType == '生日营销'">
              <el-radio :label="1">生日当天</el-radio>
              <el-radio :label="2">生日当周</el-radio>
              <el-radio :label="3">生日当月</el-radio>
            </el-radio-group>
            <el-date-picker v-model="ruleForm.activityDate" type="daterange" value-format="x" style="flex-grow: 0;"
              start-placeholder="开始日期" end-placeholder="结束日期" v-if="planType == '节日营销'" />
          </el-form-item>
        </el-col>
      </el-row>
      <div class="tab-title">权益礼包</div>
      <el-row>
        <el-col :xs="24" :sm="24" :md="18" :lg="18" :xl="18">
          <el-form-item label="会员等级规则" prop="levelRule">
            <el-radio-group v-model="ruleForm.levelRule">
              <el-radio :label="1">所有等级会员，同一规则</el-radio>
            </el-radio-group>
            <el-table :data="ruleForm.freeLevelList" header-cell-class-name="header-name"
              v-if="ruleForm.levelRule == 1">
              <el-table-column prop="name" label="会员等级" show-overflow-tooltip width="150">
                <template #default="{ row }">
                  <div style="color: #ff8232">所有等级</div>
                </template>
              </el-table-column>
              <el-table-column prop="freeShip" label="包邮" show-overflow-tooltip min-width="100">
                <template #default="{ row }">
                  <el-checkbox-group v-model="row.freeShip">
                    <el-checkbox :label="true">包邮</el-checkbox>
                  </el-checkbox-group>
                </template>
              </el-table-column>
              <el-table-column prop="consumerDiscount" label="消费折扣" show-overflow-tooltip min-width="100">
                <template #default="{ row }">
                  <el-input v-model="row.consumerDiscount" clearable></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="pointsFeedback" label="积分回馈" show-overflow-tooltip min-width="100">
                <template #default="{ row }">
                  <el-input v-model="row.pointsFeedback" clearable></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="sendPoints" label="送积分" show-overflow-tooltip min-width="100">
                <template #default="{ row }">
                  <el-input v-model="row.sendPoints" clearable></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="sendCoupon" label="送优惠券" show-overflow-tooltip min-width="100">
                <template #default="{ row }">
                  <el-button type="primary" text>设置优惠券</el-button>
                </template>
              </el-table-column>
              <el-table-column prop="status" label="状态" show-overflow-tooltip min-width="100">
                <template #default="{ row }">
                  {{ row.status ? '已开启' : '已关闭' }}
                </template>
              </el-table-column>
              <el-table-column label="操作" width="100">
                <template #default="{ row }">
                  <el-button type="primary" text @click="row.status = !row.status">{{ row.status ? '关闭' : '开启'
                    }}</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-radio-group v-model="ruleForm.levelRule">
              <el-radio :label="2">不同等级会员，不同规则</el-radio>
            </el-radio-group>
            <el-table :data="ruleForm.vipLevelList" header-cell-class-name="header-name" v-if="ruleForm.levelRule == 2">
              <el-table-column prop="name" label="会员等级" show-overflow-tooltip width="150">
                <template #default="{ row }">
                  <div style="color: #ff8232">{{ row.levelName }}</div>
                </template>
              </el-table-column>
              <el-table-column prop="freeShip" label="包邮" show-overflow-tooltip min-width="100">
                <template #default="{ row }">
                  <el-checkbox-group v-model="row.freeShip">
                    <el-checkbox :label="true">包邮</el-checkbox>
                  </el-checkbox-group>
                </template>
              </el-table-column>
              <el-table-column prop="consumerDiscount" label="消费折扣" show-overflow-tooltip min-width="100">
                <template #default="{ row }">
                  <el-input v-model="row.consumerDiscount" clearable></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="pointsFeedback" label="积分回馈" show-overflow-tooltip min-width="100">
                <template #default="{ row }">
                  <el-input v-model="row.pointsFeedback" clearable></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="sendPoints" label="送积分" show-overflow-tooltip min-width="100">
                <template #default="{ row }">
                  <el-input v-model="row.sendPoints" clearable></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="sendCoupon" label="送优惠券" show-overflow-tooltip min-width="100">
                <template #default="{ row }">
                  <el-button type="primary" text>设置优惠券</el-button>
                </template>
              </el-table-column>
              <el-table-column prop="status" label="状态" show-overflow-tooltip min-width="100">
                <template #default="{ row }">
                  {{ row.status ? '已开启' : '已关闭' }}
                </template>
              </el-table-column>
              <el-table-column label="操作" width="100">
                <template #default="{ row }">
                  <el-button type="primary" text @click="row.status = !row.status">{{ row.status ? '关闭' : '开启'
                    }}</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="margin-top: 10px;">
        <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="16">
          <el-form-item label="奖励到账时间" prop="paymentTime">
            <div style="display: flex">
              活动
              <el-select v-model="ruleForm.paymentTimeType" style="width: 100px;margin: 0 5px">
                <el-option v-for="(val, key) in compare" :key="key" :label="val.label" :value="val.value">
                </el-option>
              </el-select>
              <el-time-select v-model="ruleForm.paymentTime" start="07:00" end="19:00" placeholder="选择时间"
                style="width: 150px;margin: 0 5px">
              </el-time-select>
              进行发放
            </div>
            <div class="info">积分、优惠券的发放时间、其他权益将在活动时间内进行生效</div>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="tab-title">通知配置</div>
      <el-row>
        <el-col :xs="24" :sm="24" :md="24" :lg="13" :xl="13">
          <el-form-item label="通知渠道" prop="noticeChannel">
            <el-row :class="['channel-box', { show: channelFlag }]" :gutter="10">
              <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" v-for="(item, index) in channel" :key="index">
                <div class="channel-item">
                  <el-checkbox-group v-model="ruleForm.noticeChannel">
                    <el-checkbox :label="item.value" :disabled="item.disable || false">
                      {{ item.title }}
                      <span class="tip" v-if="item.tip">{{ item.tip }}</span>
                    </el-checkbox>
                  </el-checkbox-group>
                  <div class="info ml-2 channel-info">
                    {{ item.info }}
                    <router-link :to="item.link" v-if="item.info1">
                      <span>{{ item.info1 }}</span>
                    </router-link>
                    <span v-if="item.info2">{{ item.info2 }}</span>
                  </div>
                  <div :class="['setting', { point: !item.disable }]" @click="handleSet(item.val)">
                    <div style="font-size: 20px" v-if="!item.disable">+</div>
                    <div>{{ item.setTip }}</div>
                    <router-link :to="item.setLink" v-if="item.disable">
                      <el-button type="primary" text>
                        {{ item.value == 5 ? '去查看' : '去绑定' }}
                      </el-button>
                    </router-link>
                  </div>
                </div>
              </el-col>
            </el-row>
            <el-button type="primary" text @click="channelFlag = !channelFlag">
              {{ channelFlag ? '收起' : '展开' }}
            </el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="16">
          <el-form-item label="通知时间" prop="grantTime">
            <div style="display: flex">
              活动
              <el-select v-model="ruleForm.grantTimeType" style="width: 100px;margin: 0 5px">
                <el-option v-for="(val, key) in compare" :key="key" :label="val.label" :value="val.value">
                </el-option>
              </el-select>
              <el-time-select v-model="ruleForm.grantTime" start="07:00" end="19:00" placeholder="选择时间"
                style="width: 150px;margin: 0 5px">
              </el-time-select>
              进行通知
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :xs="24" :sm="20" :md="9" :lg="9" :xl="9">
          <el-form-item label="通知规则" prop="noticeRule">
            <div class="info" style="color: #f1bb5f">同一个客户近7天只能收到一条人群运营的微信模版消息通知</div>
            <el-radio-group v-model="ruleForm.noticeRule">
              <el-radio :label="1">仅一个渠道通知</el-radio>
            </el-radio-group>
            <div class="info ml-2">同一个客户仅通过优先级最高的渠道通知，可更改排序</div>
            <el-table :data="ruleForm.noticeRuleList" header-cell-class-name="header-name"
              v-if="ruleForm.noticeRule == 1">
              <el-table-column type="index" label="通知优先级" show-overflow-tooltip width="100"></el-table-column>
              <el-table-column prop="name" label="通知渠道" show-overflow-tooltip min-width="100"></el-table-column>
              <el-table-column fixed="right" align="right" label="操作" min-width="100">
                <template #default="{ $index }">
                  <el-form>
                    <el-button size="small" text type="primary" @click="onMove($index, 'top')">上移</el-button>
                    <el-button size="small" text type="primary" @click="onMove($index, 'bottom')">下移</el-button>
                  </el-form>
                </template>
              </el-table-column>
            </el-table>
            <el-radio-group v-model="ruleForm.noticeRule">
              <el-radio :label="2">所有渠道同步通知</el-radio>
            </el-radio-group>
            <div class="info ml-2">同一个客户每个渠道通知一遍，有可能会骚扰客户，请慎用</div>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="tab-title">计划异常提醒</div>
      <el-row>
        <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="16">
          <div style="margin-left: 52px">在计划即将到期、权益库存不足和短信条数不足的情况下提醒</div>
          <el-form-item label="提醒方式" prop="reminderMethod">
            <el-checkbox-group v-model="ruleForm.reminderMethod">
              <el-checkbox :label="1">通过App推送通知我</el-checkbox>
            </el-checkbox-group>
            <el-checkbox-group v-model="ruleForm.reminderMethod">
              <el-checkbox :label="2">通过短信通知我</el-checkbox>
            </el-checkbox-group>
            <div class="ml-2" style="display: flex">
              接收通知的手机号：
              <el-input v-model="ruleForm.phone" style="width: 200px;"
                :disabled="!ruleForm.reminderMethod || ruleForm.reminderMethod.indexOf(2) == -1"></el-input>
              <div class="info">请注意，短信通知将扣除店铺短信的条数</div>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="bottom submit-box">
      <el-button type="primary" @click="onSubmit" :loading="loading">{{ submitTxt }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, reactive, toRefs, ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElForm } from 'element-plus';
// import { getIcCardDetail, addIcCard, updateIcCard } from '@/api/member/ic/index';
// import { getMemberList } from '@/api/member/index';
import mittBus from '@/utils/mitt';
import { format } from 'path';

const props = defineProps({
  isEidt: {
    type: Boolean,
    default: false,
  },
});

// 定义变量内容
const route = useRoute();
const router = useRouter();
const formRef = ref(ElForm);
const state = reactive({
  loading: false,
  ruleForm: {} as any,
  rules: {
    name: [{ required: true, trigger: 'blur', message: '请填写计划名称' }],
  },
  planType: '' as any,
  type: '' as any,
  submitTxt: '',
  list: [] as any,
  freeLevelList: [{
    status: true
  }],
  vipLevelList: [{
    levelName: 'vip1',
    status: true
  }],
  week: [{
    label: '周一',
    value: 1
  }, {
    label: '周二',
    value: 2
  }, {
    label: '周三',
    value: 3
  }, {
    label: '周四',
    value: 4
  }, {
    label: '周五',
    value: 5
  }, {
    label: '周六',
    value: 6
  }, {
    label: '周日',
    value: 7
  }],
  compare: [{
    label: '前2天',
    value: 1
  }, {
    label: '前1天',
    value: 2
  }, {
    label: '当天',
    value: 3
  }],
  channelFlag: false,
  channel: [{
    value: 1,
    title: '小程序订阅消息',
    tip: null,
    disable: true,
    info: '用户需按次订阅，订阅后才可发送消息，详情查看',
    info1: '《小程序模版消息能力调整通知》',
    link: '',
    setLink: '',
    setTip: '未绑定微信小程序'
  }, {
    value: 2,
    title: '短信通知',
    tip: '（推荐，通知成功率≥80%）',
    disable: false,
    info: '扣除店铺短信条数，为了发送成功，请确保在',
    info1: '消息推送',
    info2: '中设置了自定义签名',
    link: '',
    setLink: '',
    setTip: '配置短信通知'
  }, {
    value: 3,
    title: '收银消息',
    tip: null,
    disable: true,
    info: '在收银机展示消息，由收银员向客户口播，确保100%触达到店客户',
    link: '',
    setLink: '',
    setTip: '未绑定收银机'
  }, {
    value: 4,
    title: '公众号图文消息',
    tip: '建议搭配短信使用',
    disable: true,
    info: '图文消息只对有互动行为的粉丝生效，无举报风险',
    link: '',
    setLink: '',
    setTip: '未绑定认证的公众号，无法推送消息'
  }, {
    value: 5,
    title: '微信模版消息',
    tip: null,
    disable: true,
    info: '根据',
    info1: '《微信公众平台运营规范》',
    info2: '，频繁发送营销类模版消息存在被封禁的风险',
    link: '',
    setLink: '',
    setTip: '微信规范模版消息服务，不支持通过模版消息发送营销类通知'
  }, {
    value: 6,
    title: '企业微信消息',
    tip: null,
    disable: true,
    info: '由企业微信员工向已添加的好友发送消息，请确保店铺客户数据已与企微助手打通',
    link: '',
    setLink: '',
    setTip: '未绑定企业微信助手，无法选择该渠道'
  }] as any
});

const { loading, ruleForm, rules, submitTxt, week, channelFlag, channel, planType, compare } = toRefs(state);

// 获取详情
const getDetailData = () => {
  state.planType = router.currentRoute.value.query.type;
  if (props.isEidt) {
    state.type = 'edit';
    state.submitTxt = '修改活动';
    const id = router.currentRoute.value.query.id;
    // getIcCardDetail({
    //   id,
    // }).then((res: any) => {
    //   state.ruleForm = {
    //     id: res.id,
    //     name: '',
    //     freeLevelList: [],
    //     activityTimeType: 1,
    //     beginActivityDate: '',
    //     endActivityDate: '',
    //     activityWeek: [],
    //     beginActivityTime: [],
    //     endActivityTime: [],
    //     activityDate: [],
    //     levelRule: 1,
    //     vipLevelList: [],
    //     paymentTimeType: 2,
    //     paymentTime: '07:00',
    //     noticeChannel: [],
    //     noticeRule: 1,
    //     noticeRuleList: [],
    //     reminderMethod: [],
    //     phone: '',
    //     grantTimeType: 3,
    //     grantTime: '07:00',
    //   };
    // });
  } else {
    state.type = 'add';
    state.submitTxt = '创建活动';
    state.ruleForm = {
      name: '',
      freeLevelList: [],
      activityTimeType: 1,
      beginActivityDate: '',
      endActivityDate: '',
      activityWeek: [],
      beginActivityTime: [],
      endActivityTime: [],
      activityDate: [],
      levelRule: 1,
      vipLevelList: [],
      paymentTimeType: 2,
      paymentTime: '07:00',
      noticeChannel: [],
      noticeRule: 1,
      noticeRuleList: [],
      reminderMethod: [],
      phone: '',
      grantTimeType: 3,
      grantTime: '07:00',
    };
  }
};

// 选择人群
const selectGroup = () => { }

// 添加手机号
const addCustomPhone = () => { }

// 选择优惠券
const selectCoupon = () => { }

// 配置通知渠道
const handleSet = (val: any) => { }

// 移动列表
const onMove = (index: any, type: string) => { }

// 提交
const onSubmit = () => {
  const ruleForm = JSON.parse(JSON.stringify(state.ruleForm));
  formRef.value.validate((valid: boolean) => {
    if (valid) {
      state.loading = true;
      // if (state.type === 'add') {
      // 	addIcCard(ruleForm)
      // 		.then(() => {
      // 			state.loading = false;
      // 			router.push('/member/tag/index');
      // 			closeCurrentTagsView();
      // 		})
      // 		.catch(() => {
      // 			state.loading = false;
      // 		});
      // } else {
      // 	updateIcCard(ruleForm)
      // 		.then(() => {
      // 			state.loading = false;
      // 			router.push('/member/tag/index');
      // 			closeCurrentTagsView();
      // 		})
      // 		.catch(() => {
      // 			state.loading = false;
      // 		});
      // }
    } else {
      return false;
    }
  });
};

// 关闭当前 tagsView
const closeCurrentTagsView = () => {
  mittBus.emit('onCurrentContextmenuClick', Object.assign({}, { contextMenuClickId: 1, ...route }));
};

// 页面加载时
onMounted(() => {
  getDetailData();
});
</script>
<style scoped lang="scss">
.f-ac {
  display: flex;
  align-items: center;
}

.tab-title {
  padding-bottom: 15px;
  margin-bottom: 20px;
  font-size: 15px;
  font-weight: 700;
  color: #343434;
  border-bottom: 1px solid #ccc;
}

.info {
  margin: 10px 0 14px 0;
  line-height: 1;
  font-size: 12px;
  color: #999;
}

.ml-2 {
  margin-left: 22px;
}

:deep(.el-form-item__content) {
  flex-direction: column;
  align-items: flex-start;
}

:deep(.el-radio-group) {
  flex-direction: column;
  align-items: flex-start;
}

:deep(.el-radio__label) {
  display: flex;
  align-items: center;
}

:deep(.header-name) {
  width: 100%;
  background-color: #f7f7f7 !important;
}

.channel-box {
  flex-wrap: nowrap;
  overflow: hidden;
  width: 100%;

  &.show {
    flex-wrap: wrap;
  }

  .channel-item {
    padding: 10px 15px !important;
    margin-bottom: 10px;
    border: 1px solid #ccc;

    .tip {
      font-size: 12px;
      color: #54a24f;
    }

    .channel-info {
      margin: 0 0 5px 22px;
      line-height: 20px;
    }

    .setting {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: calc(100% - 24px);
      height: 150px;
      padding: 15px;
      margin-left: 22px;
      text-align: center;
      border: 1px dashed #ddd;
      background-color: #f6f6f6;

      &.point {
        cursor: pointer;
      }
    }
  }
}

.submit-box {
  z-index: 1;
}
</style>