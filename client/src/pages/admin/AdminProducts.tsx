import ProductsTable from "@/components/admin/product/AdminProductsTable";
import BrandDialog from "@/components/admin/product/BrandDialog";
import CategoryDialog from "@/components/admin/product/CategoryDialog";
import ProductToolbar from "@/components/admin/product/Product-toolbar";
import ProductDialog from "@/components/admin/product/ProductDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAdminProducts } from "@/features/admin/products/use-admin-products";

export default function AdminProducts() {
  const {
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
    onEditPrduct
  } = useAdminProducts();

  return (
    <div className="space-y-6">
      <ProductToolbar
        search={search}
        onSearchChange={setSearch}
        onManageCategories={() => setCategoryDialogOpen(true)}
        onManageBrands={() => setBrandDialogOpen(true)}
        onAddProduct={openCreateProductDialog}
      />
      <Card>
        <CardContent className="p-0">
          <ProductsTable products={products??[]} onEdit={onEditPrduct} loading={loading}/>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing null of null products
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
      <ProductDialog
        open={productDialogOpen}
        openChange={(open) => {
          if (!open) {
            closeCreateProductDialog();
            return;
          }

          setProductDialogOpen(true);
        }}
        categories={categories ?? []}
        brands={brands ?? []}
        product={isEditingProduct}
        onSaved={refressAll}
        
      />

      <CategoryDialog
        open={categoryDialogOpen}
        onOpenChange={setCategoryDialogOpen}
        onSaved={refressAll}
        categories={categories ?? []}
      />
      <BrandDialog
        brands={brands ?? []}
        open={brandDialogOpen}
        onOpenChange={setBrandDialogOpen}
        onSaved={refressAll}
      />
    </div>
  );
}
