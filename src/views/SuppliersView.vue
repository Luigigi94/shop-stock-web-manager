<script setup lang="ts">
import {onMounted, onUnmounted, watch} from "vue";
import {useSupplierStore} from "@/store/SupplierStore";
import TableDataComponent from "@/components/suppliers/TableDataComponent.vue";
import FormComponent from "@/components/suppliers/FormComponent.vue";
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import {useI18n} from "vue-i18n";

const supplierStore = useSupplierStore()
const supplierState = supplierStore.supplierUiState
const {t} = useI18n()

watch(() => supplierState.success, (isSuccess) => {
  if (isSuccess) {
    supplierStore.clearForm()
  }
})

onMounted(() => {
  supplierStore.getAllSuppliers()
  console.log("onMounted value allSuppliers: "+supplierStore.allSuppliers.toString())
})

onUnmounted(() => {
  supplierStore.clear()
})
</script>

<template>
  <Dialog
      v-model:visible="supplierState.isModalVisible" :style="{ width: '450px' }" header="Supplier Details" :modal="true">
    <section>
      <FormComponent/>
    </section>
  </Dialog>
  <section>
    <TableDataComponent :datos="supplierStore.allSuppliers"/>
  </section>
</template>

<style scoped>
/*button {
  padding: 12px;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
}*/
</style>