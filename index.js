// ============================
// PRODUCTS FROM STORAGE
// ============================
let products = [];

// ============================
// LOGIN STATE
// ============================
const isCustomerLoggedIn = localStorage.getItem("customerLoggedIn") === "true";

// ============================
// FILTER / SEARCH STATE
// ============================
let currentFilter = "all";
let currentSearch = "";

// ============================
// ELEMENTS
// ============================
const productContainer = document.getElementById("productContainer");

const modalOverlay = document.getElementById("modalOverlay");
const productModal = document.getElementById("productModal");
const modalImage = document.getElementById("modalImage");
const modalTitle = document.getElementById("modalTitle");
const modalDesc = document.getElementById("modalDesc");
const modalPrice = document.getElementById("modalPrice");
const closeModalBtn = document.getElementById("closeModalBtn");
const dotsContainer = document.getElementById("dotsContainer");

const cartBtn = document.getElementById("openCartBtn");
const cartSidebar = document.getElementById("cartSidebar");
const cartOverlay = document.getElementById("cartOverlay");
const closeCartBtn = document.getElementById("closeCartBtn");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const cartCount = document.getElementById("cartCount");
const clearCartBtn = document.getElementById("clearCartBtn");

const checkoutBtn = document.getElementById("checkoutBtn");
const checkoutModal = document.getElementById("checkoutModal");
const checkoutOverlay = document.getElementById("checkoutOverlay");
const closeCheckoutBtn = document.getElementById("closeCheckoutBtn");
const checkoutForm = document.getElementById("checkoutForm");
const checkoutMsg = document.getElementById("checkoutMsg");
const successMsg = document.getElementById("successMsg");

const loginLink = document.querySelector('a[href="login.html"]');
const registerLink = document.querySelector('a[href="register.html"]');
const logoutBtn = document.getElementById("customerLogoutBtn");
const accountLink = document.getElementById("accountLink");

const modalAddToCartBtn = document.getElementById("modalAddToCartBtn");
const sizeSelect = document.getElementById("sizeSelect");
const colorSelect = document.getElementById("colorSelect");

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const sortSelect = document.getElementById("sortSelect");
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

const reviewContainer = document.getElementById("reviewContainer");
const reviewName = document.getElementById("reviewName");
const reviewText = document.getElementById("reviewText");
const reviewMsg = document.getElementById("reviewMsg");

const newsletterEmail = document.getElementById("newsletterEmail");
const subscribeBtn = document.getElementById("subscribeBtn");
const newsletterMsg = document.getElementById("newsletterMsg");

// ============================
// LOGIN UI
// ============================
if (isCustomerLoggedIn) {
  if (loginLink) loginLink.style.display = "none";
  if (registerLink) registerLink.style.display = "none";
  if (logoutBtn) logoutBtn.style.display = "inline-block";
  if (accountLink) accountLink.style.display = "inline-block";
} else {
  if (logoutBtn) logoutBtn.style.display = "none";
  if (accountLink) accountLink.style.display = "none";
}

logoutBtn?.addEventListener("click", (e) => {
  e.preventDefault();
  localStorage.removeItem("customerLoggedIn");
  localStorage.removeItem("currentCustomerEmail");
  location.reload();
});

// ============================
// CART STATE
// ============================
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// ============================
// MODAL STATE
// ============================
let currentProduct = null;
let currentIndex = 0;

// ============================
// GET IMAGES
// ============================
function getImages(p) {
  return p.images?.length ? p.images : ["placeholder.jpg"];
}

// ============================
// FILTER + SORT LIST
// ============================
function getFilteredSortedList() {
  let list = [...products];

  const q = currentSearch.trim().toLowerCase();
  if (q) {
    list = list.filter((p) => p.name.toLowerCase().includes(q));
  }

  if (currentFilter !== "all") {
    list = list.filter((p) => p.category === currentFilter);
  }

  const sortVal = sortSelect?.value || "default";
  if (sortVal === "low-high") {
    list.sort((a, b) => a.price - b.price);
  } else if (sortVal === "high-low") {
    list.sort((a, b) => b.price - a.price);
  }

  return list;
}

function setFilterButtonsActive() {
  document.querySelectorAll(".products .filter-btn").forEach((btn) => {
    const on = btn.dataset.filter === currentFilter;
    btn.classList.toggle("active", on);
    btn.setAttribute("aria-pressed", on ? "true" : "false");
  });
}

function refreshProductGrid() {
  setFilterButtonsActive();
  const list = getFilteredSortedList();
  const countEl = document.getElementById("productCountLabel");
  if (countEl) {
    const n = list.length;
    countEl.textContent =
      n === 0 ? "" : `Showing ${n} product${n === 1 ? "" : "s"}`;
  }
  renderProducts(list);
}

