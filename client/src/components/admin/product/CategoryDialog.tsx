import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "lucide-react";

type CategoryInfoProps={
  open:boolean,
  

}

export default function CategoryDialog() {
  return (
    <Dialog>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage Categories</DialogTitle>
          <DialogDescription>
            Add or remove product categories.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex gap-2">
            <Input placeholder="New category name" />
            <Button>Add</Button>
          </div>

          <div className="space-y-2">
            <Label>Existing Categories</Label>
            <div className="flex flex-wrap gap-2">
              <Badge  className="gap-2">
                asa
                <button className="ml-1 hover:text-destructive">×</button>
              </Badge>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline">Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}