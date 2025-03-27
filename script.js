// 1. Add this to your existing DOM elements (put with other selectors)
const searchInput = document.querySelector('.search-bar input');
const productCards = document.querySelectorAll('.product-card');

// 2. Add this function (put with your other setup functions)
function setupSearch() {
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();
        
        productCards.forEach(card => {
            const cardContent = [
                card.querySelector('h3').textContent,       // Product name
                card.querySelector('p').textContent,        // Tagline (e.g., "Limited Edition")
                card.querySelector('.more-info').textContent // Description
            ].join(' ').toLowerCase();
            
            card.style.display = cardContent.includes(searchTerm) ? 'block' : 'none';
        });
    });
}

// 3. Add this to your init() function (inside the init function)
setupSearch();



document.addEventListener('DOMContentLoaded', function() {
  // State management
  const state = {
    cartItems: JSON.parse(localStorage.getItem('cartItems')) || [],
    products: [],
    currentProduct: null
  };

  // DOM elements
  const dom = {
    productCards: document.querySelectorAll('.product-card'),
    cartCount: document.querySelector('.cart-count'),
    notification: document.getElementById('cart-notification'),
    // Detail modal elements
    detailModal: document.getElementById('product-detail-modal'),
    detailImage: document.getElementById('detail-product-image'),
    detailTitle: document.getElementById('detail-product-title'),
    detailDescription: document.getElementById('detail-product-description'),
    detailPrice: document.getElementById('detail-product-price'),
    detailAddToCart: document.getElementById('detail-add-to-cart'),
    closeDetail: document.querySelector('.close-detail')
  };

  // Initialize app
  init();

  function init() {
    setupProducts();
    setupCart();
    setupProductDetails();
    updateCartCount();
  }

  function setupProducts() {
    state.products = Array.from(dom.productCards).map((card, index) => ({
      id: `product-${index + 1}`,
      title: card.querySelector('h3').textContent,
      price: card.querySelector('.price').textContent,
      description: card.querySelector('.more-info').textContent,
      image: card.querySelector('img').src
    }));
  }

  function setupProductDetails() {
    // Add click event to each product card
    dom.productCards.forEach((card, index) => {
      card.addEventListener('click', (e) => {
        // Don't open if clicking on cart button
        if (e.target.closest('.cart-btn')) return;
        
        state.currentProduct = state.products[index];
        openProductDetail(state.currentProduct);
      });
    });

    // Close modal handlers
    dom.closeDetail.addEventListener('click', closeProductDetail);
    dom.detailModal.addEventListener('click', (e) => {
      if (e.target === dom.detailModal) closeProductDetail();
    });

    // Add to cart from detail view
    dom.detailAddToCart.addEventListener('click', () => {
      if (state.currentProduct) {
        addToCart(state.currentProduct);
        showNotification(`${state.currentProduct.title} added to cart!`);
      }
    });
  }

  function openProductDetail(product) {
    dom.detailImage.src = product.image;
    dom.detailImage.alt = product.title;
    dom.detailTitle.textContent = product.title;
    dom.detailDescription.textContent = product.description;
    dom.detailPrice.textContent = product.price;
    dom.detailModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
  }

  function closeProductDetail() {
    dom.detailModal.style.display = 'none';
    document.body.style.overflow = '';
  }

  function setupCart() {
    document.querySelectorAll('.cart-btn').forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        const card = this.closest('.product-card');
        const index = Array.from(dom.productCards).indexOf(card);
        const product = state.products[index];
        
        addToCart(product);
        showNotification(`${product.title} added to cart!`);
        
        // Button animation
        this.classList.add('added-to-cart');
        setTimeout(() => this.classList.remove('added-to-cart'), 1000);
      });
    });
  }

  function addToCart(product) {
    const existingItem = state.cartItems.find(item => item.id === product.id);
    existingItem ? existingItem.quantity++ : state.cartItems.push({...product, quantity: 1});
    updateCartCount();
    localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
  }

  function updateCartCount() {
    const total = state.cartItems.reduce((sum, item) => sum + item.quantity, 0);
    dom.cartCount.textContent = total;
    dom.cartCount.parentElement.classList.add('bump');
    setTimeout(() => dom.cartCount.parentElement.classList.remove('bump'), 300);
  }

  function showNotification(message) {
    const notification = dom.notification;
    notification.querySelector('#notification-message').textContent = message;
    notification.classList.add('show');
    setTimeout(() => notification.classList.remove('show'), 3000);
  }
});

