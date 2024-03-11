// This is a "database" of the leaderboards.
const leaderboardData = [
    {
        username: "ash",
        totalBattles: 100,
        battlesWon: 88,
        get winPercentage() {
            return parseFloat((this.battlesWon / this.totalBattles) * 100).toFixed(2) + " %"
        }
    },
    {
        username: "silver",
        totalBattles: 250,
        battlesWon: 200,
        get winPercentage() {
            return parseFloat((this.battlesWon / this.totalBattles) * 100).toFixed(2) + " %"
        }
    },
    {
        username: "zelda",
        totalBattles: 15,
        battlesWon: 10,
        get winPercentage() {
            return parseFloat((this.battlesWon / this.totalBattles) * 100).toFixed(2) + " %"
        }
    },
    {
        username: "link",
        totalBattles: 2,
        battlesWon: 1,
        get winPercentage() {
            return parseFloat((this.battlesWon / this.totalBattles) * 100).toFixed(2) + " %"
        }
    }
]

function addDataToTable(data) {
    let headers = []
    for (const [key, value] of Object.entries(data[0])) {
        headers.push({ name: key, type: typeof value });
    }
    const table = document.getElementById("leaderboard").getElementsByTagName('tbody')[0]
    table.innerHTML = ""
    const row = document.createElement("tr");
    table.appendChild(row)
    headers.forEach((header) => {
        const cell = document.createElement("th");
        row.appendChild(cell);
        const textNode = document.createTextNode(header.name);
        cell.appendChild(textNode);
    })
    data.forEach((dataRow) => {
        const row = document.createElement("tr");
        table.appendChild(row);
        for (const [, value] of Object.entries(dataRow)) {
            const cell = document.createElement("td");
            row.appendChild(cell);
            const textNode = document.createTextNode(value);
            cell.appendChild(textNode);
        }
    });
}

// This will run only after the DOM is fully loaded, to make sure the table exists.
document.addEventListener("DOMContentLoaded", function(event) {
    addDataToTable(leaderboardData)
})

// Every 2 seconds, a random user will either "win" or "lose" a battle, simulating multiple players using the app.
setInterval(() => {
    const index = Math.floor(Math.random() * 4)
    leaderboardData[index].totalBattles++
    if (Math.random() >= 0.5) {
        leaderboardData[index].battlesWon++
    }
    addDataToTable(leaderboardData)
}, 2000);