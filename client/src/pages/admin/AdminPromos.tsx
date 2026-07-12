import AdminPromoDialogs from "@/components/admin/promos/PromoDialogs";
import AdminPromoTable from "@/components/admin/promos/PromoTable";
import AdminPromoToolbal from "@/components/admin/promos/PromoToolBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAdminPromos } from "@/features/admin/promos/use-admin-promos";

export default function AdminPromos() {
  const {
    search,
    setSearch,
    saving,
    promos,
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
  } = useAdminPromos();

  return (
    <div className="space-y-6">
      <AdminPromoToolbal
        search={search}
        onSearchChange={setSearch}
        onAddPromo={createPromoOpenDialog}
      />
      <Card>
        <CardContent className="p-0">
          <AdminPromoTable />
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing null of null Promos
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm">
            Next
          </Button>
        </div>
      </div>
      <AdminPromoDialogs
        open={promoDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            closePromoDialog();
            return;
          }
          setPromoDialogOpen(true);
        }}
        promo={editingPromo}
        saving={saving}
        onSaved={savePromo}
      />
    </div>
  );
}
