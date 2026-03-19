import {
    collection,
    deleteDoc,
    doc,
    increment,
    onSnapshot,
    setDoc,
    Timestamp,
    Unsubscribe,
    writeBatch
} from "firebase/firestore"
import {COLLECTIONS} from "@/constants/collections";
import {db} from "@/firebase/firebase"
import type {SupplierPurchase} from "@/types/models/SupplierPurchase";
import {InventoryMovement} from "@/types/models/InventoryMovements";
import {MovementType} from "@/constants/MovementType";

const supplierCartCollection = collection(db, COLLECTIONS.SUPPLIER_CART)
const purchaseCollection = collection(db, COLLECTIONS.PURCHASES)
const inventoryMovementsCollection = collection(db, COLLECTIONS.INVENTORY_MOVEMENTS)
const productsCollection = collection(db, COLLECTIONS.PRODUCTS)

export const SupplierCartRepository = {
    getAllSupplierCart(userId: string, onUpdate: (supplierCart: SupplierPurchase | null) => void): Unsubscribe {
        const cartRef = doc(supplierCartCollection, userId);
        return onSnapshot(cartRef, (snapshot) => {
            if (snapshot.exists()) {
                onUpdate({
                    id: snapshot.id,
                    ...snapshot.data()
                } as SupplierPurchase);
            } else {
                onUpdate(null)
            }
        }, error => console.error(error));
    },
    async saveCart(supplierPurchase: SupplierPurchase, userId: string): Promise<void> {
        const docRef = doc(supplierCartCollection, userId)
        await setDoc(docRef, supplierPurchase)
    },
    async deleteCart(supplierPurchaseId: string): Promise<void> {
        const docRef = doc (supplierCartCollection, supplierPurchaseId)
        await deleteDoc(docRef)
    },async addSupplierPurchase(supplierPurchase: SupplierPurchase): Promise<string> {
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