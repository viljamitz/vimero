const API_BASE_URL = "https://api.sheety.co/008990575ec6f9fdba2d040d7c580763/vimeroData/posts";
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

// Post submission logic for post.html
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
      const response = await fetch(API_BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          post: {
            name: user,
            message: message
          }
        })
      });

      const result = await response.json();
      if (response.ok) {
        alert("Viesti lähetetty!");
        location.href = "index.html";
      } else {
        console.error(result);
        alert("Virhe Sheety-palvelussa.");
      }
    } catch (err) {
      console.error(err);
      alert("Verkkovirhe: " + err.message);
    }
  });
}

// Load and show posts on index.html
if (location.pathname.endsWith("index.html")) {
  fetch(API_BASE_URL)
    .then(response => response.json())
    .then(data => {
      const feedDiv = document.getElementById("feed");
      const posts = data.posts;

      if (posts.length === 0) {
        feedDiv.innerHTML = "<p>Ei viestejä vielä.</p>";
        return;
      }

      // Optional: reverse to show newest first
      posts.reverse();

      feedDiv.innerHTML = posts.map(post => `
      <div class="post">
        <strong>${post.name || "?"}</strong>
        <p>${post.message}</p>
        </div>
      `).join("");
    })
    .catch(err => {
      console.error("Virhe ladattaessa viestejä:", err);
      document.getElementById("feed").innerText = "Virhe ladattaessa viestejä.";
    });
}

