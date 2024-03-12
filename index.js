const express = require("express")
const app = express()

// Setting the service port.
const port = process.argv.length > 2 ? process.argv[2] : 4000

// JSON body parsing.
app.use(express.json())

// Serve up the front-end static content hosting.
app.use(express.static("public"))

// Router for service endpoints.
var apiRouter = express.Router()
app.use("/api", apiRouter)

// Get leaderboard.
apiRouter.get("/leaderboard", (_req, res) => {
    leaderboardData.sort((a,b) => (b.battlesWon / b.totalBattles) - (a.battlesWon / a.totalBattles))
    res.send(leaderboardData)
})

// Update leaderboard.
apiRouter.post("/leaderboard", (req, res) => {
    leaderboardData = updateLeaderboard(req.body, leaderboardData)
    res.send(leaderboardData)
})

// Return application's default page if path is unknown.
app.use((_req, res) => {
    res.sendFile("index.html", { root: "public" })
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})

let leaderboardData = []
function updateLeaderboard(updatedData, leaderboardData) {
    let found = false
    for (const [i, score] of leaderboardData.entries()) {
        if (score.username === updatedData.username) {
            leaderboardData.splice(i, 1, updatedData)
            found = true
            break
        }
    }
    if (!found) {
        leaderboardData.push(updatedData)
    }
    return leaderboardData
}
