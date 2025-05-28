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
    if (pass === PASSWORD && name) {
      localStorage.setItem("vimeroUser", name);
      location.href = "index.html";
    } else {
      alert("Väärä salasana tai nimi puuttuu.");
    }
  });
}

// Logout function
function logout() {
  localStorage.removeItem("vimeroUser");
  location.href = "login.html";
}

// Post submission logic
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
      console.log("Posting to backend...", message);
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
      console.log("Response from server:", text);
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
