<script setup lang="ts">
import InputText from "primevue/inputtext";
import Button from "primevue/button"
import FloatLabel from "primevue/floatlabel";

import { useSupplierStore } from "@/store/SupplierStore";

const supplierStore = useSupplierStore();
const supplierState = supplierStore.supplierUiState;

const handleByStateAction = async () => {
  if (supplierState.isEdit) {
    await handleUpdate()
  } else {
    await handleSave()
  }
}

const handleUpdate = async () => {
  await supplierStore.updateSupplier()

  if (supplierState.success) {
    supplierStore.clearForm()
  }
}

const handleSave = async () => {
  await supplierStore.addSupplier()
  if (supplierState.success) {
    supplierStore.clearForm()
  }
}

const cancelUpdate = () => {
  supplierStore.clearForm()
}
</script>

<template>
  <div class="form-card">
    <div class="form-header">
      <div class="title-wrapper">
        <i :class="supplierState.isEdit ? 'pi pi-pencil icon-edit' : 'pi pi-plus-circle icon-add'"></i>
        <h2>{{supplierState.isEdit ? 'Editar Proveedor' : 'Nuevo Proveedor'}}</h2>
      </div>
    </div>

    <div class="form-body">
      <div class="field">
        <FloatLabel>
          <InputText
            id="name"
            v-model="supplierState.name"
            class="w-full custom-input"
            :class="{ 'p-invalid': supplierState.nameError }"
          />
          <label for="name">Nombre del Proveedor</label>
        </FloatLabel>
        <small class="error-msg" v-if="supplierState.nameError">{{supplierState.nameError}}</small>
      </div>
      <div class="field">
        <FloatLabel>
          <InputText
            id="phone"
            v-model="supplierState.phone"
            class="w-full custom-input"
            :class="{ 'p-invalid': supplierState.phoneError }"
          />
          <label for="phone">Teléfono del Proveedor</label>
        </FloatLabel>
        <small class="error-msg" v-if="supplierState.phoneError">{{supplierState.phoneError}}</small>
      </div>
      <div class="field">
        <FloatLabel>
          <InputText
            id="identifierAccount"
            v-model="supplierState.identifierAccount"
            class="w-full custom-input"
            :class="{ 'p-invalid': supplierState.identifierAccountError }"
          />
          <label for="identifierAccount">Nombre del Proveedor</label>
        </FloatLabel>
        <small class="error-msg" v-if="supplierState.identifierAccountError">{{supplierState.identifierAccountError}}</small>
      </div>
      <div class="field">
        <FloatLabel>
          <InputText
            id="idBank"
            v-model="supplierState.idBank"
            class="w-full custom-input"
            :class="{ 'p-invalid': supplierState.idBankError }"
          />
          <label for="idBank">Nombre del Proveedor</label>
        </FloatLabel>
        <small class="error-msg" v-if="supplierState.idBankError">{{supplierState.idBankError}}</small>
      </div>

      <div class="actions-group">
        <Button
            type="button"
            :label="supplierState.isEdit ? 'Actualizar' : 'Crear Proveedor'"
            :icon="supplierState.isLoading ? 'pi pi-spin pi-spinner' : 'pi pi-check'"
            :disabled="supplierState.isLoading"
            @click="handleByStateAction"
            class="btn-submit w-full"
        />
        <Button
            v-if="supplierState.isEdit"
            label="Cancelar"
            icon="pi pi-times"
            severity="secondary"
            text
            @click="cancelUpdate"
            class="w-full mt-2"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>