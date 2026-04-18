<template>
  <div class="detail-container">
    <el-form ref="formRef" :model="ruleForm" :rules="rules" size="default" label-width="150px">
      <el-col :xs="24" :sm="18" :md="18" :lg="18" :xl="18" class="mb20">
        <el-row :gutter="35">
          <el-col :xs="24" :sm="10" :md="10" :lg="10" :xl="10" class="mb20">
            <el-form-item label="标签组名称" prop="name">
              <el-input v-model="ruleForm.name" clearable placeholder="最多可输入15个字符" :maxlength="15"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="16" :md="16" :lg="16" :xl="16" class="mb20">
            <el-form-item label="添加规则" prop="ruleType">
              <el-radio-group v-model="ruleForm.ruleType">
                <el-radio :label="1">仅可添加一个标签</el-radio>
              </el-radio-group>
              <div class="info">在此标签组内，一个客户仅能被添加一个标签</div>
              <el-radio-group v-model="ruleForm.ruleType">
                <el-radio :label="2">可添加多个标签</el-radio>
              </el-radio-group>
              <div class="info">在此标签组内，一个客户可同时添加多个标签</div>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="22" :md="22" :lg="22" :xl="22" class="mb20">
            <el-form-item label="打标方式" prop="markMethod">
              <el-checkbox-group v-model="ruleForm.markMethod">
                <el-checkbox :label="1">手动打标</el-checkbox>
              </el-checkbox-group>
              <div class="info">通过客户导入、手动设置、营销活动主动添加</div>
              <el-checkbox-group v-model="ruleForm.markMethod">
                <el-checkbox :label="2">自动打标</el-checkbox>
              </el-checkbox-group>
              <div class="info">自动为满足规则的客户添加标签（标签创建前满足条件的客户，将在创建次日凌晨完成打标）</div>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="22" :md="22" :lg="22" :xl="22" class="mb20">
            <el-form-item label="设置标签" prop="tags">
              <el-table :data="ruleForm.tags" v-loading="loading" style="width: 100%"
                header-cell-class-name="header-name">
                <el-table-column type="index" label="序号" width="80"></el-table-column>
                <el-table-column prop="name" label="标签名" show-overflow-tooltip width="200">
                  <template #default="{ row }">
                    <el-input v-model="row.name" placeholder="最多可输入7个字" :maxlength="14"></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="status" label="状态" show-overflow-tooltip width="100">
                  <template #default="{ row }">
                    {{ row.status == 1 ? '启用中' : '禁用中' }}
                  </template>
                </el-table-column>
                <el-table-column prop="markRule" label="自动打标" width="150">
                  <template #default="{ row, $index }">
                    <el-button size="small" text type="primary" @click="onRuleDialog(row, $index)">添加规则</el-button>
                  </template>
                </el-table-column>
                <el-table-column prop="autoDel" label="自动删除" width="120">
                  <template #default="{ row }">
                    <el-switch v-model="row.autoDel"></el-switch>
                  </template>
                </el-table-column>
                <el-table-column fixed="right" align="right" label="操作" min-width="200">
                  <template #default="{ row, $index }">
                    <el-form>
                      <el-button size="small" text type="primary" @click="row.status = !row.status">{{ row.status == 1 ?
                        '禁用' : '启用' }}</el-button>
                      <el-button size="small" text type="primary" @click="delTag($index)">删除</el-button>
                    </el-form>
                  </template>
                </el-table-column>
              </el-table>
              <el-button plain @click="onAddTag" style="margin-top: 10px">添加</el-button>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item>
              <el-button type="primary" @click="onSubmit" :loading="loading">{{ submitTxt }}</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-col>
    </el-form>
    <tagGroupDialog ref="tagGroupDialogRef" @refresh="addRule" />
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, reactive, toRefs, ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElForm } from 'element-plus';
// import { getIcCardDetail, addIcCard, updateIcCard } from '@/api/member/ic/index';
import mittBus from '@/utils/mitt';

const props = defineProps({
  isEidt: {
    type: Boolean,
    default: false,
  },
});

// 引入组件
const tagGroupDialog = defineAsyncComponent(
  () => import('./tagGroupDialog.vue')
)

// 定义变量内容
const route = useRoute();
const router = useRouter();
const tagGroupDialogRef = ref();
const formRef = ref(ElForm);
const state = reactive({
  loading: false,
  ruleForm: {} as any,
  rules: {
    name: [{ required: true, trigger: 'blur', message: '请填写标签名称' }],
  },
  type: '',
  submitTxt: '',
  list: [] as any,
  index: 0,
});

const { loading, ruleForm, rules, submitTxt } = toRefs(state);

// 获取详情
const getDetailData = () => {
  if (props.isEidt) {
    state.type = 'edit';
    state.submitTxt = '修改';
    const id = router.currentRoute.value.query.id;
    // getIcCardDetail({
    //   id,
    // }).then((res: any) => {
    //   state.ruleForm = {
    //     id: res.id,
    //     name: res.name,
    //     ruleType: res.ruleType,
    //     markMethod: res.markMethod,
    //     tags: res.tags,
    //   };
    // });
  } else {
    state.type = 'add';
    state.submitTxt = '保存';
    state.ruleForm = {
      name: '',
      ruleType: 1,
      markMethod: [],
      tags: [],
    };
  }
};

// 添加规则
const onRuleDialog = (row: any, index: any) => {
  state.index = index
  tagGroupDialogRef.value.openDialog(row)
}

// 弹窗返回
const addRule = (row: any) => {
  state.ruleForm.tags[state.index].markRule = row
}

// 删除标签
const delTag = (index: any) => {
  state.ruleForm.tags.splice(index, 1)
}

// 添加标签
const onAddTag = () => {
  let tag = {
    name: '',
    status: 1,
    markRule: {},
    autoDel: false
  }
  state.ruleForm.tags.push(tag)
}

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
.info {
  margin-left: 22px;
  margin-bottom: 14px;
  line-height: 1;
  font-size: 12px;
  color: #999;
}

.f-ac {
  display: flex;
  align-items: center;
}

:deep(.el-form-item__content) {
  flex-direction: column;
  align-items: flex-start;
}

:deep(.header-name) {
  background-color: #f7f7f7 !important;
}
</style>