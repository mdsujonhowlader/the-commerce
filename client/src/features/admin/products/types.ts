export type Category = {
  _id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
};

export type Brand = {
  _id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
};

export type ProductImage = {
  url: string;
  publicId: string;
  isCover: boolean;
};

export type ProductCategory = {
  _id: string;
  name: string;
};

export type ProductBanner = {
  _id: string;
  name: string;
};

export type ProductStatus = "active" | "inactive";

export type Product = {
  _id: string;
  titile: string;
  description: string;
  category: ProductCategory;
  brand: ProductBanner;
  stock: number;
  price: number;
  images: ProductImage[];
  colors: string[];
  sizes: string[];
  salePercentage: number;
  status: ProductStatus;
  createdAt: string;
  updatedAt: string;
};

export type createCategoryBody = {
  name: string;
};
export type updateCategoryBody = {
  name: string;
};

export type CreatePorductBody = {
  titile: string;
  description: string;
  category: ProductCategory;
  brand: ProductBanner;
  stock: number;
  price: number;
  images: ProductImage[];
  colors: string[];
  sizes: string[];
  salePercentage: number;
  status: ProductStatus;
};

export type UpdatePorductBody = {
  titile: string;
  description: string;
  category: ProductCategory;
  brand: ProductBanner;
  stock: number;
  price: number;
  colors: string[];
  sizes: string[];
  salePercentage: number;
  status: ProductStatus;
  existingImages?: ProductImage[];
  coverImagePublicId?: string;
};


