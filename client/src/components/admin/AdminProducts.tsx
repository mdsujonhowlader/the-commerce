import { useState } from "react";
import { Plus, Search, Pencil, Trash2, ImageIcon } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Badge } from "../ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

// ────────────────────────────────────────────
// Types
// ────────────────────────────────────────────

type ProductStatus = "active" | "inactive";

interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  status: ProductStatus;
  image: string | null; // Fix #5 — proper type
}

interface Category {
  id: string;
  name: string;
  count: number;
}

// ────────────────────────────────────────────
// Data
// ────────────────────────────────────────────

const initialCategories: Category[] = [
  { id: "1", name: "Electronics", count: 45 },
  { id: "2", name: "Clothing", count: 32 },
  { id: "3", name: "Home & Garden", count: 28 },
  { id: "4", name: "Sports", count: 19 },
  { id: "5", name: "Books", count: 12 },
];

const initialProducts: Product[] = [
  {
    id: "1",
    name: "Wireless Headphones",
    sku: "WH-001",
    category: "Electronics",
    price: 299.0,
    stock: 45,
    status: "active",
    image: null,
  },
  {
    id: "2",
    name: "Smart Watch Pro",
    sku: "SW-002",
    category: "Electronics",
    price: 499.0,
    stock: 23,
    status: "active",
    image: null,
  },
  {
    id: "3",
    name: "Laptop Stand",
    sku: "LS-003",
    category: "Home & Garden",
    price: 79.0,
    stock: 67,
    status: "active",
    image: null,
  },
  {
    id: "4",
    name: "USB-C Hub",
    sku: "UH-004",
    category: "Electronics",
    price: 149.0,
    stock: 0,
    status: "inactive",
    image: null,
  },
  {
    id: "5",
    name: "Mechanical Keyboard",
    sku: "MK-005",
    category: "Electronics",
    price: 189.0,
    stock: 34,
    status: "active",
    image: null,
  },
];

// ────────────────────────────────────────────
// ProductsTable
// ────────────────────────────────────────────

