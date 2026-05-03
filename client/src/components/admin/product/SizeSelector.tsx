import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { SIZE_OPTIONS } from "@/features/admin/products/constants";

type SizeSelectorProps = {
  selectedSizes: string[];
  onToggle: (size: string) => void;
};
export default function SizeSelector({
  selectedSizes,
  onToggle,
}: SizeSelectorProps) {
  return (
    <div className="flex flex-col gap-2 ">
      <Label htmlFor="color-picker">Select Size</Label>
      <div className="flex items-center gap-2">
        {SIZE_OPTIONS.map((sizeItem) => {
          const active = selectedSizes.includes(sizeItem);
          return (
            <Button
              onClick={() => onToggle(sizeItem)}
              key={sizeItem}
              type="button"
              variant={active ? "default" : "outline"}
              className="size-11"
            >
              {sizeItem}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
