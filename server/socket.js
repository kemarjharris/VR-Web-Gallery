// sources: 
// https://glitch.com/edit/#!/networked-aframe?path=server.js:1:0
// https://socket.io/docs/server-api/
// https://www.reddit.com/r/node/comments/7phg1w/express_socketio_and_heroku_question/

const sharedSession = require("express-socket.io-session");

export function shareSession(httpServer, session) {
    const io = require("socket.io")(httpServer, {
        serveClient: false,
        cookie: false
    });

    io.origins('http://localhost:3000*');

    io.use(sharedSession(session));

    const rooms = {};

    io.on("connection", socket => {
        io.set('transports', ['polling', 'xhr-polling']);
        let curRoom = null;
        socket.on("joinRoom", data => {
            if (!socket.handshake.session.username) return new Error("User is not authenticated.");
            const { room } = data;
            if (!rooms[room]) {
                rooms[room] = {
                    name: room,
                    occupants: {},
                };
            }

            const joinedTime = Date.now();
            rooms[room].occupants[socket.id] = joinedTime;
            curRoom = room;

            socket.join(room);

            socket.emit("connectSuccess", { joinedTime });
            const occupants = rooms[room].occupants;
            io.in(curRoom).emit("occupantsChanged", { occupants });
        });

        socket.on("send", data => {
            if (!socket.handshake.session.username) return new Error("User is not authenticated.");
            io.to(data.to).emit("send", data);
        });

        socket.on("broadcast", data => {
            if (!socket.handshake.session.username) return new Error("User is not authenticated.");
            socket.to(curRoom).broadcast.emit("broadcast", data);
        });

        socket.on("disconnect", () => {
            if (!socket.handshake.session.username) return new Error("User is not authenticated.");
            if (rooms[curRoom]) {
                delete rooms[curRoom].occupants[socket.id];
                const occupants = rooms[curRoom].occupants;
                socket.to(curRoom).broadcast.emit("occupantsChanged", { occupants });

                if (occupants == {}) {
                    delete rooms[curRoom];
                }
            }
        });
    });
}