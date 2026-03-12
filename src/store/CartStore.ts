import {defineStore} from "pinia";
import {CartRepository} from "@/repositories/CartRepository";
import type {Unsubscribe} from "firebase/firestore";
import { Cart }from "@/models/Cart";
import {ref} from "vue";

export const useCartStore = defineStore("CartStore", () => {

    const allCartProducts = ref<Cart[]>([]);

    let stopListener: Unsubscribe | null = null;

    function getAllCartProducts(){
        if(stopListener) stopListener();

        stopListener = CartRepository.getAllCartProducts((newList) => {
            allCartProducts.value = newList;
        })
    }

    return {
        allCartProducts,
        getAllCartProducts
    }
}