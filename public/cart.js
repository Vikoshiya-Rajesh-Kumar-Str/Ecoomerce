
class ShoppingCart {
    constructor() {
        this.cart = [];
        this.shippingRate = 99;
        this.taxRate = 0.18; // 18% GST
        this.discountAmount = 200;
        
        this.init();
    }

    init() {
        this.loadCartFromStorage();
        this.renderCart();
        this.bindEvents();
        this.updateCartCount();
    }

    // Load cart data from localStorage
    loadCartFromStorage() {
        try {
            const storedCart = localStorage.getItem('cart');
            if (storedCart) {
                this.cart = JSON.parse(storedCart);
                console.log('Cart loaded:', this.cart);
            } else {
                this.cart = [];
            }
        } catch (error) {
            console.error('Error loading cart from localStorage:', error);
            this.cart = [];
        }
    }

    // Save cart data to localStorage
    saveCartToStorage() {
        try {
            localStorage.setItem('cart', JSON.stringify(this.cart));
            console.log('Cart saved to localStorage');
        } catch (error) {
            console.error('Error saving cart to localStorage:', error);
        }
    }

    // Calculate cart totals
    calculateTotals() {
        const subtotal = this.cart.reduce((total, item) => {
            return total + (parseFloat(item['new-price']) * item.quantity);
        }, 0);

        const shipping = this.cart.length > 0 ? this.shippingRate : 0;
        const tax = subtotal * this.taxRate;
        const discount = subtotal > 500 ? this.discountAmount : 0;
        const total = subtotal + shipping + tax - discount;

        return {
            subtotal: subtotal,
            shipping: shipping,
            tax: tax,
            discount: discount,
            total: total,
            itemCount: this.cart.reduce((count, item) => count + item.quantity, 0)
        };
    }

    // Format currency
    formatCurrency(amount) {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    }

    // Generate product HTML - CORRECTED VERSION
generateProductHTML(item, index) {
    const price = parseFloat(item['new-price']) || 0;
    const subtotal = price * item.quantity;
    
    return `
        <tr data-product-index="${index}">
            <td>
                <div class="product-info">
                    <img src="${item['image-url']}" alt="${item['product-title']}" class="product-image" onerror="this.src='https://via.placeholder.com/80x80/1e3a8a/ffffff?text=IMG'">
                    <div class="product-details">
                        <h4>${item['product-title']}</h4>
                        <p>Category: ${item.category || 'General'}</p>
                        ${item['old-price'] ? `<p class="old-price">Was: ${this.formatCurrency(parseFloat(item['old-price']))}</p>` : ''}
                    </div>
                </div>
            </td>
            <td class="price">${this.formatCurrency(price)}</td>
            <td>
                <div class="quantity-controls">
                    <button class="quantity-btn decrease-btn" data-index="${index}" ${item.quantity <= 1 ? 'disabled' : ''}>-</button>
                    <input type="number" value="${item.quantity}" min="1" max="99" class="quantity-input" data-index="${index}">
                    <button class="quantity-btn increase-btn" data-index="${index}">+</button>
                </div>
            </td>
            <td class="price">${this.formatCurrency(subtotal)}</td>
            <td>
                <button class="remove-btn" data-index="${index}">
                    <i class="fas fa-trash-alt"></i> Remove
                </button>
            </td>
        </tr>
    `;
}

    // Render cart
    renderCart() {
        const emptyCartSection = document.querySelector('.empty-cart');
        const cartWithItemsSection = document.querySelector('.cart-with-items');
        
        if (!emptyCartSection || !cartWithItemsSection) {
            console.error('Required cart sections not found in DOM');
            return;
        }

        if (this.cart.length === 0) {
            // Show empty cart
            emptyCartSection.style.display = 'block';
            cartWithItemsSection.style.display = 'none';
        } else {
            // Show cart with items
            emptyCartSection.style.display = 'none';
            cartWithItemsSection.style.display = 'block';
            
            this.renderCartTable();
            this.renderCartSummary();
        }
    }

