<script setup lang="ts">
import InputText from "primevue/inputtext";
import { useToast } from 'primevue/usetoast';
import Button from "primevue/button";
import FloatLabel from "primevue/floatlabel";
import { useClientStore } from "@/store/ClientStore";
import {useI18n} from "vue-i18n";

const clientStore = useClientStore();
const stateClient = clientStore.clientUiState
const {t} = useI18n();
const toast = useToast();

const handleByStateAction = async () => {
  if (stateClient.isEdit){
    await handleUpdate()
  } else {
    await handleSave()
  }
}
function successToast(isEdit: boolean) {
  toast.add({
    severity: 'success',
    summary: t('toastOptions.success'),
    detail: isEdit ? t('toastOptions.successUpdate', {entity: t('entityName.client')}) : t('toastOptions.successSave', {entity: t('entityName.client')}),
    life: 3000
  });
}
const handleUpdate = async () => {
  await clientStore.updateClient()

  if (stateClient.success){
    successToast(stateClient.isEdit)
    clientStore.clearForm()
  }
}

const handleSave = async () => {
  await clientStore.createClient()

  if (stateClient.success){
    successToast(stateClient.isEdit)
    clientStore.clearForm()
  }
}

const cancelUpdate = () => {
  clientStore.clearForm()
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <div>
      <label for="name" class="block font-bold mb-3">{{ t("formsGeneric.name")}}</label>
      <InputText
          id="name"
          v-model.trim="stateClient.nameClient"
          required="true"
          autofocus
          :invalid="stateClient.nameTouched && !stateClient.nameClient"
          fluid
      />
      <small v-if="stateClient.nameTouched && !stateClient.nameClient" class="text-red-500">
        {{ t("errorsGeneric.required", {field: t("formsGeneric.name")}) }}
      </small>
    </div>
    <div>
      <label for="apePClient" class="block font-bold mb-3">{{ t("formsGeneric.client.lastName")}}</label>
      <InputText
          id="apePClient"
          v-model.trim="stateClient.apePClient"
          required="true"
          :invalid="stateClient.nameTouched && !stateClient.apePClient"
          fluid
      />
      <small v-if="stateClient.nameTouched && !stateClient.apePClient" class="text-red-500">
        {{ t("errorsGeneric.required", {field: t("formsGeneric.client.lastName")}) }}
      </small>
    </div>
    <div>
      <label for="apeMClient" class="block font-bold mb-3">{{ t("formsGeneric.client.secondLastName")}}</label>
      <InputText
          id="apeMClient"
          v-model.trim="stateClient.apeMClient"
          required="false"
          :invalid="stateClient.nameTouched && !stateClient.apeMClient"
          fluid
      />
    </div>
    <div>
      <label for="telephone" class="block font-bold mb-3">{{ t("formsGeneric.client.phone")}}</label>
      <InputText
          id="telephone"
          v-model.trim="stateClient.telephone"
          required="true"
          :invalid="stateClient.nameTouched && !stateClient.telephone"
          fluid
      />
      <small v-if="stateClient.nameTouched && !stateClient.telephone" class="text-red-500">
        {{ t("errorsGeneric.required", {field: t("formsGeneric.client.phone")}) }}
      </small>
    </div>
    <Button :label="t('formsGeneric.cancel')" icon="pi pi-times" text @click="cancelUpdate" />
    <Button
        :label="stateClient.isEdit ? t('formsGeneric.update') : t('formsGeneric.save', {item: t('entityName.client')})"
        icon="pi pi-check"
        @click="handleByStateAction"
        :loading="stateClient.isLoading"
    />
  </div>
</template>

<style scoped>

</style>