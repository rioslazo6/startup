// This is a "database" of the leaderboards.
const leaderboardData = [
    {
        username: "ash",
        totalBattles: 100,
        battlesWon: 88,
        winPercentage: "88%"
    },
    {
        username: "silver",
        totalBattles: 250,
        battlesWon: 200,
        winPercentage: "80%"
    },
    {
        username: "zelda",
        totalBattles: 15,
        battlesWon: 10,
        winPercentage: "67%"
    },
    {
        username: "link",
        totalBattles: 2,
        battlesWon: 1,
        winPercentage: "50%"
    }
]

function addDataToTable(data) {
    let headers = []
    for (const [key, value] of Object.entries(data[0])) {
        headers.push({ name: key, type: typeof value });
    }
    const table = document.getElementById("leaderboard").getElementsByTagName('tbody')[0]
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