export interface Hotel {
  id: string;
  name: string;
  location: string;
  category: string;
  rating: number;
  reviewCount: number;
  originalPrice: number;
  discountPrice: number;
  imageUrl: string;
  description: string;
  tags: string[];
  features: string[];
  address: string;
}

export interface Coupon {
  id: string;
  code: string;
  title: string;
  discountPercent: number;
  minSpend: number;
  validUntil: string;
}

export interface TrackingEvent {
  event_id: string;
  ts: number;
  type: string;
  payload: Record<string, unknown>;
  page_url: string;
  referrer: string;
}

export interface DecisionResponse {
  ab_group: 'control' | 'variant_a' | 'variant_b';
  component: 'coupon_modal' | 'price_match_banner' | null;
  context?: {
    discount_percent?: number;
    hotel_name?: string;
    message?: string;
  };
}
