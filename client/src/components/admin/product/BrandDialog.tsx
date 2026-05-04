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
import { createAdminBrand, updateBrand } from "@/features/admin/products/api";
import type { Brand } from "@/features/admin/products/types";
import { Pencil, Tag } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type BrandInfoProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  brands: Brand[];
  onSaved: () => Promise<void>;
};

export default function BrandDialog({
  open,
  onOpenChange,
  brands,
  onSaved,
}: BrandInfoProps) {
  const [name, setName] = useState("");
  const [editBrand, setEditBrand] = useState<Brand | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleBrandCreate() {
    if (!name.trim()) return;
    try {
      setSaving(true);
      if (editBrand) {
        await updateBrand(editBrand._id, { name: name.trim() });

        toast("Brand Update successfully", { position: "top-center" });
      } else {
        await createAdminBrand({ name: name.trim() });
        toast("Brand create successfully", { position: "top-center" });
      }
      setName("");
      await onSaved();
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  }

  function handleEditBrand(getCurrentBrand: Brand) {
    setEditBrand(getCurrentBrand);
    setName(getCurrentBrand.name);
  }
  function handleClose(nextOpen: boolean) {
    if (!nextOpen) {
      setName("");
      setEditBrand(null);
    }
    onOpenChange(nextOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-2/3 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Brands</DialogTitle>
          <DialogDescription>Add or remove product Brands.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex gap-2">
            <Input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="New Brand name"
            />
            <Button
              onClick={handleBrandCreate}
              disabled={saving || !name.trim()}
            >
              {editBrand ? "Update" : "Add"}
            </Button>
          </div>

          <div className="space-y-2">
            <Label>Existing Brand</Label>
            <div className="flex flex-wrap gap-2">
              {brands.map((brand) => (
                <div
                  key={brand._id}
                  className="flex items-center justify-between rounded-full border border-border bg-card px-2"
                >
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">
                      {brand.name}
                    </span>
                  </div>
                  <Button
                    type="button"
                    size="icon-xs"
                    variant="ghost"
                    className="hover:rounded-full"
                    onClick={() => handleEditBrand(brand)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={()=>onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
