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
    return leaderboardData.find(score => score.username === localStorage.getItem("username"))
}

async function calculateBattleResult() {
    let userScore = await loadUserScore()
    if (!userScore) {
        userScore = {
            username: localStorage.getItem("username"),
            totalBattles: 1,
            battlesWon: 0
        }
    } else {
        userScore.totalBattles += 1
    }
    if (Math.random() >= 0.3) { // Simulating a "win".
        userScore.battlesWon += 1
    }
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

// This will run only after the DOM is fully loaded, to avoid the pokemon image and name being null.
document.addEventListener("DOMContentLoaded", function(event) {
    const selectedPokemonId = localStorage.getItem("selectedPokemonId")
    myPokemonImage = document.getElementById("myPokemon")
    myPokemonImage.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/back/${selectedPokemonId}.gif`
    document.getElementById("myPokemonName").innerHTML = localStorage.getItem("selectedPokemonName")

    moves = document.querySelectorAll("td.move")
    moves.forEach(move => {
        move.addEventListener("click", async (e) => {
            const pokemonSpan = document.getElementById("pokemonSpan")
            pokemonSpan.innerHTML = localStorage.getItem("selectedPokemonName")
            const moveName = move.innerHTML
            const moveSpan = document.getElementById("moveSpan")
            moveSpan.innerHTML = moveName
            if (Math.random() >= 0.7) { // Simulating the battle being "done".
                await calculateBattleResult()
                window.location.href = "leaderboard.html"
            } else {
                // 2 seconds after the user clicks a move, the opponent will "attack".
                setTimeout(() => {
                    pokemonSpan.innerHTML = "Squirtle"
                    moveSpan.innerHTML = "WATER GUN"
                }, 2000)
            }
        })
    })
})