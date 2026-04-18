<template>
  <el-form ref="formRef" :model="formData" size="default" label-width="100px" class="form-container">
    <el-form-item label="商品分销规则">
      <div class="json-box">
        <div class="top">
          <el-button v-if="isDealerAward" type="danger" @click="onSetDealerAward('close')" size="default">关闭</el-button>
          <el-button v-else type="primary" @click="onSetDealerAward('open')" size="default">开启</el-button>
        </div>
        <el-table v-if="isDealerAward" :data="formData.dealerAwardJson" style="width: 540px;">
          <el-table-column label="等级名称" width="180">
            <template #default="{ row }">
              {{ row.levelName }}
            </template>
          </el-table-column>
          <el-table-column label="直推奖励比例" width="180">
            <template #default="{ row }">
              <el-space>
                <el-input v-model="row.directAwardPercentage" style="width: 120px;" placeholder="直推奖励比例"></el-input>%
              </el-space>
            </template>
          </el-table-column>
          <el-table-column label="间推奖励比例" width="180">
            <template #default="{ row }">
              <el-space>
                <el-input v-model="row.indirectAwardPercentage" style="width: 120px;" placeholder="间推奖励比例"></el-input>%
              </el-space>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { reactive, toRefs, onMounted, watch } from 'vue'
import {
  getDealerLevelList
} from '@/api/distribution/dealerLevel/index'

const props = defineProps({
  detailData: {
    type: Object,
    default: Object,
  }
})

// 定义变量内容
const state = reactive({
  dealerLevelList: [],
  isDealerAward: false,
  formData: {
    dealerAwardJson: '',
  } as any,
})
const { isDealerAward, formData } = toRefs(state)

watch(
  () => props.detailData,
  (newValue: any) => {
    if (newValue) {
      initFormData(newValue)
    }
  }
)

// 获取商品分类列表
const getDealerLevelListData = () => {
  getDealerLevelList().then((data: any) => {
    state.dealerLevelList = data.list
  })
}


const onSetDealerAward = (type: string) => {
  if (type === 'open') {
    state.formData.dealerAwardJson = state.dealerLevelList.map((item: any) => {
      return {
        dealerLevel: item.level,
        levelName: item.levelName,
        directAwardPercentage: '',
        indirectAwardPercentage: ''
      }
    })
    state.isDealerAward = true
  } else {
    state.formData.dealerAwardJson = []
    state.isDealerAward = false
  }
}

const initFormData = (val: any) => {
  const dealerAwardJson = val.dealerAwardJson ? JSON.parse(val.dealerAwardJson) : []
  state.isDealerAward = dealerAwardJson.length ? true : false
  if (dealerAwardJson.length) {
    state.dealerLevelList.forEach((item: any) => {
      const existIndex = dealerAwardJson.findIndex((discount: any) => {
        return discount.dealerLevel === item.level
      })
      if (existIndex === -1) {
        dealerAwardJson.push({
          dealerLevel: item.level,
          levelName: item.levelName,
          directAwardPercentage: item.directAwardPercentage,
          indirectAwardPercentage: item.indirectAwardPercentage
        })
      }
    })
  }
  state.formData = {
    dealerAwardJson: dealerAwardJson
  }
  if (dealerAwardJson.length) {
    state.isDealerAward = true
  } else {
    state.isDealerAward = false
  }
}

//子传父
const transmit = () => {
  return state.formData
}
// 页面加载时
onMounted(() => {
  getDealerLevelListData()
})

defineExpose({
  transmit,
})
</script>
<style lang="scss" scoped>
.json-box {
  width: 100%;
  display: flex;
  flex-direction: column;

  .top {
    margin-bottom: 10px;
  }
}
</style>
