import React, { createContext, useState, useContext, useEffect } from 'react';
import { mockBrands } from '../utils/mockData';

const BrandContext = createContext();

export const useBrand = () => {
  const context = useContext(BrandContext);
  if (!context) {
    throw new Error('useBrand must be used within BrandProvider');
  }
  return context;
};

export const BrandProvider = ({ children }) => {
  const [selectedBrand, setSelectedBrand] = useState(() => {
    const saved = localStorage.getItem('selectedBrand');
    return saved ? JSON.parse(saved) : mockBrands.find(b => b.associated) || mockBrands[0];
  });
  
  const [userBrands, setUserBrands] = useState(() => {
    const saved = localStorage.getItem('userBrands');
    return saved ? JSON.parse(saved) : mockBrands.filter(b => b.associated);
  });

  useEffect(() => {
    localStorage.setItem('selectedBrand', JSON.stringify(selectedBrand));
  }, [selectedBrand]);

  useEffect(() => {
    localStorage.setItem('userBrands', JSON.stringify(userBrands));
  }, [userBrands]);

  const switchBrand = (brand) => {
    setSelectedBrand(brand);
  };

  const updateBrandLogo = (brandId, logo) => {
    setUserBrands(userBrands.map(brand => 
      brand.id === brandId ? { ...brand, logo } : brand
    ));
  };

  return (
    <BrandContext.Provider value={{
      selectedBrand,
      userBrands,
      switchBrand,
      updateBrandLogo
    }}>
      {children}
    </BrandContext.Provider>
  );
};