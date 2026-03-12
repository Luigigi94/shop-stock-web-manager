import {defineStore} from "pinia";
import {CartRepository} from "@/repositories/CartRepository";
import {Timestamp, Unsubscribe} from "firebase/firestore";
import { Cart }from "@/models/Cart";
import {ref} from "vue";
import {PurchaseItem} from "@/models/PurchaseItem";

export const useCartStore = defineStore("CartStore", () => {

    const allCartProducts = ref<Cart[]>([]);
    const cartUiState = ref ({
        id: '' as string | null,
        userId: '' as string | null,
        clientId: '' as string | null,
        clientName: '' as string | null,
        items: [],
        total: '' as string | null,
        updatedAt: null,
        createdAt: null,
        isCartOpen: false,
    })

    const currentState = cartUiState.value;

    function openCart(){
        currentState.isCartOpen = true;
    }

    let stopListener: Unsubscribe | null = null;

    function getAllCartProducts(){
        if(stopListener) stopListener();

        stopListener = CartRepository.getAllCartProducts((newList) => {
            allCartProducts.value = newList;
        })
    }

    return {
        allCartProducts,
        getAllCartProducts,
        cartUiState,
        openCart
    }
})