const { WebSocketServer } = require("ws")
const uuid = require("uuid")

function peerProxy(httpServer) {
    const wss = new WebSocketServer({ noServer: true })

    // Handling upgrade from HTTP to WebSocket
    httpServer.on("upgrade", (request, socket, head) => {
        wss.handleUpgrade(request, socket, head, function done(ws) {
            wss.emit("connection", ws, request)
        })
    })

    let connections = [] // To keep track of connections

    ws.on("connection", ws => {
        const connection = { id: uuid.v4(), alive: true, ws: ws }
        connections.push(connection)

        // Forwarding messages
        ws.on("message", function message(data) {
            connections.forEach(c => {
                if (c.id !== connection.id) {
                    c.ws.send(data)
                }
            })
        })

        // Removing closed connection
        ws.on("close", () => {
            const pos = connections.findIndex(o => o.id === connection.id)
            if (pos >= 0) {
                connections.splice(pos, 1)
            }
        })

        // Marking connection as alive on "pong"
        ws.on("pong", () => {
            connection.alive = true
        })
    })

    setInterval(() => {
        connections.forEach(c => {
            if (c.alive) {
                c.alive = false
                c.ws.ping()
            } else {
                c.ws.terminate()
            }
        })
    }, 10000)
}

module.exports = { peerProxy }