// ============================
// OPEN CATEGORY (FEATURE CARDS)
// ============================
function openCategory(cat) {
  currentFilter = cat;
  document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
  refreshProductGrid();
}

window.openCategory = openCategory;

// ============================
// SEARCH
// ============================
function runSearch() {
  currentSearch = searchInput?.value || "";
  refreshProductGrid();
}

searchBtn?.addEventListener("click", runSearch);
searchInput?.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    runSearch();
  }
});

// ============================
// FILTER BUTTONS
// ============================
document.querySelector(".products")?.addEventListener("click", (e) => {
  const btn = e.target.closest(".filter-btn");
  if (!btn) return;
  currentFilter = btn.dataset.filter || "all";
  refreshProductGrid();
});

sortSelect?.addEventListener("change", refreshProductGrid);

// ============================
// MOBILE MENU
// ============================
menuBtn?.addEventListener("click", () => {
  navLinks?.classList.toggle("nav-open");
});

navLinks?.addEventListener("click", (e) => {
  if (e.target.closest("a")) {
    navLinks.classList.remove("nav-open");
  }
});

// ============================
// REVIEWS
// ============================
function escapeHtml(str) {
  if (str == null) return "";
  const d = document.createElement("div");
  d.textContent = String(str);
  return d.innerHTML;
}

function reviewInitials(name) {
  const parts = String(name || "X")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (!parts.length) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function loadReviews() {
  try {
    return JSON.parse(localStorage.getItem("reviews")) || [];
  } catch {
    return [];
  }
}

function renderReviews() {
  if (!reviewContainer) return;

  const reviews = loadReviews();
  reviewContainer.innerHTML = "";

  if (reviews.length === 0) {
    reviewContainer.innerHTML = `
      <div class="reviews-empty" role="status">
        <p class="reviews-empty-title">No reviews yet</p>
        <p class="reviews-empty-hint">
          Be the first to tell others what you think—use the form on the side, or below on your phone.
        </p>
      </div>
    `;
    return;
  }

  reviews.forEach((r) => {
    const div = document.createElement("article");
    div.className = "review-card";

    const safeName = escapeHtml(r.name || "Anonymous");
    const safeText = escapeHtml(r.text || "");
    const safeDate = escapeHtml(r.date || "");
    const initials = escapeHtml(reviewInitials(r.name || "Anonymous"));

    div.innerHTML = `
      <div class="review-card-header">
        <div class="review-avatar" aria-hidden="true">${initials}</div>
        <div class="review-meta">
          <span class="review-author">${safeName}</span>
          <span class="review-date">${safeDate}</span>
        </div>
      </div>
      <blockquote class="review-body">${safeText}</blockquote>
    `;
    reviewContainer.appendChild(div);
  });
}

const reviewForm = document.getElementById("reviewForm");

reviewForm?.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = reviewName?.value.trim() || "Anonymous";
  const text = reviewText?.value.trim();

  if (reviewMsg) {
    reviewMsg.textContent = "";
    reviewMsg.className = "review-msg";
  }

  if (!text) {
    if (reviewMsg) {
      reviewMsg.classList.add("is-error");
      reviewMsg.textContent = "Please write your review before posting.";
    }
    reviewText?.focus();
    return;
  }

  if (text.length < 10) {
    if (reviewMsg) {
      reviewMsg.classList.add("is-error");
      reviewMsg.textContent = "Add a little more detail (at least 10 characters).";
    }
    reviewText?.focus();
    return;
  }

  const reviews = loadReviews();
  reviews.push({
    name,
    text,
    date: new Date().toLocaleString(),
  });
  localStorage.setItem("reviews", JSON.stringify(reviews));

  if (reviewMsg) {
    reviewMsg.classList.add("is-success");
    reviewMsg.textContent = "Thanks—your review is live.";
  }
  if (reviewName) reviewName.value = "";
  if (reviewText) reviewText.value = "";
  renderReviews();
});

// ============================
// NEWSLETTER
// ============================
subscribeBtn?.addEventListener("click", () => {
  const email = newsletterEmail?.value.trim() || "";

  if (!email || !email.includes("@")) {
    if (newsletterMsg) {
      newsletterMsg.style.color = "red";
      newsletterMsg.textContent = "Please enter a valid email.";
    }
    return;
  }

  let list = [];
  try {
    list = JSON.parse(localStorage.getItem("newsletterEmails")) || [];
  } catch {
    list = [];
  }
  if (!list.includes(email)) {
    list.push(email);
    localStorage.setItem("newsletterEmails", JSON.stringify(list));
  }

  if (newsletterMsg) {
    newsletterMsg.style.color = "green";
    newsletterMsg.textContent = "You are subscribed. Thank you!";
  }
  newsletterEmail.value = "";
});

// ============================
// RENDER PRODUCTS
// ============================
function renderProducts(list) {
  productContainer.innerHTML = "";

  if (!list.length) {
    const emptyTitle =
      products.length === 0
        ? "No products yet"
        : "Nothing matches";
    const emptyHint =
      products.length === 0
        ? "New styles will appear here soon."
        : "Try another category or clear your search.";
    productContainer.innerHTML = `
      <div class="product-empty" role="status">
        <p class="product-empty-title">${emptyTitle}</p>
        <p class="product-empty-hint">${emptyHint}</p>
      </div>
    `;
    return;
  }

  list.forEach((p) => {
    const imgFile = getImages(p)[0];

    const card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML = `
      <img alt="" data-id="${p.id}" loading="lazy">
      <h4>${p.name}</h4>
      <p class="price">$${p.price}</p>

      <button class="buy-btn" data-id="${p.id}">
        ${isCustomerLoggedIn ? "Buy Now" : "Login to Buy"}
      </button>
    `;

    productContainer.appendChild(card);

    const imgEl = card.querySelector("img");
    bindProductImage(imgEl, imgFile);
  });

  productContainer.querySelectorAll("img").forEach((img) => {
    img.onclick = () => openModal(+img.dataset.id);
  });

  productContainer.onclick = function (e) {
    const btn = e.target.closest(".buy-btn");
    if (!btn) return;

    const id = +btn.dataset.id;

    if (!isCustomerLoggedIn) {
      alert("Please login first!");
      window.location.href = "login.html";
      return;
    }

    openModal(id);
  };
}

// ============================
// MODAL OPEN
// ============================
function openModal(id) {
  currentProduct = products.find((p) => p.id === id);
  if (!currentProduct) return;

  currentIndex = 0;

  modalOverlay.style.display = "block";
  productModal.style.display = "block";

  updateModal();
  createDots();
}

function updateModal() {
  const imgs = getImages(currentProduct);

  bindProductImage(modalImage, imgs[currentIndex]);
  modalTitle.textContent = currentProduct.name;
  modalDesc.textContent = currentProduct.desc;
  modalPrice.textContent = "$" + currentProduct.price;

  updateDots();
}

// ============================
// DOTS
// ============================
function createDots() {
  dotsContainer.innerHTML = "";

  getImages(currentProduct).forEach((_, i) => {
    const dot = document.createElement("span");
    dot.className = "dot";

    dot.onclick = () => {
      currentIndex = i;
      updateModal();
    };

    dotsContainer.appendChild(dot);
  });

  updateDots();
}

function updateDots() {
  const dots = dotsContainer.querySelectorAll(".dot");

  dots.forEach((d, i) => {
    d.classList.toggle("active", i === currentIndex);
  });
}

// ============================
// NEXT / PREV
// ============================
function nextImage() {
  const imgs = getImages(currentProduct);
  currentIndex = (currentIndex + 1) % imgs.length;
  updateModal();
}

function prevImage() {
  const imgs = getImages(currentProduct);
  currentIndex = (currentIndex - 1 + imgs.length) % imgs.length;
  updateModal();
}

let startX = 0;

modalImage?.addEventListener("touchstart", (e) => {
  startX = e.touches[0].clientX;
});

modalImage?.addEventListener("touchend", (e) => {
  const endX = e.changedTouches[0].clientX;

  if (startX - endX > 50) nextImage();
  if (endX - startX > 50) prevImage();
});

closeModalBtn?.addEventListener("click", closeModal);
modalOverlay?.addEventListener("click", closeModal);

function closeModal() {
  modalOverlay.style.display = "none";
  productModal.style.display = "none";
}

