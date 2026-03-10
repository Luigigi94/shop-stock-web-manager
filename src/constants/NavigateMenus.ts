export const NAVIGATE_MENU = {
    HOME: '/',
    CATEGORIES: '/categories',
    PRODUCTS: '/products',
    CLIENTS: '/clients',
    SUPPLIERS: '/suppliers',
} as const;

export type NavigateMenus = typeof NAVIGATE_MENU[keyof typeof NAVIGATE_MENU];