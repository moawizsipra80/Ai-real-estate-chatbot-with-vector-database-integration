import React, { useState, useEffect } from 'react';
import { Property } from '../types/property';
import { fetchAllProperties } from '../services/propertyService';
import { PropertyCard } from '../components/PropertyCard';
import { Search, Filter, Bot, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PropertyListingsPage: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [locationFilter, setLocationFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProperties();
  }, [locationFilter, typeFilter]);

  const loadProperties = async () => {
    setIsLoading(true);
    const params: Record<string, string> = {};
    if (locationFilter) params.location = locationFilter;
    if (typeFilter) params.propertyType = typeFilter;
    
    const data = await fetchAllProperties(params);
    setProperties(data);
    setIsLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Hero Banner */}
      <div className="glass-panel p-8 sm:p-10 rounded-3xl mb-8 border border-white/10 relative overflow-hidden">
        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 mb-4">
            <Building2 className="w-3.5 h-3.5" />
            <span>Explore Premier Real Estate</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Find Your Dream Home with <span className="gradient-text">AI Assistance</span>
          </h1>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            Browse verified property listings or chat directly with our AI Property Assistant to find exact matches tailored to your lifestyle and budget.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link 
              to="/ai-chat" 
              className="gradient-btn px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2"
            >
              <Bot className="w-4 h-4" />
              <span>Ask AI Chat Assistant</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="glass-panel p-4 rounded-2xl mb-8 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2 px-3 py-2 bg-slate-900/90 rounded-xl border border-white/10 text-xs w-full sm:w-64">
            <Search className="w-4 h-4 text-cyan-400 shrink-0" />
            <input
              type="text"
              placeholder="Search by location (e.g. Downtown)..."
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="bg-transparent focus:outline-none text-white w-full placeholder-slate-400"
            />
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 bg-slate-900/90 rounded-xl border border-white/10 text-xs text-slate-200 focus:outline-none"
          >
            <option value="">All Property Types</option>
            <option value="apartment">Apartment</option>
            <option value="condo">Condo</option>
            <option value="villa">Villa</option>
            <option value="penthouse">Penthouse</option>
            <option value="townhouse">Townhouse</option>
          </select>
        </div>

        <div className="text-xs text-slate-400 self-end sm:self-auto">
          Showing <span className="font-bold text-cyan-400">{properties.length}</span> properties
        </div>
      </div>

      {/* Property Cards Grid */}
      {isLoading ? (
        <div className="text-center py-16 text-slate-400 text-sm">
          Loading property listings...
        </div>
      ) : properties.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl border border-white/10 text-center space-y-4">
          <Building2 className="w-12 h-12 text-slate-500 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Properties Found</h3>
          <p className="text-xs text-slate-400">Try adjusting your location or type filters, or ask our AI assistant!</p>
          <Link to="/ai-chat" className="inline-block gradient-btn px-4 py-2 rounded-xl text-xs font-semibold">
            Search with AI Assistant
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <PropertyCard key={property._id || property.title} property={property} />
          ))}
        </div>
      )}
    </div>
  );
};
