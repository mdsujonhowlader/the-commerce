import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { useState } from "react";

type ColorPickerProps = {
  colors: string[];
  onAdd: (color: string) => void;
  onRemove: (color: string) => void;
};
export default function ColorPicker({
  colors,
  onAdd,
  onRemove,
}: ColorPickerProps) {
  const [selectedColor, setSelectedColor] = useState("#111111");
  return (
    <div className="flex flex-col gap-2 ">
      <Label htmlFor="color-picker">Color Picker</Label>
      <div className="flex items-center gap-2">
        <Input
          type="color"
          value={selectedColor}
          onChange={(event) => setSelectedColor(event.target.value)}
          className="w-1/4"
        />
        <Button type="button" onClick={() => onAdd(selectedColor)}>
          Add Color
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {colors.map((colorItem) => (
          <button
            type="button"
            key={colorItem}
            onClick={() => onRemove(colorItem)}
            className="group inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-2 text-sm text-foreground transition hover:bg-muted"
          >
            <span
              style={{ backgroundColor: colorItem }}
              className="h-4 w-4 rounded-full border border-black/10"
            />
            <X className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground" />
          </button>
        ))}
      </div>
    </div>
  );
}
