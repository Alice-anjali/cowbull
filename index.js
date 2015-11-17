var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var CryptoJS = require('./hashserver.js');
var rooms = {};
var people = {};
var clients = [];
var Room = require('./room.js');
var uuid = require('node-uuid');
/*app.get('/', function(req, res){
  res.sendfile('index.html');
});*/
app.use(require('express').static(__dirname+'/public'));
var showhash = function(hash)
{
  for(var i=0 ; i<4;i++)
    console.log(" / " + hash[i]);
}
io.on('connection', function(socket){
  socket.on('join' , function(name){
    roomId = null;
    people[socket.id] = {"name" : name , "room" : roomId};
    console.log("Player " + name + " connected");
    socket.emit('update-people' , people);
    //socket.emit('addroomlist' , {rooms : rooms});
    clients.push(socket);
    for (var roomid in rooms) {
      socket.emit('addroomlist' , rooms[roomid].name , roomid);
    }
  });
  socket.on('trycreateroom',function(name){
    if(people[socket.id].room===null){
      var roomexist = 0;
      for(roomid in rooms){
        if(rooms[roomid].name===name){
          roomexist =1;break;
        }
      }
      if(roomexist==0)
      {
        var id = uuid.v4();
        var room  = new Room(name , id);
        rooms[id]=room;
        socket.emit('addroomlist' , name , id);
        socket.room = name;
        socket.join(socket.room);
        room.addPerson(socket.id);
        people[socket.id].room = id;
        console.log("Room "+rooms[id].name+" created by " + people[socket.id].name  );
        //console.log(" Room "+  rooms[id].people);
        socket.broadcast.emit('addroomlist' , name ,id);
        socket.emit('createroom',name);
      }
      else {
        socket.emit('update'," A room with the same name already exist ! ");
        console.log(people[socket.id].name + " tried creating a duplicate room of " + name);
      }
    }
    else
    {
        socket.emit('update' , "You have already created a room !");
    }
  });
  socket.on('tryjoinRoom' , function(id){
    console.log(" Id recieved " + id);
    var room = rooms[id];
    if (people[socket.id].room !== null)
     { //make sure that one person joins one room at a time
       socket.emit('update', "You are already in a room ("+rooms[people[socket.id].room].name+"), please leave it first to join another room.");
     }
     else
     {
       if(room!=null){
         room.addPerson(socket.id);
         people[socket.id].room = id;
         socket.room = room.name;
         socket.join(socket.room); //add person to the room
         user = people[socket.id];
         //socket.broadcast.in(socket.room).emit('notify', user.name + " has connected to " + room.name + " room.");
         socket.emit('notify', "Welcome to " + room.name + ".");
         socket.emit("sendRoomID", {id: id});
         console.log(user.name + " has joined the room " + room.name);
         socket.broadcast.in(socket.room).emit('notify', user.name + " Connected !");
         socket.emit('joinroom',room.name);
       }
       else{
         console.log(user.name +  " tried to join a room that doesnt exist !");
       }
     }
  });
  socket.on('exitroom',function(){
    if(people[socket.id]!=null){
      var room = people[socket.id].room;
      if(room !== null)
      {
        console.log(people[socket.id].name + " left the room " + socket.room);
        socket.broadcast.in(socket.room).emit('notify',people[socket.id].name + ' has left the room.');
        rooms[room].removePerson(socket.id);
        people[socket.id].room=null;
        var peopleleft = Object.keys(rooms[room].people).length;
        //console.log(peopleleft + ' people left in room ' + socket.room);
        if(peopleleft === 0){
          console.log('Room '+rooms[room].name+ ' destroyed !');
          delete rooms[room];
        }
        socket.emit('clearroomlist');
        for (var roomid in rooms) {
          socket.emit('addroomlist' , rooms[roomid].name , roomid);
        }
      }
    }
  });
  socket.on('chat-message' , function(msg,playerName){
    io.sockets.in(socket.room).emit('chat-message' ,playerName + " : " + msg);
  });
  socket.on('message' , function(msg){
    io.sockets.in(socket.room).emit('message' , msg);
  });
  socket.on('trynewgame' , function(word , playerName){
    console.log(people[socket.id].name + " sent the word " + word + " to room "+ socket.room);
    var hash = [];
    for(var i=0;i<4;i++)
      hash[i] = CryptoJS.CryptoJS.SHA256(word[i]).toString();
    showhash(hash);
    //socket.broadcast.in(socket.room).emit('newgame',playerName,JSON.stringify(hash));
    socket.broadcast.in(socket.room).emit('newgame',playerName,JSON.stringify(hash));
  });

  socket.on('notify' , function(msg){
    socket.broadcast.in(socket.room).emit('notify',msg);
  });
  socket.on('disconnect', function(){
    if(people[socket.id]!=null){
      var room = people[socket.id].room;
      if(room !== null)
      {
        console.log(people[socket.id].name + " left the room " + socket.room);
        socket.broadcast.in(socket.room).emit('notify',people[socket.id].name + ' has left the room.');
        rooms[room].removePerson(socket.id);
        var peopleleft = Object.keys(rooms[room].people).length;
        //console.log(peopleleft + ' people left in room ' + socket.room);
        if(peopleleft === 0){
          console.log('Room '+rooms[room].name+ ' destroyed !');
          delete rooms[room];
        }
        delete people[socket.id];
      }
    }
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
