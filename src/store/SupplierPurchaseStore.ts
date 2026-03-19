import {defineStore} from "pinia";
import {computed, ref} from "vue";
import {SupplierPurchase} from "@/types/models/SupplierPurchase";
import {SupplierPurchaseRepository} from "@/repositories/SupplierPurchaseRepository";
import {getInitialSupplierPurchaseState} from "@/types/ui/SupplierPurchaseUiState";

import { useProductStore } from "./ProductStore";
import { useCategoryStore } from "./CategoryStore";

export const useSupplierPurchaseStore = defineStore("SupplierPurchaseStore", () =>{
    const state = ref(getInitialSupplierPurchaseState());
    const allSupplierPurchases = ref<SupplierPurchase[]>([])
    const productStore = useProductStore();
    const categoryStore = useCategoryStore();
    async function getAllSupplierPurchases() {
        state.value.isLoading = true;
        try {
            allSupplierPurchases.value = await SupplierPurchaseRepository.getAllSupplierPurchases();
        } catch (error) {
            console.error("Error al cargar el historial:", error);
        } finally {
            state.value.isLoading = false;
        }
    }
    const purchasesGroupedBySupplier = computed(() => {
        const products = productStore.allProducts;
        const purchases = allSupplierPurchases.value;

        // 1. Creamos un mapa para agrupar
        const groups = purchases.reduce((acc, purchase) => {
            const id = purchase.supplierId;
            if (!acc[id]) {
                acc[id] = {
                    id: id, // Usamos el ID del proveedor como dataKey
                    supplierName: purchase.supplierName,
                    totalAccumulated: 0,
                    purchaseHistory: [] // Aquí van las compras individuales
                };
            }

            // 2. Enriquecemos los items de esta compra (como ya lo hacíamos)
            const enrichedItems = purchase.items.map(item => {
                const pFound = products.find(p => p.idProduct === item.productId);
                return {
                    ...item,
                    productImageUrl: pFound?.imageProduct || null
                };
            });

            // 3. Empujamos la compra al historial de este proveedor
            acc[id].purchaseHistory.push({
                ...purchase,
                items: enrichedItems
            });

            // 4. Sumamos al total acumulado del proveedor (opcional pero útil)
            acc[id].totalAccumulated += purchase.totalCost;

            return acc;
        }, {} as Record<string, any>);

        return Object.values(groups); // Convertimos el objeto en Array para la DataTable
    });
    return{
        getAllSupplierPurchases,
        allSupplierPurchases,
        purchasesGroupedBySupplier,
    }
})