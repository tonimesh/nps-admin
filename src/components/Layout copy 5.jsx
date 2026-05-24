import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ClipboardList,
  FileText,
  LogOut,
  Menu,
  X,
  PlusCircle,
  Eye,
  Building,
  Store,
  ChevronDown,
  Check,
} from 'lucide-react';
import { useBrand } from '../context/BrandContext';

const Layout = ({ children, user, setUser }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [brandOpen, setBrandOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const { selectedBrand, userBrands, switchBrand } = useBrand();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Brands', href: '/brands', icon: Building },
    { name: 'Stores', href: '/stores', icon: Store },
    { name: 'Create Survey', href: '/create-survey', icon: PlusCircle },
    { name: 'Survey Management', href: '/survey-management', icon: ClipboardList },
    { name: 'Survey Preview', href: '/survey-preview', icon: Eye },
    { name: 'Reports', href: '/reports', icon: FileText },
  ];

  const handleLogout = () => {
    localStorage.removeItem('surveyUser');
    setUser(null);
    navigate('/login');
  };

  const getBrandColor = (brandId) => {
    switch (brandId) {
      case 'kfc':
        return 'from-red-500 to-red-600';
      case 'pizza_hut':
        return 'from-orange-500 to-orange-600';
      case 'taco_bell':
        return 'from-purple-500 to-purple-600';
      default:
        return 'from-orange-500 to-amber-500';
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f8f8]">
      {/* Mobile Toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-xl shadow-md"
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-72 bg-white border-r border-orange-100 transform transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Brand Logo */}
          <div className="px-6 py-5 border-b border-orange-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center shadow-lg shadow-orange-200">
                <span className="text-white text-xl font-black">L</span>
              </div>

              <div>
                <h1 className="text-2xl font-black tracking-tight">
                  <span className="text-gray-900">Loyal</span>
                  <span className="bg-gradient-to-r from-orange-500 to-amber-400 bg-clip-text text-transparent">
                    ytics
                  </span>
                </h1>

                <p className="text-xs text-gray-500 -mt-1">
                  Customer Intelligence Platform
                </p>
              </div>
            </div>
          </div>

          {/* Brand Switcher */}
  {/* Brand Switcher */}
<div className="px-4 py-4 border-b border-orange-100">
  <p className="text-[10px] font-semibold tracking-wider text-gray-400 uppercase mb-2">
    Active Brands
  </p>

  <div className="relative">
    {/* Selected Brand */}
    <button
      onClick={() => setBrandOpen(!brandOpen)}
      className={`w-full rounded-xl bg-gradient-to-r ${getBrandColor(
        selectedBrand.id
      )} px-3 py-2.5 text-white shadow-md transition-all`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-white/20 backdrop-blur flex items-center justify-center text-lg">
            {selectedBrand.logo}
          </div>

          <div className="text-left">
            <h3 className="font-semibold text-sm leading-none">
              {selectedBrand.name}
            </h3>
          </div>
        </div>

        <ChevronDown
          size={16}
          className={`transition-transform ${
            brandOpen ? 'rotate-180' : ''
          }`}
        />
      </div>
    </button>

    {/* Dropdown */}
    {brandOpen && (
      <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-xl border border-orange-100 shadow-xl overflow-hidden z-50">
        {userBrands.map((brand) => {
          const active = selectedBrand.id === brand.id;

          return (
            <button
              key={brand.id}
              onClick={() => {
                switchBrand(brand);
                setBrandOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 transition-all ${
                active
                  ? 'bg-orange-50'
                  : 'hover:bg-orange-50/50'
              }`}
            >
              <div className="flex items-center gap-2">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg bg-gradient-to-r ${getBrandColor(
                    brand.id
                  )} text-white`}
                >
                  {brand.logo}
                </div>

                <p className="font-medium text-sm text-gray-800">
                  {brand.name}
                </p>
              </div>

              {active && (
                <div className="w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center">
                  <Check size={12} className="text-white" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    )}
  </div>
</div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-1 space-y-1.5 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`group flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-orange-500 to-amber-400 text-white shadow-md'
                      : 'text-gray-700 hover:bg-orange-50'
                  }`}
                >
                  <item.icon
                    size={19}
                    className={`${
                      isActive
                        ? 'text-white'
                        : 'text-gray-500 group-hover:text-orange-500'
                    }`}
                  />

                  <span className="font-medium text-sm">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-orange-100">
            <div className="bg-orange-50 rounded-2xl p-4 mb-3">
              <p className="text-xs text-gray-500 mb-1">Logged in as</p>

              <p className="text-sm font-semibold text-gray-800 truncate">
                {user?.email}
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-red-100 text-red-500 hover:bg-red-50 transition-all font-medium"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-72 min-h-screen">
        <div className="p-4 lg:p-6">{children}</div>
      </main>
    </div>
  );
};

export default Layout;