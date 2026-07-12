import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Promo } from "@/features/admin/promos/types";
import { formatDateTime } from "@/utils/DateTimeHelper";
import { Pencil, Trash2 } from "lucide-react";

type AdminPromoTableProps = {
  promos: Promo[];
  onEdit: (promo: Promo) => void;
  loading: boolean;
  deletingPromoId: string;
  onDelete: (promoId: string) => Promise<void>;
};

const AdminPromoTable = ({
  promos,
  onEdit,
  loading,
  deletingPromoId,
  onDelete,
}: AdminPromoTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-20">Code</TableHead>
          <TableHead>Percentage</TableHead>
          <TableHead>Count</TableHead>
          <TableHead>Minimum order Value</TableHead>
          <TableHead>Start </TableHead>
          <TableHead>End</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading ? (
          <TableRow>
            <TableCell colSpan={8}>loading products...</TableCell>
          </TableRow>
        ) : promos.length === 0 ? (
          <TableRow>
            <TableCell colSpan={8}>No Products Found</TableCell>
          </TableRow>
        ) : (
          promos.map((promo) => (
            <TableRow>
              <TableCell key={promo._id}>{promo.code}</TableCell>
              <TableCell>{promo.percentage}%</TableCell>
              <TableCell>{promo.count}</TableCell>
              <TableCell>{promo.minimumOrderValue}</TableCell>
              <TableCell>{formatDateTime(promo.startAt)}</TableCell>
              <TableCell>{formatDateTime(promo.endsAt)}</TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    onClick={() => onEdit(promo)}
                    variant="ghost"
                    size="icon"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => onDelete(promo._id)}
                    variant="ghost"
                    size="icon"
                    disabled={deletingPromoId === promo._id}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default AdminPromoTable;
