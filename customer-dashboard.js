// ============================
// CUSTOMER LOGIN CHECK
// ============================
if (localStorage.getItem("customerLoggedIn") !== "true") {
  window.location.href = "login.html";
}

const email =
  localStorage.getItem("currentCustomerEmail") || "Customer";

document.getElementById("customerEmailDisplay").textContent = email;

const ordersContainer = document.getElementById("customerOrdersContainer");

// ============================
// LOAD ORDERS FOR THIS CUSTOMER
// ============================
const allOrders = JSON.parse(localStorage.getItem("orders")) || [];
const myOrders = allOrders.filter(
  (o) => o.customerEmail === email
);

if (myOrders.length === 0) {
  ordersContainer.innerHTML = "<p>No orders yet.</p>";
} else {
  ordersContainer.innerHTML = "";

  myOrders.forEach((o) => {
    const div = document.createElement("div");
    div.className = "customer-order-card";

    div.innerHTML = `
      <p><b>Order ID:</b> ${o.id}</p>
      <p><b>Date:</b> ${o.date}</p>
      <p><b>Total:</b> $${o.total}</p>
      <p><b>Items:</b></p>
      <ul>
        ${o.items
          .map(
            (item) =>
              `<li>${item.name} (x${item.qty}) - $${item.price}</li>`
          )
          .join("")}
      </ul>
      <hr>
    `;

    ordersContainer.appendChild(div);
  });
}

// ============================
// LOGOUT
// ============================
document
  .getElementById("customerDashLogoutBtn")
  .addEventListener("click", function () {
    localStorage.removeItem("customerLoggedIn");
    localStorage.removeItem("currentCustomerEmail");
    window.location.href = "login.html";
  });
