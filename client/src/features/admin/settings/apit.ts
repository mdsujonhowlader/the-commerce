import {apiGet, apiPost} from "@/lib/api.ts";
import type {AdminBannersResponse} from "@/features/admin/settings/types.ts";


export async function getAdminBanners() {
    return apiGet<AdminBannersResponse>('/admin/settings/banners')
}

export async function uploadAdminBanners(formData: FormData) {
    return apiPost<AdminBannersResponse, FormData>("/admin/settings/banners", formData)
}