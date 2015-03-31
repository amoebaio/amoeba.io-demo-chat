var Amoeba = require("amoeba.io");
var AmoebaLocalClient = require("amoeba.io-local-client");
var AmoebaSocketServer = require("amoeba.io-socket-server");

var port = "8090";
var SocketServer = require('socket.io');
var Chat = require("./Chat");
var MemoryStorage = require("./MemoryStorage");

// Only for internal use. There is no access from socket.
var private_amoeba = new Amoeba();
private_amoeba.use("sessions", new AmoebaLocalClient(new MemoryStorage()));

// Public amoeba
var public_amoeba = new Amoeba();
public_amoeba.use("chat", new AmoebaLocalClient(new Chat(private_amoeba.use("sessions"))));

//Start socket server
server = new SocketServer();
server.listen(port).on('connection', function(socket) {
    public_amoeba.server(new AmoebaSocketServer(socket));
    socket.on('disconnect', function() {
        private_amoeba.use("sessions").invoke("get", [socket.id],
            function(err, data) {
                public_amoeba.use("chat").invoke("disconnect", [data]);
                private_amoeba.use("sessions").invoke("del", [socket.id]);
            });
    });
});
