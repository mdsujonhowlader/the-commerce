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
import type { Promo, PromoFormValues } from "@/features/admin/promos/types";
import { useEffect, useState } from "react";

import { toDateTimeLocal } from "../../../utils/DateTimeHelper";

type AdminPromoDialogsProps = {
  open: boolean;
  promo: Promo | null;
  onOpenChange: (open: boolean) => void;
  saving: boolean;
  onSaved: (values: PromoFormValues) => Promise<void>;
};
const defaultFormValues: PromoFormValues = {
  code: "",
  percentage: "",
  count: "",
  minimumOrderValue: "",
  startAt: "",
  endsAt: "",
};
const AdminPromoDialogs = ({
  open,
  promo,
  onOpenChange,
  saving,
  onSaved,
}: AdminPromoDialogsProps) => {
  const [form, setForm] = useState<PromoFormValues>(defaultFormValues);
  const isEditedMode = !!promo;

  useEffect(() => {
    if (!open) {
      setForm(defaultFormValues);
      return;
    }
    if (promo) {
      setForm({
        code: promo.code,
        percentage: String(promo.percentage),
        count: String(promo.count),
        minimumOrderValue: String(promo.minimumOrderValue),
        startAt: toDateTimeLocal(promo.startAt),
        endsAt: toDateTimeLocal(promo.endsAt),
      });
      return;
    }
    setForm(defaultFormValues);
  }, [open, promo]);

  function updateFields<K extends keyof PromoFormValues>(
    key: K,
    value: PromoFormValues[K],
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  async function submit() {
    if (
      !form.code.trim() ||
      !form.count.trim() ||
      !form.percentage.trim() ||
      !form.minimumOrderValue.trim() ||
      !form.startAt.trim() ||
      !form.endsAt.trim()
    ) {
      return;
    }
    try {
      await onSaved({
        code: form.code.trim().toUpperCase(),
        percentage: form.percentage,
        count: form.count,
        minimumOrderValue: form.minimumOrderValue,
        startAt: new Date(form.startAt).toISOString(),
        endsAt: new Date(form.endsAt).toISOString(),
      });
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-2/3 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditedMode ? "Updating Promos" : "New Product Creating"}
          </DialogTitle>
          <DialogDescription>Add or Update Promos</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 w-full">
              <Label htmlFor="name">Promo Code</Label>
              <Input
                type="text"
                value={form.code}
                onChange={(event) => updateFields("code", event.target.value)}
                placeholder="SUMMARY10"
              />
            </div>
            <div className="space-y-2 w-full">
              <Label htmlFor="name">Discount Perchantage</Label>
              <Input
                type="number"
                value={form.percentage}
                min={"1"}
                max={"100"}
                onChange={(event) =>
                  updateFields("percentage", event.target.value)
                }
                placeholder="10"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 w-full">
              <Label htmlFor="name">Promo Count</Label>
              <Input
                type="number"
                value={form.count}
                onChange={(event) => updateFields("count", event.target.value)}
                placeholder="100"
              />
            </div>
            <div className="space-y-2 w-full">
              <Label htmlFor="name">Minimum Order Value</Label>
              <Input
                type="number"
                value={form.minimumOrderValue}
                onChange={(event) =>
                  updateFields("minimumOrderValue", event.target.value)
                }
                min={"1"}
                placeholder="1"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 w-full">
              <Label htmlFor="name">Valid From</Label>
              <Input
                type="datetime-local"
                value={form.startAt}
                onChange={(event) =>
                  updateFields("startAt", event.target.value)
                }
              />
            </div>
            <div className="space-y-2 w-full">
              <Label htmlFor="name">Valid Till</Label>
              <Input
                type="datetime-local"
                value={form.endsAt}
                onChange={(event) => updateFields("endsAt", event.target.value)}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={saving}>
            {saving ? "saving..." : isEditedMode ? "Update Promo" : "Add Promo"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AdminPromoDialogs;
