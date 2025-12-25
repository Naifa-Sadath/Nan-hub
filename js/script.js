$(document).ready(function () {

    // ==============================
    // CART SETUP
    // ==============================
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    function updateCartCount() {
        $('.fa-shopping-cart').siblings('.badge').text(cart.length);
    }

    updateCartCount();

    // ======== TOAST NOTIFICATION ========
    const toastEl = document.getElementById('cartToast');
    const toast = new bootstrap.Toast(toastEl);

    function showToast(message) {
        toastEl.querySelector('.toast-body').textContent = message;
        toast.show();
    }

    // ==============================
    // COLLECTION PAGE - ISOTOPE FILTER
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
    $('#searchInput').on('keypress', function (e) {
        if (e.which === 13) { // Enter key
            let query = $(this).val().toLowerCase();

            if (query.includes('dress') || query.includes('crochet')) {
                window.location.href = 'crochet.html';
            } else if (query.includes('tunics')) {
                window.location.href = 'tunics.html';
            } else if (query.includes('croptop')) {
                window.location.href = 'croptop.html';
            } else {
                alert('No matching products found');
            }
        }
    });

    $('.search-option').on('click', function () {
        let targetPage = $(this).data('target');
        window.location.href = targetPage;
    });

    // ==============================
    // ADD TO CART & ORDER SINGLE ITEM
    // ==============================
    $(document).on('click', '.add-to-cart', function () {
        let name = $(this).data('name');
        let price = Number($(this).data('price'));

        cart.push({ name, price });
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartCount();
        showToast(`${name} added to cart!`);
    });

    $(document).on('click', '.order-now', function () {
        let name = $(this).data('name');
        let price = $(this).data('price');

        let message =
            `Hello Nan Hub,%0A%0AProduct: *${name}*%0APrice: Rs ${price}`;

        let phoneNumber = "97431139653";
        window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
    });
           // ==============================
// WISHLIST SETUP
// ==============================
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

function updateWishlistCount() {
    $('.fa-heart').siblings('.badge').text(wishlist.length);
}

updateWishlistCount();

// ADD TO WISHLIST
$(document).on('click', '.add-to-wishlist', function () {
    let name = $(this).data('name');
    let price = Number($(this).data('price'));
    let image = $(this).data('image');

    // Prevent duplicates
    if (!wishlist.find(item => item.name === name)) {
        wishlist.push({ name, price, image });
        localStorage.setItem("wishlist", JSON.stringify(wishlist));
        updateWishlistCount();
        alert(`${name} added to wishlist!`);
    } else {
        alert(`${name} is already in wishlist`);
    }
});


    // ==============================
    // CART PAGE - RENDER CART
    // ==============================
    if ($('#cartItems').length) {
        function renderCart() {
            let total = 0;
            $('#cartItems').empty();
            cart.forEach((item, index) => {
                total += parseFloat(item.price);
                $('#cartItems').append(`
                    <tr>
                        <td>${item.name}</td>
                        <td>Rs ${item.price}</td>
                        <td>
                            <button class="btn btn-sm btn-danger remove-item" data-index="${index}">
                                <i class="fa fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                `);
            });
            $('#totalPrice').text(total);
        }

        renderCart();

        // REMOVE SINGLE ITEM
        $(document).on('click', '.remove-item', function () {
            const index = $(this).data('index');
            cart.splice(index, 1);
            localStorage.setItem("cart", JSON.stringify(cart));
            renderCart();
            updateCartCount();
            showToast("Item removed from cart");
        });

        // CLEAR CART
        $(document).on('click', '#clearCart', function () {
            if (cart.length === 0) {
                alert("Cart is already empty");
                return;
            }
            if (confirm("Are you sure you want to clear the cart?")) {
                cart = [];
                localStorage.setItem("cart", JSON.stringify(cart));
                renderCart();
                updateCartCount();
                showToast("Cart cleared!");
            }
        });
       
        // ORDER ALL ITEMS
        $(document).on('click', '#orderAll', function () {
            if (cart.length === 0) {
                alert("Your cart is empty");
                return;
            }

            let message = "Hello Nan Hub,%0A%0AI would like to order:%0A";
            let total = 0;

            cart.forEach((item, i) => {
                message += `${i + 1}. ${item.name} - Rs ${item.price}%0A`;
                total += item.price;
            });

            message += `%0A*Total: Rs ${total}*`;
            let phoneNumber = "97431139653";
            window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
        });
    }
});