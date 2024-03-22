const express = require("express")
const app = express()
const bcrypt = require("bcrypt")
const cookieParser = require("cookie-parser")
const db = require("./database")
const AUTH_COOKIE_NAME = "token"

// Setting the service port.
const port = process.argv.length > 2 ? process.argv[2] : 4000

// JSON body parsing.
app.use(express.json())

// Middleware to track auth tokens.
app.use(cookieParser())

// Serve up the front-end static content hosting.
app.use(express.static("public"))

// Router for service endpoints.
var apiRouter = express.Router()
app.use("/api", apiRouter)

// Create token for new user.
apiRouter.post("/auth/create", async (req, res) => {
    if (await db.getUser(req.body.username)) {
        res.status(409).send({ msg: "Username has already been taken" })
    } else {
        const user = await db.createUser(req.body.username, req.body.password)
        setAuthCookie(res, user.token) // Setting cookie
        res.send({
            id: user._id
        })
    }
})

// Get token for existing user.
apiRouter.post("/auth/login", async (req, res) => {
    const user = await db.getUser(req.body.username)
    if (user) {
        if (await bcrypt.compare(req.body.password, user.password)) {
            setAuthCookie(res, user.token)
            res.send({
                id: user._id
            })
            return
        }
    }
    res.status(401).send({ msg: "Unauthorized" })
})

// Delete token if stored in cookie
apiRouter.delete("/auth/logout", (_req, res) => {
    res.clearCookie(AUTH_COOKIE_NAME)
    res.status(204).end()
})

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

function setAuthCookie(res, token) {
    res.cookie(AUTH_COOKIE_NAME, token, {
        secure: true,
        httpOnly: true,
        sameSite: "strict"
    })
}

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
