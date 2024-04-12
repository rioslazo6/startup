import React from "react"
import { useNavigate } from "react-router-dom"
import { Card } from "./card"

export function Select({ username }) {
    const navigate = useNavigate()
    const [pokemonList, setPokemonList] = React.useState([])
    const [selectedPokemon, setSelectedPokemon] = React.useState(undefined)
    React.useEffect(() => {
        if (!sessionStorage.getItem("username")) {
            navigate("/") // Redirecting if not logged in.
        }
        async function loadPokemonList() {
            const details = []
            const pokemonSet = new Set() // Using set to avoid duplicate Pokemons.
            
            while (pokemonSet.size < 6) {
                // To get a random Pokemon ID between 1 and 151 (1st Gen).
                const id = Math.floor(Math.random() * 150) + 1
                if (pokemonSet.has(id)) {
                    continue
                }
                pokemonSet.add(id)

                const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
                const pokemonData = await response.json()

                const pokemonName = capitalizeName(pokemonData.name)
                const pokemonImageURL = pokemonData.sprites.front_default

                details.push(
                    {
                        id: id,
                        name: pokemonName,
                        imageUrl: pokemonImageURL
                    }
                )
            }
            if (details.length) {
                setPokemonList(details)
            }
        }
        let ignore = false
        loadPokemonList()
        return () => {
            ignore = true
        }
    }, [])

    function capitalizeName(string) {
        return string.replace(/\b\w/g, function(text){
            return text.charAt(0).toUpperCase() + text.substr(1).toLowerCase()
        })
    }

    return (
        <main>
            <h1 className="my-5">Choose your Pokémon, <span id="usernameSpan">{username}</span>!</h1>
            <div className="container-fluid text-center vt323-regular">
                <div id="cardsContainer" className="row row-cols-2 row-cols-sm-3 my-3">
                    {pokemonList.map((detail) => <Card key={detail.id} pokemonDetail={detail} selectedPokemon={selectedPokemon} onSelectionChange={(selection => setSelectedPokemon(selection))} />)}
                </div>
            </div>
            <button className="btn btn-primary mb-5" onClick={() => navigate("/battle")}>Done!</button>
        </main>
    )
}