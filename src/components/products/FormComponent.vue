<script setup lang="ts">
import InputText from 'primevue/inputtext';
import Select from 'primevue/select';
import Button from "primevue/button";
import FloatLabel from "primevue/floatlabel";
import {useI18n} from "vue-i18n";
import {useProductStore} from "@/store/ProductStore";

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

const handleUpdate = async () => {
  await productStore.updateProduct()

  if (stateProduct.success) {
    productStore.clearState()
  }
}

const handleSave = async () => {
  await productStore.addProduct()

  if (stateProduct.success) {
    productStore.clearState()
  }
}

const cancelUpdate = () => {
  productStore.clearState()
}
</script>

<template>
  <div class="form-card">
    <div class="form-header">
      <div class="title-wrapper">
        <i :class="stateProduct.isEdit ? 'pi pi-pencil icon-edit' :'pi pi-plus-circle icon-add'"></i>
        <h2> {{ stateProduct.isEdit ? t("formsGeneric.edit", {item: t("entityName.product")}) : t("formsGeneric.new_m", {item: t("entityName.product")}) }} </h2>
      </div>
    </div>

    <div class="form-body">
      <div class="field">
        <FloatLabel>
          <InputText
              id="name"
              v-model="stateProduct.nameProduct"
              class="w-full custom-input"
              :class="{ 'p-invalid:': stateProduct.nameError }"
          />
          <label for="name">{{ t("formsGeneric.name") }}</label>
        </FloatLabel>
        <small v-if="stateProduct.nameError" class="error-msg">
          {{ stateProduct.nameError }}
        </small>
      </div>

      <div class="field">
        <FloatLabel>
          <InputText
              id="name"
              v-model="stateProduct.descriptionProduct"
              class="w-full custom-input"
          />
          <label for="name">{{ t("formsGeneric.description") }}</label>
        </FloatLabel>
      </div>

      <div class="field">
        <FloatLabel>
          <InputText
              id="name"
              v-model="stateProduct.priceProduct"
              class="w-full custom-input"
              :class="{ 'p-invalid:': stateProduct.priceError }"
          />
          <label for="name">{{ t("formsGeneric.product.price") }}</label>
        </FloatLabel>
        <small v-if="stateProduct.priceError" class="error-msg">
          {{ stateProduct.priceError }}
        </small>
      </div>
      <div class="field">
        <FloatLabel>
          <InputText
              id="name"
              v-model="stateProduct.stock"
              class="w-full custom-input"
              :class="{ 'p-invalid:': stateProduct.quantityError }"
          />
          <label for="name">{{ t("formsGeneric.product.qty") }}</label>
        </FloatLabel>
        <small v-if="stateProduct.quantityError" class="error-msg">
          {{ stateProduct.quantityError }}
        </small>
      </div>
      <div class="field">
        <FloatLabel>
          <label for="category">{{ t("entityName.category") }}</label>

          <Select
              v-model="stateProduct.idCategory"
              :options="categoryStore.allCategories"
              optionLabel="nameCategory"
              optionValue="idCategory"
              placeholder="Selecciona una categoría"
              class="w-full md:w-14rem"
              :loading="stateCategory.isLoading"
          />
        </FloatLabel>
        <small v-if="stateProduct.idCategoryError" class="error-msg">
          {{ stateProduct.idCategoryError }}
        </small>
      </div>

      <div class="actions-group">
        <Button
            type="button"
            :label="stateProduct.isEdit ? t('formsGeneric.update') : t('formsGeneric.save', {item: t('entityName.product')})"
            :icon="stateProduct.isLoading ? 'pi pi-spin pi-spinner' : 'pi pi-check'"
            :disabled="stateProduct.isLoading"
            @click="handleByStateAction"
            class="btn-submit w-full"
        />
        <Button
            v-if="stateProduct.isEdit"
            :label="t('formsGeneric.delete')"
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
/* Estructura del Card similar a la tabla */
.form-card {
  max-width: 500px;
  width: 100%;
  margin: 0 auto;
  background: var(--surface-card, #ffffff);
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  border: 1px solid var(--surface-border, #ececec);
}

.form-header {
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f1f1f1;
}

.title-wrapper {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

h2 {
  margin: 0;
  font-size: 1.4rem;
  font-weight: 700;
  color: #4b5563;
}

/* Colores de iconos homologados */
.icon-add {
  color: #d946ef;
  font-size: 1.5rem;
}

/* Magenta */
.icon-edit {
  color: #8b5cf6;
  font-size: 1.5rem;
}

/* Morado */

.form-body {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.field {
  display: flex;
  flex-direction: column;
}

/* Inputs con el toque de la marca */
.custom-input, .custom-textarea {
  border-radius: 8px;
  border: 1px solid #ddd;
  padding: 0.75rem;
}

.custom-input:focus, .custom-textarea:focus {
  border-color: #d946ef !important; /* Magenta al foco */
  box-shadow: 0 0 0 2px rgba(217, 70, 239, 0.1) !important;
}

/* Botones */
.actions-group {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  flex-direction: column;
}

.btn-submit {
  flex: 1;
  background: #d946ef; /* Magenta principal */
  border: none;
  border-radius: 8px;
  font-weight: 600;
  transition: transform 0.2s;
}

.btn-submit:hover {
  background: #c026d3 !important;
  transform: translateY(-1px);
}

.btn-cancel {
  border-radius: 8px;
  color: #6b7280;
}

.error-msg {
  color: #ef4444;
  font-size: 0.8rem;
  margin-top: 0.4rem;
  margin-left: 0.2rem;
}

/* Espaciado extra */
.mt-5 {
  margin-top: 2rem; /* Espacio extra para que el FloatLabel no choque */
}
</style>