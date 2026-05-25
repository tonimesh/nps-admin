import React, { useState } from 'react';
import {
    Edit2,
    Save,
    X,
    Building2,
    Globe,
    Mail,
    Phone,
    BadgeCheck,
    Sparkles,
    MapMinusIcon,
    MapPin,
} from 'lucide-react';
import { useBrand } from '../context/BrandContext';

const Brands = () => {
    const { userBrands, updateBrandLogo } = useBrand();

    const [editingBrand, setEditingBrand] = useState(null);
    const [tempLogo, setTempLogo] = useState('');

    const logoOptions = ['🍗', '🍕', '🌮', '👑', '🍔', '🌯', '🍟', '🥤'];

    const handleLogoUpdate = (brand) => {
        if (tempLogo) {
            updateBrandLogo(brand.id, tempLogo);
            setEditingBrand(null);
            setTempLogo('');
        }
    };

    const getBrandGradient = (brandId) => {
        switch (brandId) {
            case 'kfc':
                return 'from-red-500 to-red-600';
            case 'pizza_hut':
                return 'from-orange-500 to-orange-600';
            case 'taco_bell':
                return 'from-purple-500 to-purple-600';
            default:
                return 'from-orange-500 to-amber-400';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            {/* <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900">
            Brand Management
          </h1>

          <p className="text-gray-500 mt-1 text-sm">
            Manage and customize your associated brands
          </p>
        </div>

        <div className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-400 text-white px-4 py-2 rounded-2xl shadow-md">
          <Sparkles size={16} />
          <span className="text-sm font-semibold">
            {userBrands.length} Active Brands
          </span>
        </div>
      </div> */}

            {/* Brands Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {userBrands.map((brand) => (
                    <div
                        key={brand.id}
                        className="relative overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-sm hover:shadow-xl transition-all duration-300"
                    >
                        {/* Top Gradient */}
                        <div
                            className={`h-2 bg-gradient-to-r ${getBrandGradient(
                                brand.id
                            )}`}
                        />

                        <div className="p-5">
                            {/* Header */}
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-4">
                                    {/* Logo */}
                                    {editingBrand === brand.id ? (
                                        <div className="relative">
                                            <select
                                                value={tempLogo}
                                                onChange={(e) => setTempLogo(e.target.value)}
                                                className="w-20 h-20 rounded-2xl border border-orange-200 text-3xl text-center bg-orange-50 focus:outline-none"
                                            >
                                                {logoOptions.map((logo) => (
                                                    <option key={logo} value={logo}>
                                                        {logo}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    ) : (
                                        <div
                                            className={`w-20 h-20 rounded-3xl bg-gradient-to-r ${getBrandGradient(
                                                brand.id
                                            )} flex items-center justify-center text-4xl shadow-lg`}
                                        >
                                            {brand.logo}
                                        </div>
                                    )}

                                    {/* Brand Info */}
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900">
                                            {brand.name}
                                        </h3>

                                        <div className="flex items-center gap-2 mt-2">
                                            <BadgeCheck
                                                size={16}
                                                className="text-green-500"
                                            />

                                            <span className="text-sm font-medium text-green-600">
                                                Active
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                {/* {editingBrand === brand.id ? (
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleLogoUpdate(brand)}
                                            className="w-9 h-9 rounded-xl bg-green-100 text-green-600 flex items-center justify-center hover:bg-green-200 transition-all"
                                        >
                                            <Save size={16} />
                                        </button>

                                        <button
                                            onClick={() => {
                                                setEditingBrand(null);
                                                setTempLogo('');
                                            }}
                                            className="w-9 h-9 rounded-xl bg-red-100 text-red-500 flex items-center justify-center hover:bg-red-200 transition-all"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => {
                                            setEditingBrand(brand.id);
                                            setTempLogo(brand.logo);
                                        }}
                                        className="w-9 h-9 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center hover:bg-orange-100 transition-all"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                )} */}
                            </div>

                            {/* Info Section */}
                            <div className="mt-6 space-y-4">
                                {/* <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center">
                                        <Globe size={16} className="text-orange-500" />
                                    </div>

                                    <span>
                                        {brand.website || 'www.brandsite.com'}
                                    </span>
                                </div> */}

                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center">
                                        <Mail size={16} className="text-orange-500" />
                                    </div>

                                    <span>
                                        {brand?.email}
                                    </span>
                                </div>

                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center">
                                        <Phone size={16} className="text-orange-500" />
                                    </div>

                                    <span>{brand?.phone}</span>
                                </div>

                                 <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center">
                                        <MapPin size={16} className="text-orange-500" />
                                    </div>

                                    <span>{brand?.address}</span>
                                </div>

                                
                            </div>

                            {/* Footer */}
                            {/* <div className="mt-6 pt-5 border-t border-orange-100 flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400">
                    Brand ID
                  </p>

                  <p className="text-sm font-semibold text-gray-700 uppercase">
                    {brand.id}
                  </p>
                </div>

                <button
                  className={`px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r ${getBrandGradient(
                    brand.id
                  )} shadow-md hover:opacity-90 transition-all`}
                >
                  View Details
                </button>
              </div> */}

                            {/* <div className="mt-6 pt-5 border-t border-orange-100">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-gray-400">
                                            Brand Code
                                        </p>

                                        <p className="text-sm font-semibold text-gray-700">
                                            {brand.code}
                                        </p>
                                    </div>

                                    <div className="px-3 py-1 rounded-full bg-green-100 text-green-600 text-xs font-semibold">
                                        {brand.status}
                                    </div>
                                </div>
                            </div> */}
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {userBrands.length === 0 && (
                <div className="bg-white border border-dashed border-orange-200 rounded-3xl py-20 text-center">
                    <div className="w-20 h-20 rounded-3xl bg-orange-50 mx-auto flex items-center justify-center mb-5">
                        <Building2 className="w-10 h-10 text-orange-500" />
                    </div>

                    <h3 className="text-xl font-bold text-gray-800">
                        No Brands Found
                    </h3>

                    <p className="text-gray-500 mt-2">
                        Your account currently has no associated brands.
                    </p>
                </div>
            )}
        </div>
    );
};

export default Brands;