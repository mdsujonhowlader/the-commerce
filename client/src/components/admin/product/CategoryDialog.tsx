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
  createAdminCategory,
  updateCategory,
} from "@/features/admin/products/api";
import type { Category } from "@/features/admin/products/types";
import { Pencil, Tag } from "lucide-react";

import { useState } from "react";
import { toast } from "sonner";

type CategoryInfoProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: Category[];
  onSaved: () => Promise<void>;
};

export default function CategoryDialog({
  open,
  onOpenChange,
  categories,
  onSaved,
}: CategoryInfoProps) {
  const [name, setName] = useState("");
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSaveCategory() {
    if (!name.trim()) return;
    try {
      setSaving(true);
      if (editingCategory) {
        await updateCategory(editingCategory._id, { name: name.trim() });
      } else {
        await createAdminCategory({ name: name.trim() });
        toast("Category create successfully", { position: "top-center" });
      }
      setName("");
      setEditingCategory(null);
      await onSaved();
    } catch (error) {
      console.log(error);
    } finally {
      setSaving(false);
    }
  }

  function handleEditBtn(getCurrentCategory: Category) {
    setEditingCategory(getCurrentCategory);
    setName(getCurrentCategory.name);
  }

  function handleClose(nextOpen: boolean) {
    if (!nextOpen) {
      setName("");
      setEditingCategory(null);
    }
    onOpenChange(nextOpen);
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-2/3 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Categories</DialogTitle>
          <DialogDescription>
            Add or remove product categories.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex gap-2">
            <Input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="New category name"
            />
            <Button
              onClick={handleSaveCategory}
              disabled={saving || !name.trim()}
            >
              {editingCategory ? "Update" : "Add"}
            </Button>
          </div>

          <div className="space-y-2">
            <Label>Existing Categories</Label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <div
                  key={cat._id}
                  className="flex items-center justify-between rounded-full border border-border bg-card px-2"
                >
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">
                      {cat.name}
                    </span>
                  </div>
                  <Button
                    onClick={() => handleEditBtn(cat)}
                    type="button"
                    size="icon-xs"
                    variant="ghost"
                    className="hover:rounded-full"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleClose(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
