var sendWord;
var connected = false;
var room;
var multi =false;
var opponentName;
var roomlist = {};
var recievedword;
jQuery(document).ready(function($){
  $('.createroomdiv').hide();
  $('.joinroomdiv').hide();
  $('.sendwordbox').hide();
  $('#chatbox').hide();
  $('.acceptwordbox').hide();
  playerName = prompt("Enter your Name");
  $('.info').prepend("<br>Hello "+playerName);
  multi = confirm("Do you want to play multiplayer ? ");
  if(multi)
 {
    socket.emit('join',playerName);
    //room=prompt("Enter the name of the room you want to enter. If the room doesn't exist , a new room will be created.");
    //socket.emit('createroom',room);
    $('.createroomdiv').show();
    $('.joinroomdiv').show();
    $('.game').hide();
    $('#inputbox').hide();
  }
  else
  {
    $('.sendwordbox').hide();
    $('#chatbox').hide();
    socket.disconnect();
    var temp;
    do{
        temp = prompt("Enter the hidden word to play !").toUpperCase();
    }while(!check(temp));
    startagame(temp);
  }
  //if(multi && !connected)
  //{
  //  $('#inputbox').hide();
  //  socket.emit('getnewgame' , playerName);
  // }
});
socket.on('addroomlist' , function(name , id){
  roomlist[name] = id;
  console.log(' Room ' + name + " created with id " + id);
  if(id!==undefined)
    $('#roomlist').append('<li>' + name + '</li>');
});
var createroom = function(){
  var ele = document.getElementById('createroominput');
  socket.emit('createroom',ele.value);
  ele.value ='';
  $('#chatbox').show();
  $('.sendwordbox').show();
  $('.createroomdiv').hide();
  $('.joinroomdiv').hide();
};
var joinroom = function(){
  var ele = document.getElementById('joinroominput');
  console.log(" Sending value " + ele.value + "  " + roomlist[ele.value]);
  socket.emit('joinRoom',roomlist[ele.value]);
  ele.value ='';
  $('#chatbox').show();
  $('.sendwordbox').show();
  $('.createroomdiv').hide();
  $('.joinroomdiv').hide();
}
var sendnewWord = function()
{
  var ele = document.getElementById('inputsendbox');
  console.log(" Sending word : " + ele.value);
  ele.value = '';
  sendWord = ele.value;
  socket.emit('newgame' , sendWord , playerName);
}
var acceptnewWord = function(){
  startagame(recievedword);
}
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
socket.on('newgame',function(word , playerName){
  console.log("newgame ping recieved");
  if(game==0)
  {
    $('#recievedfromtext').text("A new Word is recieved from " + playerName);
    $('.acceptwordbox').show();
    recievedword = word;
  }
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
