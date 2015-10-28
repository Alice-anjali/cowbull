var sendWord;
var connected = false;

var room;
var multi =false;
var opponentName;
jQuery(document).ready(function($){
  playerName = prompt("Enter your Name");
  $('.info').text("Hello "+playerName);
  //multi = confirm("Do you want to play multiplayer ? ");
  //if(multi)
//  {
  //  socket.emit('newuser' , playerName);
  //  room=prompt("Enter the name of the room you want to enter. If the room doesn't exist , a new room will be created.");
  //  socket.emit('addtoroom',room);
//  }
//  else
//  {
//    socket.disconnect();
    var temp = prompt("Enter the hidden word to play !").toUpperCase();
    startagame(temp);
//  }
//  if(multi && !connected)
//  {
//    $('#inputbox').hide();
//    socket.emit('getnewgame' , playerName);
//    }
});

var reset = function(){
  if(!multi)
  {
    game =1;
    noOfAns = 0;
    document.getElementById('titleqstn').innerHTML = "_ _ _ _";
    $('.game').css('border-color' , 'black');
    $('#titleqstn').css('color' , 'black');
    $('#titlemarks').css('color' , 'black');
    $('#inputbox').show();
    $('.markslist').children().remove();
    $('.answerlist').children().remove();
    mainWord = prompt("Enter the hidden word ! ").toUpperCase();
    $('input').show();
  }
  else
  {
    socket.emit('askgamereset');
  }
};
var initializegame = function(){
  game = 1;
};
socket.on('getnewgame' , function(name){
  //console.log("Get newgame ping recieved");
  opponentName = name;
  $('#opponent').text(opponentName);
  socket.emit('newgame',sendWord);
  if(!connected)
  {
    socket.emit('getnewgame',playerName);
  }
});
socket.on('newgame',function(word){
  console.log("newgame ping recieved");
  //console.log("Word is " + word);
  mainWord = word;
  $('.info').append("<br>New Word recieved ! <br>Start playing !");
  connected = true;
  $('input').show();
});
socket.on('askgamereset',function(){
  if(confirm(opponentName + " has asked to reset the game. Do you wish to accept ?"))
  {
    socket.emit('gamereset');
  }
  else
  {
    socket.emit('message' , "Reset Denied");
  }
});
socket.on('gamereset',function(){
  game =1;
  noOfAns = 0;
  document.getElementById('titleqstn').innerHTML = "_ _ _ _";
  $('.game').css('border-color' , 'black');
  $('#titleqstn').css('color' , 'black');
  $('#titlemarks').css('color' , 'black');
  $('#inputbox').show();
  $('.markslist').children().remove();
  $('.answerlist').children().remove();
  sendWord = prompt("Enter the hidden word ! ").toUpperCase();
  socket.emit('getnewgame',playerName);
});
socket.on('message',function(msg){
  $('.info').append("<br>"+msg);
});
