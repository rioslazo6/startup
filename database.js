const { MongoClient } = require("mongodb")
const config = require("./dbConfig.json")
const bcrypt = require("bcrypt")
const uuid = require("uuid")

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`
const client = new MongoClient(url)
const db = client.db("startup")
const userCollection = db.collection("user")

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

module.exports = {
    getUser,
    getUserByToken,
    createUser
}