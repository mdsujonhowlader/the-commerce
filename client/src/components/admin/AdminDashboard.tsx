import {
  DollarSign,
  ShoppingCart,
  Users,
  TrendingUp,
  TrendingDown,
  Package,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Badge } from "../ui/badge";

const stats = [
  {
    title: "Total Revenue",
    value: "$45,231.89",
    change: "+20.1%",
    trend: "up",
    icon: DollarSign,
  },
  {
    title: "Orders",
    value: "+2350",
    change: "+180.1%",
    trend: "up",
    icon: ShoppingCart,
  },
  {
    title: "Active Users",
    value: "+573",
    change: "+201",
    trend: "up",
    icon: Users,
  },
  {
    title: "Expenses",
    value: "$12,234.59",
    change: "-4.5%",
    trend: "down",
    icon: TrendingDown,
  },
] as const;

const recentOrders = [
  {
    id: "ORD-001",
    customer: "John Doe",
    product: "Wireless Headphones",
    amount: "$299.00",
    status: "delivered",
    date: "2024-01-15",
  },
  {
    id: "ORD-002",
    customer: "Sarah Smith",
    product: "Smart Watch Pro",
    amount: "$499.00",
    status: "shipped",
    date: "2024-01-15",
  },
  {
    id: "ORD-003",
    customer: "Mike Johnson",
    product: "Laptop Stand",
    amount: "$79.00",
    status: "processing",
    date: "2024-01-14",
  },
  {
    id: "ORD-004",
    customer: "Emily Brown",
    product: "USB-C Hub",
    amount: "$149.00",
    status: "pending",
    date: "2024-01-14",
  },
  {
    id: "ORD-005",
    customer: "David Wilson",
    product: "Mechanical Keyboard",
    amount: "$189.00",
    status: "delivered",
    date: "2024-01-13",
  },
];

const deliveryStatus = [
  { label: "Pending", count: 12, color: "bg-yellow-500" },
  { label: "Processing", count: 8, color: "bg-blue-500" },
  { label: "Shipped", count: 24, color: "bg-purple-500" },
  { label: "Delivered", count: 156, color: "bg-green-500" },
  { label: "Cancelled", count: 3, color: "bg-red-500" },
];

const topProducts = [
  { name: "Wireless Headphones", sales: 124, revenue: "$37,076" },
  { name: "Smart Watch Pro", sales: 89, revenue: "$44,411" },
  { name: "Laptop Stand", sales: 67, revenue: "$5,293" },
  { name: "USB-C Hub", sales: 45, revenue: "$6,705" },
];

const statusConfig = {
  pending: { variant: "secondary" as const },
  processing: { variant: "outline" as const },
  shipped: { variant: "default" as const },
  delivered: { variant: "default" as const },
  cancelled: { variant: "destructive" as const },
};

function StatCard({
  title,
  value,
  change,
  trend,
  icon: Icon,
}: {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: React.ElementType;
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <span
            className={`flex items-center text-xs font-medium ${
              trend === "up" ? "text-green-600" : "text-red-600"
            }`}
          >
            {trend === "up" ? (
              <ArrowUpRight className="h-3 w-3" />
            ) : (
              <ArrowDownRight className="h-3 w-3" />
            )}
            {change}
          </span>
        </div>
        <div className="mt-4">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function DeliveryStatusCard() {
  const total = deliveryStatus.reduce((a, b) => a + b.count, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Delivery Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {deliveryStatus.map((status) => (
            <div key={status.label} className="flex items-center gap-3">
              <div className={`h-3 w-3 rounded-full ${status.color}`} />
              <span className="flex-1 text-sm">{status.label}</span>
              <span className="text-sm font-medium">{status.count}</span>
            </div>
          ))}
        </div>
        <div className="mt-6">
          <div className="flex h-2 rounded-full bg-muted overflow-hidden">
            {deliveryStatus.map((status) => (
              <div
                key={status.label}
                className={`${status.color}`}
                style={{
                  width: `${(status.count / total) * 100}%`,
                }}
              />
            ))}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">{total} total orders</p>
        </div>
      </CardContent>
    </Card>
  );
}

function RecentOrdersCard() {
  return (
    <Card className="lg:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Orders</CardTitle>
        <button className="text-sm font-medium text-primary hover:underline">
          View all
        </button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell>{order.product}</TableCell>
                <TableCell className="font-medium">{order.amount}</TableCell>
                <TableCell>
                  <Badge variant={statusConfig[order.status as keyof typeof statusConfig].variant}>
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{order.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function TopProductsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Products</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topProducts.map((product, index) => (
            <div
              key={product.name}
              className="flex items-center justify-between rounded-lg border p-3"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold">
                  {index + 1}
                </div>
                <div>
                  <p className="text-sm font-medium">{product.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {product.sales} sales
                  </p>
                </div>
              </div>
              <p className="text-sm font-semibold">{product.revenue}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function QuickActionsCard() {
  const actions = [
    { icon: Package, label: "Add Product" },
    { icon: TrendingUp, label: "View Reports" },
    { icon: Users, label: "Manage Users" },
    { icon: DollarSign, label: "Create Coupon" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action) => (
            <button
              key={action.label}
              className="flex flex-col items-center justify-center rounded-lg border p-4 transition-colors hover:bg-muted"
            >
              <action.icon className="mb-2 h-6 w-6 text-primary" />
              <span className="text-sm font-medium">{action.label}</span>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <RecentOrdersCard />
        <DeliveryStatusCard />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <TopProductsCard />
        <QuickActionsCard />
      </div>
    </div>
  );
}