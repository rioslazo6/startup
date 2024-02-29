// This will run only after the DOM is fully loaded, to avoid the pokemon image and name being null.
document.addEventListener("DOMContentLoaded", function(event) {
    const selectedPokemonId = localStorage.getItem("selectedPokemonId")
    myPokemonImage = document.getElementById("myPokemon")
    myPokemonImage.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/back/${selectedPokemonId}.gif`
    document.getElementById("myPokemonName").innerHTML = localStorage.getItem("selectedPokemonName")

    moves = document.querySelectorAll("td.move")
    moves.forEach(move => {
        move.addEventListener("click", (e) => {
            const pokemonSpan = document.getElementById("pokemonSpan")
            pokemonSpan.innerHTML = localStorage.getItem("selectedPokemonName")
            const moveName = move.innerHTML
            const moveSpan = document.getElementById("moveSpan")
            moveSpan.innerHTML = moveName
            // 2 seconds after the user clicks a move, the opponent will "attack".
            setTimeout(() => {
                pokemonSpan.innerHTML = "Squirtle"
                moveSpan.innerHTML = "WATER GUN"
            }, 2000)
        })
    })
})