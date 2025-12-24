// init Isotope
var $grid = $('.collection-list').isotope({
  // options
});
// filter items on button click
$('.filter-button-group').on( 'click', 'button', function() {
  var filterValue = $(this).attr('data-filter');
  resetFilterBtns();
  $(this).addClass('active-filter-btn');
  $grid.isotope({ filter: filterValue });
});

var filterBtns = $('.filter-button-group').find('button');
function resetFilterBtns(){
  filterBtns.each(function(){
    $(this).removeClass('active-filter-btn');
  });
}
$(document).ready(function () {

    // When search option is clicked
    $('.search-option').on('click', function () {
        let targetPage = $(this).data('target');
        window.location.href = targetPage;
    });

    // When user presses Enter in search input
    $('#searchInput').on('keypress', function (e) {
        if (e.which === 13) { // Enter key
            let query = $(this).val().toLowerCase();

            if (query.includes('dress') || query.includes('crochet')) {
                window.location.href = 'crochet.html';
            } 
            else if (query.includes('tunics')) {
                window.location.href = 'tunics.html';
            } 
            else if (query.includes('croptop')) {
                window.location.href = 'croptop.html';
            } 
            else {
                alert('No matching products found');
            }
        }
    });

});
$(document).ready(function () {

    // Cart
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    function updateCartCount() {
        $('.fa-shopping-cart').next('.badge').text(cart.length);
    }

    updateCartCount();

    // Add to Cart
    $('.add-to-cart').on('click', function () {
        let name = $(this).data('name');
        let price = parseFloat($(this).data('price')); // ensure numeric

        cart.push({ name, price });
        localStorage.setItem("cart", JSON.stringify(cart));

        updateCartCount();
        alert(name + " added to cart");
    });

    // WhatsApp Order
    $('#whatsappOrder').on('click', function () {

        if (cart.length === 0) {
            alert("Your cart is empty");
            return;
        }

        let message = "Hello Nan Hub,%0A%0AI want to order:%0A";
        let total = 0;

        cart.forEach((item, index) => {
            message += `${index + 1}. ${item.name} - Rs ${item.price}%0A`;
            total += item.price;
        });

        message += `%0A*Total: Rs ${total}*`;

        let phoneNumber = "+97431139653"; // your WhatsApp number without +
        window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
    });

});
// Order button for single item
$('.order-item').on('click', function () {
    let name = $(this).data('name');
    let price = parseFloat($(this).data('price'));

    let message = `Hello Nan Hub,%0A%0AI want to order:%0A1. ${name} - Rs ${price}%0A%0A*Total: Rs ${price}*`;

    let phoneNumber = "+97431139653"; // your WhatsApp number
    let whatsappURL = `https://wa.me/${phoneNumber}?text=${message}`;

    window.open(whatsappURL, '_blank');
});