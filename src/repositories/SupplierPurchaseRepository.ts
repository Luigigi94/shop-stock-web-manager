import {collection, doc, increment, onSnapshot, query, Timestamp, Unsubscribe, writeBatch} from "firebase/firestore"
import {COLLECTIONS} from "@/constants/collections";

import {db} from "@/firebase/firebase";
import type {SupplierPurchase} from "@/types/models/SupplierPurchase";
import {InventoryMovement} from "@/types/models/InventoryMovements";
import {MovementType} from "@/constants/MovementType";

const supplierPurchaseCollection = collection(db, COLLECTIONS.SUPPLIER_PURCHASES)
const purchaseCollection = collection(db, COLLECTIONS.PURCHASES)
const inventoryMovementsCollection = collection(db, COLLECTIONS.INVENTORY_MOVEMENTS)
const productsCollection = collection(db, COLLECTIONS.PRODUCTS)

export const SupplierPurchaseRepository = {
    getAllSupplierPurchases(onUpdate: (SupplierPurchase: SupplierPurchase[]) => void): Unsubscribe {
        return onSnapshot(query(supplierPurchaseCollection), (snapshot) =>{
            const list = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as SupplierPurchase[];

            onUpdate(list);
        }, error => console.error(error));
    },
    async addSupplierPurchase(supplierPurchase: SupplierPurchase): Promise<string> {
        try {
            const batch = writeBatch(db)
            const purchaseRef = doc(purchaseCollection, supplierPurchase.id)
            batch.set(purchaseRef, supplierPurchase);

            supplierPurchase.items.forEach(item => {
                const movements: InventoryMovement = {
                    amount: 0, id: "", reason: "",
                    productId: item.productId,
                    quantity: item.quantity,
                    type: MovementType.PURCHASE,
                    referenceId: supplierPurchase.id,
                    createdAt: Timestamp.now(),
                    userId: supplierPurchase.userId
                }
                const movRef = doc(inventoryMovementsCollection)
                batch.set(movRef, movements)

                const productRef = doc(productsCollection, item.productId)
                batch.update(productRef, {stock: increment(item.quantity)})
            })

            await batch.commit()
            return supplierPurchase.id
        } catch (e: any) {
            console.error("Error en SupplierRepository", e);
            return ""
        }
    },
}

