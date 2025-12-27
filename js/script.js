$(document).ready(function () {

    // ==============================
    // CART SETUP
    // ==============================
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    function updateCartBadge() {
        $('.cart-count').text(cart.length);
        $('.fa-shopping-cart').siblings('.badge').text(cart.length);
    }

    updateCartBadge();

    // ======== TOAST NOTIFICATION ========
    const toastEl = document.getElementById('cartToast') || document.getElementById('notificationToast');
    const toast = toastEl ? new bootstrap.Toast(toastEl) : null;

    function showToast(message) {
        if (!toastEl) return;
        toastEl.querySelector('.toast-body').textContent = message;
        toast.show();
    }

    // ==============================
    // COLLECTION PAGE ISOTOPE FILTER
    // ==============================
    if ($('.collection-list').length) {
        var $grid = $('.collection-list').isotope({
            itemSelector: '.collection-item',
            layoutMode: 'fitRows'
        });

        $('.filter-button-group').on('click', 'button', function () {
            var filterValue = $(this).attr('data-filter');
            $('.filter-button-group button').removeClass('active-filter-btn');
            $(this).addClass('active-filter-btn');
            $grid.isotope({ filter: filterValue });
        });
    }

    // ==============================
    // SEARCH FUNCTIONALITY
    // ==============================
    $('#searchInput, #searchInputDesktop').on('keypress', function (e) {
        if (e.which === 13) { // Enter key
            let query = $(this).val().toLowerCase();
            let category = '';

            if (query.includes('dress') || query.includes('crochet')) category = 'crochet';
            else if (query.includes('tunics')) category = 'tunics';
            else if (query.includes('croptop')) category = 'croptop';
            else if (query.includes('skirt')) category = 'skirt';
            else if (query.includes('pants')) category = 'pants';
            else if (query.includes('jacket')) category = 'jackets';
            else if (query.includes('kurthi')) category = 'kurthi set';
            else { showToast('No matching products found'); return; }

            window.location.href = `category.html?cat=${category}`;
        }
    });

    $('.search-option').on('click', function () {
        const targetCategory = $(this).data('target');
        window.location.href = `category.html?cat=${targetCategory}`;
    });

    // ==============================
    // ADD TO CART & ORDER NOW
    // ==============================
    function attachProductListeners() {
        // Add to Cart
        document.querySelectorAll('.add-to-cart').forEach(btn => {
            btn.onclick = () => {
                const existing = cart.find(item => item.name === btn.dataset.name);
                if (existing) existing.qty += 1;
                else cart.push({
                    name: btn.dataset.name,
                    price: parseFloat(btn.dataset.price),
                    image: btn.dataset.image,
                    qty: 1
                });
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCartBadge();

                // Only show toast on category page
                if (window.location.href.includes('category.html')) {
                    showToast(`${btn.dataset.name} added to Cart!`);
                }
            };
        });

        // Order Now -> Add to Cart and go to cart page
        document.querySelectorAll('.order-now').forEach(btn => {
            btn.onclick = () => {
                const existing = cart.find(item => item.name === btn.dataset.name);
                if (existing) existing.qty += 1;
                else cart.push({
                    name: btn.dataset.name,
                    price: parseFloat(btn.dataset.price),
                    image: btn.dataset.image,
                    qty: 1
                });
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCartBadge();
                window.location.href = "cart.html";
            };
        });
    }

    attachProductListeners();

    // ==============================
    // CART PAGE RENDER
    // ==============================
    const cartItems = document.getElementById("cartItems");
    if (cartItems) {

        function renderCart() {
            cartItems.innerHTML = "";
            let total = 0;

            cart.forEach((item, index) => {
                total += item.price * item.qty;

                cartItems.innerHTML += `
                    <div class="col-12 mb-2">
                        <div class="cart-card d-flex align-items-center gap-3 p-2">
                            <img src="${item.image}" alt="${item.name}">
                            <div class="flex-grow-1">
                                <h6>${item.name}</h6>
                                <p>Rs ${item.price}</p>
                                <div class="d-flex align-items-center gap-2">
                                    <button class="qty-btn decrease" data-index="${index}">−</button>
                                    <span>${item.qty}</span>
                                    <button class="qty-btn increase" data-index="${index}">+</button>
                                </div>
                            </div>
                            <button class="btn btn-sm btn-danger remove" data-index="${index}">
                                <i class="fa fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `;
            });

            document.getElementById("totalPrice").textContent = total;
        }

        renderCart();

        // Quantity & Remove
        document.addEventListener("click", e => {
            if (e.target.classList.contains("increase")) {
                cart[e.target.dataset.index].qty++;
                localStorage.setItem("cart", JSON.stringify(cart));
                renderCart();
            }

            if (e.target.classList.contains("decrease")) {
                const i = e.target.dataset.index;
                if (cart[i].qty > 1) {
                    cart[i].qty--;
                    localStorage.setItem("cart", JSON.stringify(cart));
                    renderCart();
                }
            }

            if (e.target.closest(".remove")) {
                cart.splice(e.target.closest(".remove").dataset.index, 1);
                localStorage.setItem("cart", JSON.stringify(cart));
                renderCart();
                updateCartBadge();
                showToast("Item removed");
            }
        });

        // CLEAR CART
        document.getElementById("clearCart").onclick = () => {
            if (!cart.length) {
                showToast("Cart is already empty");
                return;
            }
            if (confirm("Are you sure you want to clear the cart?")) {
                cart = [];
                localStorage.setItem("cart", JSON.stringify(cart));
                renderCart();
                updateCartBadge();
                showToast("Cart cleared");
            }
        };

        // CHECKOUT WITH ADDRESS
        document.getElementById("checkoutBtn").onclick = () => {
            const name = document.getElementById("custName").value.trim();
            const phone = document.getElementById("custPhone").value.trim();
            const address = document.getElementById("custAddress").value.trim();

            if (!cart.length) {
                showToast("Cart is empty");
                return;
            }
            if (!name || !phone || !address) {
                showToast("Please fill address details");
                return;
            }

            let msg = `Hello Nan Hub,%0A%0AName: ${name}%0APhone: ${phone}%0AAddress: ${address}%0A%0AOrder Details:%0A`;
            let total = 0;
            cart.forEach((item, i) => {
                msg += `${i+1}. ${item.name} x${item.qty} - Rs ${item.price * item.qty}%0A`;
                total += item.price * item.qty;
            });
            msg += `%0A*Total: Rs ${total}*`;

            window.open(`https://wa.me/97431139653?text=${msg}`, "_blank");
        };
    }

    // ==============================
    // CATEGORY PAGE PRODUCTS
    // ==============================
    const productList = document.getElementById('productList');
    if (productList) {
        const products = [
            { name: "Crochet Top", price: 900, category: "crochet", image: "images/crochet.png" },
            { name: "Tunics", price: 1200, category: "tunics", image: "images/tunics.png" },
            { name: "Denim Jacket", price: 1500, category: "jackets", image: "images/jackets.png" },
            { name: "Crop Top", price: 700, category: "croptop", image: "images/c_undershirt.png" },
            { name: "Western Shirt", price: 800, category: "croptop", image: "images/c_western-shirt.png" },
            { name: "Pleated Skirt", price: 300, category: "skirt", image: "images/skirt.png" },
            { name: "Pink Pants", price: 500, category: "pants", image: "images/pink pants.png" },
            { name: "Blue Jeans", price: 1200, category: "pants", image: "images/jeans.png" },
            { name: "Crop Top With Bottom", price: 1000, category: "tunics", image: "images/special_product_1.jpg" },
            { name: "Meroon Kurthi Set", price: 800, category: "kurthi set", image: "images/special_product_2.jpg" },
            { name: "Jackets With Modestbottom Combo", price: 2000, category: "jackets", image: "images/special_product_3.jpg" },
            { name: "Kurthi With Palaza", price: 1500, category:"kurthi set", image:"images/special_product_4.jpg" }
        ];

        const urlParams = new URLSearchParams(window.location.search);
        const currentCategory = urlParams.get('cat') || 'all';

        document.getElementById('categoryTitle').textContent = 
            currentCategory === 'all' ? "Collection" : currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1) + " Collection";

        function renderProducts() {
            productList.innerHTML = '';
            const filtered = currentCategory === 'all' ? products : products.filter(p => p.category === currentCategory);
            filtered.forEach(product => {
                const col = document.createElement('div');
                col.className = "col-6 col-lg-3 p-2";
                col.innerHTML = `
                  <div class="card h-100">
                    <img src="${product.image}" class="card-img-top" alt="${product.name}">
                    <div class="card-body text-center d-flex flex-column justify-content-between">
                      <h5 class="card-title">${product.name}</h5>
                      <p class="fw-bold">Rs ${product.price}</p>
                      <div class="d-flex justify-content-center gap-2">
                        <button class="btn btn-dark btn-sm add-to-cart" data-name="${product.name}" data-price="${product.price}" data-image="${product.image}">Add to Cart</button>
                        <button class="btn btn-success btn-sm order-now" data-name="${product.name}" data-price="${product.price}" data-image="${product.image}">Order Now</button>
                      </div>
                    </div>
                  </div>
                `;
                productList.appendChild(col);
            });
            attachProductListeners();
        }

        renderProducts();
    }

});