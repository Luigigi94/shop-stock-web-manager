export const COLLECTIONS = {
    CATEGORIES: 'Categories',
    PRODUCTS: 'Products',
    CLIENTS: 'Clients',
    SUPPLIERS: 'Supplier',
    CART: 'Carts',
} as const;

export type CollectionName = typeof COLLECTIONS[keyof typeof COLLECTIONS];