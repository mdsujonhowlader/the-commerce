import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  createAdminPromos,
  deleteAdminPromos,
  getAdminPromos,
  updateAdminPromos,
} from "./api";
import type { Promo, PromoFormValues } from "./types";

export function useAdminPromos() {
  const [search, setSearch] = useState("");
  const [promos, setPromos] = useState<Promo[]>([]);
  const [loading, setLoading] = useState(false);
  const [promoDialogOpen, setPromoDialogOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<Promo | null>(null);
  const [deletingPromoId, setDeletingPromoId] = useState("");
  const [saving, setSaving] = useState(false);

  async function refreshAll() {
    try {
      setLoading(true);
      const response = await getAdminPromos();
      setPromos((response ?? { items: [] }).items);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refreshAll();
  }, []);

  const filteredPromos = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return promos;
    return promos.filter((promo) => promo.code.toLowerCase().includes(query));
  }, [promos, search]);

  function createPromoOpenDialog() {
    setEditingPromo(null);
    setPromoDialogOpen(true);
  }

  function closePromoDialog() {
    setEditingPromo(null);
    setPromoDialogOpen(false);
  }
  function onEditDialogOpen(promo: Promo) {
    setEditingPromo(promo);
    setPromoDialogOpen(true);
  }

  async function savePromo(values: PromoFormValues) {
    try {
      setSaving(true);

      const response = editingPromo
        ? await updateAdminPromos(editingPromo._id, values)
        : await createAdminPromos(values);

      setPromos((response ?? { items: [] }).items);
      closePromoDialog();
      toast("Promos Updated Successfully");
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  }

  async function removePromo(promoId: string) {
    const confirmed = window.confirm("Are you want to delete this promo");

    if (!confirmed) return;

    try {
      setDeletingPromoId(promoId);
      const response = await deleteAdminPromos(promoId);
      setPromos((response ?? { items: [] }).items);
      toast("Promos Deleted Successfully");
    } catch (error) {
      console.error(error);
    } finally {
      setDeletingPromoId("");
    }
  }

  return {
    search,
    setSearch,
    saving,
    promos: filteredPromos,
    loading,
    promoDialogOpen,
    setPromoDialogOpen,
    editingPromo,
    setEditingPromo,
    createPromoOpenDialog,
    closePromoDialog,
    refreshAll,
    savePromo,
    removePromo,
    deletingPromoId,
    onEditDialogOpen,
  };
}
