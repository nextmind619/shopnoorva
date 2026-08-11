export type TikTokStandardEvent =
  | "ViewContent"
  | "AddToCart"
  | "InitiateCheckout"
  | "CompletePayment"
  | "SubmitForm";

export type TikTokContentItem = {
  content_id: string;
  content_type?: "product";
  content_name?: string;
  quantity?: number;
  price?: number;
};

export type TikTokEventProperties = {
  contents?: TikTokContentItem[];
  value?: number;
  currency?: string;
  content_id?: string;
  content_type?: "product";
  content_name?: string;
  quantity?: number;
  order_id?: string;
};