    // Render cart table
    renderCartTable() {
        const cartTableBody = document.querySelector('.cart-table tbody');
        if (!cartTableBody) {
            console.error('Cart table body not found');
            return;
        }

        cartTableBody.innerHTML = this.cart.map((item, index) => 
            this.generateProductHTML(item, index)
        ).join('');
    }

    // Render cart summary
    renderCartSummary() {
        const totals = this.calculateTotals();
        const cartSummary = document.querySelector('.cart-summary');
        
        if (!cartSummary) {
            console.error('Cart summary section not found');
            return;
        }

        cartSummary.innerHTML = `
            <h3 style="margin-bottom: 20px; color: #1e3a8a;">Order Summary</h3>
            <div class="summary-row">
                <span>Subtotal (${totals.itemCount} items):</span>
                <span>${this.formatCurrency(totals.subtotal)}</span>
            </div>
            <div class="summary-row">
                <span>Shipping:</span>
                <span>${totals.shipping > 0 ? this.formatCurrency(totals.shipping) : 'Free'}</span>
            </div>
            <div class="summary-row">
                <span>Tax (18% GST):</span>
                <span>${this.formatCurrency(totals.tax)}</span>
            </div>
            <div class="summary-row">
                <span>Discount:</span>
                <span style="color: #28a745;">${totals.discount > 0 ? '-' + this.formatCurrency(totals.discount) : '₹0'}</span>
            </div>
            <div class="summary-row total">
                <span>Total:</span>
                <span>${this.formatCurrency(totals.total)}</span>
            </div>
            
            <button class="checkout-btn" id="checkoutBtn">
                <i class="fas fa-lock"></i> Proceed to Checkout
            </button>
            
            <div class="continue-shopping">
                <a href="index.html"><i class="fas fa-arrow-left"></i> Continue Shopping</a>
            </div>
        `;
    }

    // Update cart item quantity
    updateQuantity(index, newQuantity) {
        if (index >= 0 && index < this.cart.length) {
            const quantity = Math.max(1, Math.min(99, parseInt(newQuantity) || 1));
            this.cart[index].quantity = quantity;
            this.saveCartToStorage();
            this.renderCart();
            this.updateCartCount();
            this.showNotification(`Quantity updated to ${quantity}`, 'success');
        }
    }

    // Remove item from cart
    removeItem(index) {
        if (index >= 0 && index < this.cart.length) {
            const removedItem = this.cart[index];
            
            // Show confirmation dialog
            if (confirm(`Remove "${removedItem['product-title']}" from cart?`)) {
                this.cart.splice(index, 1);
                this.saveCartToStorage();
                this.renderCart();
                this.updateCartCount();
                this.showNotification(`"${removedItem['product-title']}" removed from cart`, 'info');
            }
        }
    }

    // Update cart count in header
    updateCartCount() {
        const cartCountElements = document.querySelectorAll('.cart-count');
        const totalItems = this.cart.reduce((count, item) => count + item.quantity, 0);
        
        cartCountElements.forEach(element => {
            element.textContent = totalItems;
            element.style.display = totalItems > 0 ? 'block' : 'none';
        });

        // Update page title
        document.title = totalItems > 0 ? `Cart (${totalItems}) - Vikoshiya` : 'Cart - Vikoshiya';
    }

    // Show notification
    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.cart-notification');
        existingNotifications.forEach(notification => notification.remove());

