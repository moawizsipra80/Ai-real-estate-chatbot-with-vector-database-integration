export interface Property {
  _id?: string;
  title: string;
  description: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  location: string;
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
}
