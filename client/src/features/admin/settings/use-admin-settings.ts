import {
  getAdminBanners,
  uploadAdminBanners,
} from "@/features/admin/settings/apit.ts";
import type { BannerImage } from "@/features/admin/settings/types.ts";
import { useEffect, useMemo, useState } from "react";

export function useAdminSettings() {
  const [items, setItems] = useState<BannerImage[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);

  async function refreshBanner() {
    try {
      setLoading(true);
      const response = await getAdminBanners();
      console.log(response);
      setItems(response?.items ?? []);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refreshBanner();
  }, []);

  async function handleBannerUpload() {
    try {
      if (!files.length) return;
      setUploading(true);

      const formData = new FormData();
      files.forEach((file: File) => formData.append("images", file));
      const response = await uploadAdminBanners(formData);
      setItems(response?.items ?? []);
      setFiles([]);
    } catch (e) {
      console.log(e);
    } finally {
      setUploading(false);
    }
  }

  const fileCountLabel = useMemo(() => {
    if (!files.length) return "No file Selected";
    if (files.length === 1) return files[0].name;
    return `${files.length} files selected`;
  }, [files]);

  return {
    items,
    setItems,
    refreshBanner,
    handleBannerUpload,
    fileCountLabel,
    setFiles,
    setUploading,
    uploading,
    loading,
    setLoading,
  };
}
