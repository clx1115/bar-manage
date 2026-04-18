<template>
  <div class="content">
    <div class="publicize-wrap">
      <div id="publicizeImg" class="publicizeImg">
        <img :src="bgUrl" class="bg">
        <div class="code">
          <img :src="barcodeImgUrl" class="code-img">
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, toRefs, nextTick } from 'vue'
import html2canvas from 'html2canvas'
import { getParameConfigByKey } from '@/api/system/config/index'
import { generateBarcode } from '@/api/member/index'


// 定义变量内容
const state = reactive({
  detail: {} as any,
  barcodeImgUrl: '',
  bgUrl: ''
})

const { detail, bgUrl, barcodeImgUrl } =
  toRefs(state)

// 打开弹窗
const getBarcode = (row: any) => {
  state.detail = row
  state.barcodeImgUrl = row.barcodeImgUrl
  if (!row.barcodeImgUrl) {
    generateBarcode({
      uid: row.id
    }).then((data: any) => {
      state.barcodeImgUrl = data.barcodeImgUrl
      generateImg()
    })
  } else {
    generateImg()
  }
}

const generateImg = () => {
  getParameConfigByKey({
    key: 'PUBLICIZE_BG_IMAGE'
  }).then((data: any) => {
    state.bgUrl = data.value
    nextTick(() => {
      html2canvas(document.getElementById('publicizeImg'), {
        dpi: 300,
        scrollY: 0,
        scrollX: 0,
        useCORS: true, //支持跨域，但好像没什么用
        allowTaint: true, //允许跨域（默认false）
      }).then((canvas: any) => {
        var donw = document.createElement('a')
        donw.href = canvas.toDataURL('image/jpeg', 1)
        donw.download = state.detail.nickName
        donw.click()
      })
    })
  })
}



// 暴露变量
defineExpose({
  getBarcode,
})
</script>
<style lang="scss" scoped>
.content {
  position: relative;
  overflow: hidden;

  .publicize-wrap {
    width: 1350px;
    height: 1480px;
    padding-top: 54px;
    position: absolute;

    // transform: translateX(10000px);
    .publicizeImg {
      width: 1350px;
      height: 1480px;
      position: relative;

      .bg {
        width: 1350px;
        height: 1480px;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
      }


      .code {
        position: absolute;
        top: 528px;
        left: 0;
        width: 100%;
        text-align: center;
        z-index: 2;

        .code-img {
          width: 480px;
          height: 480px;
        }
      }
    }
  }
}
</style>