export interface MoneyView {
  amount: string;
  currency: string;
  formatted: string;
}

export interface RestaurantSummary {
  id: string;
  slug: string;
  name: string;
  city: string;
  district: string | null;
  landmarkText: string | null;
  latitude: number;
  longitude: number;
  distanceMeters: number | null;
  coverImageUrl: string | null;
  averagePreparationMinutes: number | null;
  services: string[];
  open: boolean;
  closesInMinutes: number | null;
  opensInMinutes: number | null;
  priceFrom: MoneyView | null;
  isFavorite: boolean;
  enabledModules: string[];
}

export interface MenuProduct {
  id: string;
  name: string;
  description: string | null;
  price: MoneyView;
  available: boolean;
  vegetarian: boolean;
  halal: boolean;
  spicyLevel: number | null;
  preparationMinutes: number | null;
  imageUrl: string | null;
  allergens: string[];
}

export interface MenuCategory {
  id: string;
  name: string;
  description: string | null;
  products: MenuProduct[];
}

export interface RestaurantMenu {
  id: string;
  name: string;
  categories: MenuCategory[];
}

export interface RestaurantHours {
  weekDay: string;
  opensAtMinutes: number;
  closesAtMinutes: number;
}

export interface RestaurantDetail extends RestaurantSummary {
  description: string | null;
  phoneE164: string | null;
  addressLine: string | null;
  verified: boolean;
  hours: RestaurantHours[];
  menus: RestaurantMenu[];
}

export interface DiscoverRestaurantsQuery {
  q?: string;
  city?: string;
  district?: string;
  openNow?: boolean;
  service?: 'DINE_IN' | 'TAKEAWAY' | 'DELIVERY' | 'RESERVATION';
  sort?: 'distance' | 'name' | 'recent';
  limit?: number;
  cursor?: string;
}
