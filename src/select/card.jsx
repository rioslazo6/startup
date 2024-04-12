import React from "react"
import "./select.css"

export function Card({ pokemonDetail, selectedPokemon, onSelectionChange }) {
    let className = "pokemon-card bg-dark-subtle" + (pokemonDetail.id === selectedPokemon ? " selected" : "")

    function updateSelection() {
        sessionStorage.setItem("selectedPokemonId", pokemonDetail.id)
        sessionStorage.setItem("selectedPokemonName", pokemonDetail.name)
        onSelectionChange(pokemonDetail.id)
    }

    return (
        <div className="col mb-5">
            <div id={pokemonDetail.id} className={className} onClick={() => updateSelection()}>
                <img alt={pokemonDetail.name} width="100" src={pokemonDetail.imageUrl} />
                <p>{pokemonDetail.name}</p>
            </div>
        </div>
    )
}