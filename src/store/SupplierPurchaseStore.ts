import {defineStore} from "pinia";
import {SupplierPurchaseRepository} from "@/repositories/SupplierPurchaseRepository";
import {Unsubscribe} from "firebase/firestore";
import {SupplierPurchase} from "@/models/SupplierPurchase";
import {ref} from "vue"
import {Timestamp} from "firebase/firestore";
import {SupplierPurchaseItem} from "@/models/SupplierPurchaseItem";
import {Products} from "@/models/Products";
import * as crypto from "node:crypto";
import {SupplierCartRepository} from "@/repositories/SupplierCartRepository";

export const useSupplierPurchaseStore = defineStore("SupplierPurchaseStore", () =>{
    const allSupplierPurchases = ref<SupplierPurchase[]>([])

    const supplierPurchaseState = ref({
        isLoading: false,
        isEdit: false,
        errorMessage: '' as string | null,
        success: false,

        id:  '' as string | null,
        supplierId:  '' as string | null,
        supplierName:  '' as string | null,
        items: [] as SupplierPurchaseItem[],
        totalCost: 0 as number | null,
        createdAt: null as Timestamp | null,
        updatedAt: null as Timestamp | null,
        userId: '' as string | null,

        isCartOpen: false
    })

    let stopListener: Unsubscribe | null = null

    function openNewSupplierPurchase(){
        clearForm();
        supplierPurchaseState.value.isCartOpen = true
    }

    function getAllSupplierPurchases() {
        const currentState = supplierPurchaseState.value
        currentState.isLoading = true
        if (stopListener) stopListener()

        stopListener = SupplierPurchaseRepository.getAllSupplierPurchases((newList) => {
            allSupplierPurchases.value = newList
            currentState.isLoading = false
        })
    }
    function clear(){
        if(stopListener) stopListener()
    }
    async function addSupplierPurchase(product: Products, quantity: number, cost: number){
        const currentState = supplierPurchaseState.value
        /*if(!currentState) return*/

        const existingItem = currentState.items.findIndex(item => item.productId === product.idProduct)
        let currentQty: number = 0

        if (existingItem !== -1) {
            currentQty = currentState.items[existingItem].quantity

            const newQty: number = currentQty - quantity
            currentState.items = supplierPurchaseState.value.items.map((item, i) => {
                if (i === existingItem) {
                    return {
                        ...item,
                        quantity: newQty,
                        subtotal: newQty * item.cost
                    };
                }
                return item
            });
            supplierPurchaseState.value.updatedAt = Timestamp.now()
        } else {
            const addedItem: SupplierPurchaseItem = {
                cost: cost,
                productId: product.idProduct,
                productName: product.nameProduct,
                quantity: quantity,
                subtotal: 0,
                id: crypto.randomUUID()
            }
            const updatedItems = [...supplierPurchaseState.value.items, addedItem];
            supplierPurchaseState.value = {
                ...supplierPurchaseState.value,
                items: updatedItems,
                totalCost: updatedItems.reduce((acc, item) => acc + item.cost, 0),
                createdAt: Timestamp.now()
            }
        }
        try {
            //esta destructuración hace que se eliminen los campos que no requieres y solamente se queda la copia del resto de objetos
            const {isLoading, isEdit, errorMessage, success, isCartOpen, ...dataToSave} = supplierPurchaseState.value
            // para poder pasarlo como tipado se hace un soft cast como uknown y después al typo que necesitas
            await SupplierCartRepository.saveCart(dataToSave as unknown as SupplierPurchase, 'Luis Hernández')
        } catch(e: any) {
            console.error(e)
        }
    },

})