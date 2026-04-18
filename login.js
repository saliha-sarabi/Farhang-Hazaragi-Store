const loginForm = document.getElementById("loginForm");
const loginMsg = document.getElementById("loginMsg");

const roleSelect = document.getElementById("role");
const emailInput = document.getElementById("email");
const usernameInput = document.getElementById("username");

// SWITCH INPUTS BASED ON ROLE
roleSelect.addEventListener("change", function () {
  const role = roleSelect.value;

  if (role === "admin") {
    usernameInput.style.display = "block";
    emailInput.style.display = "none";
    emailInput.value = "";
  } else {
    usernameInput.style.display = "none";
    emailInput.style.display = "block";
    usernameInput.value = "";
  }
});

// LOGIN FUNCTION
loginForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const role = roleSelect.value;
  const password = document.getElementById("password").value.trim();

  // ============================
  // ADMIN LOGIN
  // ============================
  if (role === "admin") {
    const username = usernameInput.value.trim();

    if (username === "admin" && password === "1234") {
      localStorage.setItem("adminLoggedIn", "true");
      localStorage.setItem("adminName", username);

      // logout customer if admin logs in
      localStorage.removeItem("customerLoggedIn");
      localStorage.removeItem("currentCustomerEmail");

      loginMsg.style.color = "green";
      loginMsg.textContent = "✅ Admin login successful! Redirecting...";

      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 1000);
    } else {
      loginMsg.style.color = "red";
      loginMsg.textContent = "❌ Wrong admin username or password!";
    }
  }

  // ============================
  // CUSTOMER LOGIN
  // ============================
  else {
    const email = emailInput.value.trim();
    let users = JSON.parse(localStorage.getItem("users")) || [];

    const user = users.find((u) => u.email === email && u.password === password);

    if (!user) {
      loginMsg.style.color = "red";
      loginMsg.textContent = "❌ Wrong customer email or password!";
      return;
    }

    localStorage.setItem("customerLoggedIn", "true");
    localStorage.setItem("currentCustomerEmail", user.email);

    // logout admin if customer logs in
    localStorage.removeItem("adminLoggedIn");
    localStorage.removeItem("adminName");

    loginMsg.style.color = "green";
    loginMsg.textContent = "✅ Customer login successful! Redirecting...";

    setTimeout(() => {
      window.location.href = "index.html";
    }, 1000);
  }
});