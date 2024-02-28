// This will run only after the DOM is fully loaded, to avoid the span element being null.
document.addEventListener("DOMContentLoaded", function(event) {
    let usernameSpan = document.getElementById("usernameSpan")
    usernameSpan.textContent = localStorage.getItem("username")
})