document.addEventListener('DOMContentLoaded', function() {
  // Get all product cards
  const productCards = document.querySelectorAll('.product-card');
  const detailModal = document.getElementById('product-detail-modal');
  
  // Add click event to each card
  productCards.forEach((card, index) => {
    card.addEventListener('click', function(event) {
      // Don't open if clicking directly on the cart button
      if (event.target.closest('.cart-btn')) return;
      
      // Get product data
      const product = {
        image: card.querySelector('img').src,
        title: card.querySelector('h3').textContent,
        price: card.querySelector('.price').textContent,
        description: card.querySelector('.more-info').textContent
      };
      
      // Show modal with product data
      showProductDetail(product);
    });
  });

  // Function to display product details
  function showProductDetail(product) {
    const modalContent = `
      <span class="close-detail">&times;</span>
      <div class="product-detail-content">
        <img src="${product.image}" alt="${product.title}" class="product-detail-image">
        <div class="product-detail-info">
          <h2>${product.title}</h2>
          <div class="price">${product.price}</div>
          <p>${product.description}</p>
          <button class="cart-btn detail-add-to-cart">
            <i class="fas fa-shopping-cart"></i> Add to Cart
          </button>
        </div>
      </div>
    `;
    
    detailModal.innerHTML = modalContent;
    detailModal.style.display = 'block';
    
    // Add event to close button
    detailModal.querySelector('.close-detail').addEventListener('click', () => {
      detailModal.style.display = 'none';
    });
    
    // Add event to modal background
    detailModal.addEventListener('click', (e) => {
      if (e.target === detailModal) {
        detailModal.style.display = 'none';
      }
    });
    
    // Add to cart functionality
    detailModal.querySelector('.detail-add-to-cart').addEventListener('click', function() {
      addToCart(product);
      this.textContent = 'Added!';
      setTimeout(() => {
        this.innerHTML = '<i class="fas fa-shopping-cart"></i> Add to Cart';
      }, 1000);
    });
  }

  // Your existing cart functions
  function addToCart(product) {
    // Your existing cart logic here
    console.log('Added to cart:', product.title);
    updateCartCount();
  }
  
  function updateCartCount() {
    // Your existing cart count update logic
  }
});



document.addEventListener('DOMContentLoaded', function() {
  // Reset cart storage
  localStorage.removeItem('cartItems');
  
  const appState = {
    cartItems: [], // Empty cart
    products: [] // Your products array
  };

  const elements = {
    productCards: document.querySelectorAll('.product-card'),
    cartCount: document.querySelector('.cart-count'),
    searchInput: document.querySelector('.search-bar input')
  };

  function init() {
    setupProducts();
    setupSearch();
    updateCartCount(); // Will show 0
  }

  function setupProducts() {
    // Your existing product setup code...
  }

  function setupSearch() {
    // Your existing search functionality...
  }

  function updateCartCount() {
    elements.cartCount.textContent = '0'; // Force 0 display
  }

  init();
});









// Add this to your existing DOM elements
const detailAddToCart = document.getElementById('detail-add-to-cart');
let currentProduct = null; // Track which product is being viewed

// Add this to your existing product card click handler
productCards.forEach((card, index) => {
  card.addEventListener('click', function(e) {
    if (e.target.closest('.cart-btn')) return;
    
    // Store the current product
    currentProduct = {
      id: `product-${index + 1}`,
      title: card.querySelector('h3').textContent,
      price: card.querySelector('.price').textContent,
      image: card.querySelector('img').src
    };
    
    // Open your modal here (you already have this part)
  });
});

// Add this new event listener for the modal's Add to Cart button
detailAddToCart.addEventListener('click', function() {
  if (currentProduct) {
    // Use your existing addToCart function
    addToCart(currentProduct);
    
    // Visual feedback
    this.textContent = 'Added!';
    setTimeout(() => {
      this.innerHTML = '<i class="fas fa-shopping-cart"></i> Add to Cart';
    }, 1000);
    
    // Update counter (if your addToCart doesn't already do this)
    updateCartCount();
  }
});

// Make sure these functions exist in your code:
// 1. addToCart(product) - Your existing cart addition function
// 2. updateCartCount() - Your existing counter update function


