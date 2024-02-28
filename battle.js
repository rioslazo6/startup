// This will run only after the DOM is fully loaded, to avoid the span element being null.
document.addEventListener("DOMContentLoaded", function(event) {
    const selectedPokemonId = localStorage.getItem("selectedPokemonId")
    myPokemonImage = document.getElementById("myPokemon")
    myPokemonImage.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/back/${selectedPokemonId}.gif`
    document.getElementById("myPokemonName").innerHTML = localStorage.getItem("selectedPokemonName")
})