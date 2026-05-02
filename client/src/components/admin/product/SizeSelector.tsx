import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { SIZE_OPTIONS } from "@/features/admin/products/constants";

export default function SizeSelector() {
  return (
    <div className="flex flex-col gap-2 ">
      <Label htmlFor="color-picker">Select Size</Label>
      <div className="flex items-center gap-2">
        {SIZE_OPTIONS.map((sizeItem) => (
          <Button
            key={sizeItem}
            type="button"
            variant="outline"
            className="size-11"
          >
            {sizeItem}
          </Button>
        ))}
      </div>
    </div>
  );
}
