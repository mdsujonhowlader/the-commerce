import { useState } from "react";
import {
  type Product,
  type ProductAddFormState,
  type ProductImage,
} from "./types";
import { createAdminProduct, updateAdminProduct } from "./api";
import { toast } from "sonner";

type productAddFormProps = {
  open: boolean;
  product: Product | null;
  onSaved: () => Promise<void>;
  onClose: () => void;
};

export function getCoverImages(images: ProductImage[] = []) {
  return images.find((img) => img.isCover) ?? images[0];
}

function getEmptyForms(): ProductAddFormState {
  return {
    title: "",
    description: "",
    category: "",
    brand: "",
    stock: "",
    price: "",
    colors: [],
    sizes: [],
    salePercentage: "0",
    status: "active",
    existingImages: [],
    newFiles: [],
    coverImagePublicId: "",
  };
}

function mapProductToFormValues(product: Product): ProductAddFormState {
  const cover = getCoverImages(product.images);
  return {
    title: product.title,
    description: product.description,
    category: product.category._id,
    brand: product.brand._id,
    stock: String(product.stock),
    price: String(product.price),
    colors: product.colors ?? [],
    sizes: product.sizes ?? [],
    salePercentage: String(product.salePercentage ?? "0"),
    status: product.status,
    existingImages: product.images ?? [],
    newFiles: [],
    coverImagePublicId: cover?.publicId ?? "",
  };
}

export function useProductsAddForm({
  open,
  product,
  onSaved,
  onClose,
}: productAddFormProps) {
  const [forms, setForms] = useState<ProductAddFormState>(getEmptyForms());
  const [prevProduct, setPrevProduct] = useState<Product | null>(null);
  const [prevOpen, setPrevOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // useEffect(() => {
  //   setForms(open && product ? mapProductToFormValues(product) : getEmptyForms());
  // }, [open, product]);


  if (product !== prevProduct || open !== prevOpen) {
    setPrevProduct(product);
    setPrevOpen(open);
    setForms(open && product ? mapProductToFormValues(product) : getEmptyForms());
  }

  function toggleSizes(size: string) {
    setForms((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((item) => item !== size)
        : [...prev.sizes, size],
    }));
  }
  function addColor(color: string) {
    setForms((prev) => ({
      ...prev,
      colors: prev.colors.includes(color)
        ? prev.colors
        : [...prev.colors, color],
    }));
  }

  function removeColor(color: string) {
    setForms((prev) => ({
      ...prev,
      colors: prev.colors.filter((item) => item !== color),
    }));
  }

  function addFiles(files: FileList | null) {
    if (!files?.length) return;
    setForms((prev) => ({
      ...prev,
      newFiles: [...prev.newFiles, ...Array.from(files)],
    }));
  }

  function updatedField<K extends keyof ProductAddFormState>(
    key: K,
    value: ProductAddFormState[K],
  ) {
    setForms((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function removeExistingImages(publicId: string) {
    setForms((prev) => {
      const nextImages = prev.existingImages.filter(
        (img) => img.publicId !== publicId,
      );

      const nextcoverImageId =
        prev.coverImagePublicId === publicId
          ? (nextImages[0]?.publicId ?? "")
          : prev.coverImagePublicId;
      return {
        ...prev,
        existingImages: nextImages,
        coverImagePublicId: nextcoverImageId,
      };
    });
  }

  function changeCoverImage(publicId: string) {
    updatedField("coverImagePublicId", publicId);
  }
  async function submit() {
    if (
      !forms.title.trim() ||
      !forms.description.trim() ||
      !forms.category.trim() ||
      !forms.brand.trim()
    )
      return;
    try {
      setSaving(true);
      if (product) {
        //edit
        await updateAdminProduct(
          product._id,
          {
            title: forms.title.trim(),
            description: forms.description.trim(),
            category: forms.category,
            brand: forms.brand,
            stock: Number(forms.stock),
            price: Number(forms.price),
            colors: forms.colors,
            sizes: forms.sizes,
            salePercentage: Number(forms.salePercentage || 0),
            status: forms.status,
            existingImages: forms.existingImages,
            coverImagePublicId: forms.coverImagePublicId || undefined,
          },
          forms.newFiles,
        );
        toast("Product Updated Successfully");
      } else {
        await createAdminProduct(
          {
            title: forms.title.trim(),
            description: forms.description.trim(),
            category: forms.category,
            brand: forms.brand,
            stock: Number(forms.stock),
            price: Number(forms.price),
            colors: forms.colors,
            sizes: forms.sizes,
            salePercentage: Number(forms.salePercentage || 0),
            status: forms.status,
          },
          forms.newFiles,
        );
        toast("Product uploaded Successfully");
      }
      await onSaved();
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  }

  return {
    forms,
    isEditMode: !!product,
    addColor,
    removeColor,
    toggleSizes,
    addFiles,
    updatedField,
    saving,
    submit,
    removeExistingImages,
    changeCoverImage,
  };
}
