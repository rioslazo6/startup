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

let socket
function configureWebSocket() {
    const protocol = window.location.protocol === "http:" ? "ws" : "wss"
    socket = new WebSocket(`${protocol}://${window.location.host}/ws`)
    socket.onopen = () => {
        displayMessages('<p class="mt-3">Game connected.</p>')
        socket.send(`${sessionStorage.getItem("username")} started a battle.`)
    }
    socket.onclose = () => {
        displayMessages('<p class="mt-3">Game disconnected.</p>')
    }
    socket.onmessage = async event => {
        const message = await event.data.text()
        displayMessages(`<p class="mt-3">${message}</p>`)
    }
}

let messages = []
function displayMessages(message) {
    messages.unshift(message)
    if (messages.length > 3) {
        messages.length = 3
    }
    const messagesDiv = document.getElementById("wsMessages")
    messagesDiv.innerHTML = ""
    for (const message of messages) {
        messagesDiv.innerHTML += message
    }
}

// This will run only after the DOM is fully loaded, to avoid the pokemon image and name being null.
document.addEventListener("DOMContentLoaded", async function(event) {
    if (!sessionStorage.getItem("username")) {
        window.location.replace("index.html") // Redirecting if not logged in.
    }
    const selectedPokemonId = sessionStorage.getItem("selectedPokemonId")
    if (!selectedPokemonId) {
        document.getElementById("movesDiv").innerHTML = "You have not selected a Pokémon yet."
        document.getElementById("battleDiv").innerHTML = ""
        document.getElementById("button").innerHTML = "Select Pokémon"
        document.getElementById("buttonForm").action = "select.html"
        return
    }

    configureWebSocket()

    let opponentId = sessionStorage.getItem("opponentPokemonId")
    if (!opponentId) {
        // To get a random Pokemon ID between 1 and 151 (1st Gen).
        opponentId = Math.floor(Math.random() * 150) + 1
        sessionStorage.setItem("opponentPokemonId", opponentId)
    }
    opponentPokemonData = await loadPokemon(opponentId)

    document.getElementById("opponentPokemon").src = opponentPokemonData.sprites.versions["generation-v"]["black-white"].animated.front_default
    opponentPokemonName = capitalizeName(opponentPokemonData.name)
    document.getElementById("opponentPokemonName").innerHTML = opponentPokemonName
    opponentHP = opponentPokemonData.stats[0].base_stat
    document.getElementById("opponentRemainingHP").innerHTML = opponentHP
    document.getElementById("opponentTotalHP").innerHTML = opponentHP

    myPokemonData = await loadPokemon(selectedPokemonId)

    myPokemonImage = document.getElementById("myPokemon")
    myPokemonImage.src = myPokemonData.sprites.versions["generation-v"]["black-white"].animated.back_default
    document.getElementById("myPokemonName").innerHTML = sessionStorage.getItem("selectedPokemonName")
    myHP = myPokemonData.stats[0].base_stat
    document.getElementById("myRemainingHP").innerHTML = myHP
    document.getElementById("myTotalHP").innerHTML = myHP

    moves = document.querySelectorAll("td.move")
    moves.forEach(move => {
        move.addEventListener("click", async (e) => {
            const pokemonSpan = document.getElementById("pokemonSpan")
            pokemonSpan.innerHTML = sessionStorage.getItem("selectedPokemonName")
            const moveName = move.innerHTML
            const moveSpan = document.getElementById("moveSpan")
            moveSpan.innerHTML = moveName
            if (Math.random() >= 0.7) { // Simulating the battle being "done".
                await calculateBattleResult()
                window.alert(`You ${userWon ? "won! Well done." : "lost! Better luck next time."}`)
                window.location.href = "leaderboard.html"
            } else {
                // If battle didn't end, 2 seconds after the user clicks a move, the opponent will "attack".
                setTimeout(() => {
                    pokemonSpan.innerHTML = opponentPokemonName
                    moveSpan.innerHTML = "TACKLE"
                }, 2000)
            }
        })
    })
})