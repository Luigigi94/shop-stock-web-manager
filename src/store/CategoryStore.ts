import { defineStore } from "pinia";
import { CategoryRepository } from "@/repositories/CategoryRepository";
import type { Unsubscribe } from "firebase/firestore";
import {Categories} from "@/models/Categories";
import {ref} from "vue";

export const useCategoryStore = defineStore("CategoryStore", () => {
    const allCategories = ref<Categories[]>([])
    const categoryUiState = ref({
        isLoading: false,
        isEdit: false,
        errorMessage: '' as string | null,
        success: false,
        idCategory: '' as string | null,
        nameCategory: '' as string | null,
        descriptionCategory: '' as string | null,
        nameError: '' as string | null,
        nameTouched: false,
        isValid: false,
    })

    let stopListener: Unsubscribe | null = null;

    function getAllCategories() {
        categoryUiState.value.isLoading = true;

        if (stopListener) stopListener();

        stopListener = CategoryRepository.getAllCategories((newList) =>{
            allCategories.value = newList;
            categoryUiState.value.isLoading = false;
        })
    }

    function clear(){
        if (stopListener) stopListener();
    }

    async function addCategory(name: string, description: string) {
        const idCateGenerated = crypto.randomUUID();

        const category: Categories = {
            idCategory: idCateGenerated,
            nameCategory: name,
            descriptionCategory: description,
        }

        categoryUiState.value.isLoading = true;
        categoryUiState.value.errorMessage = null;
        categoryUiState.value.success = false;

        try{
            await CategoryRepository.addCategory(category);

            categoryUiState.value.success = true;
            categoryUiState.value.isLoading = false;
        } catch (error: any) {
            categoryUiState.value.isLoading = false;
            categoryUiState.value.errorMessage = error || "Error al crear categoria";
        }
    }

    return {
        allCategories,
        categoryUiState,
        getAllCategories,
        clear,
        addCategory
    }
})