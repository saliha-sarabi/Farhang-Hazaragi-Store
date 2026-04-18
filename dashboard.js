// ===========================
// ADMIN LOGIN CHECK
// ===========================
if (localStorage.getItem("adminLoggedIn") !== "true") {
  window.location.href = "login.html";
}

document.getElementById("adminName").textContent =
  localStorage.getItem("adminName") || "Admin";

// ===========================
// PRODUCTS (shared loader + migration)
// ===========================
let products = loadAndPersistStoreCatalog();

// ===========================
// ELEMENTS
// ===========================
const productForm = document.getElementById("productForm");
const productsContainer = document.getElementById("productsContainer");
const ordersContainer = document.getElementById("ordersContainer");
const productMsg = document.getElementById("productMsg");
const sidebarLinks = Array.from(document.querySelectorAll('.sidebar a[href^="#"]'));

const totalProducts = document.getElementById("totalProducts");
const totalOrders = document.getElementById("totalOrders");
const totalRevenue = document.getElementById("totalRevenue");

// ===========================
// LOAD DATA
// ===========================
let orders = JSON.parse(localStorage.getItem("orders")) || [];

// ===========================
// SIDEBAR ACTIVE LINK
// ===========================
function setActiveSidebarLink(targetId) {
  sidebarLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === `#${targetId}`;
    link.classList.toggle("active", isActive);
  });
}

function setupSidebarActiveTracking() {
  if (!sidebarLinks.length) return;

  const sectionIds = ["dashboard-home", "products", "orders"];
  const sections = sectionIds
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  sidebarLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const hash = link.getAttribute("href");
      if (!hash || hash === "#") return;
      setActiveSidebarLink(hash.replace("#", ""));
    });
  });

  const observer = new IntersectionObserver(
    (entries) => {
      const visibleSections = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

      if (visibleSections.length > 0) {
        setActiveSidebarLink(visibleSections[0].target.id);
      } else if (window.scrollY < 120) {
        setActiveSidebarLink("dashboard-home");
      }
    },
    {
      root: null,
      threshold: [0.2, 0.45, 0.7],
      rootMargin: "-20% 0px -45% 0px"
    }
  );

  sections.forEach((section) => observer.observe(section));

  const initialHash = window.location.hash.replace("#", "");
  if (sectionIds.includes(initialHash)) {
    setActiveSidebarLink(initialHash);
  } else {
    setActiveSidebarLink("dashboard-home");
  }
}

// ===========================
// RENDER PRODUCTS
// ===========================
function renderProducts() {
  productsContainer.innerHTML = "";

  products.forEach((p) => {
    const div = document.createElement("div");
    div.classList.add("product-card");

    div.innerHTML = `
      <div style="display:flex; gap:10px; align-items:center;">
        <img alt="${p.name}">
        <div>
          <p><b>${p.name}</b></p>
          <p>$${p.price} | ${p.category}</p>
        </div>
      </div>
      <button onclick="deleteProduct(${p.id})">Delete</button>
    `;

    productsContainer.appendChild(div);

    const imgEl = div.querySelector("img");
    bindProductImage(imgEl, p.images?.[0] || "placeholder.jpg");
  });

  totalProducts.textContent = products.length;
}

// ===========================
// DELETE PRODUCT
// ===========================
function deleteProduct(id) {
  products = products.filter((p) => p.id !== id);
  localStorage.setItem("products", JSON.stringify(products));
  renderProducts();
}

window.deleteProduct = deleteProduct;

// ===========================
// ADD PRODUCT
// ===========================
productForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("productName").value.trim();
  const price = parseFloat(document.getElementById("productPrice").value);
  const category = document.getElementById("productCategory").value.trim();
  const imgInput = document.getElementById("productImage").value.trim();
  const desc = document.getElementById("productDesc").value.trim();

  const images = imgInput.split(",").map(i => i.trim());

  const newProduct = {
    id: Date.now(),
    name,
    price,
    category,
    images,
    desc
  };

  products.push(newProduct);
  localStorage.setItem("products", JSON.stringify(products));

  productMsg.style.color = "green";
  productMsg.textContent = "✅ Product added successfully!";

  productForm.reset();
  renderProducts();
});

// ===========================
// RENDER ORDERS
// ===========================
function renderOrders() {
  ordersContainer.innerHTML = "";

  if (orders.length === 0) {
    ordersContainer.innerHTML = `
      <div class="orders-empty">
        <h3>No orders yet</h3>
        <p>Orders placed by customers will appear here.</p>
      </div>
    `;
    totalOrders.textContent = "0";
    totalRevenue.textContent = "$0";
    return;
  }

  let revenue = 0;

  orders.forEach((o) => {
    revenue += o.total;
    const orderItems = Array.isArray(o.items) ? o.items : [];
    const itemsCount = orderItems.reduce((count, item) => count + (item.qty || 0), 0);

    const div = document.createElement("div");
    div.classList.add("order-card");

    div.innerHTML = `
      <div class="order-card-header">
        <div>
          <p class="order-id">Order #${o.id}</p>
          <p class="order-date">${o.date || "N/A"}</p>
        </div>
        <p class="order-total">$${Number(o.total || 0).toFixed(2)}</p>
      </div>

      <div class="order-meta">
        <span class="order-chip">${itemsCount} item${itemsCount === 1 ? "" : "s"}</span>
        <span class="order-chip order-chip--payment">${o.paymentMethod || "Unknown payment"}</span>
      </div>

      <div class="order-details">
        <p><b>Customer:</b> ${o.customerName || "N/A"}</p>
        <p><b>Phone:</b> ${o.phone || "N/A"}</p>
        <p><b>Address:</b> ${o.address || "N/A"}</p>
      </div>

      <div class="order-items-wrap">
        <p class="order-items-title">Items</p>
        <ul class="order-items-list">
          ${orderItems.map((item) => `<li><span>${item.name}</span><span>x${item.qty} • $${item.price}</span></li>`).join("")}
        </ul>
      </div>
    `;

    ordersContainer.appendChild(div);
  });

  totalOrders.textContent = orders.length;
  totalRevenue.textContent = "$" + revenue.toFixed(2);
}

// ===========================
// LOGOUT
// ===========================
document.getElementById("logoutBtn").addEventListener("click", function () {
  localStorage.removeItem("adminLoggedIn");
  localStorage.removeItem("adminName");
  window.location.href = "login.html";
});

// ===========================
// INIT
// ===========================
renderProducts();
renderOrders();
setupSidebarActiveTracking();