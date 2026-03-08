import {collection, doc, onSnapshot, query, setDoc, Unsubscribe, getDoc, deleteDoc} from "firebase/firestore"
import {COLLECTIONS} from "@/constants/collections";
import {db} from "@/firebase/firebase"

import type { Products } from "@/models/Products";

const productsCollection = collection(db,COLLECTIONS.PRODUCTS)

export const ProductsRepository = {
    getAllProducts(onUpdate: (products: Products[]) => void): Unsubscribe {
        return onSnapshot(query(productsCollection), snapshot => {
            const list = snapshot.docs.map(doc => ({
                idProduct: doc.id,
                ...doc.data()
            })) as Products[];

            onUpdate(list);
        }, (error) =>{
            console.error("Error en ProductRepository", error);
        })
    },
    async addProduct(product: Products): Promise<void> {
        const docRef = doc(productsCollection, product.idProduct)
        await setDoc(docRef, product);
    },
    async getProductById(productId: string): Promise<Products|null> {
        const docRef = doc(productsCollection, productId)
        const snapshot = await getDoc(docRef);

        if (snapshot.exists()) {
            return {
                idProduct: productId,
                ...snapshot.data()
            } as Products
        }
        return null;
    },
    async updateProduct(product: Products): Promise<void> {
        const docRef = doc(productsCollection, product.idProduct)
        await setDoc(docRef, product);
    },
    async deleteProduct(productId: string): Promise<void> {
        const docRef = doc(productsCollection, productId)
        await deleteDoc(docRef);
    }
}