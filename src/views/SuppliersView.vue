<script setup lang="ts">
import {onMounted, onUnmounted, watch} from "vue";
import {useSupplierStore} from "@/store/SupplierStore";
import TableDataComponent from "@/components/suppliers/TableDataComponent.vue";
import FormComponent from "@/components/suppliers/FormComponent.vue";
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'

const supplierStore = useSupplierStore()
const supplierState = supplierStore.supplierUiState

watch(() => supplierState.success, (isSuccess) => {
  if (isSuccess) {
    supplierStore.clearForm()
  }
})

onMounted(() => {
  supplierStore.getAllSuppliers()
})

onUnmounted(() => {
  supplierStore.clear()
})
</script>

<template>
  <div class="container">
    <h1>Lista de Proveedores</h1>
    <Button
      label="Nuevo Proveedor"
      icon="pi pi-plus"
      @click="supplierStore.openNewSupplier()"
    />
    <Dialog
        v-model:visible="supplierState.isModalVisible"
        modal
        :header="supplierState.isEdit ? 'Editar Proveedor' : 'Nuevo Proveedor'"
    >
      <section class="form-section">
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