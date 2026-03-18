import {collection, doc, onSnapshot, query, setDoc, Unsubscribe, getDoc, deleteDoc} from "firebase/firestore"
import {COLLECTIONS} from "@/constants/collections";

import {db} from "@/firebase/firebase"
import type {Cart} from "@/models/Cart";
import {PurchaseItem} from "@/models/PurchaseItem";

const cartCollection = collection(db,COLLECTIONS.CART)

export const CartRepository = {
    getAllCartProducts(onUpdate: (cart: Cart[]) => void): Unsubscribe {
        return onSnapshot(query(cartCollection), (snapshot) => {
            const list = snapshot.docs.map(doc => ({
               id: doc.id,
               ...doc.data(),
            })) as Cart[];

            onUpdate(list);
        }, (error) =>{
            console.error("Error en CartRepository ",error);
        });
    },
    async saveCart(cart: Cart): Promise<void> {
        const docRef = doc(cartCollection, cart.id);
        await setDoc(docRef, cart);
    }
}