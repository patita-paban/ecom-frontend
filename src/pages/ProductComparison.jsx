// ProductComparison.jsx - Fixed Version with Correct Imports
import React, { useState, useEffect } from 'react';
import { 
  FaCheckCircle, FaTimesCircle, FaShoppingCart, FaTrash, 
  FaHeart, FaStar, FaTimes, FaBalanceScale, FaExchangeAlt 
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../api/api';

const ProductComparison = () => {
  const [compareProducts, setCompareProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load comparison products from localStorage
  useEffect(() => {
    const savedComparison = localStorage.getItem('compareProducts');
    if (savedComparison) {
      const productIds = JSON.parse(savedComparison);
      fetchComparisonProducts(productIds);
    }
  }, []);

  const fetchComparisonProducts = async (productIds) => {
    if (productIds.length === 0) {
      setCompareProducts([]);
      return;
    }

    setIsLoading(true);
    try {
      const promises = productIds.map(id => api.get(`/products/${id}`));
      const responses = await Promise.all(promises);
      const products = responses.map(res => res.data);
      setCompareProducts(products);
    } catch (error) {
      console.error('Error fetching comparison products:', error);
      toast.error('Failed to load comparison products');
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromComparison = (productId) => {
    const savedComparison = JSON.parse(localStorage.getItem('compareProducts') || '[]');
    const updated = savedComparison.filter(id => id !== productId);
    localStorage.setItem('compareProducts', JSON.stringify(updated));
    setCompareProducts(prev => prev.filter(p => p.productId !== productId));
    toast.info('Product removed from comparison');
  };

  const clearAllComparison = () => {
    localStorage.removeItem('compareProducts');
    setCompareProducts([]);
    toast.info('Comparison list cleared');
  };

  const handleAddToCart = async (product) => {
    try {
      // Direct API call to add to cart
      await api.post('/cart/add', {
        productId: product.productId,
        quantity: 1
      });
      toast.success(`${product.productName} added to cart!`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart');
    }
  };

  if (compareProducts.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <FaBalanceScale className="text-gray-300 text-6xl mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              No Products to Compare
            </h2>
            <p className="text-gray-600 mb-6">
              Add products from the product listing page to compare their features, 
              specifications, and prices side by side.
            </p>
            <a
              href="/products"
              className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              Browse Products
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading comparison...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <FaBalanceScale className="text-indigo-600 text-3xl" />
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  Product Comparison
                </h1>
                <p className="text-gray-600">
                  Compare {compareProducts.length} product{compareProducts.length > 1 ? 's' : ''} side by side
                </p>
              </div>
            </div>
            <button
              onClick={clearAllComparison}
              className="flex items-center gap-2 bg-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors"
            >
              <FaTimes />
              Clear All
            </button>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                <tr>
                  <th className="p-4 text-left font-semibold min-w-[150px] sticky left-0 bg-indigo-600 z-10">
                    Specifications
                  </th>
                  {compareProducts.map((product, index) => (
                    <th key={product.productId} className="p-4 text-center font-semibold min-w-[250px]">
                      Product {index + 1}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Product Images */}
                <tr className="border-b border-gray-200 bg-gray-50">
                  <td className="p-4 font-semibold text-gray-700 sticky left-0 bg-gray-50 z-10">
                    Image
                  </td>
                  {compareProducts.map(product => (
                    <td key={product.productId} className="p-4">
                      <div className="relative group">
                        <img
                          src={product.image || '/placeholder.jpg'}
                          alt={product.productName}
                          className="w-full h-48 object-cover rounded-lg shadow-md group-hover:scale-105 transition-transform"
                        />
                        <button
                          onClick={() => removeFromComparison(product.productId)}
                          className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                          title="Remove from comparison"
                        >
                          <FaTrash size={12} />
                        </button>
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Product Name */}
                <tr className="border-b border-gray-200">
                  <td className="p-4 font-semibold text-gray-700 sticky left-0 bg-white z-10">
                    Product Name
                  </td>
                  {compareProducts.map(product => (
                    <td key={product.productId} className="p-4">
                      <h3 className="font-bold text-gray-800 text-center">
                        {product.productName}
                      </h3>
                    </td>
                  ))}
                </tr>

                {/* Price */}
                <tr className="border-b border-gray-200 bg-gray-50">
                  <td className="p-4 font-semibold text-gray-700 sticky left-0 bg-gray-50 z-10">
                    Price
                  </td>
                  {compareProducts.map(product => (
                    <td key={product.productId} className="p-4 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-2xl font-bold text-green-600">
                          ${product.specialPrice?.toFixed(2)}
                        </span>
                        {product.discount > 0 && (
                          <>
                            <span className="text-sm text-gray-500 line-through">
                              ${product.price?.toFixed(2)}
                            </span>
                            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                              {product.discount}% OFF
                            </span>
                          </>
                        )}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Category */}
                <tr className="border-b border-gray-200">
                  <td className="p-4 font-semibold text-gray-700 sticky left-0 bg-white z-10">
                    Category
                  </td>
                  {compareProducts.map(product => (
                    <td key={product.productId} className="p-4 text-center">
                      <span className="inline-block bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-semibold">
                        {product.category?.categoryName || 'N/A'}
                      </span>
                    </td>
                  ))}
                </tr>

                {/* Rating */}
                <tr className="border-b border-gray-200 bg-gray-50">
                  <td className="p-4 font-semibold text-gray-700 sticky left-0 bg-gray-50 z-10">
                    Rating
                  </td>
                  {compareProducts.map(product => (
                    <td key={product.productId} className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <FaStar
                              key={i}
                              className={i < Math.floor(product.rating || 4) ? 'text-yellow-400' : 'text-gray-300'}
                              size={16}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">
                          ({product.rating || '4.0'})
                        </span>
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Availability */}
                <tr className="border-b border-gray-200">
                  <td className="p-4 font-semibold text-gray-700 sticky left-0 bg-white z-10">
                    Availability
                  </td>
                  {compareProducts.map(product => (
                    <td key={product.productId} className="p-4 text-center">
                      {product.quantity > 0 ? (
                        <div className="flex items-center justify-center gap-2 text-green-600">
                          <FaCheckCircle />
                          <span className="font-semibold">In Stock ({product.quantity})</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2 text-red-600">
                          <FaTimesCircle />
                          <span className="font-semibold">Out of Stock</span>
                        </div>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Description */}
                <tr className="border-b border-gray-200 bg-gray-50">
                  <td className="p-4 font-semibold text-gray-700 sticky left-0 bg-gray-50 z-10">
                    Description
                  </td>
                  {compareProducts.map(product => (
                    <td key={product.productId} className="p-4">
                      <p className="text-sm text-gray-600 text-left line-clamp-4">
                        {product.description || 'No description available'}
                      </p>
                    </td>
                  ))}
                </tr>

                {/* Actions */}
                <tr className="bg-gray-100">
                  <td className="p-4 font-semibold text-gray-700 sticky left-0 bg-gray-100 z-10">
                    Actions
                  </td>
                  {compareProducts.map(product => (
                    <td key={product.productId} className="p-4">
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => handleAddToCart(product)}
                          disabled={product.quantity === 0}
                          className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                            product.quantity > 0
                              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg'
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          <FaShoppingCart />
                          Add to Cart
                        </button>
                        <a
                          href={`/products/${product.productId}`}
                          className="flex items-center justify-center gap-2 bg-white border-2 border-indigo-600 text-indigo-600 px-4 py-2 rounded-lg font-semibold hover:bg-indigo-50 transition-all"
                        >
                          View Details
                        </a>
                        <button
                          onClick={() => removeFromComparison(product.productId)}
                          className="flex items-center justify-center gap-2 bg-red-50 border-2 border-red-500 text-red-600 px-4 py-2 rounded-lg font-semibold hover:bg-red-100 transition-all"
                        >
                          <FaTrash size={14} />
                          Remove
                        </button>
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Comparison Tips */}
        <div className="mt-6 bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-blue-800 mb-3 flex items-center gap-2">
            <FaExchangeAlt />
            Comparison Tips
          </h3>
          <ul className="space-y-2 text-blue-700">
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-1">•</span>
              <span>You can compare up to 4 products at once for best viewing experience</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-1">•</span>
              <span>Click "Add to Cart" to purchase your preferred product directly</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-1">•</span>
              <span>Use "View Details" to see complete product information and reviews</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-1">•</span>
              <span>Your comparison list is saved and persists across sessions</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProductComparison;
