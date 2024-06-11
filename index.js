const express = require('express');
const engine = require('ejs-mate');
const path = require('path');
const socketIO = require('socket.io');
const http = require('http');

// inicio
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const port = 4000;

// settings
app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'public', 'views'));

// static files
app.use(express.static(path.join(__dirname, 'public')));

// routes
app.use(require('./routes'));

// sockets
require('./sockets')(io);

// starting the server
server.listen(port, () => {
    console.log("server iniciado en puerto " + port);
});