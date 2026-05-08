const MOVIES_API = "/api/movies";
const ADMIN_API = "/api/admin/movies";
const FAVORITES_API = "/api/favorites";

window.addEventListener("DOMContentLoaded", async () => {
    await updateNavbar();

    if (document.getElementById("moviesGrid") && !window.location.pathname.includes("favorites")) {
        loadMovies();
    }
});

async function getCurrentUser() {
    const response = await fetch("/api/auth/me", {credentials: "include"});
    return response.json();
}

async function updateNavbar() {
    const nav = document.getElementById("mainNav");
    if (!nav) return;

    const user = await getCurrentUser();

    let links = `<a href="index.html">Home</a>`;

    if (!user.loggedIn) {
        links += `<a href="login.html">Login</a><a href="register.html">Register</a>`;
    } else {
        if (user.role === "USER") {
            links += `<a href="favorites.html">Favorites</a>`;
        }
        if (user.role === "ADMIN") {
            links += `<a href="admin.html" class="admin-link">Admin</a>`;
        }
        links += `<span class="welcome">${user.username} (${user.role})</span>`;
        links += `<button class="nav-button" onclick="logout()">Logout</button>`;
    }

    nav.innerHTML = links;
}

async function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const message = document.getElementById("message");

    const body = new URLSearchParams();
    body.append("username", username);
    body.append("password", password);

    const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {"Content-Type": "application/x-www-form-urlencoded"},
        body,
        credentials: "include"
    });

    if (!response.ok) {
        message.textContent = "Wrong username or password";
        return;
    }

    const user = await getCurrentUser();
    if (user.role === "ADMIN") {
        window.location.href = "admin.html";
    } else {
        window.location.href = "index.html";
    }
}

async function register() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const message = document.getElementById("message");

    const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({username, password})
    });

    if (!response.ok) {
        message.textContent = await response.text();
        return;
    }

    message.textContent = "Register success. Now login.";
    setTimeout(() => window.location.href = "login.html", 900);
}

async function logout() {
    await fetch("/api/auth/logout", {method: "POST", credentials: "include"});
    window.location.href = "index.html";
}

async function loadMovies(search = "") {
    const url = search ? `${MOVIES_API}?search=${encodeURIComponent(search)}` : MOVIES_API;
    const response = await fetch(url, {credentials: "include"});
    const movies = await response.json();
    showMovies(movies);
}

