// ===========================
// ADMIN LOGIN CHECK
// ===========================
if (localStorage.getItem("adminLoggedIn") !== "true") {
  window.location.href = "login.html";
}

document.getElementById("adminName").textContent =
  localStorage.getItem("adminName") || "Admin";

// ===========================
// DEFAULT PRODUCTS (IF EMPTY)
// ===========================
const defaultProducts = [
  { id: 1, name: "Women Dress", price: 35, category: "women", images: ["IMG_1025.jpg"], desc: "Elegant handmade women dress." },
  { id: 2, name: "Hand Craft Trouser", price: 50, category: "women", images: ["IMG_1131.PNG"], desc: "Traditional handmade trouser." },
  { id: 3, name: "Men Hat", price: 30, category: "men", images: ["IMG_1168.PNG"], desc: "Traditional hat for men." }
];

if (!localStorage.getItem("products")) {
  localStorage.setItem("products", JSON.stringify(defaultProducts));
}

// ===========================
// ELEMENTS
// ===========================
const productForm = document.getElementById("productForm");
const productsContainer = document.getElementById("productsContainer");
const ordersContainer = document.getElementById("ordersContainer");
const productMsg = document.getElementById("productMsg");

const totalProducts = document.getElementById("totalProducts");
const totalOrders = document.getElementById("totalOrders");
const totalRevenue = document.getElementById("totalRevenue");

// ===========================
// LOAD DATA
// ===========================
let products = JSON.parse(localStorage.getItem("products")) || [];
let orders = JSON.parse(localStorage.getItem("orders")) || [];

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
        <img src="${p.images?.[0] || "placeholder.jpg"}" alt="${p.name}">
        <div>
          <p><b>${p.name}</b></p>
          <p>$${p.price} | ${p.category}</p>
        </div>
      </div>
      <button onclick="deleteProduct(${p.id})">Delete</button>
    `;

    productsContainer.appendChild(div);
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
    ordersContainer.innerHTML = "<p>No orders yet.</p>";
    totalOrders.textContent = "0";
    totalRevenue.textContent = "$0";
    return;
  }

  let revenue = 0;

  orders.forEach((o) => {
    revenue += o.total;

    const div = document.createElement("div");
    div.classList.add("order-card");

    div.innerHTML = `
      <p><b>Order ID:</b> ${o.id}</p>
      <p><b>Date:</b> ${o.date}</p>
      <p><b>Customer:</b> ${o.customerName}</p>
      <p><b>Phone:</b> ${o.phone}</p>
      <p><b>Address:</b> ${o.address}</p>
      <p><b>Payment:</b> ${o.paymentMethod}</p>
      <p><b>Total:</b> $${o.total}</p>

      <p><b>Items:</b></p>
      <ul>
        ${o.items.map(item => `<li>${item.name} (x${item.qty}) - $${item.price}</li>`).join("")}
      </ul>

      <hr>
    `;

    ordersContainer.appendChild(div);
  });

  totalOrders.textContent = orders.length;
  totalRevenue.textContent = "$" + revenue;
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