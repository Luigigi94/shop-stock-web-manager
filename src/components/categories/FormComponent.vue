<script setup lang="ts">
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Button from 'primevue/button';
import FloatLabel from 'primevue/floatlabel';
import i18n from "@/i18n";
import {useCategoryStore} from "@/store/CategoryStore";
import {useI18n} from "vue-i18n";

const categoryStore = useCategoryStore();
const stateCategory = categoryStore.categoryUiState
const {t} = useI18n();

const handleByStateAction = async () => {
  if (stateCategory.isEdit) {
    await handleUpdate()
  } else {
    await handleSave()
  }
}

const handleUpdate = async () => {
  await categoryStore.updateCategory()

  if (stateCategory.success) {
    stateCategory.idCategory = ""
    stateCategory.nameCategory = ""
    stateCategory.descriptionCategory = ""
    stateCategory.isEdit = false
  }
}

const handleSave = async () => {
  await categoryStore.addCategory()

  if (stateCategory.success) {
    stateCategory.nameCategory = ""
    stateCategory.descriptionCategory = ""
    stateCategory.isEdit = false
  }
}

const cancelUpdate = () => {
  categoryStore.clearForm()
}
</script>

<template>
  <div class="form-card">
    <div class="form-header">
      <div class="title-wrapper">
        <i :class="stateCategory.isEdit ? 'pi pi-pencil icon-edit' : 'pi pi-plus-circle icon-add'"></i>
        <h2>{{ stateCategory.isEdit ? t("formsGeneric.edit", {item: t("entityName.category")}) : t("formsGeneric.new_f", {item: t("entityName.category")}) }}</h2>
      </div>
    </div>

    <div class="form-body">
      <div class="field">
        <FloatLabel>
          <InputText
              id="name"
              v-model="stateCategory.nameCategory"
              class="w-full custom-input"
              :class="{ 'p-invalid': stateCategory.nameError }"
          />
          <label for="name">{{t("formsGeneric.name")}}</label>
        </FloatLabel>
        <small v-if="stateCategory.nameError" class="error-msg">
          {{ stateCategory.nameError }}
        </small>
      </div>

      <div class="field mt-5">
        <FloatLabel>
          <Textarea
              id="description"
              v-model="stateCategory.descriptionCategory"
              rows="3"
              class="w-full custom-textarea"
              autoResize
          />
          <label for="description">{{ t("formsGeneric.description") }}</label>
        </FloatLabel>
      </div>

      <div class="actions-group">
        <Button
            type="button"
            :label="stateCategory.isEdit ? t('formsGeneric.update') : t('formsGeneric.save', {item: t('entityName.category')})"
            :icon="stateCategory.isLoading ? 'pi pi-spin pi-spinner' : 'pi pi-check'"
            :disabled="stateCategory.isLoading"
            @click="handleByStateAction"
            class="btn-submit w-full"
        />
        <Button
            v-if="stateCategory.isEdit"
            :label="t('formsGeneric.cancel')"
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