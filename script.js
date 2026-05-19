// Authentication System
const DEFAULT_USERNAME = "admin";
const DEFAULT_PASSWORD = "admin123";

function isAdminAuthenticated() {
    return localStorage.getItem("adminAuthenticated") === "true";
}

function updateAdminNav() {
    const adminNav = document.getElementById("adminNav");
    const logoutNav = document.getElementById("logoutNav");
    
    if (isAdminAuthenticated()) {
        adminNav.style.display = "block";
        logoutNav.style.display = "block";
    } else {
        adminNav.style.display = "none";
        logoutNav.style.display = "none";
    }
}

function logout() {
    localStorage.removeItem("adminAuthenticated");
    updateAdminNav();
    alert("Logged out successfully");
}

// Logo click - open login modal
document.getElementById("logoLink").addEventListener("click", (e) => {
    e.preventDefault();
    document.getElementById("loginModal").classList.add("show");
});

// Close modal when X is clicked
document.querySelector(".close").addEventListener("click", () => {
    document.getElementById("loginModal").classList.remove("show");
});

// Close modal when clicking outside of it
window.addEventListener("click", (e) => {
    const modal = document.getElementById("loginModal");
    if (e.target === modal) {
        modal.classList.remove("show");
    }
});

// Login form submission
document.getElementById("loginForm").addEventListener("submit", (e) => {
    e.preventDefault();
    
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const errorDiv = document.getElementById("loginError");
    
    if (username === DEFAULT_USERNAME && password === DEFAULT_PASSWORD) {
        localStorage.setItem("adminAuthenticated", "true");
        document.getElementById("loginModal").classList.remove("show");
        document.getElementById("loginForm").reset();
        errorDiv.style.display = "none";
        updateAdminNav();
        alert("Login successful!");
    } else {
        errorDiv.textContent = "Invalid username or password";
        errorDiv.style.display = "block";
    }
});

// Logout button
document.getElementById("logoutBtn").addEventListener("click", (e) => {
    e.preventDefault();
    logout();
});

// Check authentication on page load
document.addEventListener("DOMContentLoaded", () => {
    updateAdminNav();
});

window.addEventListener("scroll",()=>{

    const header = document.querySelector("header");

    if(window.scrollY > 50){
        header.style.background = "#111";
    }else{
        header.style.background = "rgba(0,0,0,0.7)";
    }

});

const quoteBtn = document.getElementById("quoteBtn");
const projectsBtn = document.getElementById("projectsBtn");
const contactBtn = document.getElementById("contactBtn");
const bookingBtn = document.getElementById("bookingBtn");
const ratingSubmitBtn = document.getElementById("ratingSubmitBtn");
const starRating = document.getElementById("starRating");
const averageRating = document.getElementById("averageRating");
const ratingCount = document.getElementById("ratingCount");
const userRating = document.getElementById("userRating");
let selectedRating = 0;

const updateRatingDisplay = () => {
    const ratings = JSON.parse(localStorage.getItem("siteRatings") || "[]");
    const count = ratings.length;
    const total = ratings.reduce((sum, value) => sum + value, 0);
    const average = count ? (total / count).toFixed(1) : 0;

    averageRating.textContent = average;
    ratingCount.textContent = count;
    userRating.textContent = selectedRating || "None";
};

const setStars = (rating) => {
    const stars = starRating.querySelectorAll("i");
    stars.forEach((star) => {
        const value = Number(star.dataset.value);
        star.classList.toggle("selected", value <= rating);
        star.classList.toggle("fa-solid", value <= rating);
        star.classList.toggle("fa-regular", value > rating);
    });
};

starRating.addEventListener("click", (event) => {
    if (!event.target.matches("i")) return;
    selectedRating = Number(event.target.dataset.value);
    setStars(selectedRating);
    userRating.textContent = selectedRating;
});

ratingSubmitBtn.addEventListener("click", () => {
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

quoteBtn.addEventListener("click", () => {
    document.getElementById("rating").scrollIntoView({ behavior: "smooth" });
});

projectsBtn.addEventListener("click", () => {
    document.getElementById("projects").scrollIntoView({ behavior: "smooth" });
});

contactBtn.addEventListener("click", () => {
    document.getElementById("contact").scrollIntoView({ behavior: "smooth" });
});

bookingBtn.addEventListener("click", () => {
    document.getElementById("contact").scrollIntoView({ behavior: "smooth" });
});

const form = document.getElementById("contactForm");
const contactStatus = document.getElementById("contactStatus");

const showContactStatus = (message, isSuccess) => {
    contactStatus.textContent = message;
    contactStatus.className = isSuccess ? "contact-status success" : "contact-status error";
    contactStatus.style.display = "block";
};

const clearContactStatus = () => {
    contactStatus.textContent = "";
    contactStatus.style.display = "none";
};

form.addEventListener("submit", async(e)=>{

    e.preventDefault();
    clearContactStatus();

    const data = {
        name:document.getElementById("name").value,
        email:document.getElementById("email").value,
        phone:document.getElementById("phone").value,
        projectType:document.getElementById("projectType").value,
        preferredDate:document.getElementById("preferredDate").value,
        budget:document.getElementById("budget").value,
        message:document.getElementById("message").value
    };

    try{

        const response = await fetch(
            "submit_contact.php",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            }
        );

        const result = await response.json();

        if (result.success) {
            showContactStatus(result.message, true);
            form.reset();
            selectedRating = 0;
            setStars(0);
            userRating.textContent = "None";
        } else {
            showContactStatus(result.message || "Unable to submit inquiry. Please try again.", false);
        }
    } catch(error){
        showContactStatus("Something went wrong. Please check your network or try again.", false);
    }

});

updateRatingDisplay();
