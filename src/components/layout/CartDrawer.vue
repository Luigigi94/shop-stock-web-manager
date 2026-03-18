<script setup lang="ts">
import { Drawer } from "primevue";
import { useCartStore } from "@/store/CartStore";
const cartStore = useCartStore();
const cartState = cartStore.cartUiState
import {useI18n} from "vue-i18n";
import Tag from "primevue/tag";
import Button from "primevue/button";
import DataView from 'primevue/dataview';
import SelectButton from 'primevue/selectbutton';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import {computed, PropType} from "vue";
import {Cart} from "@/models/Cart";
import {PurchaseItem} from "@/models/PurchaseItem";


const {t} = useI18n();

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
</script>

<template>
  <Drawer
      v-model:visible="props.visible"
      @update:visible="(value) => emit('update:visible', value)"
      :header="t('entityName.cart')"
      position="right"
      :value="props.datos"
  >
    <div class="flex-flex-col">
      <div class="card">
        <DataView :value="props.datos" :layout="'list'">
          <template #list="slotProps">
            <div class="flex flex-col">
              <div v-for="(cart, index) in (slotProps.items as Cart[])" :key="cart.id || index">
                <div v-for="item in cart.items" :key="item.productId">
                  <div class="flex flex-col sm:flex-row sm:items-center p-6 gap-4" style="border: 2px solid red">
                    <div class="relative">
                      <img class="block mx-auto w-16 h-16 rounded-full object-cover" :src="item.imageProduct" :alt="item.productName" />
                    </div>
<!--                    <div class="flex flex-col md:flex-row justify-between md:items-center flex-1 gap-6">-->
                    <div class="flex flex-row items-center justify-between flex-1 gap-4">
                      <div class="flex flex-col">
                        <div class="flex flex-col gap-2">
                          <div class="text-lg font-medium">{{ item.productName+" "+item.productId }}</div>

                          <div class="flex items-center gap-2">
                            <Button
                                icon="pi pi-minus"
                                severity="secondary"
                                raised
                                class="w-8 h-8"
                                @click="updateQuantity(cart, item, -1)"
                              />

                            <InputNumber
                                v-model="item.quantity"
                                :min="0"
                                :allowEmpty="false"
                                inputClass="w-12 text-center p-2"
                                @update:model-value="item.subtotal = item.quantity * item.price"
                            />

                            <Button
                                icon="pi pi-plus"
                                severity="info"
                                raised
                                class="w-8 h-8"
                                @click="updateQuantity(cart, item, 1)"
                              />
                          </div>
                        </div>
                      </div>
                      <div class="flex flex-col items-end">
                        <span class="text-xl font-semibold text-primary">${{ item.subtotal }}</span>
                        <span class="text-surface-500 dark:text-surface-400 text-sm">{{ item.price }}</span>
<!--                        <div class="flex flex-row-reverse md:flex-row gap-2">
                          <Button icon="pi pi-heart" outlined></Button>
                          <Button
                              icon="pi pi-shopping-cart"
                              :label="t('listsGeneric.buttonAdd')"
                              :disabled="item.stock === 0"
                              class="flex-auto md:flex-initial whitespace-nowrap"
                          ></Button>
                        </div>-->
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  Total: {{cart.total}}
                </div>
              </div>
            </div>
          </template>
        </DataView>
      </div>
    </div>
  </Drawer>
</template>

<style scoped>

</style>