import { createRouter, createWebHistory } from "vue-router";
import CategoriesView from "@/views/CategoriesView.vue";
import HomeView from "@/views/HomeView.vue";

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
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router;