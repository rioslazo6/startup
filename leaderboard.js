async function loadLeaderboard() {
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
    addDataToTable(leaderboardData)
}

function addDataToTable(data) {
    const table = document.getElementById("leaderboard").getElementsByTagName("tbody")[0]
    if (data.length) {
        let headers = []
        for (const [key, value] of Object.entries(data[0])) {
            headers.push({ name: key, type: typeof value })
        }
        table.innerHTML = ""
        const row = document.createElement("tr")
        table.appendChild(row)
        headers.forEach((header) => {
            const cell = document.createElement("th")
            row.appendChild(cell)
            const textNode = document.createTextNode(header.name)
            cell.appendChild(textNode)
        })
        data.forEach((dataRow) => {
            const row = document.createElement("tr")
            table.appendChild(row)
            for (const [, value] of Object.entries(dataRow)) {
                const cell = document.createElement("td")
                row.appendChild(cell)
                const textNode = document.createTextNode(value)
                cell.appendChild(textNode)
            }
        })
    } else {
        table.innerHTML = "<tr><td colspan=\"4\">No scores yet. Go battle!</td></tr>"
    }
}

if (!sessionStorage.getItem("username")) {
    window.location.replace("index.html") // Redirecting if not logged in.
}
loadLeaderboard()