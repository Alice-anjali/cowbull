var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var rooms = {};
var people = {};
var clients = [];
var room = require('./room.js');
var uuid = require('node-uuid');
app.get('/', function(req, res){
  res.sendfile('index.html');
});
app.use(require('express').static(__dirname));
io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

  socket.on('join' , function(name){
    roomId = null;
    people[socket.id] = {"name" : name , "room" : roomId};
    socket.sockets.emit("updat-people" , people);
    socket.emit("roomlist" , {rooms : rooms});
    clients.push(socket);
  });
  socket.on('createroom',function(name){
    if(people[socket.id].room===NULL){
      var id = uuid.v4();
      var room  = new Room(name , id);
      socket.sockets.emit('roomlist' , {rooms : rooms});
      socket.room = name;
      socket.join(socket.room);
      room.addPerson(socket.id);
      people[client.id].room = id;
    }
    else
    {
        socket.sockets.emit("update" , "You have already created a room !");
    }
  });
  socket.on('joinRoom' , function(id){
    var room = rooms[id];
    if (people[socket.id].inroom !== null)
     { //make sure that one person joins one room at a time
       socket.emit("update", "You are already in a room ("+rooms[people[client.id].inroom].name+"), please leave it first to join another room.");
     }
     else
     {
       room.addPerson(socket.id);
       people[socket.id].inroom = id;
       socket.room = room.name;
       socket.join(client.room); //add person to the room
       user = people[socket.id];
       socket.sockets.in(socket.room).emit("update", user.name + " has connected to " + room.name + " room.");
       socket.emit("update", "Welcome to " + room.name + ".");
       socket.emit("sendRoomID", {id: id});
     }
  });
  socket.on('chat-message' , function(msg,playerName){
    socket.emit('chat-message' ,playerName + " : " + msg);
  });
  socket.on('message' , function(msg){
    socket.emit('message' , msg);
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
