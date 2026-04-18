import { apiGet, apiPost } from "@/lib/api";
import type { MeResponse, syncResponse } from "./types";

export function syncUser(){
    return apiPost<syncResponse>('/auth/sync')
}
export function meUser(){
    return apiGet<MeResponse>('/auth/me')
}