async function showMovies(movies) {
    const grid = document.getElementById("moviesGrid");
    const user = await getCurrentUser();
    grid.innerHTML = "";

    if (movies.length === 0) {
        grid.innerHTML = `<p class="muted">No movies found.</p>`;
        return;
    }

    movies.forEach(movie => {
        const favoriteButton = user.loggedIn && user.role === "USER"
            ? `<button class="secondary" onclick="addToFavorite(${movie.id})">Favorite</button>`
            : "";

        const card = document.createElement("div");
        card.className = "movie-card";
        card.innerHTML = `
            <img src="${movie.posterUrl || 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=900'}" alt="${movie.title}">
            <div class="movie-info">
                <h3>${movie.title}</h3>
                <div class="movie-meta">${movie.genre} • ${movie.releaseYear}</div>
                <p class="movie-description">${movie.description || ''}</p>
                <div class="card-actions">
                    <button onclick='watchMovie(${JSON.stringify(movie)})'>Watch</button>
                    ${favoriteButton}
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

function searchMovies() {
    const search = document.getElementById("searchInput").value;
    loadMovies(search);
}

function watchMovie(movie) {
    document.getElementById("modalTitle").textContent = movie.title;
    document.getElementById("movieFrame").src = movie.videoUrl || "";
    document.getElementById("watchModal").classList.remove("hidden");
}

function closeWatchModal() {
    document.getElementById("movieFrame").src = "";
    document.getElementById("watchModal").classList.add("hidden");
}

async function addToFavorite(movieId) {
    const response = await fetch(`${FAVORITES_API}/${movieId}`, {
        method: "POST",
        credentials: "include"
    });

    if (response.ok) {
        alert("Movie added to favorites");
    } else {
        alert("Please login as USER to use favorites");
    }
}

async function removeFromFavorite(movieId) {
    await fetch(`${FAVORITES_API}/${movieId}`, {
        method: "DELETE",
        credentials: "include"
    });
    loadFavoritesPage();
}

async function loadFavoritesPage() {
    await updateNavbar();
    const response = await fetch(FAVORITES_API, {credentials: "include"});
    const movies = await response.json();
    const grid = document.getElementById("moviesGrid");
    grid.innerHTML = "";

    if (movies.length === 0) {
        grid.innerHTML = `<p class="muted">No favorites yet.</p>`;
        return;
    }

    movies.forEach(movie => {
        const card = document.createElement("div");
        card.className = "movie-card";
        card.innerHTML = `
            <img src="${movie.posterUrl}" alt="${movie.title}">
            <div class="movie-info">
                <h3>${movie.title}</h3>
                <div class="movie-meta">${movie.genre} • ${movie.releaseYear}</div>
                <p class="movie-description">${movie.description || ''}</p>
                <div class="card-actions">
                    <button onclick='watchMovie(${JSON.stringify(movie)})'>Watch</button>
                    <button class="danger" onclick="removeFromFavorite(${movie.id})">Remove</button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

async function loadAdminMovies() {
    await updateNavbar();
    const searchInput = document.getElementById("adminSearch");
    const search = searchInput ? searchInput.value : "";
    const url = search ? `${MOVIES_API}?search=${encodeURIComponent(search)}` : MOVIES_API;
    const response = await fetch(url, {credentials: "include"});
    const movies = await response.json();

    const table = document.getElementById("moviesTable");
    table.innerHTML = "";

    movies.forEach(movie => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${movie.title}</td>
            <td>${movie.genre}</td>
            <td>${movie.releaseYear}</td>
            <td>
                <button onclick='editMovie(${JSON.stringify(movie)})'>Edit</button>
                <button class="danger" onclick="deleteMovie(${movie.id})">Delete</button>
            </td>
        `;
        table.appendChild(row);
    });
}

async function saveMovie() {
    const id = document.getElementById("movieId").value;

    const movie = {
        title: document.getElementById("title").value,
        genre: document.getElementById("genre").value,
        releaseYear: Number(document.getElementById("releaseYear").value),
        description: document.getElementById("description").value,
        posterUrl: document.getElementById("posterUrl").value,
        videoUrl: document.getElementById("videoUrl").value
    };

    if (!movie.title || !movie.genre || !movie.releaseYear) {
        alert("Please enter title, genre, and release year");
        return;
    }

    const method = id ? "PUT" : "POST";
    const url = id ? `${ADMIN_API}/${id}` : ADMIN_API;

    const response = await fetch(url, {
        method,
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(movie),
        credentials: "include"
    });

    if (!response.ok) {
        alert("Only ADMIN can save movies");
        return;
    }

    clearForm();
    loadAdminMovies();
}

function editMovie(movie) {
    document.getElementById("movieId").value = movie.id;
    document.getElementById("title").value = movie.title;
    document.getElementById("genre").value = movie.genre;
    document.getElementById("releaseYear").value = movie.releaseYear;
    document.getElementById("description").value = movie.description;
    document.getElementById("posterUrl").value = movie.posterUrl;
    document.getElementById("videoUrl").value = movie.videoUrl;
    window.scrollTo({top: 0, behavior: "smooth"});
}

async function deleteMovie(id) {
    if (!confirm("Delete this movie?")) {
        return;
    }

    const response = await fetch(`${ADMIN_API}/${id}`, {
        method: "DELETE",
        credentials: "include"
    });

    if (!response.ok) {
        alert("Only ADMIN can delete movies");
        return;
    }

    loadAdminMovies();
}

function clearForm() {
    document.getElementById("movieId").value = "";
    document.getElementById("title").value = "";
    document.getElementById("genre").value = "";
    document.getElementById("releaseYear").value = "";
    document.getElementById("description").value = "";
    document.getElementById("posterUrl").value = "";
    document.getElementById("videoUrl").value = "";
}
