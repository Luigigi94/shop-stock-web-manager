<script setup lang="ts">
import InputText from 'primevue/inputtext';
import {FileUpload} from "primevue";
import { useToast } from 'primevue/usetoast';
import { ref } from 'vue';
import Select from 'primevue/select';
import Button from "primevue/button";
import {useI18n} from "vue-i18n";
import {useProductStore} from "@/store/ProductStore";

const toast = useToast();
const fileUpload = ref();

const productStore = useProductStore();
const stateProduct = productStore.productUiState;
const {t} = useI18n();

import {useCategoryStore} from "@/store/CategoryStore";

const categoryStore = useCategoryStore();
const stateCategory = categoryStore.categoryUiState;

const handleByStateAction = async () => {
  if (stateProduct.isEdit) {
    await handleUpdate()
  } else {
    await handleSave()
  }
}

function successToast(isEdit: boolean) {
  toast.add({
    severity: 'success',
    summary: t('toastOptions.success'),
    detail: isEdit ? t('toastOptions.successUpdate', {entity: t('entityName.product')}) : t('toastOptions.successSave', {entity: t('entityName.product')}),
    life: 3000
  });
}

const handleUpdate = async () => {
  await productStore.updateProduct()

  if (stateProduct.success) {
    successToast(stateProduct.isEdit);
    productStore.clearState()
    fileUpload.value?.clear();
  }
}

const handleSave = async () => {
  await productStore.addProduct()

  if (stateProduct.success) {
    successToast(stateProduct.isEdit);
    productStore.clearState()
    fileUpload.value?.clear();
  }
}

const cancelUpdate = () => {
  // productDialog.value = false;
  stateProduct.isModalVisible = false
  productStore.clearState()
}
function onUpload() {
  toast.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000 });
}

const onClearInternal = () => {
  fileUpload.value.clear();
  stateProduct.fileToUpload = null;
  console.log("Imagen eliminada y contador reseteado");
};
const onSelect = (event: any) => {
  // Manejo de archivo único
  if (fileUpload.value.files.length > 1) {
    fileUpload.value.files.shift();
  }
  // CONEXIÓN: Guardamos el archivo seleccionado en el UiState del store
  stateProduct.fileToUpload = event.files[0];
};
</script>

<template>
  <div class="flex flex-col gap-6">
    <img
        v-if="stateProduct.isEdit && stateProduct.imageProduct"
        :src="stateProduct.imageProduct"
        :alt="stateProduct.nameProduct ?? 'product-image'"
        class="block m-auto pb-4 rounded-lg shadow-md object-cover border-2 border-magenta"
        style="width: 300px; height: 300px;"
    />
    <div>
      <label for="name" class="block font-bold mb-3">{{ t("formsGeneric.name") }}</label>
      <InputText id="name" v-model.trim="stateProduct.nameProduct" required="true" autofocus :invalid="stateProduct.nameTouched && !stateProduct.nameProduct" fluid />
      <small v-if="stateProduct.nameTouched && !stateProduct.nameProduct" class="text-red-500">{{ t("errorsGeneric.required", {field: t("formsGeneric.name")}) }}</small>
    </div>
    <div>
      <label for="description" class="block font-bold mb-3">{{ t("formsGeneric.description") }}</label>
      <InputText id="description" v-model.trim="stateProduct.descriptionProduct" required="false" fluid />
    </div>
    <div>
      <div class="font-semibold text-xl mb-3">{{ t("formsGeneric.product.img") }}</div>
      <FileUpload name="productImg" ref="fileUpload" accept="image/*" :maxFileSize="2000000" customUpload :multiple="false" @clear="onClearInternal" @select="onSelect">
        <template #empty>
          <p>Arrastra una imagen o haz clic para seleccionar.</p>
        </template>
      </FileUpload>
    </div>
    <div class="grid grid-cols-12 gap-4">
      <div class="col-span-6">
        <label for="price" class="block font-bold mb-3">{{ t("formsGeneric.product.price") }}</label>
        <InputText id="price" v-model.trim="stateProduct.priceProduct" required="true" autofocus :invalid="stateProduct.priceTouched && !stateProduct.priceProduct" fluid />
        <small v-if="stateProduct.priceTouched && !stateProduct.priceProduct" class="text-red-500">{{ t("errorsGeneric.required", {field: t("formsGeneric.product.price")}) }}</small>
      </div>
      <div class="col-span-6">
        <label for="quantity" class="block font-bold mb-3">{{ t("formsGeneric.product.qty") }}</label>
        <InputText id="quantity" v-model.trim="stateProduct.stock" required="true" autofocus :invalid="stateProduct.quantityTouched && !stateProduct.stock" fluid />
        <small v-if="stateProduct.quantityTouched && !stateProduct.stock" class="text-red-500">{{ t("errorsGeneric.required", {field: t("formsGeneric.product.qty")}) }}</small>
      </div>
    </div>
    <div>
      <label for="categoryName" class="block font-bold mb-3">{{ t("entityName.category") }}</label>
      <Select
          id="categoryName"
          v-model="stateProduct.idCategory"
          :options="categoryStore.allCategories"
          optionLabel="nameCategory"
          optionValue="idCategory"
          :placeholder="t('formsGeneric.product.selectCategory', {entity: t('entityName.category')})"
          class="w-full md:w-14rem"
          :loading="stateCategory.isLoading"
      />
    </div>

    <Button :label="t('formsGeneric.cancel')" icon="pi pi-times" text @click="cancelUpdate" />
    <Button
        :label="stateProduct.isEdit ? t('formsGeneric.update') : t('formsGeneric.save', {item: t('entityName.product')})"
        icon="pi pi-check"
        @click="handleByStateAction"
        :loading="stateProduct.isLoading"
    />
  </div>
</template>

<style scoped>
:deep(.p-fileupload-upload-button) {
  display: none !important;
}

:deep(.p-fileupload-basic) {
  justify-content: center;
}
</style>