import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ProductImage } from "@/features/admin/products/types";
import { ImagePlus, Star, X } from "lucide-react";
import { useEffect, useMemo } from "react";

type ImagePickerProps = {
  existingImages: ProductImage[];
  newFiles: File[];
  coverImagePublicId: string;
  onFileAdd: (files: FileList | null) => void;
  onRemoveExistingImages: (publicId: string) => void;
  onChangeCoverImage: (publicId: string) => void;
};

export default function ImagePicker({
  existingImages,
  newFiles,
  coverImagePublicId,
  onFileAdd,
  onRemoveExistingImages,
  onChangeCoverImage

}: ImagePickerProps) {
  const previewUrls = useMemo(
    () => newFiles.map((file) => ({ file, url: URL.createObjectURL(file) })),
    [newFiles],
  );

  useEffect(() => {
    return () => {
      previewUrls.forEach((item) => URL.revokeObjectURL(item.url));
    };
  }, [previewUrls]);

  return (
    <div className="flex flex-col">
      <h1 className="text-center my-2">Product Images</h1>
      <div className="space-y-2">
        <div className="flex items-center gap-4">
          <Label className="w-full rounded-lg border-2 border-dashed flex flex-col gap-3 items-center justify-center bg-muted p-10">
            <ImagePlus className="h-8 w-8 text-muted-foreground" />
            <span>Upload Your Image</span>
            <Input
              onChange={(event) => onFileAdd(event.target.files)}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
            />
          </Label>
        </div>
        <div>
          {existingImages.length > 0 ? (
            <div>
              <p className="my-2 ">Existing Images</p>
              <div className="grid grid-cols-4 gap-2">
                {existingImages.map((image) => {
                  const isCover = (coverImagePublicId === image.publicId);
                  return (
                    <div className="overflow-hidden rounded-xl border border-border bg-card" key={image.publicId}>
                      <img className="h-28 w-full object-cover" src={image.url} alt="product" />

                      <div className="flex justify-between items-center px-2">
                        <Button
                          size="sm"
                          variant={isCover ? "default" : "secondary"}
                          onClick={()=>onChangeCoverImage(image.publicId)}
                        >
                          <Star className="mr-1 h-3.5 w-3.5"/>
                          {isCover ? "cover" : "Set Cover"}
                        </Button>
                        <Button
                          size="icon"
                          variant="destructive"
                          onClick={()=>onRemoveExistingImages(image.publicId)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}
          {previewUrls.length > 0 ? (
            <div className="mt-2">
              <p className="text-lg">New Images</p>
              <div className="grid grid-cols-4 gap-3 mt-4">
                {previewUrls.map((previewItem, index) => (
                  <div
                    className="overflow-hidden rounded-xl border border-border bg-card "
                    key={`${previewItem.file}-${index}`}
                  >
                    <img
                      className="h-28 w-full object-cover"
                      src={previewItem.url}
                      alt={previewItem.file.name}
                    />
                    <div className="text-center p-2">
                      {previewItem.file.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
