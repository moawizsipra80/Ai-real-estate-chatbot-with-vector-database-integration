import mongoose, { Schema, Document } from 'mongoose';
import { IProperty } from '../types/property';

export interface IPropertyDocument extends Omit<IProperty, '_id'>, Document {}

const PropertySchema: Schema = new Schema(
  {
    title: { type: String, required: true, index: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, index: true },
    bedrooms: { type: Number, required: true, index: true },
    bathrooms: { type: Number, required: true },
    area: { type: Number, required: true },
    location: { type: String, required: true, index: true },
    address: { type: String, required: true },
    propertyType: { 
      type: String, 
      required: true, 
      enum: ['apartment', 'house', 'villa', 'condo', 'townhouse', 'penthouse'],
      index: true 
    },
    images: [{ type: String }],
    rating: { type: Number, default: 4.5 },
    features: [{ type: String }],
    coordinates: {
      lat: { type: Number },
      lng: { type: Number }
    },
    status: { 
      type: String, 
      enum: ['for_sale', 'for_rent', 'sold'], 
      default: 'for_sale' 
    },
    yearBuilt: { type: Number },
    parkingSpaces: { type: Number, default: 1 }
  },
  {
    timestamps: true
  }
);

// Text index for full-text property search
PropertySchema.index({ title: 'text', description: 'text', location: 'text', features: 'text' });

export default mongoose.model<IPropertyDocument>('Property', PropertySchema);
