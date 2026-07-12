export type Promo = {
  _id: string;
  code: string;
  percentage: number;
  count: number;
  minimumOrderValue: number;
  startAt: string;
  endsAt: string;
  createdAt?: string;
};

export type AdminPromoResponse = {
  items: Promo[];
};

export type PromoFormValues = {
  code: string;
  percentage: string;
  count: string;
  minimumOrderValue: string;
  startAt: string;
  endsAt: string;
};
