import {collection, doc, onSnapshot, query, setDoc, Unsubscribe, getDoc, deleteDoc} from "firebase/firestore"
import {ref, uploadBytes, getDownloadURL, deleteObject} from "firebase/storage"
import {COLLECTIONS} from "@/constants/collections";
import {db, storage} from "@/firebase/firebase"

import type { Products } from "@/types/models/Products";

const productsCollection = collection(db,COLLECTIONS.PRODUCTS)

export const ProductsRepository = {
    async uploadProductImage(file: File, productId: string): Promise<string> {
        // Guardamos la imagen en una carpeta 'products' usando el ID del producto
        const storageRef = ref(storage, `${COLLECTIONS.PRODUCTS}/${productId}`);
        const snapshot = await uploadBytes(storageRef, file);
        return await getDownloadURL(snapshot.ref);
    },
    async deleteProductImage(productId: string): Promise<void> {
        const storageRef = ref(storage, `${COLLECTIONS.PRODUCTS}/${productId}`);
        await deleteObject(storageRef);
    },
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