// ============================
// PRODUCTS DATA
// ============================
const products = [
 { id: 1, name: "Banaras Dress", price: 35, category: "women", images: ["IMG_1025.jpg", "IMG_1298.jpg", "IMG_1299.jpg"], desc: "Stylish Banaras Dress" },
   { id: 2, name: "Hazaragi Dress", price: 50, category: "women", images: ["IMG_1131.PNG", "IMG_1132.PNG", "IMG_1133.PNG"], desc: "Elegant Handmade Women Hazaragi dress" },
   { id: 3, name: "Hazaragi Couple Dress", price: 28, category: "couple", images: ["IMG_1219.PNG", "IMG_1220.PNG"], desc: "Beautiful Couple Dress" },
   { id: 4, name: "Hazaragi Accessory", price: 25, category: "accessory", images: ["IMG_1224.PNG", "IMG_1194.PNG", "IMG_1225.PNG"], desc: "Classic Hazaragi Accessory" },
   { id: 5, name: "Afghani Gand", price: 45, category: "women", images: ["IMG_1070.PNG", "IMG_1071.PNG", "IMG_1072.PNG"], desc: "Traditional Afghan Dress" },
   { id: 6, name: "Traditional Thredwork Attire", price: 30, category: "women", images: ["IMG_1168.PNG", "IMG_1169.PNG", "IMG_1170.PNG"], desc: "Traditional handmade Dress" },
   { id: 7, name: "Men's Cloth", price: 60, category: "men", images: ["IMG_1274.PNG", "IMG_1275.PNG", "IMG_1276.PNG", "IMG_1278.PNG", "IMG_1279.PNG"], desc: "Traditional men's Attire" },
   { id: 8, name: "Hand Craft Trouser", price: 55, category: "women", images: ["IMG_1285.PNG", "IMG_1286.PNG", "IMG_1287.PNG", "IMG_1288.PNG", "IMG_1289.PNG", "IMG_1290.PNG"], desc: "Handmade trouser" },
   { id: 9, name: "Afghani Accessory", price: 40, category: "accessory", images: ["IMG_1179.PNG", "IMG_1180.PNG", "IMG_1181.PNG", "IMG_1182.PNG", "IMG_1183.PNG"], desc: "Classic Afghani Accessory" },
   { id: 10, name: "New Hazaragi Accessory", price: 20, category: "accessory", images: ["IMG_1228.PNG", "IMG_1230.PNG", "IMG_1192.PNG", "IMG_1231.PNG"], desc: "New Design Hazaragi Accessory" },
   { id: 11, name: "Casual Outfit", price: 22, category: "women", images: ["IMG_1264.PNG", "IMG_1266.PNG", "IMG_1271.PNG", "IMG_1273.PNG"], desc: "Comfortable Outfit" },
   { id: 12, name: "Child", price: 30, category: "women", images: ["IMG_1212.PNG", "IMG_1213.PNG", "IMG_1255.PNG", "IMG_1261.PNG"], desc: "Beautiful handmade Child' Dress" },
];

// ============================
// LOGIN STATE
// ============================
const isCustomerLoggedIn = localStorage.getItem("customerLoggedIn") === "true";

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
const successMsg = document.getElementById("successMsg");

const loginLink = document.querySelector('a[href="login.html"]');
const registerLink = document.querySelector('a[href="register.html"]');
const logoutBtn = document.getElementById("customerLogoutBtn");

const modalAddToCartBtn = document.getElementById("modalAddToCartBtn");
const sizeSelect = document.getElementById("sizeSelect");
const colorSelect = document.getElementById("colorSelect");

// ============================
// LOGIN UI FIX
// ============================
if (isCustomerLoggedIn) {
  if (loginLink) loginLink.style.display = "none";
  if (registerLink) registerLink.style.display = "none";
  if (logoutBtn) logoutBtn.style.display = "inline-block";
} else {
  if (logoutBtn) logoutBtn.style.display = "none";
}

logoutBtn?.addEventListener("click", () => {
  localStorage.removeItem("customerLoggedIn");
  location.reload();
});

// ============================
// CART STATE
// ============================
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// ============================
// MODAL STATE (RESTORED)
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
// RENDER PRODUCTS (MODAL CLICK RESTORED)
// ============================
function renderProducts(list) {
  productContainer.innerHTML = "";

  list.forEach((p) => {
    const img = getImages(p)[0];

    const card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML = `
      <img src="${img}" data-id="${p.id}">
      <h4>${p.name}</h4>
      <p class="price">$${p.price}</p>

      <button class="buy-btn" data-id="${p.id}">
        ${isCustomerLoggedIn ? "Buy Now" : "Login to Buy"}
      </button>
    `;

    productContainer.appendChild(card);
  });

  // ✅ OPEN MODAL ON IMAGE CLICK (RESTORED)
  productContainer.querySelectorAll("img").forEach(img => {
    img.onclick = () => openModal(+img.dataset.id);
  });

  // BUY BUTTON
  productContainer.onclick = function (e) {
    const btn = e.target.closest(".buy-btn");
    if (!btn) return;

    const id = +btn.dataset.id;

    if (!isCustomerLoggedIn) {
      alert("Please login first!");
      window.location.href = "login.html";
      return;
    }

    addToCart(id);
  };
}

// ============================
// MODAL OPEN (RESTORED)
// ============================
function openModal(id) {
  currentProduct = products.find(p => p.id === id);
  if (!currentProduct) return;

  currentIndex = 0;

  modalOverlay.style.display = "block";
  productModal.style.display = "block";

  updateModal();
  createDots();
}

function updateModal() {
  const imgs = getImages(currentProduct);

  modalImage.src = imgs[currentIndex];
  modalTitle.textContent = currentProduct.name;
  modalDesc.textContent = currentProduct.desc;
  modalPrice.textContent = "$" + currentProduct.price;

  updateDots();
}

// ============================
// DOTS (RESTORED)
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
// NEXT / PREV (RESTORED)
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

// swipe
let startX = 0;

modalImage?.addEventListener("touchstart", e => {
  startX = e.touches[0].clientX;
});

modalImage?.addEventListener("touchend", e => {
  const endX = e.changedTouches[0].clientX;

  if (startX - endX > 50) nextImage();
  if (endX - startX > 50) prevImage();
});

// close modal
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
    color: colorSelect.value
  };

  const exist = cart.find(i =>
    i.id === item.id &&
    i.size === item.size &&
    i.color === item.color
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
// CART (FIXED)
// ============================
function addToCart(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;

  const exist = cart.find(i => i.id === id);

  if (exist) {
    exist.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));

  updateCart();

  // FIX: force UI refresh safety
  if (cartSidebar && cartOverlay) {
    cartSidebar.style.right = "0";
    cartOverlay.style.display = "block";
  }
}

function updateCart() {
  if (!cartItems || !cartCount || !cartTotal) return;

  cartItems.innerHTML = "";

  let total = 0;
  let count = 0;

  cart.forEach(i => {
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
// CART EVENTS (FIXED)
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

  checkoutModal.style.display = "block";
  checkoutOverlay.style.display = "block";
});

function closeCheckout() {
  checkoutModal.style.display = "none";
  checkoutOverlay.style.display = "none";
}

closeCheckoutBtn?.addEventListener("click", closeCheckout);
checkoutOverlay?.addEventListener("click", closeCheckout);

checkoutForm?.addEventListener("submit", e => {
  e.preventDefault();

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
renderProducts(products);
updateCart();