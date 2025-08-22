import React from 'react';
import { Star, Heart, ShoppingCart, ArrowLeft, Minus, Plus } from 'lucide-react';

const ProductDetailsPage = ({ 
  product, 
  onBack, 
  onAddToCart, 
  onAddToWishlist, 
  favorites,
  cartItems 
}) => {
  const [quantity, setQuantity] = React.useState(1);
  const [selectedImage, setSelectedImage] = React.useState(0);
  const [selectedSize, setSelectedSize] = React.useState('');
  const [selectedColor, setSelectedColor] = React.useState('');

  const isInWishlist = favorites.some(fav => fav['product-title'] === product['product-title']);
  const cartItem = cartItems.find(item => item['product-title'] === product['product-title']);
  const cartQuantity = cartItem ? cartItem.quantity : 0;

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
  };

  const handleAddToWishlist = () => {
    onAddToWishlist(product);
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const raw = product.raw || {};
  const images = raw.characteristics?.images?.primary || product.characteristics?.images?.primary || [product['image-url']];
  const offersBanner = raw.characteristics?.images?.offers;
  const specsArray = raw.characteristics?.specifications || [];
  const description = raw.characteristics?.description || product.characteristics?.description || product['product-title'];
  const identifiers = raw.identifiers || {};
  const anchor = raw.anchor || {};
  const pricing = raw.pricing || {};
  const inventory = raw.inventory || {};
  const classification = raw.classification || {};
  const attributes = classification.attributes || {};
  const marketing = raw.marketing || {};
  const timestamps = raw.timestamps || {};

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <a
              href="#products"
              onClick={(e) => {
                e.preventDefault();
                onBack();
              }}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Products
            </a>
            <div className="flex items-center space-x-4">
              <a
                href="#wishlist"
                onClick={(e) => {
                  e.preventDefault();
                  handleAddToWishlist();
                }}
                className={`p-2 rounded-full transition-colors ${
                  isInWishlist 
                    ? 'text-red-500 bg-red-50' 
                    : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                }`}
              >
                <Heart className="w-6 h-6" fill={isInWishlist ? 'currentColor' : 'none'} />
              </a>
              <a
                href="#cart"
                onClick={(e) => {
                  e.preventDefault();
                  handleAddToCart();
                }}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart
                {cartQuantity > 0 && (
                  <span className="ml-2 bg-white text-blue-600 text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartQuantity}
                  </span>
                )}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Product Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-lg overflow-hidden shadow-lg">
              <img
                src={images[selectedImage]}
                alt={product['product-title']}
                className="w-full h-full object-cover"
              />
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square bg-white rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index ? 'border-blue-500' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product['product-title']} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product['product-title']}
              </h1>
              <div className="flex items-center mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < product.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-600">
                  {product.reviews} reviews
                </span>
              </div>
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-3xl font-bold text-blue-600">
                  ₹{product['new-price']}
                </span>
                {product['old-price'] !== product['new-price'] && (
                  <span className="text-xl text-gray-500 line-through">
                    ₹{product['old-price']}
                  </span>
                )}
                {product['old-price'] !== product['new-price'] && (
                  <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                    {Math.round(((parseFloat(product['old-price']) - parseFloat(product['new-price'])) / parseFloat(product['old-price'])) * 100)}% OFF
                  </span>
                )}
              </div>
            </div>

            {/* Category */}
            <div>
              <span className="text-sm text-gray-500">Category:</span>
              <span className="ml-2 text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                {product.category}
              </span>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">
                {description}
              </p>
            </div>

            {/* Identifiers */}
            {(identifiers.productId || identifiers.sku || identifiers.slug || identifiers.barcode) && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Identifiers</h3>
                <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  {identifiers.productId && <div><span className="text-gray-500">Product ID:</span> <span className="font-medium text-gray-900">{identifiers.productId}</span></div>}
                  {identifiers.sku && <div><span className="text-gray-500">SKU:</span> <span className="font-medium text-gray-900">{identifiers.sku}</span></div>}
                  {identifiers.slug && <div><span className="text-gray-500">Slug:</span> <span className="font-medium text-gray-900">{identifiers.slug}</span></div>}
                  {identifiers.barcode && <div><span className="text-gray-500">Barcode:</span> <span className="font-medium text-gray-900">{identifiers.barcode}</span></div>}
                </div>
              </div>
            )}

            {/* Anchor Info */}
            {(anchor.category || anchor.subcategory || anchor.subSubcategory || anchor.brand || anchor.manufacturer || anchor.productType) && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Product Info</h3>
                <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  {anchor.category && <div><span className="text-gray-500">Category:</span> <span className="font-medium text-gray-900">{anchor.category}</span></div>}
                  {anchor.subcategory && <div><span className="text-gray-500">Subcategory:</span> <span className="font-medium text-gray-900">{anchor.subcategory}</span></div>}
                  {anchor.subSubcategory && <div><span className="text-gray-500">Sub-Subcategory:</span> <span className="font-medium text-gray-900">{anchor.subSubcategory}</span></div>}
                  {anchor.brand && <div><span className="text-gray-500">Brand:</span> <span className="font-medium text-gray-900">{anchor.brand}</span></div>}
                  {anchor.manufacturer && <div><span className="text-gray-500">Manufacturer:</span> <span className="font-medium text-gray-900">{anchor.manufacturer}</span></div>}
                  {anchor.productType && <div><span className="text-gray-500">Product Type:</span> <span className="font-medium text-gray-900">{anchor.productType}</span></div>}
                </div>
              </div>
            )}

            {/* Pricing */}
            {(pricing.basePrice != null || pricing.comparePrice != null || pricing.currency || pricing.taxRate != null || (pricing.discounts && pricing.discounts.length)) && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Pricing</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {pricing.basePrice != null && <div><span className="text-gray-500">Base Price:</span> <span className="font-medium text-gray-900">₹{pricing.basePrice}</span></div>}
                    {pricing.comparePrice != null && <div><span className="text-gray-500">MRP:</span> <span className="font-medium text-gray-900">₹{pricing.comparePrice}</span></div>}
                    {pricing.currency && <div><span className="text-gray-500">Currency:</span> <span className="font-medium text-gray-900">{pricing.currency}</span></div>}
                    {pricing.taxRate != null && <div><span className="text-gray-500">Tax Rate:</span> <span className="font-medium text-gray-900">{pricing.taxRate}%</span></div>}
                  </div>
                  {Array.isArray(pricing.discounts) && pricing.discounts.length > 0 && (
                    <div>
                      <div className="text-gray-700 font-medium mb-1">Active Discounts</div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                          <thead>
                            <tr className="text-gray-500">
                              <th className="py-1 pr-3">Type</th>
                              <th className="py-1 pr-3">Value</th>
                              <th className="py-1 pr-3">Min Qty</th>
                              <th className="py-1 pr-3">Valid</th>
                              <th className="py-1 pr-3">Active</th>
                            </tr>
                          </thead>
                          <tbody>
                            {pricing.discounts.map((d, i) => (
                              <tr key={i} className="border-t">
                                <td className="py-1 pr-3 capitalize">{d.type}</td>
                                <td className="py-1 pr-3">{d.value}{d.type === 'percentage' ? '%' : ''}</td>
                                <td className="py-1 pr-3">{d.minQuantity ?? '-'}</td>
                                <td className="py-1 pr-3">{d.validFrom?.slice(0,10)} – {d.validTo?.slice(0,10)}</td>
                                <td className="py-1 pr-3">{d.isActive ? 'Yes' : 'No'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Inventory */}
            {(inventory.totalQuantity != null || inventory.availableQuantity != null || inventory.reservedQuantity != null || Array.isArray(inventory.bulkQuantityTiers)) && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Inventory</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {inventory.totalQuantity != null && <div><span className="text-gray-500">Total:</span> <span className="font-medium text-gray-900">{inventory.totalQuantity}</span></div>}
                    {inventory.availableQuantity != null && <div><span className="text-gray-500">Available:</span> <span className="font-medium text-gray-900">{inventory.availableQuantity}</span></div>}
                    {inventory.reservedQuantity != null && <div><span className="text-gray-500">Reserved:</span> <span className="font-medium text-gray-900">{inventory.reservedQuantity}</span></div>}
                    {inventory.lowStockThreshold != null && <div><span className="text-gray-500">Low Stock Thresh:</span> <span className="font-medium text-gray-900">{inventory.lowStockThreshold}</span></div>}
                  </div>
                  {Array.isArray(inventory.bulkQuantityTiers) && inventory.bulkQuantityTiers.length > 0 && (
                    <div>
                      <div className="text-gray-700 font-medium mb-1">Bulk Quantity Tiers</div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                          <thead>
                            <tr className="text-gray-500">
                              <th className="py-1 pr-3">Min</th>
                              <th className="py-1 pr-3">Max</th>
                              <th className="py-1 pr-3">Discount %</th>
                            </tr>
                          </thead>
                          <tbody>
                            {inventory.bulkQuantityTiers.map((t, i) => (
                              <tr key={i} className="border-t">
                                <td className="py-1 pr-3">{t.minQuantity}</td>
                                <td className="py-1 pr-3">{t.maxQuantity}</td>
                                <td className="py-1 pr-3">{t.discountPercentage}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Variants */}
            {Array.isArray(classification.variants) && classification.variants.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Variants</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  {classification.variants.map((v, i) => (
                    <div key={i} className="border rounded-lg p-3 text-sm">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs capitalize">{v.type}</span>
                        <span className="font-medium text-gray-900">{v.name}</span>
                        {v.sku && <span className="text-gray-500">SKU: {v.sku}</span>}
                        {v.price != null && <span className="text-gray-900">₹{v.price}</span>}
                        {v.inventory != null && <span className="text-gray-600">In stock: {v.inventory}</span>}
                      </div>
                      {Array.isArray(v.images) && v.images.length > 0 && (
                        <div className="flex gap-2 overflow-x-auto">
                          {v.images.map((img, j) => (
                            <img key={j} src={img} alt={`${v.name}-${j}`} className="w-16 h-16 object-cover rounded" />
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Attributes */}
            {Object.keys(attributes).length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Attributes</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                  {attributes.material && <div><span className="text-gray-500">Material:</span> <span className="font-medium text-gray-900">{attributes.material}</span></div>}
                  {Array.isArray(attributes.certification) && attributes.certification.length > 0 && (
                    <div><span className="text-gray-500">Certifications:</span> <span className="font-medium text-gray-900">{attributes.certification.join(', ')}</span></div>
                  )}
                  {attributes.warrantyPeriod && <div><span className="text-gray-500">Warranty:</span> <span className="font-medium text-gray-900">{attributes.warrantyPeriod}</span></div>}
                  {attributes.countryOfOrigin && <div><span className="text-gray-500">Made In:</span> <span className="font-medium text-gray-900">{attributes.countryOfOrigin}</span></div>}
                </div>
              </div>
            )}

            {/* Specifications (grouped array) */}
            {Array.isArray(specsArray) && specsArray.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Specifications</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                  {specsArray.map((s, i) => (
                    <div key={`${s.group}-${s.name}-${i}`} className="flex justify-between">
                      <span className="text-gray-600">{s.group} — {s.name}</span>
                      <span className="font-medium text-gray-900">{s.value}{s.unit ? ` ${s.unit}` : ''}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Physical */}
            {(raw.characteristics?.weight || raw.characteristics?.dimensions) && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Physical</h3>
                <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  {raw.characteristics?.weight && (
                    <div><span className="text-gray-500">Weight:</span> <span className="font-medium text-gray-900">{raw.characteristics.weight.value} {raw.characteristics.weight.unit}</span></div>
                  )}
                  {raw.characteristics?.dimensions && (
                    <div><span className="text-gray-500">Dimensions:</span> <span className="font-medium text-gray-900">{raw.characteristics.dimensions.length} × {raw.characteristics.dimensions.width} × {raw.characteristics.dimensions.height} {raw.characteristics.dimensions.unit}</span></div>
                  )}
                </div>
              </div>
            )}

            {/* Marketing */}
            {(Array.isArray(marketing.tags) || Array.isArray(marketing.keywords) || marketing.promotionText || marketing.isFeatured || marketing.isBestseller) && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Marketing</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3 text-sm">
                  {marketing.promotionText && <div className="px-3 py-2 bg-yellow-100 text-yellow-900 rounded">{marketing.promotionText}</div>}
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(marketing.tags) && marketing.tags.map((t, i) => (
                      <span key={i} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">{t}</span>
                    ))}
                    {Array.isArray(marketing.keywords) && marketing.keywords.map((k, i) => (
                      <span key={i} className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">{k}</span>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {marketing.isFeatured != null && <div><span className="text-gray-500">Featured:</span> <span className="font-medium text-gray-900">{marketing.isFeatured ? 'Yes' : 'No'}</span></div>}
                    {marketing.isBestseller != null && <div><span className="text-gray-500">Bestseller:</span> <span className="font-medium text-gray-900">{marketing.isBestseller ? 'Yes' : 'No'}</span></div>}
                  </div>
                </div>
              </div>
            )}

            {/* Timestamps */}
            {(timestamps.createdAt || timestamps.updatedAt || timestamps.publishedAt) && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Timestamps</h3>
                <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                  {timestamps.createdAt && <div><span className="text-gray-500">Created:</span> <span className="font-medium text-gray-900">{new Date(timestamps.createdAt).toLocaleString()}</span></div>}
                  {timestamps.updatedAt && <div><span className="text-gray-500">Updated:</span> <span className="font-medium text-gray-900">{new Date(timestamps.updatedAt).toLocaleString()}</span></div>}
                  {timestamps.publishedAt && <div><span className="text-gray-500">Published:</span> <span className="font-medium text-gray-900">{new Date(timestamps.publishedAt).toLocaleString()}</span></div>}
                </div>
              </div>
            )}

            {/* Offers Banner */}
            {offersBanner && (
              <div>
                <img src={offersBanner} alt="Offer" className="w-full rounded-lg" />
              </div>
            )}

            {/* Quantity Selector */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Quantity</h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    className="p-2 hover:bg-gray-100 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-2 text-lg font-medium">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    className="p-2 hover:bg-gray-100 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-sm text-gray-500">
                  {quantity} × ₹{product['new-price']} = ₹{(quantity * parseFloat(product['new-price'])).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4 pt-6">
              <a
                href="#cart"
                onClick={(e) => {
                  e.preventDefault();
                  handleAddToCart();
                }}
                className="flex-1 flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart
              </a>
              <a
                href="#wishlist"
                onClick={(e) => {
                  e.preventDefault();
                  handleAddToWishlist();
                }}
                className={`flex items-center justify-center px-6 py-3 rounded-lg border-2 transition-colors font-medium ${
                  isInWishlist
                    ? 'border-red-500 text-red-500 bg-red-50'
                    : 'border-gray-300 text-gray-700 hover:border-red-500 hover:text-red-500'
                }`}
              >
                <Heart className="w-5 h-5 mr-2" fill={isInWishlist ? 'currentColor' : 'none'} />
                {isInWishlist ? 'In Wishlist' : 'Add to Wishlist'}
              </a>
            </div>

            {/* Additional Info */}
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-blue-900">Free Shipping</h4>
                  <p className="text-sm text-blue-700">Free delivery on orders above ₹500</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