function ProductsTable({
  products,
  onEdit,
  onDelete,
}: {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-20">Image</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>SKU</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Stock</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.id}>
            <TableCell>
              <div className="h-12 w-12 rounded-lg border bg-muted flex items-center justify-center">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover rounded-lg"
                  />
                ) : (
                  <ImageIcon className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
            </TableCell>
            <TableCell className="font-medium">{product.name}</TableCell>
            <TableCell className="text-muted-foreground">{product.sku}</TableCell>
            <TableCell>{product.category}</TableCell>
            <TableCell className="font-medium">
              ${product.price.toFixed(2)}
            </TableCell>
            <TableCell>
              <span
                className={
                  product.stock === 0
                    ? "text-red-600"
                    : product.stock < 10
                    ? "text-yellow-600"
                    : ""
                }
              >
                {product.stock}
              </span>
            </TableCell>
            <TableCell>
              <Badge
                variant={product.status === "active" ? "default" : "secondary"}
              >
                {product.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-end gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(product)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(product.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

// ────────────────────────────────────────────
// ProductDialog
// ────────────────────────────────────────────

// Fix #1 & #2 — onSave receives a single Product, not array
function ProductDialog({
  open,
  onOpenChange,
  product,
  onSave,
  categories,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  onSave: (data: Omit<Product, "id"> & { id?: string }) => void;
  categories: Category[];
}) {
  const [name, setName] = useState(product?.name ?? "");
  const [sku, setSku] = useState(product?.sku ?? "");
  const [category, setCategory] = useState(product?.category ?? "");
  const [price, setPrice] = useState(product?.price?.toString() ?? "");
  const [stock, setStock] = useState(product?.stock?.toString() ?? "");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<ProductStatus>(product?.status ?? "active");
  const [image, setImage] = useState<string | null>(product?.image ?? null);

  const handleSave = () => {
    onSave({
      id: product?.id,
      name,
      sku,
      category,
      price: parseFloat(price) || 0,
      stock: parseInt(stock) || 0,
      status,
      image,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {product ? "Edit Product" : "Add New Product"}
          </DialogTitle>
          <DialogDescription>
            {product
              ? "Update product details below."
              : "Fill in the product details below to add a new product."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Image Upload */}
          <div className="space-y-2">
            <Label>Product Image</Label>
            <div className="flex items-center gap-4">
              <div className="h-32 w-32 rounded-lg border-2 border-dashed flex items-center justify-center bg-muted">
                {image ? (
                  <img
                    src={image}
                    alt="Preview"
                    className="h-full w-full object-cover rounded-lg"
                  />
                ) : (
                  <ImageIcon className="h-8 w-8 text-muted-foreground" />
                )}
              </div>
              <Button
                variant="outline"
                onClick={() => setImage("https://picsum.photos/200")}
              >
                Upload Image
              </Button>
            </div>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter product name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sku">SKU</Label>
              <Input
                id="sku"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="e.g., PROD-001"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter product description"
              rows={3}
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.name}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Price & Stock */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock">Stock Quantity</Label>
              <Input
                id="stock"
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="0"
              />
            </div>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label>Status</Label>
            {/* Fix — status is typed as ProductStatus, no cast needed */}
            <Select
              value={status}
              onValueChange={(val) => setStatus(val as ProductStatus)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {product ? "Update" : "Add"} Product
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ────────────────────────────────────────────
// CategoryDialog
// ────────────────────────────────────────────

function CategoryDialog({
  open,
  onOpenChange,
  categories,
  onAddCategory,
  onDeleteCategory,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: Category[];
  onAddCategory: (name: string) => void;
  onDeleteCategory: (id: string) => void;
}) {
  const [newCategory, setNewCategory] = useState("");

  const handleAdd = () => {
    if (newCategory.trim()) {
      onAddCategory(newCategory.trim());
      setNewCategory("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage Categories</DialogTitle>
          <DialogDescription>
            Add or remove product categories.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex gap-2">
            <Input
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="New category name"
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            />
            <Button onClick={handleAdd}>Add</Button>
          </div>

          <div className="space-y-2">
            <Label>Existing Categories</Label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <Badge key={cat.id} variant="outline" className="gap-2">
                  {cat.name}
                  <button
                    className="ml-1 hover:text-destructive"
                    onClick={() => onDeleteCategory(cat.id)}
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ────────────────────────────────────────────
// AdminProducts (main)
// ────────────────────────────────────────────

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.sku.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || product.category === categoryFilter;
    const matchesStatus =
      statusFilter === "all" || product.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  // Fix #1 & #2 — correct type: single product partial
  const handleSaveProduct = (data: Omit<Product, "id"> & { id?: string }) => {
    if (data.id) {
      setProducts((prev) =>
        prev.map((p) => (p.id === data.id ? { ...p, ...data } : p))
      );
    } else {
      const newProduct: Product = {
        id: Date.now().toString(),
        name: data.name,
        sku: data.sku,
        category: data.category,
        price: data.price,
        stock: data.stock,
        status: data.status,
        image: data.image,
      };
      setProducts((prev) => [...prev, newProduct]);
    }
    setEditingProduct(null);
  };

  const handleAddCategory = (name: string) => {
    setCategories((prev) => [
      ...prev,
      { id: Date.now().toString(), name, count: 0 },
    ]);
  };

  const handleDeleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  const handleOpenAddDialog = () => {
    setEditingProduct(null); // Fix #3 — reset editing state
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Products</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setCategoryDialogOpen(true)}
          >
            Categories
          </Button>
          {/* Fix #4 — removed conflicting DialogTrigger, using plain Button */}
          <Button onClick={handleOpenAddDialog}>
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="pl-9"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.name}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardContent className="p-0">
          <ProductsTable
            products={filteredProducts}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredProducts.length} of {products.length} products
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

      {/* Fix #3 — key prop forces remount when switching add/edit */}
      <ProductDialog
        key={editingProduct?.id ?? "new"}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        product={editingProduct}
        onSave={handleSaveProduct}
        categories={categories}
      />

      <CategoryDialog
        open={categoryDialogOpen}
        onOpenChange={setCategoryDialogOpen}
        categories={categories}
        onAddCategory={handleAddCategory}
        onDeleteCategory={handleDeleteCategory}
      />
    </div>
  );
}