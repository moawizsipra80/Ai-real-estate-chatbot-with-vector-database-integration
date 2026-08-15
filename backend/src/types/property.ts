export interface IProperty {
  _id?: string;
  title: string;
  description: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number; // in sqft
  location: string; // e.g. "Downtown", "Midtown", "City Center"
  address: string;
  propertyType: 'apartment' | 'house' | 'villa' | 'condo' | 'townhouse' | 'penthouse';
  images: string[];
  rating: number;
  features: string[];
  coordinates?: {
    lat: number;
    lng: number;
  };
  status: 'for_sale' | 'for_rent' | 'sold';
  yearBuilt?: number;
  parkingSpaces?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IPropertyFilter {
  location?: string;
  propertyType?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  status?: string;
}
