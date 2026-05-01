import ProductsTable, {
  ProductDialog,
} from "@/components/admin/product/AdminProducts";
import CategoryDialog from "@/components/admin/product/CategoryDialog";
import ProductToolbar from "@/components/admin/product/Product-toolbar";
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
    closeCreateProductDialog
  } = useAdminProducts();

  return (
    <div className="space-y-6">
      <ProductToolbar search={search} onSearchChange={setSearch} onManageCategories={()=>setCategoryDialogOpen(true)} onManageBrands={()=>setBrandDialogOpen(true)} onAddProduct={openCreateProductDialog} />
      <Card>
        <CardContent className="p-0">
          <ProductsTable />
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
      <ProductDialog />

      <CategoryDialog />
    </div>
  );
}
