<template>
  <div class="table-search-container" v-if="search.length > 0">
    <el-form ref="tableSearchRef" :model="state.form" size="default" label-width="100px" class="table-form">
      <div class="table-item" v-for="(item, index) in search" :key="index">
        <div class="top">
          <div class="title">
            {{ item.name }}
            <div class="info">{{ item.tip }}</div>
          </div>
          <div class="del" @click="delForm(index, item)">
            <el-icon>
              <ele-Close />
            </el-icon>
          </div>
        </div>
        <template v-if="item.type !== ''">
          <el-radio-group v-model="form[item.prop[0]]" v-if="item.type === 'radio'">
            <el-radio v-for="(val, key) in item.option" :key="key" :label="val.value">{{ val.label }}</el-radio>
          </el-radio-group>

          <el-button type="primary" text v-if="item.type === 'dialog'" @click="select(item.prop[0])">
            +选择{{ item.name }}
          </el-button>

          <div class="f-ac" v-if="item.type === 'timeRange'">
            <el-select v-model="form[item.prop[0]]" style="margin-right: 10px;">
              <el-option v-for="(val, key) in item.options[0]" :key="key" :label="val.label" :value="val.value">
              </el-option>
            </el-select>
            <el-date-picker v-model="form[item.prop[1]]" type="daterange" value-format="x" style="flex-grow: 0;"
              start-placeholder="开始日期" end-placeholder="结束日期" v-if="form[item.prop[0]] != 2" />
            <el-select v-model="form[item.prop[2]]" style="width: 100px;" v-if="form[item.prop[0]] == 2">
              <el-option v-for="(val, key) in item.options[1]" :key="key" :label="val.label" :value="val.value">
              </el-option>
            </el-select>
            <el-input v-model.number="form[item.prop[3]]" v-if="form[item.prop[0]] == 2"
              style="margin-right: 6px;width: 120px" />
            <span v-if="form[item.prop[0]] == 2">天</span>
          </div>

          <!-- 会员等级 -->
          <template v-if="item.type === 'checkbox'"></template>

          <div class="f-ac" v-if="item.type === 'selectMore'">
            <el-select v-model="form[item.prop[0]]" style="margin-right: 10px;">
              <el-option v-for="(val, key) in item.options[0]" :key="key" :label="val.label" :value="val.value">
              </el-option>
            </el-select>
            <el-select v-model="form[item.prop[1]]">
              <el-option v-for="(val, key) in item.options[1]" :key="key" :label="val.label" :value="val.value">
              </el-option>
            </el-select>
          </div>

          <div class="f-ac" v-if="item.type === 'number'">
            <el-select v-model="form[item.prop[0]]" style="width: 120px;">
              <el-option v-for="(val, key) in compare" :key="key" :label="val.label" :value="val.value">
              </el-option>
            </el-select>
            <el-input-number v-model="form[item.prop[1]]" :min="0" controls-position="right" />
            <span style="margin: 0 6px;">{{ form[item.prop[0]] !== 3 ? item.unit : '到' }}</span>
            <el-input-number v-model="form[item.prop[2]]" :min="0" controls-position="right"
              v-if="form[item.prop[0]] == 3" />
          </div>

          <div class="f-ac" v-if="item.type === 'time'">
            最近
            <el-input v-model="form[item.prop[0]]" placeholder="请输入1~720的数值" style="margin: 0 6px;width: 200px;" />
            天
          </div>

          <el-select v-model="form[item.prop[0]]" v-if="item.type === 'select'">
            <el-option v-for="(val, key) in item.option" :key="key" :label="val.label" :value="val.value">
            </el-option>
          </el-select>

          <div v-if="item.type === 'dialogNumber'">
            <el-button type="primary" text @click="select(item.prop[0])">
              +选择{{ item.name }}
            </el-button>
            <div class="f-ac" style="margin-top: 10px;">
              卡余额：
              <el-select v-model="form[item.prop[1]]" style="width: 120px;">
                <el-option v-for="(val, key) in compare" :key="key" :label="val.label" :value="val.value">
                </el-option>
              </el-select>
              <el-input-number v-model="form[item.prop[2]]" :min="0" controls-position="right" />
              <span style="margin: 0 6px;">{{ form[item.prop[1]] !== 3 ? item.unit : '到' }}</span>
              <el-input-number v-model="form[item.prop[3]]" :min="0" controls-position="right"
                v-if="form[item.prop[1]] == 3" />
            </div>
          </div>

          <div v-if="item.type === 'radioNumber'">
            统计时间：
            <div class="f-ac" style="margin: 8px 0;">
              <el-radio-group v-model="form[item.prop[0]]" style="margin-right: 6px;">
                <el-radio v-for="(val, key) in item.option" :key="key" :label="val.value">{{ val.label }}</el-radio>
              </el-radio-group>
              <el-date-picker v-model="form[item.prop[1]]" type="daterange" value-format="x" style="flex-grow: 0;"
                start-placeholder="开始日期" end-placeholder="结束日期" :disabled="form[item.prop[0]] !== 2" />
            </div>
            {{ item.name }}：
            <div class="f-ac" style="margin-top: 10px;">
              <el-select v-model="form[item.prop[2]]" style="width: 120px;">
                <el-option v-for="(val, key) in compare" :key="key" :label="val.label" :value="val.value">
                </el-option>
              </el-select>
              <el-input-number v-model="form[item.prop[3]]" :min="0" controls-position="right" />
              <span style="margin: 0 6px;">{{ form[item.prop[2]] !== 3 ? item.unit : '到' }}</span>
              <el-input-number v-model="form[item.prop[4]]" :min="0" controls-position="right"
                v-if="form[item.prop[2]] == 3" />
            </div>
          </div>

          <div v-if="item.type === 'selectMultiple'">
            免费会员：
            <div class="f-ac" style="margin: 8px 0;">
              <el-select v-model="form[item.prop[0]]" multiple collapse-tags>
                <el-option v-for="(val, key) in item.options[0]" :key="key" :label="val.label" :value="val.value">
                </el-option>
              </el-select>
            </div>
            注册会员：
            <div class="f-ac" style="margin-top: 8px;">
              <el-select v-model="form[item.prop[1]]" multiple collapse-tags>
                <el-option v-for="(val, key) in item.options[1]" :key="key" :label="val.label" :value="val.value">
                </el-option>
              </el-select>
            </div>
          </div>
        </template>
      </div>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, toRefs } from 'vue'
