const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

var players = 1;
var connList = [];

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
app.get('/master', (req, res) => {
  res.sendFile(__dirname + '/CanvasTest.html');
});
app.get('/settings', (req, res) => {
  res.sendFile(__dirname + '/settings.html');
});

app.get('/canvasSocket.js', (req, res) => {
  res.sendFile(__dirname + '/canvasSocket.js');
});
app.get('/plane.png', (req, res) => {
  res.sendFile(__dirname + '/plane.png');
});
app.get('/nosleep.js', (req, res) => {
  res.sendFile(__dirname + '/node_modules/nosleep.js/dist/nosleep.js');
});
app.get('/nipplejs.js', (req, res) => {
  res.sendFile(__dirname + '/node_modules/nipplejs/dist/nipplejs.js');
});

var view = io.of("/view");
var controllers = io.of("/controller")
var settings = io.of("/settings")

controllers.on('connection', (socket) => {
  /*var playerNumber = 0;
  if(!connList[socket.client.conn.remoteAddress]){
    playerNumber = players;
    connList[socket.client.conn.remoteAddress] = playerNumber;
    players++;
    console.log("Player " + playerNumber + " connected: " + socket.client.conn.remoteAddress);
  }else{
    playerNumber = connList[socket.client.conn.remoteAddress];
    console.log("Player " + playerNumber + " reconnected: " + socket.client.conn.remoteAddress);
  }*/

  var playerNumber = players;
  players++;

  socket.on('fire', msg => {
    view.emit('fire', playerNumber);
  });
  socket.on('disconnect', msg => {
    console.log("Player " + playerNumber + " disconnected: " + socket.client.conn.remoteAddress);
    view.emit('remove player', playerNumber);
  });
  socket.on('direction change', msg => {
    msg.player = playerNumber;
    view.emit('direction change', msg);
  });
});

settings.on('connection', (socket) => {

  socket.on('update settings', msg => {
    view.emit('update settings', msg);
  });

  socket.on('start game', msg => {
    view.emit('start game', msg);
  });

  socket.on('reset game', msg => {
    view.emit('reset game', msg);
  });
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
