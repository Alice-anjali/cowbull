var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendfile('index.html');
});
app.use(require('express').static(__dirname));
io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
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
  socket.on('message' , function(msg){
    socket.broadcast.emit('message',msg);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
