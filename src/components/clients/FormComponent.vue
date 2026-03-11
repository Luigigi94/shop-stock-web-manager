<script setup lang="ts">
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import FloatLabel from "primevue/floatlabel";
import { useClientStore } from "@/store/ClientStore";
import {useI18n} from "vue-i18n";

const clientStore = useClientStore();
const stateClient = clientStore.clientUiState
const {t} = useI18n();

const handleByStateAction = async () => {
  if (stateClient.isEdit){
    await handleUpdate()
  } else {
    await handleSave()
  }
}

const handleUpdate = async () => {
  await clientStore.updateClient()

  if (stateClient.success){
    clientStore.clearForm()
  }
}

const handleSave = async () => {
  await clientStore.createClient()

  if (stateClient.success){
    clientStore.clearForm()
  }
}

const cancelUpdate = () => {
  clientStore.clearForm()
}
</script>

<template>
  <div class="form-card">
    <div class="form-header">
      <div class="title-wrapper">
        <i :class="stateClient.isEdit ? 'pi pi-pencil icon-edit' : 'pi pi-plus-circle icon-add'"></i>
        <h2>{{ stateClient.isEdit ? t("formsGeneric.edit", {item: t("entityName.client")}) : t('formsGeneric.new_m', {item: t('entityName.client')}) }}</h2>
      </div>
    </div>

    <div class="form-body">
      <div class="field">
        <FloatLabel>
          <InputText
              id="name"
              v-model="stateClient.nameClient"
              class="w-full custom-input"
              :class="{ 'p-invalid': stateClient.nameError }"
          />
          <label for="name">{{ t("formsGeneric.name")}}</label>
        </FloatLabel>
        <small v-if="stateClient.nameError" class="error-msg">
          {{ stateClient.nameError }}
        </small>
      </div>

      <div class="field">
        <FloatLabel>
          <InputText
            id="apePClient"
            v-model="stateClient.apePClient"
            class="w-full custom-input"
            :class="{ 'p-invalid': stateClient.apePError }"
          />
          <label for="apePClient">{{ t("formsGeneric.client.lastName")}}</label>
        </FloatLabel>
        <small class="error-msg" v-if="stateClient.apePError">
          {{ stateClient.apePError }}
        </small>
      </div>
      <div class="field">
        <FloatLabel>
          <InputText
            id="apeMClient"
            v-model="stateClient.apeMClient"
            class="w-full custom-input"
          />
          <label for="apeMClient">{{ t("formsGeneric.client.secondLastName")}}</label>
        </FloatLabel>
      </div>

      <div class="field">
        <FloatLabel>
          <InputText
              id="telephone"
              v-model="stateClient.telephone"
              class="w-full custom-input"
              :class="{ 'p-invalid': stateClient.telephoneError }"
          />
          <label for="telephone">{{ t("formsGeneric.client.phone")}}</label>
        </FloatLabel>
        <small class="error-msg" v-if="stateClient.telephoneError">
          {{ stateClient.telephoneError }}
        </small>
      </div>

      <div class="actions-group">
        <Button
            type="button"
            :label="stateClient.isEdit ? t('formsGeneric.update') :  t('formsGeneric.save', {item:  t('entityName.client')})"
            :icon="stateClient.isLoading ? 'pi pi-spin pi-spinner' : 'pi pi-check'"
            :disabled="stateClient.isLoading"
            @click="handleByStateAction"
            class="btn-submit w-full"
        />
        <Button
            v-if="stateClient.isEdit"
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