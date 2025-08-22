import { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Footer from './components/Footer';
import LoginPage from './pages/LoginPage';
import CategoryListPage from './pages/CategoryListPage';
import productsData from './data/product.json';

function App() {
  const [products, setProducts] = useState([]);
const [filteredProducts, setFilteredProducts] = useState([]);
const [cartItems, setCartItems] = useState([]);
const [isCartOpen, setIsCartOpen] = useState(false);
const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
const [searchQuery, setSearchQuery] = useState('');
const [selectedCategory, setSelectedCategory] = useState('');
const [isLoginOpen, setIsLoginOpen] = useState(false);
const [currentUser, setCurrentUser] = useState(null);
const [favorites, setFavorites] = useState([]);
const [showFavorites, setShowFavorites] = useState(false);
const [showCategoryList, setShowCategoryList] = useState(false);
const [selectedCategoryForList, setSelectedCategoryForList] = useState('');


  // Load products on component mount
  useEffect(() => {
    try {
      const source = Array.isArray(productsData)
        ? productsData
        : (productsData && Array.isArray(productsData.products) ? productsData.products : []);

      const loadedProducts = source.map((p) => {
        const title = p?.characteristics?.title || 'Untitled Product';
        const imageUrl = p?.characteristics?.images?.primary?.[0] ||
          'https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=400';
        const basePrice = p?.pricing?.basePrice ?? 0;
        const comparePrice = p?.pricing?.comparePrice ?? basePrice;

        return {
          'product-title': title,
          'image-url': imageUrl,
          'old-price': String(comparePrice),
          'new-price': String(basePrice),
          category: getProductCategory(title),
          rating: Math.floor(Math.random() * 2) + 4,
          reviews: Math.floor(Math.random() * 100) + 10
        };
      });

      setProducts(loadedProducts);
      setFilteredProducts(loadedProducts);
    } catch (error) {
      console.error('Failed to load products:', error);
      setProducts([]);
      setFilteredProducts([]);
    }
  }, []);

  // Load persisted cart from localStorage
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

  // Persist cart to localStorage when it changes
  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [cartItems]);

  // Check if user is already logged in
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

  // Load favorites from localStorage
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

  // Filter products based on search and category
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

  // Compute categories from loaded products for "Shop by Category"
  const categories = useMemo(() => {
    // We will present canonical category names used in the app
    const canonicalCategories = [
      'Switches & Sockets',
      'LED Lighting',
      'Wires & Cables',
      'Circuit Protection',
      'Home Appliances',
      'General'
    ];

    // Prepare summaries with defaults
    const summaries = new Map(
      canonicalCategories.map((name) => [
        name,
        {
          id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
          name,
          image:
            'https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=300',
          productCount: 0
        }
      ])
    );

    // Fill in counts and use the first product image seen for that category
    for (const product of products) {
      const categoryName = product.category || 'General';
      if (!summaries.has(categoryName)) {
        summaries.set(categoryName, {
          id: categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
          name: categoryName,
          image: product['image-url'],
          productCount: 0
        });
      }
      const s = summaries.get(categoryName);
      if (s.productCount === 0 && product['image-url']) {
        s.image = product['image-url'];
      }
      s.productCount += 1;
    }

    // Return only categories that have at least 1 product, preserving canonical order
    return canonicalCategories
      .map((name) => summaries.get(name))
      .filter((s) => s && s.productCount > 0);
  }, [products]);

  // Helper function to categorize products
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
    setIsCartOpen(true);
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
        // Remove from favorites
        const newFavorites = prevFavorites.filter(fav => fav['product-title'] !== product['product-title']);
        localStorage.setItem('favorites', JSON.stringify(newFavorites));
        return newFavorites;
      } else {
        // Add to favorites
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
    setShowFavorites(!showFavorites);
    // Scroll to top when opening favorites
    if (!showFavorites) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
    setSelectedCategory(''); // Clear category filter when searching
  };

  const handleCategorySelect = (category) => {
    setSelectedCategoryForList(category);
    setShowCategoryList(true);
    setSearchQuery('');
    setSelectedCategory('');
    setShowFavorites(false);
    // Scroll to top when opening category list
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // New function to handle returning to home page
  const handleReturnToHome = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setShowFavorites(false);
    setShowCategoryList(false);
    setSelectedCategoryForList('');
    // Scroll to top when returning to home
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackFromCategoryList = () => {
    setShowCategoryList(false);
    setSelectedCategoryForList('');
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
        onCartClick={() => setIsCartOpen(true)}
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
        {/* Navigation Anchors */}
        <div id="home" className="sr-only">Home</div>
        <div id="favorites" className="sr-only">Favorites</div>
        <div id="cart" className="sr-only">Cart</div>
        <div id="checkout" className="sr-only">Checkout</div>
        <div id="login" className="sr-only">Login</div>
        <div id="products" className="sr-only">Products</div>
        <div id="categories" className="sr-only">Categories</div>
        <div id="about" className="sr-only">About</div>
        <div id="contact" className="sr-only">Contact</div>
        
        {showCategoryList ? (
          <CategoryListPage
            category={selectedCategoryForList}
            products={products.filter(product => 
              product.category && product.category.toLowerCase().includes(selectedCategoryForList.toLowerCase())
            )}
            onBack={handleBackFromCategoryList}
            onAddToCart={handleAddToCart}
            onAddToWishlist={handleAddToWishlist}
            favorites={favorites}
          />
        ) : showFavorites ? (
          <div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
              <a
                href="#home"
                onClick={(e) => {
                  e.preventDefault();
                  setShowFavorites(false);
                }}
                className="mb-6 px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors flex items-center space-x-2 inline-flex"
              >
                <span>←</span>
                <span>Back to Products</span>
              </a>
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
                products={filteredProducts.slice(0, 8)} // Show first 8 products in featured section
                onAddToCart={handleAddToCart}
                onAddToWishlist={handleAddToWishlist}
                onCategorySelect={handleCategorySelect}
                favorites={favorites}
              />
            )}
            
            {(searchQuery || selectedCategory) && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
                <a
                  href="#home"
                  onClick={(e) => {
                    e.preventDefault();
                    handleReturnToHome();
                  }}
                  className="mb-6 px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors flex items-center space-x-2 inline-flex"
                >
                  <span>←</span>
                  <span>Back to Home</span>
                </a>
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

      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
      />

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

export default App;