        // Create notification
        const notification = document.createElement('div');
        notification.className = `cart-notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;

        // Add styles
        Object.assign(notification.style, {
            position: 'fixed',
            top: '100px',
            right: '20px',
            padding: '15px 20px',
            backgroundColor: type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8',
            color: 'white',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            zIndex: '1000',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '14px',
            fontWeight: '500',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease'
        });

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Auto remove
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Bind event listeners
    bindEvents() {
        // Quantity controls
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('decrease-btn')) {
                const index = parseInt(e.target.dataset.index);
                const currentQuantity = this.cart[index].quantity;
                this.updateQuantity(index, currentQuantity - 1);
            }
            
            if (e.target.classList.contains('increase-btn')) {
                const index = parseInt(e.target.dataset.index);
                const currentQuantity = this.cart[index].quantity;
                this.updateQuantity(index, currentQuantity + 1);
            }

            if (e.target.classList.contains('remove-btn')) {
                const index = parseInt(e.target.dataset.index);
                this.removeItem(index);
            }

            if (e.target.id === 'checkoutBtn') {
                this.proceedToCheckout();
            }
        });

        // Quantity input changes
        document.addEventListener('change', (e) => {
            if (e.target.classList.contains('quantity-input')) {
                const index = parseInt(e.target.dataset.index);
                const newQuantity = parseInt(e.target.value);
                this.updateQuantity(index, newQuantity);
            }
        });

        // Prevent invalid input in quantity fields
        document.addEventListener('input', (e) => {
            if (e.target.classList.contains('quantity-input')) {
                const value = parseInt(e.target.value);
                if (isNaN(value) || value < 1) {
                    e.target.value = 1;
                } else if (value > 99) {
                    e.target.value = 99;
                }
            }
        });

        // Continue shopping buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('.continue-shopping-btn') || 
                e.target.closest('.continue-shopping a')) {
                e.preventDefault();
                window.location.href = 'index.html';
            }
        });
    }

    // Proceed to checkout
    proceedToCheckout() {
        if (this.cart.length === 0) {
            this.showNotification('Your cart is empty!', 'error');
            return;
        }

        const totals = this.calculateTotals();
        
        // Create checkout data
        const checkoutData = {
            items: this.cart,
            totals: totals,
            timestamp: new Date().toISOString()
        };

        // Store checkout data
        localStorage.setItem('checkoutData', JSON.stringify(checkoutData));

        this.showNotification('Redirecting to checkout...', 'success');
        
        // Redirect to checkout page after short delay
        setTimeout(() => {
            window.location.href = 'checkout.html';
        }, 1500);
    }

    // Clear entire cart
    clearCart() {
        if (confirm('Are you sure you want to clear your entire cart?')) {
            this.cart = [];
            this.saveCartToStorage();
            this.renderCart();
            this.updateCartCount();
            this.showNotification('Cart cleared successfully', 'info');
        }
    }

    // Get cart statistics
    getCartStats() {
        const totals = this.calculateTotals();
        return {
            itemCount: this.cart.length,
            totalQuantity: totals.itemCount,
            subtotal: totals.subtotal,
            total: totals.total,
            categories: [...new Set(this.cart.map(item => item.category))],
            averagePrice: totals.subtotal / totals.itemCount || 0
        };
    }
}

// Initialize cart when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Create global cart instance
    window.shoppingCart = new ShoppingCart();
    
    // Add some additional utility functions to window
    window.addToCart = function(product) {
        const existingItemIndex = window.shoppingCart.cart.findIndex(
            item => item['product-title'] === product['product-title']
        );

        if (existingItemIndex > -1) {
            window.shoppingCart.cart[existingItemIndex].quantity += product.quantity || 1;
        } else {
            window.shoppingCart.cart.push({
                ...product,
                quantity: product.quantity || 1
            });
        }

        window.shoppingCart.saveCartToStorage();
        window.shoppingCart.updateCartCount();
        window.shoppingCart.showNotification(`"${product['product-title']}" added to cart!`, 'success');
    };

    window.clearCart = function() {
        window.shoppingCart.clearCart();
    };

    window.getCartStats = function() {
        return window.shoppingCart.getCartStats();
    };

    console.log('Shopping Cart initialized successfully');
    console.log('Cart stats:', window.shoppingCart.getCartStats());
});

// Handle page unload - save any pending changes
window.addEventListener('beforeunload', () => {
    if (window.shoppingCart) {
        window.shoppingCart.saveCartToStorage();
    }
});

// Export for module systems (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ShoppingCart;
}