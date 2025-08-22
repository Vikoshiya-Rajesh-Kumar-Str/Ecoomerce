import React from 'react';
import { ArrowLeft, Grid, List, Filter } from 'lucide-react';

const CategoryListPage = ({ 
  category, 
  products, 
  onBack, 
  onAddToCart, 
  onAddToWishlist, 
  onOpenDetails,
  favorites = [] 
}) => {
  const [viewMode, setViewMode] = React.useState('grid');
  const [sortBy, setSortBy] = React.useState('name');
  const [sortedProducts, setSortedProducts] = React.useState(products);

  React.useEffect(() => {
    let sorted = [...products];
    switch (sortBy) {
      case 'price-low':
        sorted.sort((a, b) => parseInt(a['new-price']) - parseInt(b['new-price']));
        break;
      case 'price-high':
        sorted.sort((a, b) => parseInt(b['new-price']) - parseInt(a['new-price']));
        break;
      case 'name':
        sorted.sort((a, b) => a['product-title'].localeCompare(b['product-title']));
        break;
      default:
        break;
    }
    setSortedProducts(sorted);
  }, [products, sortBy]);

  const isInWishlist = (product) => {
    return favorites.some(fav => fav['product-title'] === product['product-title']);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const calculateDiscount = (oldPrice, newPrice) => {
    const discount = ((oldPrice - newPrice) / oldPrice) * 100;
    return Math.round(discount);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <a
                href="#home"
                onClick={(e) => {
                  e.preventDefault();
                  onBack();
                }}
                className="flex items-center space-x-2 text-blue-900 hover:text-blue-700 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back</span>
              </a>
              <div className="h-6 w-px bg-gray-300"></div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{category}</h1>
                <p className="text-gray-600 mt-1">{products.length} products available</p>
              </div>
            </div>

            {/* View Controls */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="name">Name</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
              
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-blue-900 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-blue-900 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {sortedProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <Filter className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600">Try adjusting your filters or search terms.</p>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
            : "space-y-4"
          }>
            {sortedProducts.map((product, index) => (
              <div
                key={index}
                className={viewMode === 'grid' 
                  ? "bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden group cursor-pointer"
                  : "bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 overflow-hidden cursor-pointer"
                }
                onClick={() => onOpenDetails && onOpenDetails(product)}
              >
                {viewMode === 'grid' ? (
                  // Grid View
                  <>
                    <div className="relative aspect-square overflow-hidden">
                      <img
                        src={product['image-url']}
                        alt={product['product-title']}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {product['old-price'] !== product['new-price'] && (
                        <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                          {calculateDiscount(parseInt(product['old-price']), parseInt(product['new-price']))}% OFF
                        </div>
                      )}
                      <button
                        onClick={() => onAddToWishlist(product)}
                        className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 ${
                          isInWishlist(product)
                            ? 'bg-pink-500 text-white'
                            : 'bg-white text-gray-600 hover:bg-pink-50 hover:text-pink-500'
                        }`}
                      >
                        <svg className="w-4 h-4" fill={isInWishlist(product) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-900 transition-colors">
                        {product['product-title']}
                      </h3>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-bold text-gray-900">
                            {formatPrice(product['new-price'])}
                          </span>
                          {product['old-price'] !== product['new-price'] && (
                            <span className="text-sm text-gray-500 line-through">
                              {formatPrice(product['old-price'])}
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => onAddToCart(product)}
                        className="w-full bg-blue-900 text-white py-2 px-4 rounded-lg hover:bg-blue-800 transition-colors font-medium"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </>
                ) : (
                  // List View
                  <div className="flex items-center p-4 space-x-4">
                    <div className="relative w-24 h-24 flex-shrink-0 overflow-hidden rounded-lg">
                      <img
                        src={product['image-url']}
                        alt={product['product-title']}
                        className="w-full h-full object-cover"
                      />
                      {product['old-price'] !== product['new-price'] && (
                        <div className="absolute top-1 left-1 bg-red-500 text-white px-1 py-0.5 rounded text-xs font-semibold">
                          {calculateDiscount(parseInt(product['old-price']), parseInt(product['new-price']))}%
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 mb-1 truncate">
                        {product['product-title']}
                      </h3>
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-lg font-bold text-gray-900">
                          {formatPrice(product['new-price'])}
                        </span>
                        {product['old-price'] !== product['new-price'] && (
                          <span className="text-sm text-gray-500 line-through">
                            {formatPrice(product['old-price'])}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onAddToWishlist(product)}
                        className={`p-2 rounded-full transition-all duration-200 ${
                          isInWishlist(product)
                            ? 'bg-pink-500 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-pink-50 hover:text-pink-500'
                        }`}
                      >
                        <svg className="w-4 h-4" fill={isInWishlist(product) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => onAddToCart(product)}
                        className="bg-blue-900 text-white py-2 px-6 rounded-lg hover:bg-blue-800 transition-colors font-medium"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryListPage;