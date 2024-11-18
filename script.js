const productsContainer = document.getElementById("products");
const productDetailContainer = document.getElementById("product-detail");
const filterSelect = document.getElementById("filter");
const searchInput = document.getElementById("search");
const cartItemsContainer = document.getElementById("cart-items");
const cartView = document.getElementById("cart-view");
const cartCount = document.getElementById("cart-count");
const cartTotal = document.getElementById("cart-total");

let products = [];
let cart = [];

// Fetch products and categories
async function fetchProducts() {
  try {
    const response = await fetch("https://fakestoreapi.com/products");
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    products = await response.json();
    displayProducts(products);
    populateCategories(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    productsContainer.innerHTML = `<p>Failed to load products. Please try again later.</p>`;
  }
}

// Display products in a grid
function displayProducts(productsToDisplay) {
  productDetailContainer.style.display = "none";
  productsContainer.style.display = "grid";
  cartView.style.display = "none";
  productsContainer.innerHTML = productsToDisplay
    .map(
      (product) => `
      <div class="product-card" onclick="viewProduct(${product.id})">
        <img src="${product.image}" alt="${product.title}" />
        <h3>${product.title}</h3>
        <p>$${product.price}</p>
      </div>
    `
    )
    .join("");
}

// Populate category filter
function populateCategories(products) {
  const categories = Array.from(new Set(products.map((product) => product.category)));
  filterSelect.innerHTML = `<option value="">All Categories</option>`;
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    filterSelect.appendChild(option);
  });
}

// Search and filter products
function searchAndFilterProducts() {
  const searchText = searchInput.value.toLowerCase();
  const selectedCategory = filterSelect.value;
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.title.toLowerCase().includes(searchText) ||
      product.description.toLowerCase().includes(searchText);
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  displayProducts(filteredProducts);
}

// View product details
function viewProduct(productId) {
  const product = products.find((p) => p.id === productId);
  productsContainer.style.display = "none";
  productDetailContainer.style.display = "block";
  productDetailContainer.innerHTML = `
    <div>
      <img src="${product.image}" alt="${product.title}" />
      <h3>${product.title}</h3>
      <p>$${product.price}</p>
      <p>${product.description}</p>
      <button onclick="addToCart(${productId})">Add to Cart</button>
      <button onclick="displayProducts(products)">Back to Products</button>
    </div>
  `;
}

// Add product to cart
function addToCart(productId) {
  const product = products.find((p) => p.id === productId);
  cart.push(product);
  updateCart();
}

// Update cart
function updateCart() {
  cartCount.textContent = cart.length;
  cartItemsContainer.innerHTML = cart
    .map(
      (item, index) => `
      <div class="cart-item">
        <span>${item.title} - $${item.price}</span>
        <button onclick="removeFromCart(${index})">Remove</button>
      </div>
    `
    )
    .join("");
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  cartTotal.textContent = total.toFixed(2);
}

// Remove product from cart
function removeFromCart(index) {
  cart.splice(index, 1);
  updateCart();
}

// Toggle cart view
function toggleCartView() {
  const isCartVisible = cartView.style.display === "block";
  cartView.style.display = isCartVisible ? "none" : "block";
}

// Event listeners
filterSelect.addEventListener("change", searchAndFilterProducts);
searchInput.addEventListener("input", searchAndFilterProducts);

// Initialize app
fetchProducts();
