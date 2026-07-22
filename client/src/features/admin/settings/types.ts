export type BannerImage={
    _id:string;
    imageUrl: string;
    imagePublicId: string;
    createdAt:string;
}
export type AdminBannersResponse = {
items: BannerImage[];
}