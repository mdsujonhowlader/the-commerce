import { apiDelete, apiGet, apiPost, apiPut } from "@/lib/api";
import type {
  Brand,
  Category,
  createBrandBody,
  createCategoryBody,
  CreatePorductBody,
  Product,
  updateBrandBody,
  updateCategoryBody,
  UpdatePorductBody,
} from "./types";

type DeleteResponse = {
  message: string;
};
export async function getAdminCategories() {
  return apiGet<Category[]>(`/admin/categories`);
}

export async function createAdminCategory(body: createCategoryBody) {
  return apiPost<Category, createCategoryBody>("/admin/categories", body);
}

export async function updateCategory(cateId: string, body: updateCategoryBody) {
  return apiPut<Category, updateCategoryBody>(
    `/admin/categories/${cateId}`,
    body,
  );
}

export async function deleteCategory(cateId: string) {
  return apiDelete<DeleteResponse>(`/admin/categories/${cateId}`);
}

//brand
export async function getAdminBrands() {
  return apiGet<Brand[]>(`/admin/brands`);
}
export async function createAdminBrand(body: createBrandBody) {
  return apiPost<Brand, createBrandBody>("/admin/brand", body);
}

export async function updateBrand(brandId: string, body: updateBrandBody) {
  return apiPut<Brand, updateBrandBody>(`/admin/brand/${brandId}`, body);
}

export async function deleteBrand(brandId: string) {
  return apiDelete<DeleteResponse>(`/admin/brand/${brandId}`);
}

//product
export async function getAdminProducts(search?: string) {
  const query = search?.trim()
    ? `/admin/products?search=${encodeURIComponent(search.trim())}`
    : `/admin/products`;
  return apiGet<Product[]>(query);
}

export async function getAdminProductById(productId: string) {
  return apiGet<Product>(`/admin/products/${productId}`);
}

function buildProductFormData(
  body: CreatePorductBody | UpdatePorductBody,
  files: File[],
) {
  const formData = new FormData();
  formData.append("title", body.title);
  formData.append("description", body.description);
  formData.append("category", body.category);
  formData.append("brand", body.brand);
  formData.append("stock", String(body.stock));
  formData.append("price", String(body.price));
  formData.append("salePercentage", String(body.salePercentage));
  formData.append("status", body.status);

  body.colors.forEach((color) => formData.append("colors", color));
  body.sizes.forEach((size) => formData.append("sizes", size));

  if ("existingImages" in body && body.existingImages) {
    formData.append("existingImages", JSON.stringify(body.existingImages));
  }
  if ("coverImagePublicId" in body && body.coverImagePublicId) {
    formData.append("coverImagePublicId", body.coverImagePublicId);
  }

  files.forEach((file) => formData.append("images", file));
  return formData;
}

export async function createAdminProduct(
  body: CreatePorductBody,
  files: File[],
) {
  const formData = buildProductFormData(body, files);

  return apiPost<Product, FormData>("/admin/product", formData);
}

export async function updateAdminProduct(
  productId: string,
  body: UpdatePorductBody,
  files: File[],
) {
  const formData = buildProductFormData(body, files);

  return apiPut<Product, FormData>(`/admin/product/${productId}`, formData);
}


