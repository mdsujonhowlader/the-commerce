import {apiGet} from "@/lib/api.ts";
import type {ProductBrand, ProductCategory} from "@/features/customer/products/types.ts";


export async function getCustomerCategories(){
    return apiGet<ProductCategory>("/customer/categories");
}
export async function getCustomerBrands(){
    return apiGet<ProductBrand>("/customer/brands");
}

