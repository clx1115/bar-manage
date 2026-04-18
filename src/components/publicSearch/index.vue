<template>
  <div class="table-search-container" v-if="props.search.length > 0">
    <el-form ref="tableSearchRef" :model="state.form" size="default" label-width="100px" class="table-form">
      <el-row>
        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" class="mb20" v-for="(val, key) in search" :key="key" v-show="key <= 1 || state.isToggle">
          <template v-if="val.type !== ''">
            <el-form-item :label="val.label" :prop="val.prop" :label-width="val.labelWidth">
              <el-input v-model="state.form[val.prop]" :placeholder="val.placeholder" clearable v-if="val.type === 'input'" style="width: 100%" />
              <el-date-picker v-model="state.form[val.prop]" :type="val.dataType" :placeholder="val.placeholder" v-else-if="val.type === 'dataPicker'" style="width: 100%" value-format="x" />
              <el-date-picker v-model="state.form[val.prop]" type="daterange" :start-placeholder="val.startPlaceholder" :end-placeholder="val.endPlaceholder" v-else-if="val.type === 'daterange'" value-format="x" style="width: 100%" :shortcuts="val.shortcuts" />
              <el-select v-model="state.form[val.prop]" :placeholder="val.placeholder" v-else-if="val.type === 'select'" style="width: 100%" clearable filterable>
                <el-option v-for="item in val.options" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
              <el-radio-group v-else-if="val.type === 'radio'" v-model="state.form[val.prop]">
                <el-radio v-for="item in val.options" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
              </el-radio-group>
              <template v-else-if="val.type === 'range'">
                <el-input v-model.number="state.form[val.prop[0]]" style="width: 46%;margin-right: 3%;" :placeholder="val.placeholder[0]" />
                <span style="width: 2%;">-</span>
                <el-input v-model.number="state.form[val.prop[1]]" style="width: 46%;margin-left: 3%;" :placeholder="val.placeholder[1]" />
              </template>
            </el-form-item>
          </template>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" class="mb20">
          <el-form-item class="table-form-btn" :label-width="search.length <= 1 ? '10px' : '100px'">
            <template #label v-if="search.length > 1 && !isShort">
              <div class="table-form-btn-toggle ml10" @click="state.isToggle = !state.isToggle">
                <span>{{ state.isToggle ? '收筛选' : '展筛选' }}</span>
                <SvgIcon :name="state.isToggle ? 'ele-ArrowUp' : 'ele-ArrowDown'" />
              </div>
            </template>
            <el-button size="default" type="primary" @click="onSearch(tableSearchRef)">
              <el-icon>
                <ele-Search />
              </el-icon>
              查询
            </el-button>
            <el-button size="default" @click="onReset(tableSearchRef)">
              <el-icon>
                <ele-Refresh />
              </el-icon>
              重置
            </el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
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
  },
  isToggle: {
    type: Boolean,
    default: false,
  },
})

// 定义子组件向父组件传值/事件
const emit = defineEmits(['search'])

// 定义变量内容
const tableSearchRef = ref<FormInstance>()
const state = reactive({
  form: {} as any,
  isToggle: props.isToggle,
})

// 查询
const onSearch = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid: boolean) => {
    if (valid) {
      emit('search', state.form)
    } else {
      return false
    }
  })
}
// 重置
const onReset = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  emit('search', state.form)
}
// 初始化 form 字段，取自父组件 search.prop
const initFormField = () => {
  if (props.search.length <= 0) return false
  props.search.forEach((v: any) => (state.form[v.prop] = v.default || ''))
}
// 页面加载时
onMounted(() => {
  initFormField()
})
</script>

<style scoped lang="scss">
.table-search-container {
  display: flex;

  .table-form {
    flex: 1;

    .table-form-btn-toggle {
      white-space: nowrap;
      user-select: none;
      display: flex;
      align-items: center;
      color: var(--el-color-primary);
    }
  }
}
</style>
