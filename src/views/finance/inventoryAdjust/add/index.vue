<template>
  <div class="page-container layout-padding">
    <div class="card">
      <SwitchSupStock v-if="type === 1" />
      <SwitchSupReceipt v-else-if="type === 2" />
      <PurchasePrice v-else />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, onMounted, reactive, toRefs } from 'vue'
import { useRoute } from 'vue-router';

const SwitchSupStock = defineAsyncComponent(
  () => import('./switchSupStock.vue')
)
const SwitchSupReceipt = defineAsyncComponent(
  () => import('./switchSupReceipt.vue')
)
const PurchasePrice = defineAsyncComponent(
  () => import('./purchasePrice.vue')
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