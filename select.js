let pokemonCards = undefined

// This will run only after the DOM is fully loaded, to avoid the span element being null.
document.addEventListener("DOMContentLoaded", function(event) {
    const usernameSpan = document.getElementById("usernameSpan")
    usernameSpan.textContent = localStorage.getItem("username")
    pokemonCards = document.querySelectorAll("div.pokemon-card")
    pokemonCards.forEach(card => {
        card.addEventListener("click", (e) => {
            refreshCardSelection(card.id)
        })
    })
})

function refreshCardSelection(id) {
    pokemonCards.forEach(card => {
        if (card.id === id) {
            card.classList.add("selected")
        } else {
            card.classList.remove("selected")
        }
    })
}


