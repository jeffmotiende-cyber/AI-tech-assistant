import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, setFilters } from '../store/productsSlice';

const Recommendations = () => {
  const [selectedCategory, setSelectedCategory] = useState('phone');
  const [budget, setBudget] = useState(50000);
  const [voltage, setVoltage] = useState('240V');
  const [wattage, setWattage] = useState('');
  const [adapterType, setAdapterType] = useState('');

  const dispatch = useDispatch();
  const { items: products, loading, error } = useSelector((state) => state.products);

  const categories = [
    { id: 'phone', name: 'Phones', icon: '📱' },
    { id: 'laptop', name: 'Laptops', icon: '💻' },
    { id: 'tv', name: 'TVs', icon: '📺' },
    { id: 'home appliance', name: 'Appliances', icon: '🏠' }
  ];

  useEffect(() => {
    const filters = {
      category: selectedCategory,
      price_max: budget,
      power_voltage: voltage,
    };
    dispatch(setFilters(filters));
    dispatch(fetchProducts(filters));
  }, [selectedCategory, budget, voltage, dispatch]);

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Page Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Discover</span> Electronics
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find the perfect electronics tailored for Kenya with AI-powered recommendations
          </p>
        </div>

        {/* Category Selection */}
        <div className="flex justify-center mb-8 animate-slide-up">
          <div className="glass-dark rounded-2xl p-2 inline-flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${selectedCategory === category.id
                    ? 'bg-gradient-primary text-white shadow-lg transform scale-105'
                    : 'text-gray-700 hover:bg-white hover:bg-opacity-50'
                  }`}
              >
                <span className="text-xl">{category.icon}</span>
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Filters Section */}
        <div className="mb-10 animate-slide-up" style={{ animationDelay: '100ms' }}>
          <div className="card-glass">
            <h2 className="text-2xl font-bold mb-6 gradient-text">Refine Your Search</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Budget Slider */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Budget (KES)
                </label>
                <div className="relative">
                  <input
                    type="range"
                    min="5000"
                    max="500000"
                    step="5000"
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #a855f7 0%, #a855f7 ${((budget - 5000) / (500000 - 5000)) * 100}%, #e5e7eb ${((budget - 5000) / (500000 - 5000)) * 100}%, #e5e7eb 100%)`
                    }}
                  />
                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-xs text-gray-500">KES 5K</span>
                    <span className="text-sm font-bold gradient-text">
                      KES {budget.toLocaleString()}
                    </span>
                    <span className="text-xs text-gray-500">KES 500K</span>
                  </div>
                </div>
              </div>

              {/* Voltage */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Voltage
                </label>
                <input
                  type="text"
                  value={voltage}
                  onChange={(e) => setVoltage(e.target.value)}
                  className="input"
                  placeholder="e.g., 240V"
                />
              </div>

              {/* Wattage */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Wattage
                </label>
                <input
                  type="number"
                  value={wattage}
                  onChange={(e) => setWattage(e.target.value)}
                  className="input"
                  placeholder="e.g., 100W"
                />
              </div>

              {/* Adapter Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Adapter Type
                </label>
                <input
                  type="text"
                  value={adapterType}
                  onChange={(e) => setAdapterType(e.target.value)}
                  className="input"
                  placeholder="e.g., USB-C"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
            <div className="spinner mb-4"></div>
            <p className="text-gray-600 font-medium">Finding the best products for you...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="max-w-md mx-auto animate-slide-up">
            <div className="p-6 bg-red-50 border-l-4 border-red-500 rounded-lg">
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-700 font-medium">
                  {error.message || 'Error fetching products. Please try again.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Product Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.length === 0 ? (
              <div className="col-span-full text-center py-20 animate-fade-in">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-gray-700 mb-2">No products found</h3>
                <p className="text-gray-500">Try adjusting your filters to see more results</p>
              </div>
            ) : (
              products.map((product, index) => (
                <div
                  key={product._id}
                  className="card bg-white hover:shadow-2xl group animate-slide-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Product Image Placeholder */}
                  <div className="w-full h-48 bg-gradient-to-br from-purple-100 to-emerald-100 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
                    <span className="text-6xl opacity-50">
                      {selectedCategory === 'phone' ? '📱' :
                        selectedCategory === 'laptop' ? '💻' :
                          selectedCategory === 'tv' ? '📺' : '🏠'}
                    </span>
                  </div>

                  {/* Product Info */}
                  <h2 className="text-xl font-bold mb-3 text-gray-800 group-hover:gradient-text transition-all">
                    {product.name}
                  </h2>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-500">Brand:</span>
                      <span className="text-sm text-gray-700">{product.brand?.name || 'Unknown'}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-500">Price:</span>
                      <span className="text-lg font-bold gradient-text">
                        KSh {product.price_kes?.toLocaleString()}
                      </span>
                    </div>

                    {product.specifications?.power_voltage && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-500">Power:</span>
                        <span className="text-sm text-gray-700">
                          {product.specifications.power_voltage} {product.specifications.power_frequency}
                        </span>
                      </div>
                    )}

                    {product.specifications?.features && product.specifications.features.length > 0 && (
                      <div>
                        <span className="text-sm font-semibold text-gray-500 block mb-1">Features:</span>
                        <div className="flex flex-wrap gap-1">
                          {product.specifications.features.slice(0, 3).map((feature, idx) => (
                            <span key={idx} className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Marketplaces */}
                  {product.marketplaces && product.marketplaces.length > 0 && (
                    <div className="pt-4 border-t border-gray-200">
                      <span className="text-sm font-semibold text-gray-500 block mb-2">Available on:</span>
                      <div className="flex flex-wrap gap-2">
                        {product.marketplaces.map(marketplace => (
                          <a
                            key={marketplace._id}
                            href={marketplace.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs px-3 py-1.5 bg-gradient-accent text-white rounded-lg hover:shadow-lg transition-all transform hover:scale-105"
                          >
                            {marketplace.platform?.name || 'Shop'}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Recommendations;
