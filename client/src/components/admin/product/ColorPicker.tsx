import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ColorPicker() {
  return (
    <div className="flex flex-col gap-2 "> 
    <Label htmlFor="color-picker">Color Picker</Label>
      <div className="flex items-center gap-2">
        <Input type="color" className="w-1/4" />
        <Button>Add Color</Button>
      </div>
    </div>
  );
}
