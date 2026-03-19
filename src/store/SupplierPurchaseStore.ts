import {defineStore} from "pinia";
import {SupplierPurchaseRepository} from "@/repositories/SupplierPurchaseRepository";
import {Timestamp, Unsubscribe} from "firebase/firestore";
import {SupplierPurchase} from "@/types/models/SupplierPurchase";
import {ref} from "vue"
import {SupplierPurchaseItem} from "@/types/models/SupplierPurchaseItem";
import {getInitialSupplierPurchaseState} from "@/types/ui/SupplierPurchaseUiState";
import {Products} from "@/types/models/Products";
import * as crypto from "node:crypto";
import {SupplierCartRepository} from "@/repositories/SupplierCartRepository";

export const useSupplierPurchaseStore = defineStore("SupplierPurchaseStore", () =>{
    const allSupplierPurchases = ref<SupplierPurchase[]>([])

    const state = ref(getInitialSupplierPurchaseState());

    let stopListener: Unsubscribe | null = null

    function openNewSupplierPurchase(){
        clearForm();
        state.value.isCartOpen = true
    }

    const clearForm = () => {
        state.value = getInitialSupplierPurchaseState();
    }

    function getAllSupplierPurchases() {
        state.value.isLoading = true
        if (stopListener) stopListener()

        stopListener = SupplierPurchaseRepository.getAllSupplierPurchases((newList) => {
            allSupplierPurchases.value = newList
            state.value.isLoading = false
        })
    }
    function clear(){
        if(stopListener) stopListener()
    }

    function cleanModelToSave() {
        const {
            isLoading, isEdit, errorMessage, success, isCartOpen,
            ...dataToSave
        } = state.value;
        return dataToSave;
    }

    async function addSupplierPurchase(product: Products, quantity: number, cost: number): Promise<void> {
        // 1. Referencia reactiva (opcional, pero ayuda a la legibilidad)
        const currentState = state.value;

        const existingIndex = currentState.items.findIndex(item => item.productId === product.idProduct);

        if (existingIndex !== -1) {
            // UPDATE: Si ya existe, actualizamos cantidad y subtotal
            state.value.items = currentState.items.map((item, i) => {
                if (i === existingIndex) {
                    const newQty = item.quantity + quantity; // Ojo: ¿era + o -? En compra suele ser +
                    return {
                        ...item,
                        quantity: newQty,
                        subtotal: newQty * item.cost
                    };
                }
                return item;
            });
        } else {
            const newItem: SupplierPurchaseItem = {
                id: crypto.randomUUID(),
                productId: product.idProduct,
                productName: product.nameProduct,
                quantity: quantity,
                cost: cost,
                subtotal: quantity * cost,
            };
            state.value.items.push(newItem);
        }

        state.value.totalCost = state.value.items.reduce((acc, item) => acc + item.subtotal, 0);
        state.value.updatedAt = Timestamp.now();

        try {
            const dataToSave = cleanModelToSave();

            // 4. Guardado en el Repo
            // Aquí dataToSave ya no tiene los campos de UI
            await SupplierCartRepository.saveCart(
                dataToSave as unknown as SupplierPurchase,
                state.value.userId || 'Luis Hernández'
            );

        } catch (e: any) {
            console.error("Error al guardar el carrito:", e);
        }
    }
    async function updateItemQuantity(productId: string, quantity: number): Promise<void>{
        state.value.items = state.value.items.map (item => {
            if (item.productId === productId) {
                return {
                    ...item,
                    quantity: quantity,
                    subtotal: quantity * item.cost
                };
            }
            return item;
        })
        state.value.totalCost = state.value.items.reduce((acc, i) => acc + i.subtotal, 0);
        state.value.updatedAt = Timestamp.now();
        const dataToSave = cleanModelToSave();

        try {
            await SupplierCartRepository.saveCart(
                dataToSave as unknown as SupplierPurchase,
                state.value.userId || 'Luis Hernández'
            );
        } catch (e) {
            console.error("Fallo al sincronizar con Firebase", e);
        }
    }

    async function removeItem(productId: string): Promise<void> {
        const updatedItems = state.value.items.filter(item => item.productId !== productId)
        state.value.items = updatedItems;
        state.value.totalCost = updatedItems.reduce((acc, item) => acc + (item.cost * item.quantity), 0);
        state.value.updatedAt = Timestamp.now();

        try {
            const { isLoading, isEdit, errorMessage, success, isCartOpen, ...dataToSave } = state.value;

            await SupplierCartRepository.saveCart(
                dataToSave as unknown as SupplierPurchase,
                state.value.userId || 'Luis Hernández'
            );
        } catch (error) {
            console.error("Error al sincronizar tras eliminar item:", error);
        }
    }

    return{
        state,
        stopListener,
        clearForm,
        addSupplierPurchase,
        updateItemQuantity,
        clear,
        openNewSupplierPurchase,
        getAllSupplierPurchases,
        allSupplierPurchases,
        removeItem,
    }
})