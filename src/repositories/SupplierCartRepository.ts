import {
    collection, deleteDoc,
    doc,
    increment,
    onSnapshot,
    query,
    setDoc,
    Timestamp,
    Unsubscribe,
    writeBatch
} from "firebase/firestore"
import {COLLECTIONS} from "@/constants/collections";
import {db} from "@/firebase/firebase"
import type {SupplierPurchase} from "@/models/SupplierPurchase";

const supplierCartCollection = collection(db, COLLECTIONS.SUPPLIER_CART)

export const SupplierCartRepository = {
    getAllSupplierCart(onUpdate: (supplierCart: SupplierPurchase[]) => void): Unsubscribe {
        return onSnapshot(query(supplierCartCollection), (snapshot) =>{
            const list = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as SupplierPurchase[];

            onUpdate(list);
        }, (error) => {
            console.error(error);
        })
    },
    async saveCart(supplierPurchase: SupplierPurchase, userId: string): Promise<void> {
        const docRef = doc(supplierCartCollection, userId)
        await setDoc(docRef, supplierPurchase)
    },
    async deleteCart(supplierPurchaseId: string): Promise<void> {
        const docRef = doc (supplierCartCollection, supplierPurchaseId)
        await deleteDoc(docRef)
    },
    async confirmPurchaseCart(): Promise<string>{
        return ""
    }
}