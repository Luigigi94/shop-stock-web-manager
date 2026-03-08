import { createRouter, createWebHistory } from "vue-router";
import CategoriesView from "@/views/CategoriesView.vue";
import HomeView from "@/views/HomeView.vue";
import ProductsView from "@/views/ProductsView.vue";

const routes = [
    {
        path: "/",
        name: "Home",
        component: HomeView
    },
    {
        path: "/categories",
        name: "Categories",
        component: CategoriesView,
    },
    {
        path: "/products",
        name: "Products",
        component: ProductsView,
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router;