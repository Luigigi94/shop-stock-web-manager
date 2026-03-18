import {collection, doc, onSnapshot, query, setDoc, Unsubscribe, getDoc, deleteDoc, writeBatch, increment} from "firebase/firestore"
import {COLLECTIONS} from "@/constants/collections";

import {db} from "@/firebase/firebase"
import type {Cart} from "@/models/Cart";
import {Purchase} from "@/models/Purchase";
import {InventoryMovement} from "@/models/InventoryMovements";
import firebase from "firebase/compat/app";

const cartCollection = collection(db,COLLECTIONS.CART)
const purchaseCollection = collection(db, COLLECTIONS.PURCHASES)
const movementsCollection = collection(db,COLLECTIONS.INVENTORY_MOVEMENTS)
const productsCollection = collection(db,COLLECTIONS.PRODUCTS)

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
    },
    async deleteCart(cartId: string): Promise<void> {
        const docRef = doc(cartCollection, cartId);
        await deleteDoc(docRef);
    },
    async confirmCartSale(cart: Cart, purchase: Purchase, movements: Array<InventoryMovement>, userId: string): Promise<string> {
        try{
            const batch = writeBatch(db)
            const purchaseRef = doc(purchaseCollection, purchase.id)

            batch.set(purchaseRef, purchase);

            movements.forEach(movement => {
                const movRef = doc(movementsCollection)
                batch.set(movRef, movement);
            })

            cart.items.forEach(item => {
                const prodRef = doc(productsCollection, item.productId)
                batch.update(prodRef, {stock: increment(-item.quantity)})
            })

            const cartRef = doc(cartCollection, userId)
            batch.delete(cartRef);

            await batch.commit()
            return purchase.id
        } catch (e: any) {
            console.error(e);
            return ""
        }
    }
}