modalAddToCartBtn?.addEventListener("click", () => {
  if (!currentProduct) return;

  if (!isCustomerLoggedIn) {
    alert("Please login first!");
    window.location.href = "login.html";
    return;
  }

  const item = {
    ...currentProduct,
    size: sizeSelect.value,
    color: colorSelect.value,
  };

  const exist = cart.find(
    (i) =>
      i.id === item.id && i.size === item.size && i.color === item.color
  );

  if (exist) {
    exist.qty++;
  } else {
    cart.push({ ...item, qty: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCart();

  alert("Added to cart ✔");
});

// ============================
// CART
// ============================
function updateCart() {
  if (!cartItems || !cartCount || !cartTotal) return;

  cartItems.innerHTML = "";

  let total = 0;
  let count = 0;

  cart.forEach((i) => {
    total += i.price * i.qty;
    count += i.qty;

    const div = document.createElement("div");
    div.className = "cart-item";

    div.innerHTML = `
      <b>${i.name}</b>
      <small>${i.qty} × $${i.price}</small>
      <small>Size: ${i.size || "-"}</small>
      <small>Color: ${i.color || "-"}</small>
    `;

    cartItems.appendChild(div);
  });

  cartCount.textContent = count;
  cartTotal.textContent = "$" + total;
}

// ============================
// CART EVENTS
// ============================
cartBtn?.addEventListener("click", () => {
  cartSidebar.style.right = "0";
  cartOverlay.style.display = "block";
});

function closeCart() {
  cartSidebar.style.right = "-400px";
  cartOverlay.style.display = "none";
}

closeCartBtn?.addEventListener("click", closeCart);
cartOverlay?.addEventListener("click", closeCart);

clearCartBtn?.addEventListener("click", () => {
  cart = [];
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCart();
});

// ============================
// CHECKOUT
// ============================
checkoutBtn?.addEventListener("click", () => {
  if (!isCustomerLoggedIn) {
    alert("Login first!");
    return;
  }

  if (cart.length === 0) {
    alert("Cart is empty!");
    return;
  }

  if (checkoutMsg) {
    checkoutMsg.textContent = "";
    checkoutMsg.className = "checkout-msg";
  }
  if (successMsg) {
    successMsg.textContent = "";
  }

  checkoutModal.style.display = "block";
  checkoutOverlay.style.display = "block";
});

function closeCheckout() {
  checkoutModal.style.display = "none";
  checkoutOverlay.style.display = "none";
}

closeCheckoutBtn?.addEventListener("click", closeCheckout);
checkoutOverlay?.addEventListener("click", closeCheckout);

checkoutForm?.addEventListener("submit", (e) => {
  e.preventDefault();

  const fullName = document.getElementById("fullName").value.trim();
  const address = document.getElementById("address").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const paymentMethod = document.getElementById("paymentMethod").value;

  if (checkoutMsg) {
    checkoutMsg.textContent = "";
    checkoutMsg.className = "checkout-msg";
  }
  if (successMsg) {
    successMsg.textContent = "";
  }

  if (!fullName || fullName.length < 3) {
    if (checkoutMsg) {
      checkoutMsg.classList.add("is-error");
      checkoutMsg.textContent = "Please enter your full name.";
    }
    document.getElementById("fullName")?.focus();
    return;
  }

  if (!address || address.length < 6) {
    if (checkoutMsg) {
      checkoutMsg.classList.add("is-error");
      checkoutMsg.textContent = "Please enter a clear delivery address.";
    }
    document.getElementById("address")?.focus();
    return;
  }

  const phoneDigits = phone.replace(/\D/g, "");
  if (phoneDigits.length < 9) {
    if (checkoutMsg) {
      checkoutMsg.classList.add("is-error");
      checkoutMsg.textContent = "Please enter a valid phone number.";
    }
    document.getElementById("phone")?.focus();
    return;
  }

  if (!paymentMethod) {
    if (checkoutMsg) {
      checkoutMsg.classList.add("is-error");
      checkoutMsg.textContent = "Please select a payment method.";
    }
    document.getElementById("paymentMethod")?.focus();
    return;
  }

  let orderTotal = 0;
  cart.forEach((i) => {
    orderTotal += i.price * i.qty;
  });

  const order = {
    id: Date.now(),
    date: new Date().toLocaleString(),
    customerName: fullName,
    customerEmail: localStorage.getItem("currentCustomerEmail") || "",
    phone,
    address,
    paymentMethod,
    total: orderTotal,
    items: cart.map((i) => ({
      name: i.name,
      qty: i.qty,
      price: i.price,
    })),
  };

  let orders = [];
  try {
    orders = JSON.parse(localStorage.getItem("orders")) || [];
  } catch {
    orders = [];
  }
  orders.push(order);
  localStorage.setItem("orders", JSON.stringify(orders));

  if (checkoutMsg) {
    checkoutMsg.classList.add("is-success");
    checkoutMsg.textContent = "Details confirmed. Placing order...";
  }
  successMsg.textContent = "Order placed successfully ✔";

  cart = [];
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCart();

  setTimeout(() => {
    closeCheckout();
    checkoutForm.reset();
    successMsg.textContent = "";
  }, 2000);
});

// ============================
// INIT
// ============================
products = loadAndPersistStoreCatalog();
refreshProductGrid();
updateCart();
renderReviews();
