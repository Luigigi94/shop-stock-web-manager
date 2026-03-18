<script setup lang="ts">
import {Drawer, useConfirm} from "primevue";
import { useCartStore } from "@/store/CartStore";
const cartStore = useCartStore();
import {useI18n} from "vue-i18n";
import Button from "primevue/button";
import DataView from 'primevue/dataview';
import InputNumber from 'primevue/inputnumber';
import {ref, PropType} from "vue";
import {Cart} from "@/models/Cart";
import {PurchaseItem} from "@/models/PurchaseItem";
import { useToast } from 'primevue/usetoast';
import ConfirmPopup from 'primevue/confirmpopup';
const displayConfirmation = ref(false);
import Tag from "primevue/tag";
import SelectButton from 'primevue/selectbutton';
import InputText from 'primevue/inputtext';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';

const toast = useToast();
const {t} = useI18n();
const confirmPopup = useConfirm();
const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  datos: {
    type: Array as PropType<Cart[]>,
    required: true,
    default: () => []
  }
})


const emit = defineEmits(["update:visible"])
const updateQuantity = (cart: Cart, item: PurchaseItem, change: number) => {
  const newQuantity = item.quantity + change;
  console.log(newQuantity+" valor id "+item.productId);
  if (newQuantity > 0) {
    // 1. Actualizamos cantidad
    console.log("Entro al 1er If");
    item.quantity = newQuantity;

    // 2. Actualizamos subtotal del item
    item.subtotal = item.quantity * item.price;

    // 3. Actualizamos el total del carrito (la suma de todos sus items)
    cart.total = cart.items.reduce((acc, i) => acc + i.subtotal, 0);
  } else if (newQuantity < 1) {
    console.log("Entro al 2do If");
    cartStore.removeItem(item.productId)
  }
};

 function confirm(event: { target: any; }) {
  confirmPopup.require({
    target: event.target,
    message: t('toastOptions.messageClearCart'),
    icon: 'pi pi-exclamation-triangle',
    rejectProps: {
      label: 'Cancel',
      severity: 'secondary',
      outlined: true
    },
    acceptProps: {
      label: 'Save'
    },
    accept: () => {
      try {
        cartStore.cleanCart()
      } catch (e: any) {
        console.error(e)
      } finally {
        toast.add({ severity: 'info', summary: t('toastOptions.summaryConfirmed'), detail: t('toastOptions.confirmedOption'), life: 3000 });
      }
    }/*,
    reject: () => {
      toast.add({ severity: 'info', summary: t('toastOptions.summaryCanceled'), detail: 'You have rejected', life: 3000 });
    }*/
  });
}
</script>

<template>
  <Drawer
      v-model:visible="props.visible"
      @update:visible="(value) => emit('update:visible', value)"
      :header="t('entityName.cart')"
      position="right"
      class="custom-drawer-width"
  >
    <div class="flex flex-col h-full">

      <div class="flex-1 overflow-y-auto pr-2">
        <DataView :value="props.datos" layout="list">
          <template #list="slotProps">
            <div class="flex flex-col gap-6">
              <div v-for="(cart, index) in (slotProps.items as Cart[])" :key="cart.id || index" class="flex flex-col">
                <div class="flex flex-col gap-4">
                  <div v-for="item in cart.items" :key="item.productId">
                    <div class="flex flex-row items-center p-4 gap-4 border border-surface-200 dark:border-surface-700 bg-surface-0 dark:bg-surface-900 rounded-lg shadow-sm">
                      <div class="shrink-0">
                        <img class="w-16 h-16 rounded-full object-cover" :src="item.imageProduct" :alt="item.productName" />
                      </div>
                      <div class="flex flex-row items-center justify-between flex-1 gap-4">
                        <div class="flex flex-col gap-2">
                          <div class="text-lg font-medium leading-tight">{{ item.productName }}</div>
                          <div class="flex items-center gap-2">
                            <Button icon="pi pi-minus" severity="secondary" raised class="w-8 h-8" @click="updateQuantity(cart, item, -1)" />
                            <InputNumber v-model="item.quantity" :min="0" :allowEmpty="false" inputClass="w-12 text-center p-2" @update:model-value="updateQuantity(cart, item, 0)" />
                            <Button icon="pi pi-plus" severity="info" raised class="w-8 h-8" @click="updateQuantity(cart, item, 1)" />
                          </div>
                        </div>
                        <div class="flex flex-col items-end">
                          <span class="text-xl font-semibold text-primary">${{ item.subtotal.toFixed(2) }}</span>
                          <span class="text-surface-500 dark:text-surface-400 text-sm">${{ item.price }} c/u</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </DataView>
      </div>

      <div class="pt-6 border-t border-surface-200 dark:border-surface-700 mt-auto bg-surface-0 dark:bg-surface-900">
        <div v-for="cart in props.datos" :key="cart.id" class="mb-4">

          <div class="flex gap-3">
            <ConfirmPopup></ConfirmPopup>
            <Button
                icon="pi pi-trash"
                severity="danger"
                outlined
                class="w-16 h-16 shrink-0"
                v-tooltip.top="t('tooltipOptions.cleanCart')"
                ref="popup"
                @click="confirm($event)"
            />

            <Button
                class="flex-1 p-4 flex justify-between items-center"
                severity="success"
                @click="confirmarVenta(cart)"
            >
              <span class="flex items-center gap-2">
                <i class="pi pi-check-circle text-xl"></i>
                <span class="font-bold uppercase tracking-wider">Confirmar</span>
              </span>
              <span class="text-xl font-black bg-white/20 px-3 py-1 rounded">
                ${{ cart.total.toFixed(2) }}
              </span>
            </Button>
          </div>

        </div>
      </div>

    </div>
  </Drawer>
</template>

<style scoped>
:deep(.p-drawer-content) {
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>