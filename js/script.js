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

  /* ===============================
     ISOTOPE FILTER (COLLECTION)
  =============================== */
  var $grid = $('.collection-list').isotope({
    itemSelector: '.col-6',
    layoutMode: 'fitRows'
  });

  $('.filter-button-group').on('click', 'button', function () {
    var filterValue = $(this).attr('data-filter');
    $('.filter-button-group button').removeClass('active-filter-btn');
    $(this).addClass('active-filter-btn');
    $grid.isotope({ filter: filterValue });
  });

  /* ===============================
     CART SYSTEM
  =============================== */
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  function updateCartCount() {
    let count = cart.length;
    $('.fa-shopping-cart').siblings('.badge').text(count);
  }

  updateCartCount();

  $('.add-to-cart').on('click', function () {
    let name = $(this).data('name');
    let price = $(this).data('price');

    cart.push({ name, price });
    localStorage.setItem("cart", JSON.stringify(cart));

    updateCartCount();
    alert(name + " added to cart");
  });

  /* ===============================
     WHATSAPP ORDER (SINGLE PRODUCT)
  =============================== */
  $('.order-item').on('click', function () {
    let name = $(this).data('name');
    let price = $(this).data('price');

    let phone = "+97431139653"; // Qatar number (NO + sign)
    let message =
      `Hello Nan Hub,%0A%0AI want to order:%0A` +
      `Product: ${name}%0A` +
      `Price: Rs ${price}`;

    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  });

});

  $('#searchInput').on('keyup', function (e) {
    if (e.key === "Enter") {
      let q = $(this).val().toLowerCase();

      if (q.includes("skirt")) location.href = "#collection";
      else if (q.includes("jeans")) location.href = "#collection";
      else if (q.includes("crochet")) location.href = "crochet.html";
      else alert("No product found");
    }
});
