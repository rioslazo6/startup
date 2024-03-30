let pokemonCards = undefined

function capitalizeName(string) {
    return string.replace(/\b\w/g, function(text){
        return text.charAt(0).toUpperCase() + text.substr(1).toLowerCase()
    })
}

// This will run only after the DOM is fully loaded, to avoid the span element being null.
document.addEventListener("DOMContentLoaded", async function(event) {
    const usernameSpan = document.getElementById("usernameSpan")
    usernameSpan.textContent = sessionStorage.getItem("username")

    cardsContainer = document.getElementById("cardsContainer")
    for (let i = 0; i < 6; i++) {
        // To get a random Pokemon ID between 1 and 151 (1st Gen).
        const id = Math.floor(Math.random() * 150) + 1
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
        const pokemonData = await response.json()

        pokemonName = capitalizeName(pokemonData.name)
        pokemonImageURL = pokemonData.sprites.front_default

        child = document.createElement("div")
        child.classList.add("col", "mb-5")
        child.innerHTML = `
            <div id="${id}" class="pokemon-card bg-dark-subtle">
                <img alt="${pokemonName}" width="100" src="${pokemonImageURL}"/>
                <p>${pokemonName}</p>
            </div>
        `
        cardsContainer.appendChild(child)
    }

    pokemonCards = document.querySelectorAll("div.pokemon-card")
    pokemonCards.forEach(card => {
        card.addEventListener("click", (e) => {
            refreshCardSelection(card.id)
            sessionStorage.setItem("selectedPokemonId", card.id)
            const selectedPokemonName = document.querySelector(".selected p").innerHTML
            sessionStorage.setItem("selectedPokemonName", selectedPokemonName)
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


