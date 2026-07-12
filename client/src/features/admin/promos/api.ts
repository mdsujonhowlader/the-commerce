import { apiDelete, apiGet, apiPatch, apiPost } from "@/lib/api";
import type { AdminPromoResponse, PromoFormValues } from "./types";

export async function getAdminPromos() {
  return apiGet<AdminPromoResponse>("/admin/promos");
}

export async function createAdminPromos(body: PromoFormValues) {
  return apiPost<AdminPromoResponse, PromoFormValues>("/admin/promos", body);
}

export async function updateAdminPromos(
  promoId: string,
  body: PromoFormValues,
) {
  return apiPatch<AdminPromoResponse, PromoFormValues>(
    `/admin/promos/${promoId}`,
    body,
  );
}

export async function deleteAdminPromos(promoId: string) {
  return apiDelete<AdminPromoResponse>(`/admin/promos/${promoId}`);
}
