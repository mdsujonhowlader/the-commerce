import { useCallback, useEffect, useState } from "react";
import type { Brand, Category, Product } from "./types";
import { getAdminBrands, getAdminCategories, getAdminProducts } from "./api";

export function useAdminProducts() {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<Product[] | null>(null);
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [brands, setBrands] = useState<Brand[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [brandDialogOpen, setBrandDialogOpen] = useState(false);
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [isEditingProduct, setIsEditingProduct] = useState<Product | null>(
    null,
  );

  const loadCategories = useCallback(async () => {
    const data = await getAdminCategories();
    setCategories(data ?? []);
  }, []);

  const loadBrands = useCallback(async () => {
    const data = await getAdminBrands();
    setBrands(data ?? []);
  }, []);

  const loadProducts = useCallback(async (searchValue = "") => {
    setLoading(true);
    try {
      const data = await getAdminProducts(searchValue);
      setProducts(data ?? []);
    } catch (error) {
      console.error("failed to loading data", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const openCreateProductDialog = () => {
    setIsEditingProduct(null);
    setProductDialogOpen(true);
  };

  const onEditPrduct = (product: Product) => {
    setIsEditingProduct(product);
    setProductDialogOpen(true);
  };
  const closeCreateProductDialog = () => {
    setProductDialogOpen(false);
    setIsEditingProduct(null);
  };

  const refressAll = useCallback(async () => {
    await Promise.all([loadCategories(), loadBrands(), loadProducts(search)]);
  }, [loadBrands, loadCategories, loadProducts, search]);

  useEffect(() => {
    let isMounted = true;
    const initData = async () => {
      if (isMounted) {
        await Promise.all([loadCategories(), loadBrands()]);
      }
    };

    void initData();
    return () => {
      isMounted = false;
    };
  }, [loadCategories, loadBrands]);

  // useEffect(() => {
  //   void loadBrands();
  // }, [loadBrands]);

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadProducts(search);
    }, 250);
    return () => clearTimeout(timer);
  }, [search, loadProducts]);
  return {
    search,
    setSearch,
    products,
    categories,
    brands,
    loading,
    categoryDialogOpen,
    setCategoryDialogOpen,
    brandDialogOpen,
    setBrandDialogOpen,
    productDialogOpen,
    setProductDialogOpen,
    isEditingProduct,
    openCreateProductDialog,
    closeCreateProductDialog,
    refressAll,
    onEditPrduct,
  };
}
