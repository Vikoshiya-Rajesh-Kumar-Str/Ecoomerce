import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Zap, Shield, Truck, Award, X, Star, ShoppingCart, Heart } from 'lucide-react';

const Home = ({ products = [], onAddToCart, onAddToWishlist, onCategorySelect, favorites = [] }) => {
  // Hero component state
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Categories component state
  const scrollContainer = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  
  // Product modal state
  const [selectedProduct, setSelectedProduct] = useState(null);

  const defaultCategories = [
    {
      id: 'switches',
      name: 'Switches & Sockets',
      image: 'https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=300',
      productCount: 0
    },
    {
      id: 'lighting',
      name: 'LED Lighting',
      image: 'https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg?auto=compress&cs=tinysrgb&w=300',
      productCount: 0
    },
    {
      id: 'wiring',
      name: 'Wires & Cables',
      image: 'https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=300',
      productCount: 0
    },
    {
      id: 'protection',
      name: 'Circuit Protection',
      image: 'https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=300',
      productCount: 0
    },
    {
      id: 'home',
      name: 'Home Automation',
      image: 'https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg?auto=compress&cs=tinysrgb&w=300',
      productCount: 0
    },
    {
      id: 'industrial',
      name: 'Industrial Equipment',
      image: 'https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=300',
      productCount: 0
    }
  ];

  const slides = [
    {
      id: 1,
      title: "Premium LED Lighting Solutions",
      subtitle: "Illuminate your space with energy-efficient LED lights",
      description: "Discover our range of smart LED bulbs, strip lights, and fixtures. Save up to 80% on electricity bills with our premium lighting collection.",
      image: "https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg?auto=compress&cs=tinysrgb&w=1920",
      cta1: "Shop LED Lights",
      cta2: "View Collection",
      accent: "from-blue-600 to-purple-600"
    },
    {
      id: 2,
      title: "Smart Switches & Controls",
      subtitle: "Modern electrical switches for smart homes",
      description: "Upgrade to smart switches with WiFi control, dimming features, and energy monitoring. Compatible with Alexa and Google Home.",
      image: "https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=1920",
      cta1: "Shop Switches",
      cta2: "Smart Home Kit",
      accent: "from-green-600 to-teal-600"
    },
    {
      id: 3,
      title: "Industrial Grade Wiring",
      subtitle: "Professional electrical cables & wires",
      description: "Heavy-duty electrical wires and cables for residential and commercial projects. ISI certified with lifetime warranty.",
      image: "https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=1920",
      cta1: "Shop Cables",
      cta2: "Bulk Orders",
      accent: "from-orange-600 to-red-600"
    },
    {
      id: 4,
      title: "Complete Electrical Solutions",
      subtitle: "Everything you need for electrical projects",
      description: "From panels and MCBs to sockets and plugs. Get professional-grade electrical components with expert support and fast delivery.",
      image: "https://images.pexels.com/photos/8293711/pexels-photo-8293711.jpeg?auto=compress&cs=tinysrgb&w=1920",
      cta1: "View All Products",
      cta2: "Get Quote",
      accent: "from-indigo-600 to-blue-600"
    }
  ];

  // Hero Auto slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 8000); // 8 seconds

    return () => clearInterval(interval);
  }, [slides.length]);

  // Categories scroll functionality
  const checkScrollButtons = () => {
    if (scrollContainer.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainer.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    checkScrollButtons();
    const container = scrollContainer.current;
    if (container) {
      container.addEventListener('scroll', checkScrollButtons);
      return () => container.removeEventListener('scroll', checkScrollButtons);
    }
  }, [defaultCategories]);

  // Hero navigation functions
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Categories scroll functions
  const scrollLeft = () => {
    if (scrollContainer.current) {
      scrollContainer.current.scrollBy({
        left: -280, // Width of one card
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainer.current) {
      scrollContainer.current.scrollBy({
        left: 280, // Width of one card
        behavior: 'smooth'
      });
    }
  };

  // Handle category selection - use the prop if available, otherwise log
  const handleCategorySelect = (categoryName) => {
    if (onCategorySelect) {
      onCategorySelect(categoryName);
    } else {
  
    }
  };

  // ProductCard component
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
          <button
            onClick={() => onAddToWishlist?.(product)}
            className={`absolute top-2 right-2 p-2 rounded-full shadow-md transition-all duration-300 ${
              isFavorite 
                ? 'bg-red-500 text-white opacity-100' 
                : 'bg-white text-gray-600 opacity-0 group-hover:opacity-100 hover:bg-gray-50'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
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
          <button
            onClick={(e) => { e.stopPropagation(); onOpenDetails?.(product); }}
            className="w-full bg-blue-900 text-white py-2 px-4 rounded-lg hover:bg-blue-800 transition-colors duration-200 flex items-center justify-center space-x-2 font-medium"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    );
  };

  // ProductDetailsModal component
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
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
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
              <button
                onClick={() => {
                  onAddToCart(product);
                  onClose();
                }}
                className="bg-blue-900 text-white px-6 py-3 rounded-lg flex items-center space-x-2 hover:bg-blue-800"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Add to Cart</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden">
        {/* Slides */}
        <div className="relative w-full h-full">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                index === currentSlide ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
              }`}
              style={{
                backgroundImage: `url('${slide.image}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            >
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/50"></div>
              
              {/* Gradient Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-r ${slide.accent} opacity-20`}></div>
              
              {/* Content */}
              <div className="relative h-full flex items-start pt-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                  <div className="max-w-3xl">
                    
                    <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold leading-tight text-white mb-6 animate-fade-in">
                      {slide.title}
                    </h1>
                    
                    <p className="text-xl sm:text-2xl text-blue-100 mb-4 font-medium">
                      {slide.subtitle}
                    </p>
                    
                    <p className="text-lg text-gray-200 mb-8 max-w-2xl leading-relaxed">
                      {slide.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-4 mb-8">
                      <button className={`px-8 py-4 bg-gradient-to-r ${slide.accent} text-white rounded-full font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300`}>
                        {slide.cta1}
                      </button>
                      <button className="px-8 py-4 bg-white/20 backdrop-blur-sm text-white rounded-full font-semibold text-lg hover:bg-white/30 transition-all duration-300 border border-white/30">
                        {slide.cta2}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-2 rounded-r-full transition-all duration-300 hover:scale-110 z-10"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        
        <button
          onClick={nextSlide}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-2 rounded-l-full transition-all duration-300 hover:scale-110 z-10"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-10">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-white scale-125' 
                  : 'bg-white/50 hover:bg-white/70'
              }`}
            />
          ))}
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20 z-10">
          <div 
            className="h-full bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-4000 ease-linear"
            style={{
              width: `${((currentSlide + 1) / slides.length) * 100}%`
            }}
          />
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 right-20 animate-bounce opacity-20">
          <Zap className="w-16 h-16 text-yellow-300" />
        </div>
        <div className="absolute bottom-32 left-20 animate-pulse opacity-10">
          <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" />
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Shop by Category</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our comprehensive range of electrical products organized by category
            </p>
          </div>

          <div className="relative">
            {/* Left Arrow */}
            {canScrollLeft && (
              <button
                onClick={scrollLeft}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white shadow-xl rounded-full p-3 hover:bg-gray-50 transition-all duration-200 border border-gray-200 hover:scale-110"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-6 h-6 text-gray-700" />
              </button>
            )}

            {/* Right Arrow */}
            {canScrollRight && (
              <button
                onClick={scrollRight}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white shadow-xl rounded-full p-3 hover:bg-gray-50 transition-all duration-200 border border-gray-200 hover:scale-110"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-6 h-6 text-gray-700" />
              </button>
            )}

            {/* Desktop: Horizontal Scrollable Container */}
            <div className="hidden md:block">
              <div
                ref={scrollContainer}
                className="flex overflow-x-auto scrollbar-hide gap-6 px-12 py-4"
                style={{
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                }}
              >
                {defaultCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategorySelect(category.name)}
                    className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3 border border-gray-100 flex-shrink-0 overflow-hidden"
                    style={{ width: '280px', height: '220px' }}
                  >
                    <div className="relative h-32 overflow-hidden">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-blue-900/40 to-transparent"></div>
                    </div>
                    <div className="p-6 text-center">
                      <h3 className="font-bold text-gray-900 mb-2 text-lg leading-tight group-hover:text-blue-900 transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-sm text-gray-500 font-medium">
                        {category.productCount} products
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile: 4 Grid Layout */}
            <div className="md:hidden grid grid-cols-2 gap-4">
              {defaultCategories.slice(0, 4).map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategorySelect(category.name)}
                  className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 overflow-hidden"
                >
                  <div className="relative h-24 overflow-hidden">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-blue-900/40 to-transparent"></div>
                  </div>
                  <div className="p-4 text-center">
                    <h3 className="font-semibold text-gray-900 mb-1 text-sm leading-tight group-hover:text-blue-900 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-xs text-gray-500 font-medium">
                      {category.productCount} products
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Product Grid Section */}
      {products && products.length > 0 && (
        <section id="products" className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Products</h2>
              <div className="w-24 h-1 bg-yellow-400 mx-auto"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product, index) => (
                <div
                  key={`${product['product-title']}-${index}`}
                  onClick={() => setSelectedProduct(product)}
                  className="cursor-pointer"
                >
                  <ProductCard
                    product={product}
                    onAddToCart={onAddToCart}
                    onAddToWishlist={onAddToWishlist}
                    isFavorite={favorites.some((fav) => fav['product-title'] === product['product-title'])}
                    onOpenDetails={(p) => setSelectedProduct(p)}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Product Details Modal */}
      <ProductDetailsModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={onAddToCart}
      />
    </div>
  );
};

export default Home;