import React, { useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { useBrand } from '../context/BrandContext';

const BrandSwitcher = () => {
  const { selectedBrand, userBrands, switchBrand } = useBrand();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <span className="text-2xl">{selectedBrand.logo}</span>
        <div className="text-left">
          <p className="text-sm font-medium text-gray-900">{selectedBrand.name}</p>
          <p className="text-xs text-gray-500">{selectedBrand.description}</p>
        </div>
        <ChevronDown size={16} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
            <div className="p-2">
              <p className="text-xs text-gray-500 px-3 py-2">Switch Brand</p>
              {userBrands.map((brand) => (
                <button
                  key={brand.id}
                  onClick={() => {
                    switchBrand(brand);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    selectedBrand.id === brand.id
                      ? 'bg-orange-50 text-orange-700'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <span className="text-xl">{brand.logo}</span>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium">{brand.name}</p>
                    <p className="text-xs text-gray-500">{brand.description}</p>
                  </div>
                  {selectedBrand.id === brand.id && <Check size={16} className="text-orange-600" />}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default BrandSwitcher;