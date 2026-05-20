// Authentication System - WARNING: Move this validation to the backend for security
const DEFAULT_USERNAME = "admin";
const DEFAULT_PASSWORD = "admin123";

const isAdminAuthenticated = () => localStorage.getItem("adminAuthenticated") === "true";

const updateAdminNav = () => {
    const adminNav = document.getElementById("adminNav");
    const logoutNav = document.getElementById("logoutNav");
    
    if (adminNav && logoutNav) {
        const isAuthenticated = isAdminAuthenticated();
        adminNav.style.display = isAuthenticated ? "block" : "none";
        logoutNav.style.display = isAuthenticated ? "block" : "none";
    }
};

const logout = () => {
    localStorage.removeItem("adminAuthenticated");
    updateAdminNav();
    alert("Logged out successfully");
};

// Event Listeners with Null Checks
document.getElementById("logoLink")?.addEventListener("click", (e) => {
    e.preventDefault();
    document.getElementById("loginModal")?.classList.add("show");
});

document.querySelector(".close")?.addEventListener("click", () => {
    document.getElementById("loginModal")?.classList.remove("show");
});

window.addEventListener("click", (e) => {
    const modal = document.getElementById("loginModal");
    if (e.target === modal) modal.classList.remove("show");
});

document.getElementById("loginForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.getElementById("username")?.value;
    const password = document.getElementById("password")?.value;
    const errorDiv = document.getElementById("loginError");
    
    if (username === DEFAULT_USERNAME && password === DEFAULT_PASSWORD) {
        localStorage.setItem("adminAuthenticated", "true");
        document.getElementById("loginModal")?.classList.remove("show");
        e.target.reset();
        if (errorDiv) errorDiv.style.display = "none";
        updateAdminNav();
        alert("Login successful!");
    } else if (errorDiv) {
        errorDiv.textContent = "Invalid username or password";
        errorDiv.style.display = "block";
    }
});

document.getElementById("logoutBtn")?.addEventListener("click", (e) => {
    e.preventDefault();
    logout();
});

document.addEventListener("DOMContentLoaded", updateAdminNav);

window.addEventListener("scroll", () => {
    const header = document.querySelector("header");
    if (header) {
        header.style.background = window.scrollY > 50 ? "#111" : "rgba(0,0,0,0.7)";
    }
});

// Rating System
const starRating = document.getElementById("starRating");
const userRating = document.getElementById("userRating");
let selectedRating = 0;

const updateRatingDisplay = () => {
    const ratings = JSON.parse(localStorage.getItem("siteRatings") || "[]");
    const count = ratings.length;
    const total = ratings.reduce((sum, value) => sum + value, 0);
    const average = count ? (total / count).toFixed(1) : 0;

    const avgDisplay = document.getElementById("averageRating");
    const countDisplay = document.getElementById("ratingCount");

    if (avgDisplay) avgDisplay.textContent = average;
    if (countDisplay) countDisplay.textContent = count;
    if (userRating) userRating.textContent = selectedRating || "None";
};

const setStars = (rating) => {
    if (!starRating) return;
    const stars = starRating.querySelectorAll("i");
    stars.forEach((star) => {
        const value = Number(star.dataset.value);
        const isSelected = value <= rating;
        star.classList.toggle("selected", isSelected);
        star.classList.toggle("fa-solid", isSelected);
        star.classList.toggle("fa-regular", !isSelected);
    });
};

starRating?.addEventListener("click", (event) => {
    if (!event.target.matches("i")) return;
    selectedRating = Number(event.target.dataset.value);
    setStars(selectedRating);
    if (userRating) userRating.textContent = selectedRating;
});

document.getElementById("ratingSubmitBtn")?.addEventListener("click", () => {
    if (selectedRating === 0) {
        alert("Please choose a rating before submitting.");
        return;
    }
    const ratings = JSON.parse(localStorage.getItem("siteRatings") || "[]");
    ratings.push(selectedRating);
    localStorage.setItem("siteRatings", JSON.stringify(ratings));
    updateRatingDisplay();
    alert(`Thank you! You rated this site ${selectedRating} stars.`);
});

// Smooth Scroll Helpers
const bindScroll = (btnId, targetId) => {
    document.getElementById(btnId)?.addEventListener("click", () => {
        document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" });
    });
};

bindScroll("quoteBtn", "rating");
bindScroll("projectsBtn", "projects");
bindScroll("contactBtn", "contact");
bindScroll("bookingBtn", "contact");

// Contact Form
const contactStatus = document.getElementById("contactStatus");
const showContactStatus = (message, isSuccess) => {
    if (!contactStatus) return;
    contactStatus.textContent = message;
    contactStatus.className = isSuccess ? "contact-status success" : "contact-status error";
    contactStatus.style.display = "block";
};

document.getElementById("contactForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (contactStatus) contactStatus.style.display = "none";

    const data = {
        name: document.getElementById("name")?.value,
        email: document.getElementById("email")?.value,
        phone: document.getElementById("phone")?.value,
        projectType: document.getElementById("projectType")?.value,
        preferredDate: document.getElementById("preferredDate")?.value,
        budget: document.getElementById("budget")?.value,
        message: document.getElementById("message")?.value
    };

    try {
        const response = await fetch("submit_contact.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        if (result.success) {
            showContactStatus(result.message, true);
            e.target.reset();
            selectedRating = 0;
            setStars(0);
            if (userRating) userRating.textContent = "None";
        } else {
            showContactStatus(result.message || "Submission failed.", false);
        }
    } catch (error) {
        showContactStatus("Network error. Please try again.", false);
    }
});

updateRatingDisplay();
