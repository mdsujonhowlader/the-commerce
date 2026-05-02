import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImagePlus } from "lucide-react";
export default function ImagePicker() {
  return (
    <div className="flex flex-col">
      <h1 className="text-center my-2">Product Images</h1>
      <div className="space-y-2">
        <div className="flex items-center gap-4">
          <Label className="w-full rounded-lg border-2 border-dashed flex flex-col gap-3 items-center justify-center bg-muted p-10">
            <ImagePlus className="h-8 w-8 text-muted-foreground" />
            <span>Upload Your Image</span>
            <Input type="file" accept="image/*" multiple className="hidden" />
          </Label>
        </div>
      </div>
    </div>
  );
}
