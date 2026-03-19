import {collection, getDocs, orderBy, query, where} from "firebase/firestore"
import {COLLECTIONS} from "@/constants/collections";

import {db} from "@/firebase/firebase";
import type {SupplierPurchase} from "@/types/models/SupplierPurchase";

const supplierPurchaseCollection = collection(db, COLLECTIONS.SUPPLIER_PURCHASES)

export const SupplierPurchaseRepository = {
    async getAllSupplierPurchases(isAdmin: boolean = false): Promise<SupplierPurchase[]> {
        try {
            let q;

            if (isAdmin) {
                q = query(supplierPurchaseCollection, orderBy("createdAt", "desc"));
            } else {
                q = query(supplierPurchaseCollection,
                    where("isActive", "==", true),
                    orderBy("createdAt", "desc"));
            }

            const querySnapshot = await getDocs(q);

            return querySnapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            } as SupplierPurchase));
        } catch (e) {
            console.error(e);
            return [];
        }
    },
}

