import React, { useState } from 'react';
import {
    Plus,
    Search,
    Filter,
    Download,
    MoreVertical,
    Edit,
    Trash2,
    Eye,
    Store,
    MapPin,
    Calendar,
    CheckCircle,
    XCircle,
    Building,
    Globe,
    Phone,
    Mail
} from 'lucide-react';

const Stores = () => {
    const [stores, setStores] = useState([
        {
            id: 1,
            name: 'Luxe Valley Mall',
            address: '782 Fashion Ave, New York, NY 10001',
            brand: 'KFC',
            logo: 'KFC',
            status: 'active',
            dateCreated: 'Oct 12, 2023',
            phone: '+1 (212) 555-0123',
            email: 'luxe.valley@kfc.com',
            manager: 'John Smith',
            location: 'New York, NY'
        },
        {
            id: 2,
            name: 'South Beach Plaza',
            address: '441 Ocean Dr, Miami, FL 33139',
            brand: 'Pizza Hut',
            logo: 'PH',
            status: 'active',
            dateCreated: 'Jan 05, 2024',
            phone: '+1 (305) 555-0456',
            email: 'southbeach@pizzahut.com',
            manager: 'Maria Garcia',
            location: 'Miami, FL'
        },
        {
            id: 3,
            name: 'Crystal Heights',
            address: '22 Alpine Way, Aspen, CO 81611',
            brand: 'KFC',
            logo: 'KFC',
            status: 'inactive',
            dateCreated: 'Mar 22, 2023',
            phone: '+1 (970) 555-0789',
            email: 'crystal.heights@kfc.com',
            manager: 'Robert Johnson',
            location: 'Aspen, CO'
        },
        {
            id: 4,
            name: 'Emerald Marina',
            address: '101 Harbor View, Seattle, WA 98101',
            brand: 'Pizza Hut',
            logo: 'PH',
            status: 'active',
            dateCreated: 'Feb 14, 2024',
            phone: '+1 (206) 555-0321',
            email: 'emerald.marina@pizzahut.com',
            manager: 'Sarah Williams',
            location: 'Seattle, WA'
        },
        {
            id: 5,
            name: 'Golden Gate Center',
            address: '888 Market St, San Francisco, CA 94102',
            brand: 'KFC',
            logo: 'KFC',
            status: 'active',
            dateCreated: 'Nov 20, 2023',
            phone: '+1 (415) 555-0654',
            email: 'goldengate@kfc.com',
            manager: 'David Chen',
            location: 'San Francisco, CA'
        },
        {
            id: 6,
            name: 'Windy City Mall',
            address: '555 Michigan Ave, Chicago, IL 60611',
            brand: 'Pizza Hut',
            logo: 'PH',
            status: 'inactive',
            dateCreated: 'Aug 15, 2023',
            phone: '+1 (312) 555-0987',
            email: 'windycity@pizzahut.com',
            manager: 'Lisa Brown',
            location: 'Chicago, IL'
        },
        {
            id: 7,
            name: 'Lone Star Plaza',
            address: '777 Dallas Pkwy, Dallas, TX 75201',
            brand: 'KFC',
            logo: 'KFC',
            status: 'active',
            dateCreated: 'Feb 28, 2024',
            phone: '+1 (214) 555-0432',
            email: 'lonestar@kfc.com',
            manager: 'James Wilson',
            location: 'Dallas, TX'
        },
        {
            id: 8,
            name: 'Peachtree Center',
            address: '333 Peachtree St, Atlanta, GA 30303',
            brand: 'Pizza Hut',
            logo: 'PH',
            status: 'active',
            dateCreated: 'Dec 10, 2023',
            phone: '+1 (404) 555-0765',
            email: 'peachtree@pizzahut.com',
            manager: 'Jennifer Lee',
            location: 'Atlanta, GA'
        },
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [brandFilter, setBrandFilter] = useState('all');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedStore, setSelectedStore] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const [newStore, setNewStore] = useState({
        name: '',
        address: '',
        brand: 'KFC',
        phone: '',
        email: '',
        manager: '',
        location: '',
        status: 'active'
    });

    // Filter stores
    const filteredStores = stores.filter(store => {
        const matchesSearch = store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            store.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
            store.manager.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || store.status === statusFilter;
        const matchesBrand = brandFilter === 'all' || store.brand === brandFilter;
        return matchesSearch && matchesStatus && matchesBrand;
    });

    // Pagination
    const totalPages = Math.ceil(filteredStores.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedStores = filteredStores.slice(startIndex, startIndex + itemsPerPage);

    const handleAddStore = () => {
        if (!newStore.name || !newStore.address) {
            alert('Please fill in required fields');
            return;
        }

        const store = {
            id: stores.length + 1,
            ...newStore,
            dateCreated: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            logo: newStore.brand === 'KFC' ? 'KFC' : 'PH'
        };

        setStores([...stores, store]);
        setShowAddModal(false);
        setNewStore({
            name: '',
            address: '',
            brand: 'KFC',
            phone: '',
            email: '',
            manager: '',
            location: '',
            status: 'active'
        });
    };

    const handleDeleteStore = () => {
        setStores(stores.filter(store => store.id !== selectedStore.id));
        setShowDeleteModal(false);
        setSelectedStore(null);
    };

    const handleStatusToggle = (storeId) => {
        setStores(stores.map(store =>
            store.id === storeId
                ? { ...store, status: store.status === 'active' ? 'inactive' : 'active' }
                : store
        ));
    };

    const exportToCSV = () => {
        const csvData = [
            ['Store Name', 'Address', 'Brand', 'Status', 'Date Created', 'Phone', 'Email', 'Manager', 'Location']
        ];

        filteredStores.forEach(store => {
            csvData.push([
                store.name,
                store.address,
                store.brand,
                store.status,
                store.dateCreated,
                store.phone,
                store.email,
                store.manager,
                store.location
            ]);
        });

        const csvContent = csvData.map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `stores_export_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const getStatusBadge = (status) => {
        return status === 'active'
            ? <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                <CheckCircle size={12} />
                Active
            </span>
            : <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                <XCircle size={12} />
                Inactive
            </span>;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Stores</h1>
                    <p className="text-gray-500 mt-1">Manage your store locations and details</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all duration-300 shadow-lg hover:shadow-orange-300"
                >
                    <Plus size={18} />
                    Add New Store
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="card">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Total Stores</p>
                            <p className="text-2xl font-bold text-gray-900">{stores.length}</p>
                        </div>
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Store className="w-5 h-5 text-blue-600" />
                        </div>
                    </div>
                </div>
                <div className="card">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Active Stores</p>
                            <p className="text-2xl font-bold text-green-600">
                                {stores.filter(s => s.status === 'active').length}
                            </p>
                        </div>
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                        </div>
                    </div>
                </div>
                <div className="card">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">KFC Locations</p>
                            <p className="text-2xl font-bold text-orange-600">
                                {stores.filter(s => s.brand === 'KFC').length}
                            </p>
                        </div>
                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                            <Building className="w-5 h-5 text-orange-600" />
                        </div>
                    </div>
                </div>
                <div className="card">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Pizza Hut Locations</p>
                            <p className="text-2xl font-bold text-red-600">
                                {stores.filter(s => s.brand === 'Pizza Hut').length}
                            </p>
                        </div>
                        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                            <Building className="w-5 h-5 text-red-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="card">
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search stores, locations, or managers..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="input-field pl-10"
                        />
                    </div>

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="input-field w-40"
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>

                    <select
                        value={brandFilter}
                        onChange={(e) => setBrandFilter(e.target.value)}
                        className="input-field w-40"
                    >
                        <option value="all">All Brands</option>
                        <option value="KFC">KFC</option>
                        <option value="Pizza Hut">Pizza Hut</option>
                    </select>

                    <button
                        onClick={exportToCSV}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <Download size={18} />
                        Export CSV
                    </button>
                </div>
            </div>

            {/* Stores Table */}
            <div className="card overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-200">
                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">STORE NAME</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">ADDRESS</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">BRAND</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">STATUS</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">DATE CREATED</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedStores.map((store) => (
                            <tr key={store.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                <td className="py-3 px-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${store.brand === 'KFC' ? 'bg-orange-100' : 'bg-red-100'
                                            }`}>
                                            <span className={`font-bold text-sm ${store.brand === 'KFC' ? 'text-orange-600' : 'text-red-600'
                                                }`}>
                                                {store.logo}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{store.name}</p>
                                            <p className="text-xs text-gray-500">{store.manager}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-3 px-4">
                                    <div className="flex items-center gap-2">
                                        <MapPin size={14} className="text-gray-400" />
                                        <span className="text-sm text-gray-600">{store.address}</span>
                                    </div>
                                </td>
                                <td className="py-3 px-4">
                                    <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${store.brand === 'KFC' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                        {store.brand}
                                    </span>
                                </td>
                                <td className="py-3 px-4">
                                    {getStatusBadge(store.status)}
                                </td>
                                <td className="py-3 px-4">
                                    <div className="flex items-center gap-2">
                                        <Calendar size={14} className="text-gray-400" />
                                        <span className="text-sm text-gray-600">{store.dateCreated}</span>
                                    </div>
                                </td>
                                <td className="py-3 px-4">
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleStatusToggle(store.id)}
                                            className="p-1 hover:bg-gray-100 rounded transition-colors"
                                            title={store.status === 'active' ? 'Deactivate' : 'Activate'}
                                        >
                                            {store.status === 'active' ? (
                                                <XCircle size={16} className="text-red-500" />
                                            ) : (
                                                <CheckCircle size={16} className="text-green-500" />
                                            )}
                                        </button>
                                        <button
                                            className="p-1 hover:bg-gray-100 rounded transition-colors"
                                            title="Edit"
                                        >
                                            <Edit size={16} className="text-blue-500" />
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSelectedStore(store);
                                                setShowDeleteModal(true);
                                            }}
                                            className="p-1 hover:bg-gray-100 rounded transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 size={16} className="text-red-500" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-200">
                        <p className="text-sm text-gray-500">
                            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredStores.length)} of {filteredStores.length} entries
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                            >
                                Previous
                            </button>
                            <span className="px-3 py-1 text-sm">
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Add Store Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
                            <h3 className="text-xl font-semibold text-gray-900">Add New Store</h3>
                            <p className="text-sm text-gray-500 mt-1">Fill in the store details</p>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Store Name *</label>
                                    <input
                                        type="text"
                                        value={newStore.name}
                                        onChange={(e) => setNewStore({ ...newStore, name: e.target.value })}
                                        className="input-field"
                                        placeholder="Enter store name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
                                    <select
                                        value={newStore.brand}
                                        onChange={(e) => setNewStore({ ...newStore, brand: e.target.value })}
                                        className="input-field"
                                    >
                                        <option value="KFC">KFC</option>
                                        <option value="Pizza Hut">Pizza Hut</option>
                                    </select>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                                    <input
                                        type="text"
                                        value={newStore.address}
                                        onChange={(e) => setNewStore({ ...newStore, address: e.target.value })}
                                        className="input-field"
                                        placeholder="Full store address"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                                    <input
                                        type="text"
                                        value={newStore.location}
                                        onChange={(e) => setNewStore({ ...newStore, location: e.target.value })}
                                        className="input-field"
                                        placeholder="City, State"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                                    <input
                                        type="text"
                                        value={newStore.phone}
                                        onChange={(e) => setNewStore({ ...newStore, phone: e.target.value })}
                                        className="input-field"
                                        placeholder="Contact number"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                    <input
                                        type="email"
                                        value={newStore.email}
                                        onChange={(e) => setNewStore({ ...newStore, email: e.target.value })}
                                        className="input-field"
                                        placeholder="store@email.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Manager</label>
                                    <input
                                        type="text"
                                        value={newStore.manager}
                                        onChange={(e) => setNewStore({ ...newStore, manager: e.target.value })}
                                        className="input-field"
                                        placeholder="Store manager name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                    <select
                                        value={newStore.status}
                                        onChange={(e) => setNewStore({ ...newStore, status: e.target.value })}
                                        className="input-field"
                                    >
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6 flex justify-end gap-3">
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="btn-secondary"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddStore}
                                className="btn-primary"
                            >
                                Add Store
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && selectedStore && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-md w-full p-6">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Trash2 size={24} className="text-red-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Store</h3>
                            <p className="text-gray-500 mb-6">
                                Are you sure you want to delete <span className="font-semibold">{selectedStore.name}</span>? This action cannot be undone.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="flex-1 btn-secondary"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeleteStore}
                                    className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Stores;