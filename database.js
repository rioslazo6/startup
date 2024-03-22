const { MongoClient } = require('mongodb')
const config = require('./dbConfig.json')
const bcrypt = require('bcrypt')
const uuid = require('uuid')

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`
const client = new MongoClient(url)
const db = client.db('startup')

// Testing database connection
(async function testConnection() {
    await client.connect()
    await db.command({ ping: 1 })
})().catch((ex) => {
    console.log(`There was an error connecting to the database: ${ex.message}`)
    process.exit(1)
})