<script setup lang="ts">
import InputText from "primevue/inputtext";
import { useToast } from 'primevue/usetoast';
import Button from "primevue/button"
import FloatLabel from "primevue/floatlabel";
import {useI18n} from "vue-i18n";

import { useSupplierStore } from "@/store/SupplierStore";
const toast = useToast();

const supplierStore = useSupplierStore();
const supplierState = supplierStore.supplierUiState;
const {t} = useI18n();
const handleByStateAction = async () => {
  if (supplierState.isEdit) {
    await handleUpdate()
  } else {
    await handleSave()
  }
}
function successToast(isEdit: boolean) {
  toast.add({
    severity: 'success',
    summary: t('toastOptions.success'),
    detail: isEdit ? t('toastOptions.successUpdate', {entity: t('entityName.supplier')}) : t('toastOptions.successSave', {entity: t('entityName.supplier')}),
    life: 3000
  });
}
const handleUpdate = async () => {
  await supplierStore.updateSupplier()

  if (supplierState.success) {
    successToast(supplierState.isEdit);
    supplierStore.clearForm()
  }
}

const handleSave = async () => {
  await supplierStore.addSupplier()
  if (supplierState.success) {
    successToast(supplierState.isEdit);
    supplierStore.clearForm()
  }
}

const cancelUpdate = () => {
  supplierStore.clearForm()
}
</script>

<template>
  <div class="flex flex-col gap-6">
  <div>
      <label for="name" class="block font-bold mb-3">{{ t('formsGeneric.name') }}</label>
      <InputText
          id="name"
          v-model.trim="supplierState.name"
          required="true"
          autofocus
          fluid
      />
<!--      <small class="text-red-500" v-if="supplierState.nameError">{{ t("errorsGeneric.required", {field: t("formsGeneric.name")}) }}</small>-->
    </div>
    <div>
      <label for="phone" class="block font-bold mb-3">{{ t('formsGeneric.supplier.phone') }}</label>
      <InputText
        id="phone"
        v-model.trim="supplierState.phone"
        required="true"
        fluid
      />
    </div>
    <div>
      <label for="identifierAccount" class="block font-bold mb-3">{{ t('formsGeneric.supplier.idAccount')}}</label>
      <InputText
        id="identifierAccount"
        v-model.trim="supplierState.identifierAccount"
        fluid
      />
    </div>
    <div>
      <label for="idBank" class="block font-bold mb-3">{{ t('formsGeneric.supplier.bank') }}</label>
      <InputText
        id="idBank"
        v-model.trim="supplierState.idBank"
        fluid
      />
    </div>
    <Button :label="t('formsGeneric.cancel')" icon="pi pi-times" text @click="cancelUpdate" />
    <Button
        :label="supplierState.isEdit ? t('formsGeneric.update') : t('formsGeneric.save', {item: t('entityName.product')})"
        icon="pi pi-check"
        @click="handleByStateAction"
        :loading="supplierState.isLoading"
    />
  </div>
</template>

<style scoped>

</style>