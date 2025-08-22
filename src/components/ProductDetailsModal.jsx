import React from 'react';
import { X, Star, ShoppingCart } from 'lucide-react';

const ProductDetailsModal = ({ product, onClose, onAddToCart }) => {
  if (!product) return null;

  const oldPrice = parseFloat(product['old-price']);
  const newPrice = parseFloat(product['new-price']);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-xl max-w-3xl w-full shadow-lg overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">{product['product-title']}</h2>
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              onClose();
            }}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </a>
        </div>

        {/* Body */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          <img
            src={product['image-url']}
            alt={product['product-title']}
            className="w-full h-64 object-cover rounded-lg shadow"
            onError={(e) => {
              e.target.src = 'https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=400';
            }}
          />

          <div>
            {product.category && (
              <p className="text-sm text-gray-500 mb-2">{product.category}</p>
            )}

            {/* Rating */}
            <div className="flex items-center mb-4">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < (product.rating || 4) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                />
              ))}
              <span className="ml-2 text-sm text-gray-500">
                ({product.reviews || Math.floor(Math.random() * 100) + 10} reviews)
              </span>
            </div>

            {/* Prices */}
            <div className="flex items-center space-x-3 mb-4">
              <span className="text-2xl font-bold text-blue-900">₹{newPrice.toLocaleString()}</span>
              {oldPrice > newPrice && (
                <span className="text-gray-500 line-through">₹{oldPrice.toLocaleString()}</span>
              )}
            </div>

            {/* Description placeholder */}
            <p className="text-gray-700 mb-6">
              This is a detailed description of the product. You can replace this text with actual product
              specifications, materials, warranty information, and other important details that help customers make informed decisions.
            </p>

            {/* Add to cart */}
            <a
              href="#cart"
              onClick={(e) => {
                e.preventDefault();
                onAddToCart(product);
                onClose();
              }}
              className="bg-blue-900 text-white px-6 py-3 rounded-lg flex items-center space-x-2 hover:bg-blue-800 inline-flex"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Add to Cart</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsModal;