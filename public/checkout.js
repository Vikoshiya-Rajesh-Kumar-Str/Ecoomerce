class CheckoutPage {
    constructor() {
        this.checkoutData = null;
        this.shippingRate = 99;
        this.taxRate = 0.18;
        this.discountAmount = 200;
        this.codFee = 40;
        
        this.init();
    }

    init() {
        this.loadCheckoutData();
        this.renderOrderSummary();
        this.bindEvents();
    }

    // Load checkout data from localStorage
    loadCheckoutData() {
        try {
            const storedData = localStorage.getItem('checkoutData');
            if (storedData) {
                this.checkoutData = JSON.parse(storedData);
                console.log('Checkout data loaded:', this.checkoutData);
            } else {
                // Fallback: try to load from cart
                const cartData = localStorage.getItem('cart');
                if (cartData) {
                    const cart = JSON.parse(cartData);
                    if (cart.length > 0) {
                        this.checkoutData = {
                            items: cart,
                            totals: this.calculateTotals(cart),
                            timestamp: new Date().toISOString()
                        };
                    }
                }
            }
        } catch (error) {
            console.error('Error loading checkout data:', error);
            this.checkoutData = null;
        }
    }

    // Calculate totals
    calculateTotals(items, paymentMethod = null) {
        const subtotal = items.reduce((total, item) => {
            return total + (parseFloat(item['new-price']) * item.quantity);
        }, 0);

        const shipping = items.length > 0 ? this.shippingRate : 0;
        const tax = subtotal * this.taxRate;
        const discount = subtotal > 500 ? this.discountAmount : 0;
        const codHandlingFee = paymentMethod === 'cod' ? this.codFee : 0;
        const total = subtotal + shipping + tax - discount + codHandlingFee;

        return {
            subtotal: subtotal,
            shipping: shipping,
            tax: tax,
            discount: discount,
            codFee: codHandlingFee,
            total: total,
            itemCount: items.reduce((count, item) => count + item.quantity, 0)
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

    // Render order summary
    renderOrderSummary() {
        if (!this.checkoutData || !this.checkoutData.items || this.checkoutData.items.length === 0) {
            this.showEmptyCheckout();
            return;
        }

        this.renderOrderItems();
        this.updateOrderTotals();
    }

    // Show empty checkout
    showEmptyCheckout() {
        const orderItems = document.getElementById('orderItems');
        if (orderItems) {
            orderItems.innerHTML = `
                <div style="text-align: center; padding: 40px 20px; color: #6b7280;">
                    <i class="fas fa-shopping-cart" style="font-size: 48px; margin-bottom: 16px; opacity: 0.5;"></i>
                    <h3 style="margin-bottom: 8px;">Your cart is empty</h3>
                    <p style="margin-bottom: 20px;">Add some products to proceed with checkout</p>
                    <a href="index.html" style="display: inline-block; padding: 12px 24px; background-color: #1e3a8a; color: white; text-decoration: none; border-radius: 6px;">
                        <i class="fas fa-arrow-left"></i> Continue Shopping
                    </a>
                </div>
            `;
        }

        // Disable place order button
        const placeOrderBtn = document.querySelector('.place-order-btn');
        if (placeOrderBtn) {
            placeOrderBtn.disabled = true;
            placeOrderBtn.innerHTML = '<i class="fas fa-shopping-cart"></i> Cart is Empty';
        }
    }

    // Render order items
    renderOrderItems() {
        const orderItemsContainer = document.getElementById('orderItems');
        
        if (!orderItemsContainer) {
            console.error('Order items container not found');
            return;
        }

        const itemsHTML = this.checkoutData.items.map(item => {
            const price = parseFloat(item['new-price']) || 0;
            const subtotal = price * item.quantity;
            
            return `
                <div class="order-item" style="display: flex; align-items: center; padding: 15px 0; border-bottom: 1px solid #e5e7eb;">
                    <img src="${item['image-url']}" alt="${item['product-title']}" 
                         style="width: 60px; height: 60px; object-fit: cover; border-radius: 6px; margin-right: 15px;" 
                         onerror="this.src='https://via.placeholder.com/60x60/1e3a8a/ffffff?text=IMG'">
                    <div style="flex: 1;">
                        <div style="font-weight: 500; color: #1f2937; margin-bottom: 4px;">${item['product-title']}</div>
                        <div style="font-size: 0.875rem; color: #6b7280; margin-bottom: 4px;">${item.category || 'General'}</div>
                        <div style="font-size: 0.875rem; color: #6b7280;">Qty: ${item.quantity}</div>
                    </div>
                    <div style="font-weight: 600; color: #1e3a8a;">${this.formatCurrency(subtotal)}</div>
                </div>
            `;
        }).join('');

        orderItemsContainer.innerHTML = itemsHTML;
    }

    // Update order totals
    updateOrderTotals(paymentMethod = null) {
        if (!this.checkoutData || !this.checkoutData.items) return;

        const totals = this.calculateTotals(this.checkoutData.items, paymentMethod);

        // Update item count
        const itemCountElement = document.getElementById('itemCount');
        if (itemCountElement) {
            itemCountElement.textContent = totals.itemCount;
        }

        // Update subtotal
        const subtotalElement = document.getElementById('subtotalAmount');
        if (subtotalElement) {
            subtotalElement.textContent = this.formatCurrency(totals.subtotal);
        }

        // Update shipping
        const shippingElement = document.getElementById('shippingAmount');
        if (shippingElement) {
            shippingElement.textContent = totals.shipping > 0 ? this.formatCurrency(totals.shipping) : 'Free';
        }

        // Update tax
        const taxElement = document.getElementById('taxAmount');
        if (taxElement) {
            taxElement.textContent = this.formatCurrency(totals.tax);
        }

        // Update discount
        const discountElement = document.getElementById('discountAmount');
        if (discountElement) {
            discountElement.textContent = totals.discount > 0 ? '-' + this.formatCurrency(totals.discount) : '₹0';
        }

        // Update COD fee
        const codFeeRow = document.getElementById('codFeeRow');
        if (codFeeRow) {
            codFeeRow.style.display = paymentMethod === 'cod' ? 'block' : 'none';
        }

        // Update total
        const totalElement = document.getElementById('totalAmount');
        if (totalElement) {
            totalElement.textContent = this.formatCurrency(totals.total);
        }

        // Update checkout data with new totals
        this.checkoutData.totals = totals;
    }

    // Show notification
    showNotification(message, type = 'success') {
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        `;

        // Add styles
        Object.assign(notification.style, {
            position: 'fixed',
            top: '100px',
            right: '20px',
            padding: '15px 20px',
            backgroundColor: type === 'success' ? '#10b981' : '#ef4444',
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

        setTimeout(() => notification.classList.add('show'), 100);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Validate form
    validateForm() {
        const form = document.getElementById('checkoutForm');
        const formData = new FormData(form);
        const required = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'pincode'];
        
        for (let field of required) {
            if (!formData.get(field)) {
                this.showNotification(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`, 'error');
                document.getElementById(field).focus();
                return false;
            }
        }

        // Validate email
        const email = formData.get('email');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            this.showNotification('Please enter a valid email address', 'error');
            document.getElementById('email').focus();
            return false;
        }

        // Validate phone
        const phone = formData.get('phone');
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(phone)) {
            this.showNotification('Please enter a valid 10-digit phone number', 'error');
            document.getElementById('phone').focus();
            return false;
        }

        // Validate pincode
        const pincode = formData.get('pincode');
        const pincodeRegex = /^[0-9]{6}$/;
        if (!pincodeRegex.test(pincode)) {
            this.showNotification('Please enter a valid 6-digit PIN code', 'error');
            document.getElementById('pincode').focus();
            return false;
        }

        // Validate payment method
        const paymentMethod = formData.get('paymentMethod');
        if (!paymentMethod) {
            this.showNotification('Please select a payment method', 'error');
            return false;
        }

        return true;
    }

    // Place order
    placeOrder() {
        if (!this.validateForm()) {
            return;
        }

        const form = document.getElementById('checkoutForm');
        const formData = new FormData(form);
        const placeOrderBtn = document.querySelector('.place-order-btn');

        // Disable button and show loading
        placeOrderBtn.disabled = true;
        placeOrderBtn.innerHTML = '<div class="loading"></div><span><i class="fas fa-spinner fa-spin"></i> Processing Order...</span>';

        // Get selected payment method
        const paymentMethod = formData.get('paymentMethod');
        
        // Recalculate totals with COD fee if applicable
        const finalTotals = this.calculateTotals(this.checkoutData.items, paymentMethod);

        // Create order object
        const orderData = {
            id: 'ORD' + Date.now(),
            timestamp: new Date().toISOString(),
            customer: {
                firstName: formData.get('firstName'),
                lastName: formData.get('lastName'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                address: {
                    street: formData.get('address'),
                    apartment: formData.get('address2'),
                    city: formData.get('city'),
                    state: formData.get('state'),
                    pincode: formData.get('pincode'),
                    country: 'India'
                }
            },
            items: this.checkoutData.items,
            totals: finalTotals,
            paymentMethod: paymentMethod,
            notes: formData.get('notes'),
            status: 'pending'
        };

        // Simulate order processing
        setTimeout(() => {
            try {
                // Save order to localStorage
                const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
                existingOrders.push(orderData);
                localStorage.setItem('orders', JSON.stringify(existingOrders));

                // Clear cart and checkout data
                localStorage.removeItem('cart');
                localStorage.removeItem('checkoutData');

                this.showNotification('Order placed successfully!', 'success');

                // Show success message and redirect
                setTimeout(() => {
                    alert(`Order placed successfully!\nOrder ID: ${orderData.id}\nTotal Amount: ${this.formatCurrency(finalTotals.total)}\n\nYou will receive a confirmation email shortly.`);
                    window.location.href = 'index.html';
                }, 2000);

            } catch (error) {
                console.error('Error placing order:', error);
                this.showNotification('Error placing order. Please try again.', 'error');
                
                placeOrderBtn.disabled = false;
                placeOrderBtn.innerHTML = '<span><i class="fas fa-lock"></i> Place Order</span>';
            }
        }, 2000);
    }

    // Bind events
    bindEvents() {
        // Place order button
        const placeOrderBtn = document.querySelector('.place-order-btn');
        if (placeOrderBtn) {
            placeOrderBtn.addEventListener('click', () => {
                this.placeOrder();
            });
        }

        // Payment method selection
        document.querySelectorAll('.payment-option').forEach(option => {
            option.addEventListener('click', () => {
                document.querySelectorAll('.payment-option').forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
                const radio = option.querySelector('input[type="radio"]');
                if (radio) {
                    radio.checked = true;
                    this.updateOrderTotals(radio.value);
                }
            });
        });

        // Form validation on input
        const checkoutForm = document.getElementById('checkoutForm');
        if (checkoutForm) {
            checkoutForm.addEventListener('input', (e) => {
                if (e.target.checkValidity()) {
                    e.target.style.borderColor = '#10b981';
                } else {
                    e.target.style.borderColor = '#ef4444';
                }
            });
        }

        // Card number formatting
        const cardNumberInput = document.getElementById('cardNumber');
        if (cardNumberInput) {
            cardNumberInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
                let formattedInputValue = value.match(/.{1,4}/g)?.join(' ') || value;
                e.target.value = formattedInputValue;
            });
        }

        // Card expiry formatting
        const cardExpiryInput = document.getElementById('cardExpiry');
        if (cardExpiryInput) {
            cardExpiryInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length >= 2) {
                    value = value.substring(0, 2) + '/' + value.substring(2, 4);
                }
                e.target.value = value;
            });
        }
    }
}

// Payment selection function (global)
function selectPayment(method) {
    document.querySelectorAll('.payment-option').forEach(opt => opt.classList.remove('selected'));
    document.querySelector(`#payment${method.charAt(0).toUpperCase() + method.slice(1)}`).parentElement.parentElement.classList.add('selected');
    document.querySelector(`#payment${method.charAt(0).toUpperCase() + method.slice(1)}`).checked = true;
    
    if (window.checkoutPage) {
        window.checkoutPage.updateOrderTotals(method);
    }
}

// Global place order function
function placeOrder() {
    if (window.checkoutPage) {
        window.checkoutPage.placeOrder();
    }
}

// Initialize checkout page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.checkoutPage = new CheckoutPage();
    console.log('Checkout page initialized');
});