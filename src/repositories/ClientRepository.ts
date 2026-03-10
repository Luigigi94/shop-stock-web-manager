import {collection, doc, onSnapshot, query, setDoc, Unsubscribe, getDoc, deleteDoc} from "firebase/firestore"
import {COLLECTIONS} from "@/constants/collections";

import {db} from "@/firebase/firebase"
import type { Clients } from "@/models/Clients";

const clientsCollection = collection(db, COLLECTIONS.CLIENTS)

export const ClientRepository = {
    getAllClients(onUpdate: (clients: Clients[]) => void): Unsubscribe {
        return onSnapshot(query(clientsCollection), (snapshot) => {
            const list = snapshot.docs.map(doc => ({
                idClient: doc.id,
                ...doc.data(),
            })) as Clients[];

            onUpdate(list)
        }, (error) => {
            console.error(error);
        })
    },
    async addClient(client: Clients): Promise<void> {
        const docRef = doc (clientsCollection, client.idClient)
        await setDoc(docRef, client)
    },
    async getClientById(idClient: string): Promise<Clients|null> {
        const docRef = doc (clientsCollection, idClient)
        const snapshot = await getDoc(docRef)

        if (snapshot.exists()) {
            return {
                idClient: idClient,
                ...snapshot.data()
            } as Clients
        }
        return null
    },
    async updateClient(client: Clients): Promise<void> {
        const docRef = doc (clientsCollection, client.idClient)
        await setDoc(docRef, client)
    },
    async deleteClient(clientId: string): Promise<void> {
        const docRef = doc (clientsCollection, clientId)
        await deleteDoc(docRef)
    }
}