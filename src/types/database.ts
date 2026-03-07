// Client-side types for tables that use `as any` casts with the Supabase client.
// These types provide IDE autocompletion and documentation.

export interface DbProperty {
  id: string;
  title: string;
  title_ar?: string;
  description?: string;
  description_ar?: string;
  price: number;
  price_iqd?: number;
  currency?: string;
  type: string;
  property_type: string;
  city: string;
  district: string;
  address?: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  features?: string[];
  terra_score: number;
  ai_valuation?: number;
  ai_confidence?: string;
  verified?: boolean;
  agent_name?: string;
  agent_verified?: boolean;
  views: number;
  status: string;
  user_id: string;
  lat?: number;
  lng?: number;
  created_at: string;
  updated_at?: string;
  property_images?: { id: string; url: string; position?: number }[];
}

export interface DbOffer {
  id: string;
  property_id: string;
  buyer_id: string;
  seller_id?: string;
  offer_price: number;
  asking_price?: number;
  currency: string;
  offer_type: string;
  financing_type: string;
  closing_timeline_days: number;
  deposit_percent?: number;
  proof_uploaded?: boolean;
  message?: string;
  seller_note?: string;
  counter_price?: number;
  seriousness_score: number;
  status: string;
  created_at: string;
}

export interface DbLead {
  id: string;
  agent_id: string;
  name: string;
  email?: string;
  phone?: string;
  source?: string;
  status: string;
  notes?: string;
  property_id?: string;
  created_at: string;
}

export interface DbMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  read_at?: string;
  property_id?: string;
  created_at: string;
}
