export type ProductSort = "recent" | "price-low" | "price-high";
export type ProductImage = {
    url: string;
    publicId: string;
    isCover: boolean;
};

export type ProductCategory = {
    _id: string;
    name: string;
};

export type ProductBrand = {
    _id: string;
    name: string;
};

export type ProductStatus = "active" | "inactive";

export type ProductSizes = "S" | "M" | "L" | "XL"

export type CustomerProduct = {
    _id: string;
    title: string;
    description: string;
    category: ProductCategory;
    brand: ProductBrand;
    stock: number;
    price: number;
    images: ProductImage[];
    colors: string[];
    sizes: ProductSizes[];
    salePercentage: number;
    status: ProductStatus;
    createdAt: string;
    updatedAt: string;
};

export type GetCustomerProductsParams = {
    category?: string;
    brandName?: string;
    color?: string;
    sizes?: string;
    sort?: ProductSort;
}
export type GetCustomerProductsDetailsResponse = {
    product: CustomerProduct;
    relatedProducts: CustomerProduct[];
}