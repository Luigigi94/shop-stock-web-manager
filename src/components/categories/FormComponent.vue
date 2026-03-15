<script setup lang="ts">
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Button from 'primevue/button';
import FloatLabel from 'primevue/floatlabel';
import {useCategoryStore} from "@/store/CategoryStore";
import {useI18n} from "vue-i18n";
import { useToast } from 'primevue/usetoast';

const toast = useToast();
const categoryStore = useCategoryStore();
const stateCategory = categoryStore.categoryUiState
const {t} = useI18n();

function successToast(isEdit: boolean) {
  toast.add({
    severity: 'success',
    summary: t('toastOptions.success'),
    detail: isEdit ? t('toastOptions.successUpdate', {entity: t('entityName.category')}) : t('toastOptions.successSave', {entity: t('entityName.category')}),
    life: 3000
  });
}

const handleByStateAction = async () => {
  if (stateCategory.isEdit) {
    await handleUpdate()
  } else {
    await handleSave()
  }
}

const handleUpdate = async () => {
  await categoryStore.updateCategory()

  if (stateCategory.success){
    successToast(stateCategory.isEdit);
    categoryStore.clearForm()
  }
}

const handleSave = async () => {
  await categoryStore.addCategory()

  if (stateCategory.success) {
    successToast(stateCategory.isEdit);
    categoryStore.clearForm()
  }
}

const cancelUpdate = () => {
  categoryStore.clearForm()
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <div>
      <label for="name" class="block font-bold mb-3">{{t("formsGeneric.name")}}</label>
      <InputText  id="name"  v-model.trim="stateCategory.nameCategory" required="true" autofocus :invalid="stateCategory.nameTouched && !stateCategory.nameCategory" fluid/>
      <small v-if="stateCategory.nameTouched && !stateCategory.nameCategory" class="text-red-500">{{ t("errorsGeneric.required", {field: t("formsGeneric.name")}) }}</small>
    </div>
    <div>
      <label for="description" class="block font-bold mb-3">{{ t("formsGeneric.description") }}</label>
      <InputText id="description" v-model.trim="stateCategory.descriptionCategory" required="false" fluid />
    </div>
    <Button :label="t('formsGeneric.cancel')" icon="pi pi-times" text @click="cancelUpdate" />
    <Button
        :label="stateCategory.isEdit ? t('formsGeneric.update') : t('formsGeneric.save', {item: t('entityName.category')})"
        icon="pi pi-check"
        @click="handleByStateAction"
        :loading="stateCategory.isLoading"
    />
  </div>
</template>

<style scoped>

</style>