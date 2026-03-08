import { defineStore } from "pinia";
import { CategoryRepository } from "@/repositories/CategoryRepository";
import type { Unsubscribe } from "firebase/firestore";
import { Categories } from "@/models/Categories";
import { ref } from "vue";

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
        isModalVisible: false,
    })

    let stopListener: Unsubscribe | null = null;

    function openNewCategory() {
        clearForm();
        categoryUiState.value.isModalVisible = true;
    }

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

    async function addCategory() {
        const idCateGenerated = crypto.randomUUID();
        const currentState = categoryUiState.value;


        const category: Categories = {
            idCategory: idCateGenerated,
            nameCategory: currentState.nameCategory ?? '',
            descriptionCategory: currentState.descriptionCategory ?? '',
        }

        categoryUiState.value.isLoading = true;
        categoryUiState.value.errorMessage = null;
        categoryUiState.value.success = false;


        try{
            await CategoryRepository.addCategory(category);

            categoryUiState.value.success = true;
            categoryUiState.value.isLoading = false;
            categoryUiState.value.isModalVisible = false;
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

    async function updateCategory(): Promise<void> {
        const actualState = categoryUiState.value;
        const category: Categories = {
            idCategory: actualState.idCategory?? '',
            nameCategory: actualState.nameCategory?? '',
            descriptionCategory: actualState.descriptionCategory?? '',
        }

        categoryUiState.value.isLoading = true;
        categoryUiState.value.errorMessage = null;
        categoryUiState.value.success = false;

        try {
            await CategoryRepository.updateCategory(category);

            categoryUiState.value.success = true;
            categoryUiState.value.isLoading = false;
        }catch (e: any) {
            categoryUiState.value.isLoading = false;
            categoryUiState.value.errorMessage = e;
        }
    }

    async function deleteCategory(id: string): Promise<void> {
        categoryUiState.value.isLoading = true;
        categoryUiState.value.errorMessage = null;
        categoryUiState.value.success = false;

        try {
            await CategoryRepository.deleteCategory(id);
        } catch (error: any) {
            categoryUiState.value.isLoading = false;
            categoryUiState.value.errorMessage = error;
        }
    }

    function clearForm() {
        categoryUiState.value.isLoading = false;
        categoryUiState.value.isEdit = false;
        categoryUiState.value.errorMessage = null;
        categoryUiState.value.success = false;
        categoryUiState.value.idCategory = null;
        categoryUiState.value.nameCategory = ""; // Usa string vacío mejor que null para inputs
        categoryUiState.value.descriptionCategory = "";
        categoryUiState.value.nameError = null;
        categoryUiState.value.nameTouched = false;
        categoryUiState.value.isValid = false;
        categoryUiState.value.isModalVisible = false;
    }

    return {
        allCategories,
        categoryUiState,
        getAllCategories,
        clear,
        addCategory,
        categoryById,
        updateCategory,
        deleteCategory,
        clearForm,
        openNewCategory
    }
})