const express = require("express")
const app = express()

// Setting the service port.
const port = process.argv.length > 2 ? process.argv[2] : 4000

// JSON body parsing.
app.use(express.json())

// Serve up the front-end static content hosting.
app.use(express.static("public"))

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})