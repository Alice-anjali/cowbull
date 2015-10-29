var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var rooms = {};
var people = {};
var clients = [];
var Room = require('./room.js');
var uuid = require('node-uuid');
app.get('/', function(req, res){
  res.sendfile('index.html');
});
app.use(require('express').static(__dirname));
io.on('connection', function(socket){

  socket.on('join' , function(name){
    roomId = null;
    people[socket.id] = {"name" : name , "room" : roomId};
    console.log("Player " + name + " connected");
    socket.emit('update-people' , people);
    socket.emit('addroomlist' , {rooms : rooms});
    clients.push(socket);
    for (var roomid in rooms) {
      socket.emit('addroomlist' , rooms[roomid].name , roomid);
    }
  });
  socket.on('createroom',function(name){
    if(people[socket.id].room===null){
      var id = uuid.v4();
      var room  = new Room(name , id);
      rooms[id]=room;
      socket.emit('addroomlist' , name , id);
      socket.room = name;
      socket.join(socket.room);
      room.addPerson(socket.id);
      people[socket.id].room = id;
      console.log("Room "+rooms[id].name+" created with id " + id  );

    }
    else
    {
        socket.emit('update' , "You have already created a room !");
    }
  });
  socket.on('joinRoom' , function(id){
    console.log(" Id recieved " + id);
    var room = rooms[id];
    //if (people[socket.id].inroom !== null)
     //{ //make sure that one person joins one room at a time
    //   socket.emit('update', "You are already in a room ("+rooms[people[socket.id].inroom].name+"), please leave it first to join another room.");
     //}
     //else
     //{
       room.addPerson(socket.id);
       people[socket.id].inroom = id;
       socket.room = room.name;
       socket.join(socket.room); //add person to the room
       user = people[socket.id];
       //socket.sockets.in(socket.room).emit('update', user.name + " has connected to " + room.name + " room.");
       socket.emit('update', "Welcome to " + room.name + ".");
       socket.emit("sendRoomID", {id: id});
       console.log(user.name + " has joined the room " + room.name);
     //}
  });
  socket.on('chat-message' , function(msg,playerName){
    socket.emit('chat-message' ,playerName + " : " + msg);
    socket.broadcast.emit('chat-message' ,playerName + " : " + msg);
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
