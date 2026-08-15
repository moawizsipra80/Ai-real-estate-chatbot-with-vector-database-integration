import { IProperty } from '../types/property';
import Property from '../models/Property';

export const INITIAL_PROPERTIES: IProperty[] = [
  {
    _id: '66b5a0011111111111111111',
    title: 'The Grand Residence - Skyline Suite',
    description: 'Luxury 3-bedroom apartment located in the heart of Downtown with panoramic city views, modern kitchen appliances, floor-to-ceiling windows, and 24/7 concierge service.',
    price: 450000,
    bedrooms: 3,
    bathrooms: 2,
    area: 1800,
    location: 'Downtown',
    address: '101 Grand Avenue, Downtown',
    propertyType: 'apartment',
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'
    ],
    rating: 4.8,
    features: ['Balcony', 'City View', 'Fitness Center', 'Parking', 'Swimming Pool', 'Smart Home System'],
    status: 'for_sale',
    yearBuilt: 2022,
    parkingSpaces: 2
  },
  {
    _id: '66b5a0022222222222222222',
    title: 'Parkview Heights Executive Condo',
    description: 'Spacious 3-bedroom executive condo overlooking Central Park in Midtown. Features marble countertops, hardwood flooring, and private balcony.',
    price: 475000,
    bedrooms: 3,
    bathrooms: 2.5,
    area: 1650,
    location: 'Midtown',
    address: '450 Park Avenue, Midtown',
    propertyType: 'condo',
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80'
    ],
    rating: 4.6,
    features: ['Park View', 'Gym', 'Security', 'Balcony', 'EV Charger'],
    status: 'for_sale',
    yearBuilt: 2021,
    parkingSpaces: 1
  },
  {
    _id: '66b5a0033333333333333333',
    title: 'Downtown Modern Minimalist Loft',
    description: 'Chic 2-bedroom open-concept loft in Downtown Arts District. Double-height ceilings, exposed brick, and high-speed fiber internet.',
    price: 385000,
    bedrooms: 2,
    bathrooms: 2,
    area: 1250,
    location: 'Downtown',
    address: '88 Art District Way, Downtown',
    propertyType: 'apartment',
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80'
    ],
    rating: 4.7,
    features: ['High Ceilings', 'Exposed Brick', 'Pet Friendly', 'Storage Unit'],
    status: 'for_sale',
    yearBuilt: 2020,
    parkingSpaces: 1
  },
  {
    _id: '66b5a0044444444444444444',
    title: 'Ocean Front Luxury Villa',
    description: 'Extravagant 5-bedroom waterfront villa with infinity pool, private dock, expansive terrace, and smart security system.',
    price: 1250000,
    bedrooms: 5,
    bathrooms: 4.5,
    area: 4200,
    location: 'Waterfront',
    address: '1 Ocean Boulevard, Waterfront',
    propertyType: 'villa',
    images: [
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80'
    ],
    rating: 4.9,
    features: ['Infinity Pool', 'Waterfront', 'Private Dock', 'Home Theater', 'Wine Cellar'],
    status: 'for_sale',
    yearBuilt: 2023,
    parkingSpaces: 3
  },
  {
    _id: '66b5a0055555555555555555',
    title: 'City Center Modern Penthouse',
    description: 'Ultra-luxurious 4-bedroom penthouse in City Center with private rooftop terrace, hot tub, and 360-degree city views.',
    price: 890000,
    bedrooms: 4,
    bathrooms: 3.5,
    area: 2900,
    location: 'City Center',
    address: '500 Central Plaza, City Center',
    propertyType: 'penthouse',
    images: [
      'https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&w=800&q=80'
    ],
    rating: 4.9,
    features: ['Rooftop Terrace', 'Hot Tub', 'Private Elevator', 'Wine Cooler'],
    status: 'for_sale',
    yearBuilt: 2023,
    parkingSpaces: 2
  },
  {
    _id: '66b5a0066666666666666666',
    title: 'Cozy Uptown Family Townhouse',
    description: 'Charmingly renovated 3-bedroom family townhouse in quiet Uptown neighborhood near top-rated schools and green parks.',
    price: 420000,
    bedrooms: 3,
    bathrooms: 2,
    area: 1750,
    location: 'Uptown',
    address: '312 Elm Street, Uptown',
    propertyType: 'townhouse',
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
    ],
    rating: 4.5,
    features: ['Private Garden', 'Fireplace', 'Garage', 'Near Schools'],
    status: 'for_sale',
    yearBuilt: 2018,
    parkingSpaces: 2
  }
];

export async function seedProperties() {
  try {
    const count = await Property.countDocuments();
    if (count === 0) {
      console.log('Seeding initial property database records...');
      await Property.insertMany(INITIAL_PROPERTIES);
      console.log('Properties seeded successfully!');
    }
  } catch (error) {
    console.warn('MongoDB not available for auto-seeding. Using in-memory fallback store.');
  }
}
