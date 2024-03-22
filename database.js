const { MongoClient } = require("mongodb")
const config = require("./dbConfig.json")
const bcrypt = require("bcrypt")
const uuid = require("uuid")

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`
const client = new MongoClient(url)
const db = client.db("startup")
const userCollection = db.collection("user")
const leaderboardCollection = db.collection("leaderboard")

// Testing database connection
;(async function testConnection() {
    await client.connect()
    await db.command({ ping: 1 })
})().catch((ex) => {
    console.log(`There was an error connecting to the database: ${ex.message}`)
    process.exit(1)
})

function getUser(username) {
    return userCollection.findOne({ username: username})
}

function getUserByToken(token) {
    return userCollection.findOne({ token: token })
}

async function createUser(username, password) {
    const user = {
        username: username,
        password: await bcrypt.hash(password, 10), // Hashing password
        token: uuid.v4()
    }
    await userCollection.insertOne(user)
    return user
}

function getLeaderboard() {
    const cursor = leaderboardCollection.find(
        {},
        {
            sort: { winRate: -1, totalBattles: -1 }, // Sorting by winRate and totalBattles descending
            limit: 10, // Showing only top 10
            projection: { _id: 0, winRate: 0 } // Preventing these properties from being displayed
        }
    )
    return cursor.toArray()
}

function updateLeaderboard(requestBody) {
    leaderboardCollection.updateOne(
        { "username": requestBody.username },
        {
            $set: {
                battlesWon: requestBody.battlesWon,
                totalBattles: requestBody.totalBattles,
                winPercentage: requestBody.winPercentage,
                winRate: requestBody.winRate
            }
        },
        { upsert: true } // If record doesn't exist, it will be created
    )
}

module.exports = {
    getUser,
    getUserByToken,
    createUser,
    getLeaderboard,
    updateLeaderboard
}