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
  <div class="container">
    <h1>{{ t("viewsGeneric.list", {entity: t("entityName.supplier")}) }}</h1>
    <Button
      :label="t('formsGeneric.new_m', {item: t('entityName.supplier')})"
      icon="pi pi-plus"
      @click="supplierStore.openNewSupplier()"
    />
    <Dialog
        v-model:visible="supplierState.isModalVisible"
        modal
    >
      <section>
        <FormComponent/>
      </section>
    </Dialog>
    <hr>
    <hr>
    <section class="data-section">
      <TableDataComponent :datos="supplierStore.allSuppliers"/>
    </section>
  </div>
</template>

<style scoped>
button {
  padding: 12px;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
}
</style>