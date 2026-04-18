<template>
  <div class="page-container layout-pd">
    <div class="steps">
      <div class="step">
        <div class="fix" :class="{ 'fix-active': step === 1 }"></div>
        <div class="content" :class="{ 'content-active': step === 1 }">1.编辑基本信息</div>
        <div class="right" :class="{ 'right-active': step === 1 }"></div>
      </div>
      <div class="step step2">
        <div class="left" :class="{ 'left-active': step === 2 }"></div>
        <div class="content" :class="{ 'content-active': step === 2 }">2.编辑销售渠道</div>
        <div class="right" :class="{ 'right-active': step === 2 }"></div>
      </div>
      <div class="step step3">
        <div class="left" :class="{ 'left-active': step === 3 }"></div>
        <div class="content" :class="{ 'content-active': step === 3 }">3.配置可售店铺</div>
        <div class="fix" :class="{ 'fix-active': step === 3 }"></div>
      </div>
    </div>
    <div ref="resizeRef"></div>
    <div style="margin-bottom: 60px; background-color: white; padding: 20px">
      <Base v-if="step === 1" />
    </div>
    <div class="bottom" ref="bottomRef">
      <el-button type="primary">保存并编辑销售渠道</el-button>
    </div>
  </div>
</template>

<script setup lang="ts" name="productAdd">
import { reactive, toRefs, ref, onMounted, onBeforeUnmount, defineAsyncComponent } from 'vue'

const Base = defineAsyncComponent(() => import('./base.vue'))

const state = reactive({
  step: 1,
})

const { step } = toRefs(state)

const resizeRef = ref()
const bottomRef = ref()
let resizeObserver: any = null
const openMonitor = () => {
  //获取监听元素 id class ref
  const target = resizeRef.value
  // 创建 ResizeObserver 实例
  resizeObserver = new ResizeObserver(entries => {
    // entries 是一个 ResizeObserverEntry 对象数组，包含目标元素的信息
    entries.forEach(item => {
      const { width } = item.contentRect;
      //获取 监听元素的宽高
      console.log('Width', width)
      resizeBottom(width)
    })
  });

  // 开始监听目标元素的大小变化
  resizeObserver.observe(target);
}

const resizeBottom = (w: number) => {
  bottomRef.value.style.width = (w + 30) + 'px'
}

onMounted(() => {
  openMonitor()
})

onBeforeUnmount(() => {
  resizeObserver.disconnect();
})

</script>

<style scoped lang="scss">
.steps {
  display: flex;
  margin-bottom: 10px;

  .step {
    flex: 0 0 calc(33.33% + 6px);
    display: flex;

    .fix {
      width: 16px;
      background-color: white;
    }

    .fix-active {
      background-color: var(--el-color-primary);
    }

    .left {
      width: 0;
      height: 0;
      border-left: 16px solid transparent;
      border-top: 23px solid white;
      border-bottom: 23px solid white;
    }

    .left-active {
      border-top: 23px solid var(--el-color-primary);
      border-bottom: 23px solid var(--el-color-primary);
    }

    .content {
      width: 96%;
      height: 46px;
      background-color: white;
      text-align: center;
      line-height: 46px;
    }

    .content-active {
      background-color: var(--el-color-primary);
      color: white;
    }

    .right {
      width: 0;
      height: 0;
      border-top: 23px solid transparent;
      border-bottom: 23px solid transparent;
      border-left: 16px solid white;
    }

    .right-active {
      border-left: 16px solid var(--el-color-primary);
    }
  }

  .step2 {
    position: relative;
    left: -9px;
  }

  .step3 {
    position: relative;
    left: -18px;
  }

}

.bottom {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  z-index: 999;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 60px;
  background-color: white;
  box-shadow: 0 -1px 3px rgba(0, 0, 0, 0.12);
}
</style>