import type { FormInstance } from 'element-plus'

// 定义父组件传过来的值
const props = defineProps({
  // 搜索表单
  search: {
    type: Array as any,
    default: () => [],
  },
  isShort: {
    type: Boolean,
    default: false,
  }
})

const { search } = toRefs(props)

// 定义子组件向父组件传值/事件
const emit = defineEmits(['del'])

// 定义变量内容
const tableSearchRef = ref<FormInstance>()
const state = reactive({
  form: {} as any,
  compare: [{
    label: '大于',
    value: 1
  }, {
    label: '小于',
    value: 2
  }, {
    label: '区间',
    value: 3
  }]
})

const { form, compare } = toRefs(state)

// 初始化新增的 form 元素，赋予初始值
const initFormField = (btnItem: any) => {
  return new Promise((resolve, reject) => {
    if (props.search.length <= 0) return false
    btnItem.prop.forEach((i: any, index: number) => {
      if (btnItem.default) {
        state.form[i] = btnItem.default[index]
      }
    });
    resolve('')
  });
}

// 删除表单选项
const delForm = (index: number, item: any) => {
  item.prop.forEach((i: any) => {
    delete state.form[i]
  });
  emit('del', index, item)
}

// 获取表单数据
const getFormData = () => {
  return state.form
}

// 打开弹窗
const select = (searchProp: string) => { }

// 页面加载时
onMounted(() => {
  // initFormField()
})

// 暴露变量
defineExpose({
  getFormData,
  delForm,
  initFormField
});
</script>

<style scoped lang="scss">
.table-search-container {
  display: flex;
  padding-bottom: 60px;

  .table-form {
    flex: 1;

    .table-item {
      padding: 15px;
      margin-bottom: 15px;
      border-radius: 4px;
      background-color: #fff;

      .top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 10px;
        color: #343434;
        font-size: 15px;

        .title {
          display: flex;
          align-items: center;

          .info {
            margin-left: 10px;
            font-size: 13px;
            color: #bbb;
          }
        }

        .del {
          cursor: pointer;
        }
      }

      .f-ac {
        display: flex;
        align-items: center;
      }
    }
  }
}
</style>