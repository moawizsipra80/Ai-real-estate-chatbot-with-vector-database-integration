import React from 'react';
import { Property } from '../types/property';
import { Bed, Bath, Maximize2, MapPin, Star, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PropertyCardProps {
  property: Property;
  compact?: boolean;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, compact = false }) => {
  const imageUrl = property.images && property.images.length > 0 
    ? property.images[0] 
    : 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80';

  return (
    <div className={`glass-panel rounded-xl overflow-hidden transition-all duration-300 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10 group ${compact ? 'max-w-xs' : 'w-full'}`}>
      {/* Property Thumbnail Image */}
      <div className="relative h-44 w-full overflow-hidden bg-slate-900">
        <img 
          src={imageUrl} 
          alt={property.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-semibold text-cyan-400 border border-cyan-500/30">
          {property.propertyType.toUpperCase()}
        </div>
        <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold text-amber-400 border border-amber-500/30 flex items-center gap-1">
          <Star className="w-3 h-3 fill-amber-400" />
          {property.rating || 4.5}
        </div>
        <div className="absolute bottom-3 left-3 bg-slate-950/90 backdrop-blur-md px-3 py-1 rounded-lg text-lg font-bold text-white border border-white/10">
          ${property.price ? property.price.toLocaleString() : 'N/A'}
        </div>
      </div>

      {/* Property Card Body */}
      <div className="p-4 flex flex-col justify-between">
        <div>
          <h4 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
            {property.title}
          </h4>
          <div className="flex items-center gap-1 text-slate-400 text-xs mt-1">
            <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="truncate">{property.location} • {property.address}</span>
          </div>
        </div>

        {/* Key Property Specs */}
        <div className="grid grid-cols-3 gap-2 my-3 py-2 px-3 bg-slate-900/60 rounded-lg border border-white/5 text-xs text-slate-300">
          <div className="flex items-center gap-1.5">
            <Bed className="w-3.5 h-3.5 text-cyan-400" />
            <span>{property.bedrooms} Beds</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Bath className="w-3.5 h-3.5 text-cyan-400" />
            <span>{property.bathrooms} Baths</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Maximize2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>{property.area} sqft</span>
          </div>
        </div>

        {/* Action button */}
        <Link 
          to={`/property/${property._id}`}
          className="w-full mt-1 py-2 px-3 bg-slate-800/80 hover:bg-cyan-600 text-slate-200 hover:text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-white/10"
        >
          <span>View Details</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
