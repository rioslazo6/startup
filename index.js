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
    res.send(leaderboardData)
})

// Return application's default page if path is unknown.
app.use((_req, res) => {
    res.sendFile("index.html", { root: "public" })
  });

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})

// Temporary mock data.
let leaderboardData = [
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
