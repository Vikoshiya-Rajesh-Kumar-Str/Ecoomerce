import React from 'react';
import { Heart, Star, ShoppingCart } from 'lucide-react';

const ProductCard = ({ product, onAddToCart, onAddToWishlist, isFavorite = false, onOpenDetails }) => {
  const oldPrice = parseFloat(product['old-price']);
  const newPrice = parseFloat(product['new-price']);
  const discount = Math.round(((oldPrice - newPrice) / oldPrice) * 100);

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden group">
      {/* Image Container */}
      <div className="relative overflow-hidden">
        <img
          src={product['image-url']}
          alt={product['product-title']}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            const target = e.target;
            target.src = 'https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=400';
          }}
        />
        {discount > 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
            -{discount}%
          </div>
        )}
        <a
          href="#favorites"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onAddToWishlist?.(product);
          }}
          className={`absolute top-2 right-2 p-2 rounded-full shadow-md transition-all duration-300 ${
            isFavorite 
              ? 'bg-red-500 text-white opacity-100' 
              : 'bg-white text-gray-600 opacity-0 group-hover:opacity-100 hover:bg-gray-50'
          }`}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
        </a>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 text-sm">
          {product['product-title']}
        </h3>
        
        {product.category && (
          <p className="text-xs text-gray-500 mb-2">{product.category}</p>
        )}

        {/* Rating */}
        <div className="flex items-center mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${
                  i < (product.rating || 4) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500 ml-1">
            ({product.reviews || Math.floor(Math.random() * 100) + 10})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-blue-900">
              ₹{newPrice.toLocaleString()}
            </span>
            {oldPrice > newPrice && (
              <span className="text-sm text-gray-500 line-through">
                ₹{oldPrice.toLocaleString()}
              </span>
            )}
          </div>
        </div>

        {/* Add to Cart Button */}
        <a
          href="#cart"
          onClick={(e) => { 
            e.preventDefault();
            e.stopPropagation(); 
            onOpenDetails?.(product); 
          }}
          className="w-full bg-blue-900 text-white py-2 px-4 rounded-lg hover:bg-blue-800 transition-colors duration-200 flex items-center justify-center space-x-2 font-medium inline-block"
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Add to Cart</span>
        </a>
      </div>
    </div>
  );
};

export default ProductCard;
