<template>
  <div v-for="(line, indexP) in processList" :class="[indexP % 2 === 0 ? 'process-r' : 'process-l', indexP === processList.length - 1 ? 'mb0' : '']" :key="indexP">
    <template v-for="(item, indexL) in line" :key="indexL">
      <div class="item">
        <div @click="goto(item.type, item.url)">
          <div class="title">{{ item.title }}</div>
          <div class="content">
            {{ item.content }}
          </div>
        </div>
        <div v-if="(indexL + 1) % 4 === 0 && (indexP + 1) !== processList.length" style="width:100%; cursor: auto; position: relative;">
          <Bottom style="width: 1em; height: 1em; margin:16px 0; color: #a5a7a9; position: absolute; top: 10px; left: 90px" />
        </div>
      </div>
      <Right v-if="indexL !== 3 && indexP % 2 === 0 && indexL !== line.length - 1" style="width: 1em; height: 1em; margin:0 16px; color: #a5a7a9;" />
      <Back v-if="indexL !== 3 && indexP % 2 !== 0 && indexL !== line.length - 1" style="width: 1em; height: 1em; margin:0 16px; color: #a5a7a9;" />
    </template>
  </div>
</template>

<script setup lang="ts">
import { Right, Bottom, Back } from '@element-plus/icons-vue'

interface ProcessItem {
  title: string
  content: string
  type?: string
  url?: string
}

const props = defineProps({
  processList: {
    type: Array as () => ProcessItem[][],
    default: []
  }
})

const goto = (type?: string, url?: string) => {
  if (type === 'anchor') {
    if (url) {
      const targetElement = document.querySelector(url);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth"
        });
      } else {
        console.error(`Element with ID ${url} not found.`);
      }
    }
  } else {

  }
}

</script>

<style scoped lang="scss">
.process-r,
.process-l {
  margin-top: 10px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 40px;
  width: 1044px;

  .item {
    width: 226px;
    height: 69px;
    background-color: #f6f8fa;
    padding: 14px;
    cursor: pointer;

    .title {
      margin-bottom: 4px;
    }

    .content {
      color: #a5a7a9;
      display: flex;
      align-items: center;
    }
  }
}

.process-l {
  flex-direction: row-reverse;
}

.mb0 {
  margin-bottom: 0;
}
</style>