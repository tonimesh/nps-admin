import React, {
  createContext,
  useState,
  useContext,
  useEffect,
} from "react";

const BrandContext = createContext();

export const useBrand = () => {
  const context = useContext(BrandContext);

  if (!context) {
    throw new Error(
      "useBrand must be used within BrandProvider"
    );
  }

  return context;
};

export const BrandProvider = ({ children }) => {
  const [selectedBrand, setSelectedBrand] =
    useState(() => {
      const saved = localStorage.getItem(
        "selectedBrand"
      );

      return saved ? JSON.parse(saved) : null;
    });

  const [userBrands, setUserBrands] = useState(() => {
    const saved = localStorage.getItem(
      "userBrands"
    );

    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(
      "selectedBrand",
      JSON.stringify(selectedBrand)
    );
  }, [selectedBrand]);

  useEffect(() => {
    localStorage.setItem(
      "userBrands",
      JSON.stringify(userBrands)
    );
  }, [userBrands]);

  const switchBrand = (brand) => {
    setSelectedBrand(brand);
  };

  const setBrandsFromLogin = (brands) => {
    setUserBrands(brands);

    if (brands.length > 0) {
      setSelectedBrand(brands[0]);
    }
  };

  return (
    <BrandContext.Provider
      value={{
        selectedBrand,
        userBrands,
        switchBrand,
        setBrandsFromLogin,
      }}
    >
      {children}
    </BrandContext.Provider>
  );
};