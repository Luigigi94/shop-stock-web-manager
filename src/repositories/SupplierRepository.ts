import {collection, doc, onSnapshot, query, setDoc, Unsubscribe, getDoc, deleteDoc} from "firebase/firestore"
import { COLLECTIONS } from "@/constants/collections";

import { db } from "@/firebase/firebase";
import type { Suppliers } from "@/models/Suppliers";

const suppliersCollection = collection(db, COLLECTIONS.SUPPLIERS)

export const SupplierRepository = {
    getAllSuppliers(onUpdate: (suppliers: Suppliers[]) => void): Unsubscribe {
        return onSnapshot(query(suppliersCollection), (snapshot) => {
            const list = snapshot.docs.map(doc => ({
                idSupplier: doc.id,
                ...doc.data()
            })) as Suppliers[];

            onUpdate(list);
        }, error => {
            console.error("Error en SupplierRepository", error);
        });
    },
    async addSupplier(supplier: Suppliers): Promise<void> {
        const docRef = doc(suppliersCollection, supplier.idSupplier)
        await setDoc(docRef, supplier)
    },
    async getSupplierById(supplierId: string): Promise<Suppliers|null> {
        const docRef = doc(suppliersCollection, supplierId)
        const snapshot = await getDoc(docRef)

        if (snapshot.exists()){
            return {
                idSupplier: supplierId,
                ...snapshot.data()
            } as Suppliers
        }
        return null
    },
    async updateSupplier(supplier: Suppliers): Promise<void> {
        const docRef = doc(suppliersCollection, supplier.idSupplier)
        await setDoc(docRef, supplier)
    },
    async deleteSupplier(supplierId: string): Promise<void> {
        const docRef = doc(suppliersCollection, supplierId)
        await deleteDoc(docRef)
    }
}