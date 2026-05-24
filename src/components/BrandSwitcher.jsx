import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Sparkles, Star, TrendingUp } from 'lucide-react';
import { useBrand } from '../context/BrandContext';

const BrandSwitcher = () => {
  const { selectedBrand, userBrands, switchBrand } = useBrand();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getBrandGradient = (brandId) => {
    switch(brandId) {
      case 'kfc':
        return 'from-red-600 to-red-700';
      case 'pizza_hut':
        return 'from-blue-600 to-blue-700';
      case 'taco_bell':
        return 'from-purple-600 to-purple-700';
      default:
        return 'from-gray-600 to-gray-700';
    }
  };

  const getBrandStats = (brandId) => {
    // Mock stats - in real app, fetch from API
    switch(brandId) {
      case 'kfc':
        return { nps: 58, responses: 1245, trend: '+5%' };
      case 'pizza_hut':
        return { nps: 52, responses: 987, trend: '+3%' };
      default:
        return { nps: 45, responses: 567, trend: '+2%' };
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Selected Brand Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full group relative overflow-hidden rounded-xl transition-all duration-300 hover:shadow-lg"
      >
        <div className={`absolute inset-0 bg-gradient-to-r ${getBrandGradient(selectedBrand.id)} opacity-90`} />
        <div className="relative p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center text-2xl">
              {selectedBrand.logo}
            </div>
            <div className="text-left">
              <p className="text-white font-semibold text-lg">{selectedBrand.name}</p>
              <p className="text-white/80 text-xs">{selectedBrand.description}</p>
            </div>
          </div>
          <ChevronDown 
            size={20} 
            className={`text-white transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          />
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden animate-in slide-in-from-top-2 duration-200">
          <div className="p-3 bg-gradient-to-r from-orange-50 to-red-50 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-orange-600" />
              <p className="text-xs font-medium text-gray-700">Switch between brands</p>
            </div>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {userBrands.map((brand) => {
              const stats = getBrandStats(brand.id);
              const isSelected = selectedBrand.id === brand.id;
              
              return (
                <button
                  key={brand.id}
                  onClick={() => {
                    switchBrand(brand);
                    setIsOpen(false);
                  }}
                  className={`w-full p-4 flex items-center gap-4 transition-all duration-200 hover:bg-gray-50 ${
                    isSelected ? 'bg-orange-50/50' : ''
                  }`}
                >
                  {/* Brand Logo */}
                  <div className={`relative w-14 h-14 rounded-xl flex items-center justify-center text-2xl transition-all ${
                    isSelected 
                      ? `bg-gradient-to-r ${getBrandGradient(brand.id)} shadow-md` 
                      : 'bg-gray-100'
                  }`}>
                    {brand.logo}
                    {isSelected && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <Check size={12} className="text-white" />
                      </div>
                    )}
                  </div>
                  
                  {/* Brand Info */}
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2 mb-1">
                      <p className={`font-semibold ${isSelected ? 'text-orange-700' : 'text-gray-900'}`}>
                        {brand.name}
                      </p>
                      {isSelected && (
                        <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mb-2">{brand.description}</p>
                    
                    {/* Quick Stats */}
                    <div className="flex items-center gap-3 text-xs">
                      <div className="flex items-center gap-1">
                        <Star size={12} className="text-yellow-500" />
                        <span className="text-gray-600">NPS: {stats.nps}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp size={12} className="text-green-500" />
                        <span className="text-gray-600">{stats.trend}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Response Count */}
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-800">{stats.responses}</p>
                    <p className="text-xs text-gray-400">responses</p>
                  </div>
                </button>
              );
            })}
          </div>
          
          {/* Footer */}
          <div className="p-3 bg-gray-50 border-t border-gray-100">
            <p className="text-xs text-gray-500 text-center">
              Data shown for {selectedBrand.name} brand
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrandSwitcher;