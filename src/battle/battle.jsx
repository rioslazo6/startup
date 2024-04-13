import React from "react"
import { useNavigate } from "react-router-dom"
import "./battle.css"

export function Battle() {
    const navigate = useNavigate()
    const [hasSelectedPokemon, setHasSelectedPokemon] = React.useState(false)
    const [wsMessage, setWsMessage] = React.useState("")
    const [myPokemon, setMyPokemon] = React.useState(undefined)
    const [opponentPokemon, setOpponentPokemon] = React.useState(undefined)
    const [selectedMove, setSelectedMove] = React.useState("")
    const [attackingPokemon, setAttackingPokemon] = React.useState("")
    const [socket, setSocket] = React.useState(undefined)
    let messageCount = 0

    React.useEffect(() => {
        if (!sessionStorage.getItem("username")) {
            navigate("/") // Redirecting if not logged in.
        }
        const selectedPokemonId = sessionStorage.getItem("selectedPokemonId")
        if (!selectedPokemonId) {
            return
        }
        setHasSelectedPokemon(true)

        async function setupBattle() {
            configureWebSocket()

            let opponentId = sessionStorage.getItem("opponentPokemonId")
            if (!opponentId) {
                // To get a random Pokemon ID between 1 and 151 (1st Gen).
                opponentId = Math.floor(Math.random() * 150) + 1
                sessionStorage.setItem("opponentPokemonId", opponentId)
            }
            const opponentPokemonData = await loadPokemon(opponentId)
            if (opponentPokemonData) {
                setOpponentPokemon(opponentPokemonData)
            }

            const myPokemonData = await loadPokemon(selectedPokemonId)
            if (myPokemonData) {
                setMyPokemon(myPokemonData)
            }
        }
        let ignore = false
        setupBattle()
        return () => {
            ignore = true
        }
    }, [])

    async function loadPokemon(id) {
        // Calling 3rd party API.
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
        return await response.json()
    }
    
    function capitalizeName(string) {
        return string.replace(/\b\w/g, function(text){
            return text.charAt(0).toUpperCase() + text.substr(1).toLowerCase()
        })
    }

    function configureWebSocket() {
        const protocol = window.location.protocol === "http:" ? "ws" : "wss"
        let socket = new WebSocket(`${protocol}://${window.location.host}/ws`)
        setSocket(socket)
        socket.onopen = () => {
            setWsMessage(<p key={messageCount} className="mt-3">Game connected.</p>)
            if (!sessionStorage.getItem("battleMessageWasSent")) {
                socket.send(`${sessionStorage.getItem("username")} started a battle using ${sessionStorage.getItem("selectedPokemonName")}.`)
                sessionStorage.setItem("battleMessageWasSent", "true")
            }
        }
        socket.onclose = () => {
            setWsMessage(<p key={messageCount} className="mt-3">Game disconnected.</p>)
        }
        socket.onmessage = async event => {
            const message = await event.data.text()
            setWsMessage(<p key={messageCount} className="mt-3">{message}</p>)
        }
    }

    async function handleMove(move) {
        setAttackingPokemon(capitalizeName(myPokemon.name))
        setSelectedMove(move)
        if (Math.random() >= 0.7) { // Simulating the battle being "done".
            await calculateBattleResult()
            window.alert(`You ${userWon ? "won! Well done." : "lost! Better luck next time."}`)
            navigate("/leaderboard")
        } else {
            // If battle didn't end, 2 seconds after the user clicks a move, the opponent will "attack".
            setTimeout(() => {
                setAttackingPokemon(capitalizeName(opponentPokemon.name))
                setSelectedMove("TACKLE")
            }, 2000)
        }
    }

    async function loadUserScore() {
        let leaderboardData = []
        try {
            // Getting latest leaderboard from the service.
            const response = await fetch("api/leaderboard")
            leaderboardData = await response.json()

            // Saving locally.
            localStorage.setItem("leaderboard", JSON.stringify(leaderboardData))
        } catch {
            // Using local copy if there's an error.
            const leaderboardString = localStorage.getItem("leaderboard")
            if (leaderboardString) {
                leaderboardData = JSON.parse(leaderboardString)
            }
        }
        return leaderboardData.find(score => score.username === sessionStorage.getItem("username"))
    }

    let userWon = false
    async function calculateBattleResult() {
        let userScore = await loadUserScore()
        if (!userScore) {
            userScore = {
                username: sessionStorage.getItem("username"),
                totalBattles: 1,
                battlesWon: 0
            }
        } else {
            userScore.totalBattles += 1
        }
        if (Math.random() >= 0.3) { // Simulating a "win".
            userScore.battlesWon += 1
            userWon = true
        }
        sessionStorage.removeItem("selectedPokemonId")
        sessionStorage.removeItem("opponentPokemonId")
        sessionStorage.removeItem("battleMessageWasSent")
        socket.send(`${userScore.username} just ${userWon ? "won" : "lost"} a battle!`)
        userScore.winRate = userScore.battlesWon / userScore.totalBattles
        userScore.winPercentage = parseFloat((userScore.battlesWon / userScore.totalBattles) * 100).toFixed(2) + " %"
        try {
            const response = await fetch("/api/leaderboard", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify(userScore),
            })
            const leaderboardData = await response.json()
            localStorage.setItem("leaderboard", JSON.stringify(leaderboardData))
        } catch {
            window.alert("There was an error updating the leaderboard. Please try again.")
        }
    }

    return (
        <main>
            <div id="wsMessage" className="my-4 text-center">{wsMessage}</div>
            {hasSelectedPokemon && <div id="movesDiv">
                <p><span id="pokemonSpan">{attackingPokemon || "Pokémon"}</span> used <span id="moveSpan">{selectedMove || "TACKLE"}</span>!</p>
            </div>}
            <br />
            {!hasSelectedPokemon && <div>You have not selected a Pokémon yet.</div>}
            {hasSelectedPokemon && <div id="battleDiv" className="container vt323-regular">
                <div className="row">
                    <div className="col">
                        <p id="opponentPokemonName" className="mb-0">{opponentPokemon ? capitalizeName(opponentPokemon.name) : "..."}</p>
                        <p>HP: <span id="opponentRemainingHP">{opponentPokemon ? opponentPokemon.stats[0].base_stat : ""}</span>/<span id="opponentTotalHP">{opponentPokemon ? opponentPokemon.stats[0].base_stat : ""}</span></p>
                    </div>
                    <div className="col"></div>
                </div>
                <div className="row mb-5">
                    <div className="col"></div>
                    <div className="col">
                        <img id="opponentPokemon" alt="Opponent Pokemon" height="50" src={opponentPokemon ? opponentPokemon.sprites.versions["generation-v"]["black-white"].animated.front_default : "images/pokeball.png"} />
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <img id="myPokemon" alt="My Pokemon" height="50" src={myPokemon ? myPokemon.sprites.versions["generation-v"]["black-white"].animated.back_default : "images/pokeball.png"} />
                    </div>
                    <div className="col">
                        <p id="myPokemonName" className="mb-0">{myPokemon ? sessionStorage.getItem("selectedPokemonName") : "..."}</p>
                        <p>HP: <span id="myRemainingHP">{myPokemon ? myPokemon.stats[0].base_stat : ""}</span>/<span id="myTotalHP">{myPokemon ? myPokemon.stats[0].base_stat : ""}</span></p>
                    </div>
                </div>
                <div className="row">
                    <div className="col align-items-center">
                        <p>What would you like to do?</p>
                    </div>
                    <div className="col">
                        <table>
                            <tbody>
                                <tr className="row">
                                    <td className="col move m-1" onClick={() => handleMove("THUNDERBOLT")}>THUNDERBOLT</td>
                                    <td className="col move m-1" onClick={() => handleMove("THUNDERWAVE")}>THUNDERWAVE</td>
                                </tr>
                                <tr className="row">
                                    <td className="col move m-1" onClick={() => handleMove("BODY SLAM")}>BODY SLAM</td>
                                    <td className="col move m-1" onClick={() => handleMove("AGILITY")}>AGILITY</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>}
            <div>


            </div>
            <hr />
            <button id="button" className="btn btn-primary mb-5" onClick={() => navigate(hasSelectedPokemon ? "/leaderboard" : "/select")}>{hasSelectedPokemon ? "See leaderboard" : "Select Pokémon"}</button>
        </main>
    )
}