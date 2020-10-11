const express = require('express');
const app = express();
// const { uniqueNamesGenerator, adjectives, colors, animals } = require('unique-names-generator');

// const randomName = uniqueNamesGenerator({ dictionaries: [adjectives, colors, animals] }); // big_red_donkey


var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.use(express.static('public'));

app.get('/listen/', function (req, res) {
  res.send(req.params)
})

const workspaces = io.of(/^\/\w+$/);
workspaces.on('connection', socket => {
  const workspace = socket.nsp;

  workspace.emit('hello');

  console.log('a user connected');
  socket.broadcast.emit('connection');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);
    workspace.emit('chat message', msg);
  });
  socket.on('oneshot', (msg) => {
    console.log('oneshot: ' + msg);
    var soundData = { sound_name: msg };
    workspace.emit('sound', JSON.stringify(soundData));
  });
  socket.on('loop', (msg) => {
    console.log('loop adjusted: ' + msg);
    var soundData = { sound_name: msg };
    workspace.emit('sound', JSON.stringify(soundData));
  });
});

// this middleware will be assigned to each namespace
workspaces.use((socket, next) => {
  // ensure the user has access to the workspace
  next();
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});