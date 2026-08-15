import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Property } from '../types/property';
import { fetchPropertyById } from '../services/propertyService';
import { Bed, Bath, Maximize2, MapPin, Star, ArrowLeft, Bot, Calendar, ShieldCheck, Check } from 'lucide-react';

export const PropertyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadProperty(id);
    }
  }, [id]);

  const loadProperty = async (propId: string) => {
    setIsLoading(true);
    const data = await fetchPropertyById(propId);
    setProperty(data);
    setIsLoading(false);
  };

  if (isLoading) {
    return <div className="text-center py-20 text-slate-400">Loading property details...</div>;
  }

  if (!property) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Property Not Found</h2>
        <p className="text-sm text-slate-400">The requested property listing could not be located.</p>
        <Link to="/" className="inline-block gradient-btn px-5 py-2.5 rounded-xl text-xs font-semibold">
          Back to Listings
        </Link>
      </div>
    );
  }

  const mainImage = property.images?.[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Back Button */}
      <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-400 mb-6 transition-colors font-medium">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Listings</span>
      </Link>

      {/* Main Image Gallery Container */}
      <div className="relative rounded-3xl overflow-hidden glass-panel h-80 sm:h-[420px] mb-8 border border-white/10 shadow-2xl">
        <img src={mainImage} alt={property.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
        
        <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-block px-3 py-1 bg-cyan-500/20 border border-cyan-500/40 backdrop-blur-md rounded-full text-xs font-bold text-cyan-300 uppercase tracking-wider mb-2">
              {property.propertyType}
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white">{property.title}</h1>
            <div className="flex items-center gap-2 text-slate-300 text-xs sm:text-sm mt-1">
              <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>{property.address}, {property.location}</span>
            </div>
          </div>

          <div className="bg-slate-900/90 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10 text-right self-start sm:self-auto">
            <div className="text-2xl sm:text-3xl font-extrabold text-white">
              ${property.price ? property.price.toLocaleString() : 'N/A'}
            </div>
            <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1 justify-end mt-0.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified Listing</span>
            </div>
          </div>
        </div>
      </div>

      {/* Specs Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="glass-panel p-4 rounded-2xl border border-white/10 text-center">
          <Bed className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
          <div className="text-lg font-bold text-white">{property.bedrooms}</div>
          <div className="text-xs text-slate-400">Bedrooms</div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-white/10 text-center">
          <Bath className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
          <div className="text-lg font-bold text-white">{property.bathrooms}</div>
          <div className="text-xs text-slate-400">Bathrooms</div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-white/10 text-center">
          <Maximize2 className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
          <div className="text-lg font-bold text-white">{property.area}</div>
          <div className="text-xs text-slate-400">Square Feet</div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-white/10 text-center">
          <Star className="w-5 h-5 text-amber-400 mx-auto mb-1 fill-amber-400" />
          <div className="text-lg font-bold text-white">{property.rating || 4.5} / 5</div>
          <div className="text-xs text-slate-400">Rating</div>
        </div>
      </div>

      {/* Grid: Description & AI Chat Action */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <div className="glass-panel p-6 rounded-3xl border border-white/10">
            <h3 className="text-lg font-bold text-white mb-3">Property Description</h3>
            <p className="text-sm text-slate-300 leading-relaxed">{property.description}</p>
          </div>

          {/* Features */}
          <div className="glass-panel p-6 rounded-3xl border border-white/10">
            <h3 className="text-lg font-bold text-white mb-3">Features & Amenities</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {property.features?.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-slate-300 bg-slate-900/60 p-2.5 rounded-xl border border-white/5">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Actions */}
        <div className="space-y-4">
          <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Have questions about this home?</h4>
                <p className="text-xs text-slate-400">Ask our AI Assistant for neighborhood insight, ROI, or virtual tours.</p>
              </div>
            </div>

            <Link
              to="/ai-chat"
              className="w-full gradient-btn py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
            >
              <Bot className="w-4 h-4" />
              <span>Ask AI About This Property</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
