export type Locale = "ar" | "fr" | "en";

export type LocalizedString = Record<Locale, string>;

export interface Category {
  id: string;
  slug: string;
  name: LocalizedString;
  description: LocalizedString;
  image: string;
  productCount: number;
}

export interface ProductVariant {
  id: string;
  name: LocalizedString;
  price: number;
  compareAtPrice?: number;
  sku: string;
  stock: number;
}

export interface ProductImage {
  id: string;
  url: string;
  alt: LocalizedString;
  type: "image" | "video" | "360";
}

export interface ProductReview {
  id: string;
  author: string;
  city: string;
  rating: number;
  title: LocalizedString;
  content: LocalizedString;
  date: string;
  verified: boolean;
  images?: string[];
}

export interface ProductQuestion {
  id: string;
  author: string;
  question: LocalizedString;
  answer: LocalizedString;
  date: string;
}

export interface ProductBundle {
  id: string;
  name: LocalizedString;
  products: string[];
  discount: number;
}

export interface ProductSpec {
  label: LocalizedString;
  value: LocalizedString;
}

export interface Product {
  id: string;
  slug: string;
  name: LocalizedString;
  shortDescription: LocalizedString;
  description: LocalizedString;
  categoryId: string;
  price: number;
  compareAtPrice?: number;
  images: ProductImage[];
  variants: ProductVariant[];
  tags: string[];
  rating: number;
  reviewCount: number;
  soldCount: number;
  stock: number;
  sku: string;
  benefits: LocalizedString[];
  features?: LocalizedString[];
  specifications?: ProductSpec[];
  packageIncludes?: LocalizedString[];
  videoUrl?: string;
  warrantyMonths?: number;
  ingredients?: LocalizedString;
  howToUse?: LocalizedString;
  isBestSeller: boolean;
  isTrending: boolean;
  isTikTokViral: boolean;
  isFeatured: boolean;
  flashSaleEndsAt?: string;
  bundles?: ProductBundle[];
  upsellIds?: string[];
  crossSellIds?: string[];
  beforeAfter?: { before: string; after: string };
  lifestyleImages?: string[];
  problem?: LocalizedString;
  problemCause?: LocalizedString;
  problemSolution?: LocalizedString;
  problemEmoji?: string;
  deepDescription?: LocalizedString;
  seo: {
    title: LocalizedString;
    description: LocalizedString;
  };
}

export interface CartItem {
  productId: string;
  variantId: string;
  quantity: number;
}

export type PaymentMethod = "cod";

export interface ShippingAddress {
  fullName: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  region?: string;
  postalCode?: string;
  country: string;
  notes?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  items: (CartItem & { product: Product; variant: ProductVariant; lineTotal: number })[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  couponCode?: string;
  paymentMethod: PaymentMethod;
  shippingAddress: ShippingAddress;
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  totalOrders: number;
  totalSpent: number;
  createdAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  type: "percentage" | "fixed";
  value: number;
  minOrder: number;
  maxUses: number;
  usedCount: number;
  expiresAt: string;
  active: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  city: string;
  videoThumbnail: string;
  videoUrl: string;
  quote: LocalizedString;
}

export interface FAQ {
  id: string;
  question: LocalizedString;
  answer: LocalizedString;
}

export interface InstagramPost {
  id: string;
  image: string;
  url: string;
  likes: number;
}

export interface AnalyticsEvent {
  type: "page_view" | "add_to_cart" | "purchase" | "view_item";
  payload: Record<string, unknown>;
  timestamp: string;
}
