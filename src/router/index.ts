import { createRouter, createWebHistory } from "vue-router";
import CategoriesView from "@/views/CategoriesView.vue";
import HomeView from "@/views/HomeView.vue";
import ProductsView from "@/views/ProductsView.vue";
import ClientsView from "@/views/ClientsView.vue";
import SuppliersView from "@/views/SuppliersView.vue";

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
    },
    {
        path: "/clients",
        name: "Clients",
        component: ClientsView,
    },
    {
        path: "/suppliers",
        name: "Suppliers",
        component: SuppliersView,
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router;