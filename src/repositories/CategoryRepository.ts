import {collection, doc, onSnapshot, query, setDoc, Unsubscribe, getDoc} from "firebase/firestore"
import {COLLECTIONS} from "@/constants/collections";

import {db} from "@/firebase/firebase"
import type {Categories} from "@/models/Categories";

const categoriesCollection = collection(db,COLLECTIONS.CATEGORIES)


export const CategoryRepository = {
    getAllCategories(onUpdate: (categories: Categories[]) => void): Unsubscribe {
        return onSnapshot(query(categoriesCollection), (snapshot) => {
            const list = snapshot.docs.map( doc => ({
                idCategory: doc.id,
                ...doc.data()
            })) as Categories[]

            onUpdate(list)
        }, (error) => {
            console.error("Error en CategoryRepository",error)
        });
    },
    async addCategory(category: Categories): Promise<void> {
        const docRef = doc(categoriesCollection, category.idCategory)
        await setDoc(docRef, category)
    },
    async getCategoryById(categoryId: string): Promise<Categories|null> {
        const docRef = doc(categoriesCollection, categoryId)
        const snapshot = await getDoc(docRef)

        if (snapshot.exists()) {
            return {
                idCategory: categoryId,
                ...snapshot.data()
            } as Categories
        }
        return null
    }
}