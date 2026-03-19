import { defineStore } from 'pinia'
import { ClientRepository } from "@/repositories/ClientRepository";
import type { Unsubscribe } from "firebase/firestore";
import { Clients } from '@/types/models/Clients'
import { ref } from "vue"

export const useClientStore = defineStore( "ClientStore", () => {
    const allClients = ref<Clients[]>([])
    const clientUiState = ref({
        isLoading: false,
        isEdit: false,
        errorMessage: '' as string | null,
        success: false,

        idClient: '' as string | null,
        nameClient: '' as string | null,
        apePClient: '' as string | null,
        apeMClient: '' as string | null,
        telephone : '' as string | null,

        nameError: '' as string | null,
        apePError: '' as string | null,
        telephoneError: '' as string | null,

        nameTouched: false,
        apePTouched: false,
        telephoneTouched: false,

        isValid: false,
        isModalVisible: false,
    })

    let stopListener: Unsubscribe | null = null
    let currentState = clientUiState.value

    function openNewClient(): void {
        clearForm()
        currentState.isModalVisible = true
    }

    function getAllClients() {
        currentState.isLoading = true

        if (stopListener) stopListener()

        stopListener = ClientRepository.getAllClients((newList) =>{
            allClients.value = newList
            currentState.isLoading = false
        })
    }

    function clear(): void {
        if (stopListener) stopListener()
    }

    async function createClient(): Promise<void> {
        const idClientGenerated = crypto.randomUUID()

        const client: Clients = {
            idClient: idClientGenerated,
            nameClient: currentState.nameClient ?? '',
            apePClient: currentState.apePClient ?? '',
            apeMClient: currentState.apeMClient ?? '',
            telephone: currentState.telephone ?? '',
        }

        defaultStateUi()

        try {
            await ClientRepository.addClient(client)
            currentState.success = true
            currentState.isLoading = false
            currentState.isModalVisible = false
        } catch (e: any) {
            currentState.success = false
            currentState.errorMessage = e || "Error al crear cliente"
        }
    }

    async function clientById(id: string): Promise< Clients | null> {
        currentState.isLoading = true
        currentState.isEdit = true
        try{
            const client = await ClientRepository.getClientById(id)
            if (client) {
                currentState.idClient = client.idClient
                currentState.nameClient = client.nameClient
                currentState.apePClient = client.apePClient
                currentState.apeMClient = client.apeMClient
                currentState.telephone = client.telephone

                return client
            }
            return null
        } catch (e: any) {
            currentState.isLoading = false
            currentState.errorMessage = e || "Error al crear cliente"
            return null
        } finally {
            currentState.isLoading = false
        }
    }

    function defaultStateUi() {
        currentState.isLoading = true
        currentState.errorMessage = null
        currentState.success = false
    }

    async function updateClient(): Promise<void> {
        const client: Clients = {
            apeMClient: currentState.apeMClient ?? "",
            apePClient: currentState.apePClient ?? "",
            idClient: currentState.idClient ?? "",
            nameClient: currentState.nameClient ?? "",
            telephone: currentState.telephone ?? ""
        }

        defaultStateUi();

        try {
            await ClientRepository.updateClient(client)
            currentState.success = true
            currentState.isLoading = false
            currentState.isModalVisible = false
        } catch (e: any) {
            currentState.success = false
            currentState.errorMessage = e || "Error updating client"
        }
    }

    async function deleteClient(id: string): Promise<void> {
        defaultStateUi();
        try {
            await ClientRepository.deleteClient(id)
        }catch (e: any) {
            currentState.isLoading = false
            currentState.errorMessage = e || "Error deleting client"
        }
    }

    function clearForm(): void {
        currentState.isLoading = false
        currentState.isEdit = false
        currentState.errorMessage = null
        currentState.success = false
        currentState.idClient = null
        currentState.nameClient = null
        currentState.apePClient = null
        currentState.apeMClient = null
        currentState.telephone  = null
        currentState.nameError = null
        currentState.apePError = null
        currentState.telephoneError = null
        currentState.nameTouched = false
        currentState.apePTouched = false
        currentState.telephoneTouched = false
        currentState.isValid = false
        currentState.isModalVisible = false
    }

    return{
        allClients,
        getAllClients,
        clientUiState,
        createClient,
        clientById,
        updateClient,
        deleteClient,
        clearForm,
        clear,
        openNewClient,
    }
})