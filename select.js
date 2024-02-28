// This will run only after the DOM is fully loaded, to avoid the span element being null.
document.addEventListener("DOMContentLoaded", function(event) {
    const usernameSpan = document.getElementById("usernameSpan")
    usernameSpan.textContent = localStorage.getItem("username")
    pokemonCards = document.querySelectorAll("div.pokemon-card")
    pokemonCards.forEach(card => {
        card.addEventListener("click", (e) => {
            card.classList.add("selected")
        })
    })
})


