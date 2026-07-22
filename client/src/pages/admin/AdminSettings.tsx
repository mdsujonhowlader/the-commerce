import AdminBannerSettingsTable from "@/components/admin/AdminBannerSettingsTable.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { Input } from "@/components/ui/input.tsx";
import { useAdminSettings } from "@/features/admin/settings/use-admin-settings.ts";

export default function AdminSettings() {
  const {
    items,
    refreshBanner,
    handleBannerUpload,
    fileCountLabel,
    setFiles,
    uploading,
    loading,
  } = useAdminSettings();
  return (
    <div className="flex items-start justify-between  gap-4">
      <Card className="overflow-hidden shadow-sm w-1/3 ">
        <CardHeader>
          <CardTitle>Upload Banner</CardTitle>
        </CardHeader>
        <CardContent>
          <label
            htmlFor="image"
            className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition"
          >
            <div className="flex flex-col items-center justify-center">
              <svg
                className="w-12 h-12 mb-3 text-gray-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l-4-4m4 4l4-4"
                />
              </svg>

              <p className="text-sm text-gray-600">
                <span className="font-semibold">Click to upload</span>
              </p>
              <p className="text-xs text-gray-400 mt-1">
                PNG, JPG, JPEG (Max 5MB)
              </p>
            </div>
            <p>{fileCountLabel}</p>

            <Input
              id="image"
              type="file"
              accept="image/*"
              className="hidden"
              multiple
              onChange={(event) =>
                setFiles(Array.from(event.target.files || []))
              }
            />
          </label>

          <Button
            disabled={uploading}
            onClick={() => handleBannerUpload()}
            className="w-full mt-4"
          >
            {uploading ? "uploading Banner" : "Upload Banner"}
          </Button>
        </CardContent>
      </Card>
      <Card className="overflow-hidden shadow-sm w-2/3">
        <CardHeader className="flex justify-between">
          <CardTitle>Current Banner</CardTitle>
          <Button onClick={() => refreshBanner()}>Refresh Banner</Button>
        </CardHeader>
        <CardContent>
          {loading ? null : !items.length ? (
            <div>No Banner Found</div>
          ) : (
            <AdminBannerSettingsTable items={items} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
