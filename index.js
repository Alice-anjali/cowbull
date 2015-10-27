var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var rooms = {};
app.get('/', function(req, res){
  res.sendfile('index.html');
});
app.use(require('express').static(__dirname));
io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
  socket.on('newuser' , function(name){
    socket.name = name;
  });
  socket.on('addtoroom' , function(roomname){
    socket.join(roomname);
    socket.room = roomname;
  });
  socket.on('message' , function(msg){
    socket.broadcast.emit('message' , socket.name + " : " + msg);
  });
  socket.on('getnewgame' , function(name){
    socket.broadcast.emit('getnewgame',name);
  });
  socket.on('newgame' , function(word){
    socket.broadcast.emit('newgame',word);
  });
  socket.on('gamereset' , function(){
    io.emit('gamereset');
  });
  socket.on('askgamereset' , function(){
    socket.broadcast.emit('askgamereset');
  });
  socket.on('notify' , function(msg){
    socket.broadcast.emit('notify',msg);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
