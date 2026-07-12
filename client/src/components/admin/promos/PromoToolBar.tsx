import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";

type AdminPromoToolbalProps = {
  search: string;
  onSearchChange: (value: string) => void;
  onAddPromo: () => void;
};

const AdminPromoToolbal = ({
  search,
  onSearchChange,
  onAddPromo,
}: AdminPromoToolbalProps) => {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Products</h1>
        <div className="flex gap-2">
          <Button onClick={onAddPromo}>
            <Plus className="mr-2 h-4 w-4" />
            Add Promos
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => onSearchChange(event.target.value)}
                className="pl-9"
                placeholder="Search products..."
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPromoToolbal;
