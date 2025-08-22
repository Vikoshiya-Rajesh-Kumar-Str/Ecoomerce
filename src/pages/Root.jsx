import { useState, useEffect, useMemo } from 'react';
import Header from '../components/Header';
import Home from './Home';
import CartPage from './CartPage';
import Checkout from './Checkout';
import Footer from '../components/Footer';
import LoginPage from './LoginPage';
import CategoryListPage from './CategoryListPage';
import ProductCard from '../components/ProductCard';
import ProductDetailsPage from './ProductDetailsPage';
import FavoritesPage from './FavoritesPage';
import productsData from '../data/product.json';

function Root() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [showCartPage, setShowCartPage] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showCategoryList, setShowCategoryList] = useState(false);
  const [selectedCategoryForList, setSelectedCategoryForList] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductDetailsPage, setShowProductDetailsPage] = useState(false);
  const [showFavoritesPage, setShowFavoritesPage] = useState(false);

  const rawSource = useMemo(() => {
    return Array.isArray(productsData)
      ? productsData
      : (productsData && Array.isArray(productsData.products) ? productsData.products : []);
  }, []);

  const getProductCategory = (title) => {
    const titleLower = title.toLowerCase();
    if (titleLower.includes('led') || titleLower.includes('bulb') || titleLower.includes('light')) {
      return 'LED Lighting';
    }
    if (titleLower.includes('wire') || titleLower.includes('cable')) {
      return 'Wires & Cables';
    }
    if (titleLower.includes('switch') || titleLower.includes('regulator')) {
      return 'Switches & Sockets';
    }
    if (titleLower.includes('drill') || titleLower.includes('kettle') || titleLower.includes('heater')) {
      return 'Home Appliances';
    }
    if (titleLower.includes('extension') || titleLower.includes('board')) {
      return 'Circuit Protection';
    }
    return 'General';
  };

  const mapRawToDisplayProduct = (p) => {
    const title = p?.characteristics?.title || 'Untitled Product';
    const imageUrl = p?.characteristics?.images?.primary?.[0]
      || 'https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=400';
    const basePrice = p?.pricing?.basePrice ?? 0;
    const comparePrice = p?.pricing?.comparePrice ?? basePrice;
    const categoryFromData = p?.anchor?.subcategory || p?.anchor?.category || getProductCategory(title);
    return {
      'product-title': title,
      'image-url': imageUrl,
      'old-price': String(comparePrice),
      'new-price': String(basePrice),
      category: categoryFromData,
      rating: Math.floor(Math.random() * 2) + 4,
      reviews: Math.floor(Math.random() * 100) + 10,
      raw: p
    };
  };

  useEffect(() => {
    try {
      const loadedProducts = rawSource.map(mapRawToDisplayProduct);
      setProducts(loadedProducts);
      setFilteredProducts(loadedProducts);
    } catch (error) {
      console.error('Failed to load products:', error);
      setProducts([]);
      setFilteredProducts([]);
    }
  }, []);

  useEffect(() => {
    try {
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        const parsed = JSON.parse(storedCart);
        if (Array.isArray(parsed)) {
          setCartItems(parsed);
        }
      }
    } catch (error) {
      console.error('Error parsing stored cart:', error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [cartItems]);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
      }
    }
  }, []);

  useEffect(() => {
    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) {
      try {
        setFavorites(JSON.parse(storedFavorites));
      } catch (error) {
        console.error('Error parsing stored favorites:', error);
      }
    }
  }, []);

  useEffect(() => {
    let filtered = products;

    if (searchQuery) {
      filtered = filtered.filter(product =>
        product['product-title'].toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.category && product.category.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(product =>
        product.category && product.category.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  }, [products, searchQuery, selectedCategory]);

  const subcategories = useMemo(() => {
    const summaries = new Map();
    for (const p of rawSource) {
      const sub = p?.anchor?.subcategory || 'Other';
      const firstImage = p?.characteristics?.images?.primary?.[0]
        || 'https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=300';
      if (!summaries.has(sub)) {
        summaries.set(sub, {
          id: sub.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
          name: sub,
          image: firstImage,
          productCount: 0
        });
      }
      const s = summaries.get(sub);
      s.productCount += 1;
    }
    return Array.from(summaries.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [rawSource]);

  const handleAddToCart = (product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item['product-title'] === product['product-title']);
      if (existingItem) {
        return prevItems.map(item =>
          item['product-title'] === product['product-title']
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
    // Optionally open cart page after adding
    // setShowCartPage(true);
  };

  const handleUpdateQuantity = (index, quantity) => {
    setCartItems(prevItems =>
      prevItems.map((item, i) =>
        i === index ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    );
  };

  const handleRemoveItem = (index) => {
    setCartItems(prevItems => prevItems.filter((_, i) => i !== index));
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderComplete = () => {
    setCartItems([]);
    setIsCheckoutOpen(false);
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setIsLoginOpen(false);
  };

  const handleLoginClose = () => {
    setIsLoginOpen(false);
  };

  const handleLoginClick = () => {
    setIsLoginOpen(true);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const handleAddToWishlist = (product) => {
    if (!currentUser) {
      setIsLoginOpen(true);
      return;
    }
    setFavorites(prevFavorites => {
      const isAlreadyFavorite = prevFavorites.find(fav => fav['product-title'] === product['product-title']);
      if (isAlreadyFavorite) {
        const newFavorites = prevFavorites.filter(fav => fav['product-title'] !== product['product-title']);
        localStorage.setItem('favorites', JSON.stringify(newFavorites));
        return newFavorites;
      } else {
        const newFavorites = [...prevFavorites, product];
        localStorage.setItem('favorites', JSON.stringify(newFavorites));
        return newFavorites;
      }
    });
  };

  const handleFavoritesClick = () => {
    if (!currentUser) {
      setIsLoginOpen(true);
      return;
    }
    setShowFavoritesPage(true);
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
    setSelectedCategory('');
  };

  const handleCategorySelect = (category) => {
    setSelectedCategoryForList(category);
    setShowCategoryList(true);
    setSearchQuery('');
    setSelectedCategory('');
    setShowFavorites(false);
  };

  const handleReturnToHome = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setShowFavorites(false);
    setShowCategoryList(false);
    setSelectedCategoryForList('');
  };

  const handleBackFromCategoryList = () => {
    setShowCategoryList(false);
    setSelectedCategoryForList('');
  };

  const handleOpenProductDetailsPage = (product) => {
    setSelectedProduct(product);
    setShowProductDetailsPage(true);
  };

  const handleBackFromProductDetails = () => {
    setShowProductDetailsPage(false);
    setSelectedProduct(null);
  };

  const getTotalCartItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getGridTitle = () => {
    if (searchQuery) {
      return `Search Results for "${searchQuery}"`;
    }
    if (selectedCategory) {
      return selectedCategory;
    }
    return 'Featured Products';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        cartItemCount={getTotalCartItems()}
        favoritesCount={favorites.length}
        onCartClick={() => setShowCartPage(true)}
        onSearchChange={handleSearchChange}
        onLoginClick={handleLoginClick}
        onLogout={handleLogout}
        onFavoritesClick={handleFavoritesClick}
        onLogoClick={handleReturnToHome}
        onHomeClick={handleReturnToHome}
        isLoggedIn={!!currentUser}
        currentUser={currentUser || undefined}
      />
      <main className="pt-20">
        {showCartPage ? (
          <CartPage
            items={cartItems}
            onBack={() => setShowCartPage(false)}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onCheckout={() => { setShowCartPage(false); setIsCheckoutOpen(true); }}
          />
        ) : showFavoritesPage ? (
          <FavoritesPage
            favorites={favorites}
            onBack={() => setShowFavoritesPage(false)}
            onAddToCart={handleAddToCart}
            onAddToWishlist={handleAddToWishlist}
            onOpenDetails={handleOpenProductDetailsPage}
          />
        ) : showProductDetailsPage && selectedProduct ? (
          <ProductDetailsPage
            product={selectedProduct}
            onBack={handleBackFromProductDetails}
            onAddToCart={handleAddToCart}
            onAddToWishlist={handleAddToWishlist}
            favorites={favorites}
            cartItems={cartItems}
          />
        ) : showCategoryList ? (
          <CategoryListPage
            category={selectedCategoryForList}
            products={products.filter(product =>
              product.category && (
                product.category.toLowerCase() === selectedCategoryForList.toLowerCase()
              )
            )}
            onBack={handleBackFromCategoryList}
            onAddToCart={handleAddToCart}
            onAddToWishlist={handleAddToWishlist}
            onOpenDetails={handleOpenProductDetailsPage}
            favorites={favorites}
          />
        ) : showFavorites ? (
          <div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
              <button
                onClick={() => setShowFavorites(false)}
                className="mb-6 px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors flex items-center space-x-2"
              >
                <span>←</span>
                <span>Back to Products</span>
              </button>
            </div>
            <section className="py-16 bg-gray-50">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">My Favorites</h2>
                  <div className="w-24 h-1 bg-yellow-400 mx-auto"></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {favorites.map((product, index) => (
                    <div key={`${product['product-title']}-${index}`} className="cursor-pointer">
                      <ProductCard
                        product={product}
                        onAddToCart={handleAddToCart}
                        onAddToWishlist={handleAddToWishlist}
                        isFavorite={favorites.some((fav) => fav['product-title'] === product['product-title'])}
                        onOpenDetails={handleOpenProductDetailsPage}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        ) : (
          <>
            {!searchQuery && !selectedCategory && (
              <Home 
                products={filteredProducts.slice(0, 8)}
                onAddToCart={handleAddToCart}
                onAddToWishlist={handleAddToWishlist}
                onCategorySelect={handleCategorySelect}
                onOpenDetails={handleOpenProductDetailsPage}
                favorites={favorites}
                categories={subcategories}
              />
            )}
            {(searchQuery || selectedCategory) && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
                <button
                  onClick={handleReturnToHome}
                  className="mb-6 px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors flex items-center space-x-2"
                >
                  <span>←</span>
                  <span>Back to Home</span>
                </button>
              </div>
            )}
            {(searchQuery || selectedCategory) && (
              <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">{getGridTitle()}</h2>
                    <div className="w-24 h-1 bg-yellow-400 mx-auto"></div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProducts.map((product, index) => (
                      <div key={`${product['product-title']}-${index}`} className="cursor-pointer">
                        <ProductCard
                          product={product}
                          onAddToCart={handleAddToCart}
                          onAddToWishlist={handleAddToWishlist}
                          isFavorite={favorites.some((fav) => fav['product-title'] === product['product-title'])}
                          onOpenDetails={handleOpenProductDetailsPage}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}
          </>
        )}
      </main>
      <Footer />
      {/* Sidebar cart removed in favor of full page CartPage */}
      <Checkout
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        onOrderComplete={handleOrderComplete}
      />
      {isLoginOpen && (
        <LoginPage
          onLoginSuccess={handleLoginSuccess}
          onClose={handleLoginClose}
        />
      )}
    </div>
  );
}

export default Root;