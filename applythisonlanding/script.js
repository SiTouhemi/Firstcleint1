class ProductStore {
    constructor() {
        this.cartItems = [];
        this.favorites = [];
        this.currentPage = 'home';
        this.orderCounter = 1004; // Starting order number
        this.products = [
            // New vegetables products
            { id: 7, name: 'طماطم طازجة', price: 12, category: 'vegetables', description: 'طماطم طازجة عالية الجودة' },
            { id: 8, name: 'خيار طازج', price: 8, category: 'vegetables', description: 'خيار طازج ومقرمش' },
            { id: 9, name: 'جزر طازج', price: 10, category: 'vegetables', description: 'جزر طازج غني بالفيتامينات' },
            // New fruits products
            { id: 10, name: 'تفاح أحمر', price: 15, category: 'fruits', description: 'تفاح أحمر حلو ولذيذ' },
            { id: 11, name: 'موز طازج', price: 9, category: 'fruits', description: 'موز طازج غني بالبوتاسيوم' },
            { id: 12, name: 'برتقال طازج', price: 13, category: 'fruits', description: 'برتقال طازج غني بفيتامين C' },
            // Existing products
            { id: 1, name: 'حذاء رياضي أديداس', price: 299, category: 'shoes', description: 'حذاء رياضي مريح للجري' },
            { id: 2, name: 'قميص قطني كلاسيكي', price: 149, category: 'clothes', description: 'قميص قطني عالي الجودة' },
            { id: 3, name: 'حقيبة يد جلدية', price: 399, category: 'accessories', description: 'حقيبة أنيقة من الجلد الطبيعي' },
            { id: 4, name: 'سماعات لاسلكية', price: 599, category: 'electronics', description: 'سماعات عالية الجودة' },
            { id: 5, name: 'حذاء كاجوال', price: 249, category: 'shoes', description: 'حذاء مريح للاستخدام اليومي' },
            { id: 6, name: 'هودي رياضي', price: 199, category: 'clothes', description: 'هودي دافئ ومريح' }
        ];

        
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateCartCount();
        this.initBottomNav();
    }

    bindEvents() {
        // Category filtering
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('category-btn')) {
                this.filterByCategory(e.target);
            }
        });

        // Main category filtering
        document.addEventListener('click', (e) => {
            if (e.target.closest('.main-category-card')) {
                const card = e.target.closest('.main-category-card');
                const category = card.dataset.category;
                this.filterByMainCategory(category);
            }
        });

        // Orders filtering
        document.addEventListener('click', (e) => {
            if (e.target.closest('.filter-btn')) {
                const filterBtn = e.target.closest('.filter-btn');
                this.filterOrdersByStatus(filterBtn);
            }
        });

        // Add to cart
        document.addEventListener('click', (e) => {
            if (e.target.closest('.add-to-cart-btn')) {
                const btn = e.target.closest('.add-to-cart-btn');
                const productId = parseInt(btn.dataset.id);
                this.addToCart(productId, btn);
            }
        });

        // Favorite toggle
        document.addEventListener('click', (e) => {
            if (e.target.closest('.favorite-btn')) {
                const btn = e.target.closest('.favorite-btn');
                const productCard = btn.closest('.product-card');
                const productId = parseInt(productCard.dataset.id);
                this.toggleFavorite(productId, btn);
            }
        });

        // Product card click (for product details)
        document.addEventListener('click', (e) => {
            if (e.target.closest('.product-card') && !e.target.closest('.add-to-cart-btn') && !e.target.closest('.favorite-btn')) {
                const productCard = e.target.closest('.product-card');
                const productId = parseInt(productCard.dataset.id);
                this.viewProductDetails(productId);
            }
        });

        // Cart button
        document.querySelector('.cart-btn').addEventListener('click', () => {
            this.goToCart();
        });

        // Search button
        document.querySelector('.search-btn').addEventListener('click', () => {
            this.openSearch();
        });

        // Bottom navigation
        document.addEventListener('click', (e) => {
            if (e.target.closest('.nav-item')) {
                const navItem = e.target.closest('.nav-item');
                const page = navItem.dataset.page;
                this.navigateToPage(page, navItem);
            }
        });
    }

    filterByCategory(categoryBtn) {
        // Update active category
        document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
        categoryBtn.classList.add('active');
        
        const category = categoryBtn.dataset.category;
        const productCards = document.querySelectorAll('.product-card');
        
        productCards.forEach((card, index) => {
            if (category === 'all' || card.dataset.category === category) {
                card.style.display = 'block';
                card.style.animation = `fadeInUp 0.5s ease forwards`;
                card.style.animationDelay = `${index * 0.1}s`;
            } else {
                card.style.display = 'none';
            }
        });
    }

    filterByMainCategory(category) {
        // Update active category button
        const categoryBtn = document.querySelector(`[data-category="${category}"]`);
        if (categoryBtn && categoryBtn.classList.contains('category-btn')) {
            document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
            categoryBtn.classList.add('active');
        }
        
        // Filter products
        const productCards = document.querySelectorAll('.product-card');
        productCards.forEach((card, index) => {
            if (card.dataset.category === category) {
                card.style.display = 'block';
                card.style.animation = `fadeInUp 0.5s ease forwards`;
                card.style.animationDelay = `${index * 0.1}s`;
            } else {
                card.style.display = 'none';
            }
        });

        // Show success message
        const categoryNames = {
            electronics: 'إلكترونيات',
            clothes: 'ملابس',
            shoes: 'أحذية',
            accessories: 'إكسسوارات',
            vegetables: 'خضار',
            fruits: 'فواكه'
        };
        
        this.showMessage(`عرض منتجات ${categoryNames[category]}`);
    }

    filterOrdersByStatus(filterBtn) {
        // Update active filter button
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        filterBtn.classList.add('active');
        
        const status = filterBtn.dataset.status;
        const orderCards = document.querySelectorAll('.order-card');
        
        orderCards.forEach((card, index) => {
            if (status === 'all' || card.dataset.status === status) {
                card.style.display = 'block';
                card.style.animation = `fadeInUp 0.5s ease forwards`;
                card.style.animationDelay = `${index * 0.1}s`;
            } else {
                card.style.display = 'none';
            }
        });

        // Show filter message
        const statusNames = {
            all: 'جميع الطلبات',
            delivered: 'الطلبات المُسلّمة',
            shipped: 'الطلبات قيد التوصيل',
            processing: 'الطلبات قيد المعالجة'
        };
        
        this.showMessage(`عرض ${statusNames[status]}`);
    }

    addToCart(productId, button) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        // Check if already in cart
        const existingItem = this.cartItems.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            this.cartItems.push({ ...product, quantity: 1 });
        }

        // Animate button
        const originalContent = button.innerHTML;
        button.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2"/>
            </svg>
            تمت الإضافة
        `;
        button.style.background = '#28a745';
        button.style.color = 'white';
        button.style.borderColor = '#28a745';

        setTimeout(() => {
            button.innerHTML = originalContent;
            button.style.background = '';
            button.style.color = '';
            button.style.borderColor = '';
        }, 1500);

        this.updateCartCount();
        this.showMessage(`تم إضافة ${product.name} للسلة`);
    }

    toggleFavorite(productId, button) {
        const index = this.favorites.indexOf(productId);
        if (index > -1) {
            this.favorites.splice(index, 1);
            button.classList.remove('active');
            this.showMessage('تم إزالة المنتج من المفضلة');
        } else {
            this.favorites.push(productId);
            button.classList.add('active');
            this.showMessage('تم إضافة المنتج للمفضلة');
        }
    }

    viewProductDetails(productId) {
        const product = this.products.find(p => p.id === productId);
        this.showMessage(`عرض تفاصيل: ${product.name}`);
        // In a real app, this would navigate to product details page
    }

    updateCartCount() {
        const totalItems = this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
        document.querySelector('.cart-count').textContent = totalItems;
        
        if (totalItems === 0) {
            document.querySelector('.cart-count').style.display = 'none';
        } else {
            document.querySelector('.cart-count').style.display = 'flex';
        }
        
        this.updateBottomNavCount();
    }

    updateBottomNavCount() {
        const totalItems = this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
        const navCartCount = document.querySelector('.nav-cart-count');
        
        if (navCartCount) {
            navCartCount.textContent = totalItems;
            
            if (totalItems === 0) {
                navCartCount.style.display = 'none';
            } else {
                navCartCount.style.display = 'flex';
            }
        }
    }

    navigateToPage(page, navItem) {
        // Update active nav item
        document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
        navItem.classList.add('active');
        
        this.currentPage = page;
        
        // Hide all pages
        const bannerSection = document.querySelector('.banner-section');
        const mainCategoriesSection = document.querySelector('.main-categories-section');
        const categoriesSection = document.querySelector('.categories-section');
        const productsSection = document.querySelector('.products-section');
        const ordersPage = document.getElementById('ordersPage');
        const cartPage = document.getElementById('cartPage');
        
        switch(page) {
            case 'home':
                bannerSection.style.display = 'block';
                mainCategoriesSection.style.display = 'block';
                categoriesSection.style.display = 'block';
                productsSection.style.display = 'block';
                ordersPage.style.display = 'none';
                cartPage.style.display = 'none';
                this.showMessage('الصفحة الرئيسية');
                break;
            case 'orders':
                bannerSection.style.display = 'none';
                mainCategoriesSection.style.display = 'none';
                categoriesSection.style.display = 'none';
                productsSection.style.display = 'none';
                ordersPage.style.display = 'block';
                cartPage.style.display = 'none';
                this.showMessage('صفحة طلباتي');
                break;
            case 'cart':
                bannerSection.style.display = 'none';
                mainCategoriesSection.style.display = 'none';
                categoriesSection.style.display = 'none';
                productsSection.style.display = 'none';
                ordersPage.style.display = 'none';
                cartPage.style.display = 'block';
                this.renderCartPage();
                this.showMessage('سلة التسوق');
                break;
        }
    }

    renderCartPage() {
        const cartItemsContainer = document.getElementById('cartItems');
        const cartEmpty = document.getElementById('cartEmpty');
        const cartSummary = document.getElementById('cartSummary');

        if (this.cartItems.length === 0) {
            cartItemsContainer.innerHTML = '';
            cartEmpty.style.display = 'block';
            cartSummary.style.display = 'none';
            return;
        }

        cartEmpty.style.display = 'none';
        cartSummary.style.display = 'block';

        // Render cart items
        cartItemsContainer.innerHTML = this.cartItems.map(item => {
            const product = this.products.find(p => p.id === item.id);
            const imageMap = {
                // New vegetables and fruits
                7: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=80&h=80&fit=crop&crop=center',
                8: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=80&h=80&fit=crop&crop=center',
                9: 'https://images.unsplash.com/photo-1619114602456-524b01d0d40a?w=80&h=80&fit=crop&crop=center',
                10: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=80&h=80&fit=crop&crop=center',
                11: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=80&h=80&fit=crop&crop=center',
                12: 'https://images.unsplash.com/photo-1547514701-42782101795e?w=80&h=80&fit=crop&crop=center',
                // Existing products
                1: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=80&h=80&fit=crop&crop=center',
                2: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=80&h=80&fit=crop&crop=center',
                3: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=80&h=80&fit=crop&crop=center',
                4: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=80&h=80&fit=crop&crop=center',
                5: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=80&h=80&fit=crop&crop=center',
                6: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=80&h=80&fit=crop&crop=center'
            };

            return `
                <div class="cart-item" data-id="${item.id}">
                    <div class="cart-item-image">
                        <img src="${imageMap[item.id]}" alt="${item.name}">
                    </div>
                    <div class="cart-item-details">
                        <h3 class="cart-item-name">${item.name}</h3>
                        <p class="cart-item-description">${item.description}</p>
                        <div class="cart-item-price">${item.price} ر.س</div>
                    </div>
                    <div class="cart-item-actions">
                        <div class="quantity-controls">
                            <button class="quantity-btn decrease-btn" data-id="${item.id}" ${item.quantity <= 1 ? 'disabled' : ''}>-</button>
                            <span class="quantity-display">${item.quantity}</span>
                            <button class="quantity-btn increase-btn" data-id="${item.id}">+</button>
                        </div>
                        <button class="remove-item-btn" data-id="${item.id}">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" stroke-width="2"/>
                            </svg>
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        // Update summary
        this.updateCartSummary();

        // Bind cart item events
        this.bindCartEvents();
    }

    bindCartEvents() {
        // Quantity controls
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('increase-btn')) {
                const productId = parseInt(e.target.dataset.id);
                this.updateQuantity(productId, 1);
            }
            
            if (e.target.classList.contains('decrease-btn')) {
                const productId = parseInt(e.target.dataset.id);
                this.updateQuantity(productId, -1);
            }
            
            if (e.target.closest('.remove-item-btn')) {
                const productId = parseInt(e.target.closest('.remove-item-btn').dataset.id);
                this.removeFromCart(productId);
            }
        });

        // Continue shopping button
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('continue-shopping-btn')) {
                const homeNavItem = document.querySelector('[data-page="home"]');
                this.navigateToPage('home', homeNavItem);
            }
        });

        // Checkout button
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('checkout-btn')) {
                this.checkout();
            }
        });

        // Map controls
        this.bindMapEvents();

        // Discount code application
        document.addEventListener('click', (e) => {
            if (e.target.id === 'applyDiscount') {
                this.applyDiscountCode();
            }
        });

        document.addEventListener('keypress', (e) => {
            if (e.target.id === 'discountCode' && e.key === 'Enter') {
                this.applyDiscountCode();
            }
        });
    }

    bindMapEvents() {
        // Get current location
        document.addEventListener('click', (e) => {
            if (e.target.id === 'getCurrentLocation') {
                this.getCurrentLocation();
            }
            
            if (e.target.id === 'selectOnMap') {
                this.openMapSelector();
            }
            
            if (e.target.id === 'closeMap') {
                this.closeMapSelector();
            }
            
            if (e.target.id === 'confirmLocation') {
                this.confirmSelectedLocation();
            }
        });

        // Location marker selection
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('location-marker')) {
                this.selectLocationMarker(e.target);
            }
        });
    }

    getCurrentLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    this.setLocationFromCoords(lat, lng);
                    this.showMessage('تم تحديد موقعك الحالي بنجاح');
                },
                (error) => {
                    this.showMessage('لا يمكن تحديد موقعك الحالي، يرجى اختيار الموقع من الخريطة');
                    this.openMapSelector();
                }
            );
        } else {
            this.showMessage('المتصفح لا يدعم تحديد الموقع، يرجى اختيار الموقع من الخريطة');
            this.openMapSelector();
        }
    }

    setLocationFromCoords(lat, lng) {
        const addressInput = document.getElementById('customerAddress');
        const locationText = `الإحداثيات: ${lat.toFixed(6)}, ${lng.toFixed(6)}`;
        
        if (addressInput.value.trim() === '') {
            addressInput.value = locationText;
        } else {
            addressInput.value += `\n${locationText}`;
        }
    }

    openMapSelector() {
        const mapPlaceholder = document.querySelector('.map-placeholder');
        const mapCanvas = document.getElementById('mapCanvas');
        
        mapPlaceholder.style.display = 'none';
        mapCanvas.style.display = 'block';
        
        // Reset selection
        document.querySelectorAll('.location-marker').forEach(marker => {
            marker.classList.remove('selected');
        });
        
        document.getElementById('selectedLocationText').textContent = 'لم يتم تحديد موقع بعد';
        document.getElementById('selectedLocationText').classList.remove('selected');
        document.getElementById('confirmLocation').disabled = true;
    }

    closeMapSelector() {
        const mapPlaceholder = document.querySelector('.map-placeholder');
        const mapCanvas = document.getElementById('mapCanvas');
        
        mapPlaceholder.style.display = 'block';
        mapCanvas.style.display = 'none';
    }

    selectLocationMarker(marker) {
        // Remove previous selection
        document.querySelectorAll('.location-marker').forEach(m => {
            m.classList.remove('selected');
        });
        
        // Select current marker
        marker.classList.add('selected');
        
        // Update location info
        const locationName = marker.dataset.name;
        const selectedLocationText = document.getElementById('selectedLocationText');
        selectedLocationText.textContent = locationName;
        selectedLocationText.classList.add('selected');
        
        // Enable confirm button
        document.getElementById('confirmLocation').disabled = false;
        
        this.showMessage(`تم اختيار: ${locationName}`);
    }

    confirmSelectedLocation() {
        const selectedMarker = document.querySelector('.location-marker.selected');
        if (!selectedMarker) return;
        
        const locationName = selectedMarker.dataset.name;
        const lat = selectedMarker.dataset.lat;
        const lng = selectedMarker.dataset.lng;
        
        const addressInput = document.getElementById('customerAddress');
        const locationInfo = `${locationName}\nالإحداثيات: ${lat}, ${lng}`;
        
        if (addressInput.value.trim() === '') {
            addressInput.value = locationInfo;
        } else {
            // Replace any existing location info
            let currentValue = addressInput.value;
            const coordsPattern = /الإحداثيات: .+/g;
            currentValue = currentValue.replace(coordsPattern, '').trim();
            addressInput.value = currentValue + `\n${locationInfo}`;
        }
        
        this.closeMapSelector();
        this.showMessage(`تم تأكيد الموقع: ${locationName}`);
    }

    updateQuantity(productId, change) {
        const item = this.cartItems.find(item => item.id === productId);
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                this.removeFromCart(productId);
            } else {
                this.updateCartCount();
                this.renderCartPage();
            }
        }
    }

    removeFromCart(productId) {
        const index = this.cartItems.findIndex(item => item.id === productId);
        if (index > -1) {
            const product = this.cartItems[index];
            this.cartItems.splice(index, 1);
            this.updateCartCount();
            this.renderCartPage();
            this.showMessage(`تم إزالة ${product.name} من السلة`);
        }
    }

    updateCartSummary() {
        const subtotal = this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const total = subtotal - this.discountAmount;
        
        document.getElementById('subtotal').textContent = `${subtotal} ر.س`;
        document.getElementById('total').textContent = `${total} ر.س`;
        
        // Update discount row
        let discountRow = document.querySelector('.discount-row');
        if (this.discountAmount > 0) {
            if (!discountRow) {
                const subtotalRow = document.querySelector('.summary-row');
                discountRow = document.createElement('div');
                discountRow.className = 'summary-row discount-row';
                subtotalRow.parentNode.insertBefore(discountRow, subtotalRow.nextSibling);
            }
            discountRow.innerHTML = `
                <span>الخصم (${this.discountCode}):</span>
                <span>-${this.discountAmount} ر.س</span>
            `;
            discountRow.style.display = 'flex';
        } else if (discountRow) {
            discountRow.style.display = 'none';
        }
    }

    checkout() {
        if (this.cartItems.length === 0) {
            this.showMessage('سلة التسوق فارغة');
            return;
        }
        
        // Check if customer info is provided
        const phoneInput = document.getElementById('customerPhone');
        const addressInput = document.getElementById('customerAddress');
        
        if (!phoneInput.value.trim()) {
            this.showMessage('يرجى إدخال رقم الجوال');
            phoneInput.focus();
            return;
        }
        
        if (!addressInput.value.trim()) {
            this.showMessage('يرجى إدخال عنوان التوصيل');
            addressInput.focus();
            return;
        }
        
        // Validate phone number format
        const phoneRegex = /^05\d{8}$/;
        if (!phoneRegex.test(phoneInput.value.trim())) {
            this.showMessage('يرجى إدخال رقم جوال صحيح (05xxxxxxxx)');
            phoneInput.focus();
            return;
        }
        
        // Clear cart, form, and discount
        this.cartItems = [];
        this.discountCode = null;
        this.discountAmount = 0;
        phoneInput.value = '';
        addressInput.value = '';
        
        // Reset discount form
        const discountInput = document.getElementById('discountCode');
        const applyBtn = document.getElementById('applyDiscount');
        const messageDiv = document.getElementById('discountMessage');
        
        if (discountInput) {
            discountInput.value = '';
            discountInput.disabled = false;
        }
        if (applyBtn) {
            applyBtn.disabled = false;
            applyBtn.textContent = 'تطبيق';
        }
        if (messageDiv) {
            messageDiv.textContent = '';
            messageDiv.className = 'discount-message';
        }
        
        this.updateCartCount();
        
        // Show success message and go back to home
        const discountText = this.discountAmount > 0 ? ` (بعد خصم ${this.discountAmount} ر.س)` : '';
        this.showMessage(`تم تأكيد طلبك رقم #${this.orderCounter} بنجاح! سيتم التوصيل إلى: ${addressInput.value.trim()}. المبلغ: ${total} ر.س${discountText}`);
        
        // Navigate back to home after a short delay
        setTimeout(() => {
            const homeNavItem = document.querySelector('[data-page="home"]');
            this.navigateToPage('home', homeNavItem);
        }, 3000);
    }

    goToCart() {
        const cartNavItem = document.querySelector('[data-page="cart"]');
        this.navigateToPage('cart', cartNavItem);
    }

    openSearch() {
        this.showMessage('فتح صفحة البحث');
        // In a real app, this would open search interface
    }

    showMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'success-message';
        messageDiv.textContent = message;
        
        document.body.appendChild(messageDiv);

        setTimeout(() => {
            messageDiv.style.animation = 'slideUp 0.3s ease forwards';
            setTimeout(() => messageDiv.remove(), 300);
        }, 2000);
    }

    showDiscountMessage(message, type) {
        const messageDiv = document.getElementById('discountMessage');
        messageDiv.textContent = message;
        messageDiv.className = `discount-message ${type}`;
    }

    applyDiscountCode() {
        const codeInput = document.getElementById('discountCode');
        const messageDiv = document.getElementById('discountMessage');
        const applyBtn = document.getElementById('applyDiscount');
        
        const code = codeInput.value.trim().toUpperCase();
        
        if (!code) {
            this.showDiscountMessage('يرجى إدخال كود الخصم', 'error');
            return;
        }
        
        // Disable button temporarily
        applyBtn.disabled = true;
        applyBtn.textContent = 'جاري التحقق...';
        
        setTimeout(() => {
            if (this.validDiscountCodes[code]) {
                const discount = this.validDiscountCodes[code];
                this.discountCode = code;
                
                const subtotal = this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                
                if (discount.type === 'percentage') {
                    this.discountAmount = Math.round(subtotal * (discount.value / 100));
                } else {
                    this.discountAmount = Math.min(discount.value, subtotal);
                }
                
                this.showDiscountMessage(`تم تطبيق ${discount.description} بنجاح!`, 'success');
                codeInput.disabled = true;
                applyBtn.textContent = 'مُطبق';
                this.updateCartSummary();
            } else {
                this.showDiscountMessage('كود الخصم غير صالح', 'error');
                applyBtn.disabled = false;
                applyBtn.textContent = 'تطبيق';
            }
        }, 1000);
    }
}

// Initialize the store when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ProductStore();
});