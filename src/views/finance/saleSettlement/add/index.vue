<template>
  <div class="page-container layout-padding">
    <Distribution v-if="type === 1" />
    <Consignment v-else-if="type === 2" />
    <Joint v-else-if="type === 3" />
    <PutOn v-else-if="type === 4" />
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, onMounted, reactive, toRefs } from 'vue'
import { useRoute } from 'vue-router';

const Distribution = defineAsyncComponent(
  () => import('./distribution.vue')
)
const Consignment = defineAsyncComponent(
  () => import('./consignment.vue')
)
const Joint = defineAsyncComponent(
  () => import('./joint.vue')
)
const PutOn = defineAsyncComponent(
  () => import('./puton.vue')
)

const state = reactive({
  type: 1,
})

const { type } = toRefs(state)

const route = useRoute()
onMounted(() => {
  const type = route.query.type as unknown as string;
  state.type = parseInt(type);
})

</script>

<style scoped lang="scss">
.card {
  background-color: white;
  padding: 16px;
}

.flex {
  display: flex;
}
</style>