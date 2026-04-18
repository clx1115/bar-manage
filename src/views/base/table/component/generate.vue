<template>
  <div class="content">
    <div class="table-wrap">
      <div id="tableImg" class="tableImg">
        <img :src="bgUrl" class="bg">
        <div class="table-no">
          {{ detail.tableNo }}
        </div>
        <div class="code">
          <img :src="detail.url" class="code-img">
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, toRefs, nextTick } from 'vue'
import html2canvas from 'html2canvas'
import { getParameConfigByKey } from '@/api/system/config/index'



// 定义变量内容
const state = reactive({
  detail: {} as any,
  bgUrl: ''
})

const { detail, bgUrl } =
  toRefs(state)

// 打开弹窗
const generateImg = (row: any) => {
  state.detail = row
  getParameConfigByKey({
    key: 'TABLE_BG_IMAGE'
  }).then((data: any) => {
    state.bgUrl = data.value
    nextTick(() => {
      html2canvas(document.getElementById('tableImg'), {
        dpi: 300,
        scrollY: 0,
        scrollX: 0,
        useCORS: true, //支持跨域，但好像没什么用
        allowTaint: true, //允许跨域（默认false）
      }).then((canvas: any) => {
        var donw = document.createElement('a')
        donw.href = canvas.toDataURL('image/jpeg', 1)
        donw.download = state.detail.shopName + state.detail.tableNo + '号桌'
        donw.click()
      })
    })
  })
}


// 暴露变量
defineExpose({
  generateImg,
})
</script>
<style lang="scss" scoped>
.content {
  position: relative;
  overflow: hidden;

  .table-wrap {
    width: 1004px;
    height: 1417px;
    padding-top: 54px;
    position: absolute;

    // transform: translateX(10000px);
    .tableImg {
      width: 1004px;
      height: 1417px;
      position: relative;

      .bg {
        width: 1004px;
        height: 1417px;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
      }

      .table-no {
        position: absolute;
        top: 402px;
        left: 0;
        width: 100%;
        text-align: center;
        height: 120px;
        font-family: 'PingFangSC-Semibold', 'PingFang SC';
        font-size: 88px;
        color: #000000;
        line-height: 120px;
        font-weight: 700;
        z-index: 2;
      }

      .code {
        position: absolute;
        top: 569px;
        left: 0;
        width: 100%;
        text-align: center;
        z-index: 2;

        .code-img {
          width: 520px;
          height: 520px;
        }
      }
    }
  }
}
</style>