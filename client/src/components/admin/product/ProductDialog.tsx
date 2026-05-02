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
import ColorPicker from "./ColorPicker";
import SizeSelector from "./SizeSelector";
import ImagePicker from "./ImagePicker";
import type { Brand, Category } from "@/features/admin/products/types";

type ProductDialogProps = {
  open: boolean;
  categories:Category[],
  brands:Brand[],
  openChange: (open: boolean) => void;
};
export default function ProductDialog({
  open,
  categories,
  brands,
  openChange,
}: ProductDialogProps) {
  return (
    <Dialog open={open} onOpenChange={openChange}>
      <DialogContent className="w-2/3 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
          <DialogDescription>
            Fill in the product details below to add a new product.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* grid grid-cols-2 gap-4 */}
          <div className="">
            <div className="space-y-2 w-full">
              <Label htmlFor="name">Product Title</Label>
              <Input type="text" placeholder="Enter product title" />
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
              id="description"
              placeholder="Enter product description"
              rows={3}
            />
          </div>

          {/* Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            {/* Brand */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Brand</Label>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Brand" />
                </SelectTrigger>
                <SelectContent>
                  {
                    brands.map((brandItem)=>(

                  <SelectItem key={brandItem._id} value={brandItem.name}>{brandItem.name}</SelectItem>
                    ))
                    }
                </SelectContent>
              </Select>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Category</Label>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {
                    categories.map(cat=>(

                  <SelectItem key={cat._id} value={cat.name}>{cat.name}</SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Price & Stock */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price (Taka)</Label>
              <Input id="price" type="number" step="0.01" placeholder="0.00" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock">Stock Quantity</Label>
              <Input id="stock" type="number" placeholder="0" />
            </div>
          </div>

          {/* Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <div className="space-y-2">
              <Label htmlFor="salePerchantage">Sale Perchantage</Label>
              <Input type="number" placeholder="Sale Perchantage %" />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select>
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
              <ColorPicker />
              <SizeSelector />
            </div>
          </div>

          {/* Image Upload */}
         <ImagePicker/>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={()=>openChange(false)}>Cancel</Button>
          <Button>Add Product</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
