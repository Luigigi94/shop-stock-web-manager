import { defineStore } from "pinia";
import { SupplierRepository } from "@/repositories/SupplierRepository";
import type { Unsubscribe } from "firebase/firestore";
import { Suppliers } from "@/models/Suppliers";
import { ref } from "vue";
import {Timestamp} from "firebase/firestore";


export const useSupplierStore = defineStore("SupplierStore", () => {

    const allSuppliers = ref<Suppliers[]>([])

    const supplierUiState = ref({
        isLoading: false,
        isEdit: false,
        errorMessage: '' as string | null,
        success: false,

        idSupplier: '' as string | null,
        name: '' as string | null,
        phone: '' as string | null,
        identifierAccount: '' as string | null,
        idBank: '' as string | null,
        createdAt: null as Timestamp | null,

        nameError: '' as string | null,
        phoneError: '' as string | null,
        identifierAccountError: '' as string | null,
        idBankError: '' as string | null,
        
        isValid: false,
        isModalVisible: false,
    })

    const currentState = supplierUiState.value;
    
    let stopListener: Unsubscribe | null = null;

    function openNewSupplier() {
        clearForm();
        currentState.isModalVisible = true;
    }

    function getAllSuppliers() {

        currentState.isLoading = true;

        if (stopListener) stopListener();

        stopListener = SupplierRepository.getAllSuppliers((newList) => {
            allSuppliers.value = newList;
            currentState.isLoading = false;
        })
    }

    function clear() {
        if (stopListener) stopListener();
    }

    function beginRequest() {
        currentState.isLoading = true;
        currentState.errorMessage = null;
        currentState.success = false;
    }

    async function addSupplier() {

        const idGenerated = crypto.randomUUID();

        const entity: Suppliers = {
            idSupplier: idGenerated,
            name: currentState.name ?? '',
            phone: currentState.phone ?? '',
            identifierAccount: currentState.identifierAccount ?? '',
            idBank: currentState.idBank ?? '',
            createdAt: Timestamp.now(),
        }

        beginRequest();

        try {

            await SupplierRepository.addSupplier(entity);

            currentState.success = true;
            currentState.isLoading = false;
            currentState.isModalVisible = false;

        } catch (error: any) {

            currentState.isLoading = false;
            currentState.errorMessage = error || "Error creating supplier";
        }
    }

    async function supplierById(id: string): Promise<Suppliers | null> {

        currentState.isLoading = true;

        try {

            const entity = await SupplierRepository.getSupplierById(id)
            if (entity) {
                currentState.idSupplier = entity.idSupplier;
                currentState.isEdit = true;
                currentState.idBank = entity.idBank;
                currentState.name = entity.name;
                currentState.phone = entity.phone;
                return entity
            }

            return null

        } catch (error: any) {

            currentState.errorMessage = error || `Error fetching supplier: ${id}`

            return null

        } finally {

            currentState.isLoading = false;
        }
    }

    async function updateSupplier(): Promise<void> {

        const actualState = currentState;

        const supplier: Suppliers = {
            idSupplier: actualState.idSupplier ?? '',
            name: actualState.name ?? '',
            phone: actualState.phone ?? '',
            identifierAccount: actualState.identifierAccount ?? '',
            idBank: actualState.idBank ?? '',
        }

        beginRequest()

        try {

            await SupplierRepository.updateSupplier(supplier);

            currentState.success = true;
            currentState.isLoading = false;

        } catch (error: any) {

            currentState.isLoading = false;
            currentState.errorMessage = error;
        }
    }

    async function deleteSupplier(id: string): Promise<void> {

        beginRequest()

        try {

            await SupplierRepository.deleteSupplier(id);

        } catch (error: any) {

            currentState.isLoading = false;
            currentState.errorMessage = error;
        }
    }

    function clearForm() {
       currentState.isLoading = false
       currentState.isEdit = false
       currentState.errorMessage = ''
       currentState.success = false
       currentState.idSupplier = ''
       currentState.name = ''
       currentState.phone = ''
       currentState.identifierAccount = ''
       currentState.idBank = ''
       currentState.createdAt = null
       currentState.nameError = ''
       currentState.phoneError = ''
       currentState.identifierAccountError = ''
       currentState.idBankError = ''
       currentState.isValid = false
       currentState.isModalVisible = false
    }

    return {
        allSuppliers,
        supplierUiState,
        getAllSuppliers,
        clear,
        addSupplier,
        supplierById,
        updateSupplier,
        deleteSupplier,
        clearForm,
        openNewSupplier
    }

})