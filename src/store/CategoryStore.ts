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

    async function categoryById(id: string): Promise< Categories | null> {
        categoryUiState.value.isLoading = true;
        try {
            const category = await CategoryRepository.getCategoryById(id)
            if (category) {
                categoryUiState.value.nameCategory = category.nameCategory;
                categoryUiState.value.descriptionCategory = category.descriptionCategory || "";

                // Tip: Activa el modo edición en tu uiState
                categoryUiState.value.isEdit = true;
                categoryUiState.value.idCategory = category.idCategory;
                return category
            }
            return null;
        }catch (error: any) {
            categoryUiState.value.isLoading = false;
            categoryUiState.value.errorMessage = error || `Error al obtener categoria: ${id}`+id;
            return null
        } finally {
            categoryUiState.value.isLoading = false;
        }
    }

    return {
        allCategories,
        categoryUiState,
        getAllCategories,
        clear,
        addCategory,
        categoryById
    }
})