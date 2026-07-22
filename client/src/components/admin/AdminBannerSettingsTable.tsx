import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.tsx";
import type { BannerImage } from "@/features/admin/settings/types.ts";

export default function AdminBannerSettingsTable({
  items,
}: {
  items: BannerImage[];
}) {
  return (
    <div>
      <Table>
        <TableHeader>
          <TableHead>Image</TableHead>
          <TableHead>Public Id</TableHead>
          <TableHead>Date</TableHead>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow>
              <TableCell key={item._id}>
                <div className="h-16 w-28 overflow-hidden border border-border bg-muted">
                  <img src={item.imageUrl} alt="Banner" />
                </div>
              </TableCell>
              <TableCell>
                <p>{item.imagePublicId}</p>
              </TableCell>
              <TableCell>
                <p>{item.createdAt}</p>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
