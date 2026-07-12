import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type {
  Brand,
  Category,
  Product,
  ProductStatus,
} from "@/features/admin/products/types";
import { useProductsAddForm } from "@/features/admin/products/use-product-add-form";
import ColorPicker from "./ColorPicker";
import ImagePicker from "./ImagePicker";
import SizeSelector from "./SizeSelector";

type ProductDialogProps = {
  open: boolean;
  categories: Category[];
  product: Product | null;
  brands: Brand[];
  onSaved: () => Promise<void>;
  openChange: (open: boolean) => void;
};
export default function ProductDialog({
  open,
  categories,
  product,
  onSaved,
  brands,
  openChange,
}: ProductDialogProps) {
  const {
    forms,
    addColor,
    removeColor,
    addFiles,
    toggleSizes,
    submit,
    updatedField,
    saving,
    isEditMode,
    removeExistingImages,
    changeCoverImage,
  } = useProductsAddForm({
    open,
    product,
    onSaved,
    onClose: () => openChange(false),
  });

  return (
    <Dialog open={open} onOpenChange={openChange}>
      <DialogContent className="w-2/3 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Update Product" : "Add New Product"}
          </DialogTitle>
          <DialogDescription>
            Fill in the product details below to add a new product.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* grid grid-cols-2 gap-4 */}
          <div className="">
            <div className="space-y-2 w-full">
              <Label htmlFor="name">Product Title</Label>
              <Input
                value={forms.title}
                onChange={(event) => updatedField("title", event.target.value)}
                type="text"
                placeholder="Enter product title"
              />
            </div>
            {/* <div className="space-y-2">
              <Label htmlFor="sku">SKU</Label>
              <Input id="sku" placeholder="e.g., PROD-001" />
            </div> */}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              value={forms.description}
              onChange={(event) =>
                updatedField("description", event.target.value)
              }
              placeholder="Enter product description"
              rows={3}
            />
          </div>

          {/* Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            {/* Brand */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Brand</Label>
              <Select
                value={forms.brand}
                onValueChange={(value) => updatedField("brand", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Brand" />
                </SelectTrigger>
                <SelectContent>
                  {brands.map((brandItem) => (
                    <SelectItem key={brandItem._id} value={brandItem._id}>
                      {brandItem.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Category</Label>
              <Select
                value={forms.category}
                onValueChange={(value) => updatedField("category", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat._id} value={cat._id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Price & Stock */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price (Taka)</Label>
              <Input
                value={forms.price}
                onChange={(event) => updatedField("price", event.target.value)}
                type="number"
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock">Stock Quantity</Label>
              <Input
                value={forms.stock}
                onChange={(event) => updatedField("stock", event.target.value)}
                type="number"
                placeholder="0"
              />
            </div>
          </div>

          {/* Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <div className="space-y-2">
              <Label htmlFor="salePerchantage">Sale Perchantage</Label>
              <Input
                value={forms.salePercentage}
                onChange={(event) =>
                  updatedField("salePercentage", event.target.value)
                }
                type="number"
                placeholder="Sale Perchantage %"
              />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={forms.status}
                onValueChange={(value) =>
                  updatedField("status", value as ProductStatus)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="w-full">
            <div className="grid grid-cols-2 gap-4">
              <ColorPicker
                colors={forms.colors}
                onAdd={addColor}
                onRemove={removeColor}
              />
              <SizeSelector
                selectedSizes={forms.sizes}
                onToggle={toggleSizes}
              />
            </div>
          </div>

          {/* Image Upload */}
          <ImagePicker
            existingImages={forms.existingImages}
            newFiles={forms.newFiles}
            coverImagePublicId={forms.coverImagePublicId}
            onFileAdd={addFiles}
            onRemoveExistingImages={removeExistingImages}
            onChangeCoverImage={changeCoverImage}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => openChange(false)}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={saving}>
            {saving
              ? "saving..."
              : isEditMode
                ? "Update Product"
                : "Add Product"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
