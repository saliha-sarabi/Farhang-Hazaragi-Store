const registerForm = document.getElementById("registerForm");
const msg = document.getElementById("msg");

registerForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const fullName = document.getElementById("fullName").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  let users = JSON.parse(localStorage.getItem("users")) || [];

  // check if email already exists
  const userExists = users.find((u) => u.email === email);

  if (userExists) {
    msg.style.color = "red";
    msg.textContent = "❌ This email is already registered!";
    return;
  }

  const newUser = {
    id: Date.now(),
    fullName,
    email,
    password
  };

  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));

  msg.style.color = "green";
  msg.textContent = "✅ Account created successfully! Redirecting...";

  setTimeout(() => {
    window.location.href = "login.html";
  }, 1500);

  registerForm.reset();
});