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

  const categories = ['phone', 'laptop', 'tv', 'home appliance'];

  useEffect(() => {
    const filters = {
      category: selectedCategory,
      price_max: budget,
      power_voltage: voltage,
      // Add other filters as needed
    };
    dispatch(setFilters(filters));
    dispatch(fetchProducts(filters));
  }, [selectedCategory, budget, voltage, dispatch]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8">Gadget Recommendations</h1>

      {/* Filters */}
      <div className="mb-8 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Budget Slider */}
          <div>
            <label className="block text-sm font-medium mb-2">Budget (KES)</label>
            <input
              type="range"
              min="5000"
              max="500000"
              step="5000"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-full"
            />
            <span className="text-sm text-gray-600">{budget.toLocaleString()} KES</span>
          </div>
          {/* Voltage */}
          <div>
            <label className="block text-sm font-medium mb-2">Voltage</label>
            <input
              type="text"
              value={voltage}
              onChange={(e) => setVoltage(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="e.g., 240V"
            />
          </div>
          {/* Wattage */}
          <div>
            <label className="block text-sm font-medium mb-2">Wattage</label>
            <input
              type="number"
              value={wattage}
              onChange={(e) => setWattage(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="e.g., 100W"
            />
          </div>
          {/* Adapter Type */}
          <div>
            <label className="block text-sm font-medium mb-2">Adapter Type</label>
            <input
              type="text"
              value={adapterType}
              onChange={(e) => setAdapterType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="e.g., USB-C"
            />
          </div>
        </div>
      </div>

      {/* Category Selection */}
      <div className="flex justify-center mb-8">
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Loading/Error */}
      {loading && <p className="text-center">Loading products...</p>}
      {error && <p className="text-center text-red-500">{error.message || 'Error fetching products'}</p>}

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <div key={product._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
            <p className="text-gray-600 mb-1"><strong>Brand:</strong> {product.brand?.name || 'Unknown'}</p>
            <p className="text-gray-600 mb-1"><strong>Price:</strong> KSh {product.price_kes?.toLocaleString()}</p>
            <p className="text-gray-600 mb-1"><strong>Power Specs:</strong> {product.specifications?.power_voltage} {product.specifications?.power_frequency}</p>
            <p className="text-gray-600 mb-4"><strong>Features:</strong> {product.specifications?.features?.join(', ')}</p>
            <div className="mb-4">
              <strong>Available on:</strong>
              <div className="flex gap-2 mt-1">
                {product.marketplaces?.map(marketplace => (
                  <a
                    key={marketplace._id}
                    href={marketplace.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    {marketplace.platform?.name || 'Marketplace'}
                  </a>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recommendations;