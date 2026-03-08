export const COLLECTIONS = {
    CATEGORIES: 'Categories',
    PRODUCTS: 'Products',
} as const;

export type CollectionName = typeof COLLECTIONS[keyof typeof COLLECTIONS];