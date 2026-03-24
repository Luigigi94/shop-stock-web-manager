import {collection, doc, onSnapshot, query, setDoc, Unsubscribe, getDoc, deleteDoc} from "firebase/firestore"
import {COLLECTIONS} from "@/constants/collections";
import {db, storage} from "@/firebase/firebase"
import type { Reserves } from "@/types/models/Reserves"

const reserveCollection = collection(db, COLLECTIONS.RESERVES)

export const ReserveRepository = {
    getAllReserves(onUpdate:(reserves: Reserves[]) => void): Unsubscribe {
        return onSnapshot(query(reserveCollection), snapshot => {
            const list = snapshot.docs.map(doc => ({
                idReserves: doc.id,
                ...doc.data()
            })) as Reserves[]
            onUpdate(list)
        }, error => {
            console.error(error)
        })
    },
    async addReserve(reserve: Reserves): Promise<Boolean> {
        try{
            const docRef = doc(reserveCollection, reserve.idReserves)
            await setDoc(docRef, reserve)
            return true
        } catch (e: any) {
            console.error(e.message)
            return false
        }
    },
    async getReserveById(reserveId: string): Promise<Reserves | null> {
        const docRef = doc(reserveCollection, reserveId)
        const snapshot = await getDoc(docRef);

        if (snapshot.exists()) {
            return {
                idReserves: reserveId,
                ...snapshot.data()
            } as Reserves
        }
        return null
    },
    async updateReserve(reserve: Reserves): Promise<Boolean> {
        try {
            const docRef = doc(reserveCollection, reserve.idReserves)
            await setDoc(docRef, reserve)
            return true
        } catch (e: any) {
            console.error(e.message)
            return false
        }
    },
    async deleteReserve(reserveId: string): Promise<Boolean> {
        try {
            const docRef = doc(reserveCollection, reserveId)
            await deleteDoc(docRef)
            return true
        } catch (e: any) {
            console.error(e.message)
            return false
        }
    }
}