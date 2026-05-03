import { Pencil, Trash2 } from "lucide-react";
import { Button } from "../../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { Badge } from "../../ui/badge";
import type { Product } from "@/features/admin/products/types";
import { getCoverImages } from "@/features/admin/products/use-product-add-form";

type ProductsTableProps = {
  products: Product[];
  onEdit: (product: Product) => void;
  loading: boolean;
};

export default function ProductsTable({
  products,
  onEdit,
  loading,
}: ProductsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-20">Image</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Brand</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>SalePercentage</TableHead>
          <TableHead>Stock</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading ? 
          <TableRow>
            <TableCell colSpan={8}>loading products...</TableCell></TableRow>:
            products.length === 0 ?
             <TableRow><TableCell colSpan={8}>No Products Found</TableCell></TableRow>
          
         : (
          products.map((product) => {
            const cover = getCoverImages(product.images);
            return (
              <TableRow key={product._id}>
                <TableCell>
                  <div className="h-12 w-12 rounded-lg border bg-muted flex items-center justify-center">
                    {cover ? (
                      <img
                        className="rounded-lg text-muted-foreground"
                        src={cover.url}
                        alt={product.title}
                      />
                    ) : null}
                  </div>
                </TableCell>
                <TableCell>{product.title}</TableCell>
                <TableCell>{product.category.name}</TableCell>
                <TableCell>{product.brand.name}</TableCell>
                <TableCell>{product.price}</TableCell>
                <TableCell>{product.salePercentage}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      product.status === "active" ? "default" : "secondary"
                    }
                  >
                    {" "}
                    {product.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      onClick={() => onEdit(product)}
                      variant="ghost"
                      size="icon"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })
        )}
      </TableBody>
    </Table>
  );
}
