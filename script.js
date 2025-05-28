const API_URL = "https://script.google.com/macros/s/AKfycbzGGjaelM5k3YELu2x-Qcqq4tPK2_-NcYJC2IsEwZ2LjVW4vz220BALKyZ1w4WR9H1y4Q/exec";
const PASSWORD = "makiseura2025";

// Redirect to login if not logged in
if (!location.pathname.endsWith("login.html")) {
  const user = localStorage.getItem("vimeroUser");
  if (!user) location.href = "login.html";
}

// Login logic
if (location.pathname.endsWith("login.html")) {
  document.getElementById("loginForm").addEventListener("submit", e => {
    e.preventDefault();
    const name = document.getElementById("name").value.trim();
    const pass = document.getElementById("password").value;
    if (pass === PASSWORD) {
      localStorage.setItem("vimeroUser", name);
      location.href = "index.html";
    } else {
      alert("Väärä salasana.");
    }
  });
}

// Logout
function logout() {
  localStorage.removeItem("vimeroUser");
  location.href = "login.html";
}

// Handle post form submission on post.html
if (location.pathname.endsWith("post.html")) {
  document.getElementById("postForm").addEventListener("submit", async e => {
    e.preventDefault();

    const user = localStorage.getItem("vimeroUser");
    const message = document.getElementById("message").value.trim();

    if (!message) {
      alert("Kirjoita viesti.");
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: user,
          message: message
        })
      });

      const text = await response.text();
      if (text === "OK") {
        alert("Viesti lähetetty!");
        location.href = "index.html";
      } else {
        alert("Virhe palvelimelta: " + text);
      }
    } catch (error) {
      console.error("Virhe fetchissä:", error);
      alert("Verkkovirhe: " + error.message);
    }
  });
}
